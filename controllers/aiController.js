const AiChat = require('../models/AiChat');
const { asyncHandler } = require('../middlewares/errorHandler');

// General-purpose assistant - not restricted to any single topic.
// The user can ask/paste/quote anything (code, text, questions, etc.) and get a real reply.
const SYSTEM_PROMPT =
  'You are a helpful, friendly general-purpose AI assistant embedded in a website. ' +
  'Answer whatever the user asks or pastes - any topic, question, quote, or piece of text - ' +
  'clearly and helpfully. Keep answers reasonably concise unless the user asks for detail.';

/**
 * Calls OpenRouter's chat-completions endpoint (OpenAI-compatible format).
 * Returns a plain string reply.
 * If no OPENROUTER_API_KEY is configured, returns a helpful offline/demo reply
 * instead of crashing, so the feature still "works" out of the box.
 */
async function askOpenRouter(history, userMessage) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return (
      `(Demo mode - no OPENROUTER_API_KEY set in .env) You asked: "${userMessage}". ` +
      'Add your OpenRouter API key to the .env file to get real AI-generated answers here.'
    );
  }

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.map((m) => ({ role: m.role, content: m.text })),
    { role: 'user', content: userMessage },
  ];

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': process.env.SITE_URL || 'http://localhost:3000',
      'X-Title': 'Fruitables Site Assistant',
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini',
      max_tokens: 600,
      messages,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenRouter API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const reply = data.choices && data.choices[0] && data.choices[0].message;
  return reply && reply.content ? reply.content : 'Sorry, I could not generate a reply.';
}

/** Finds (or lazily creates) the AiChat document tied to the current session. */
async function getOrCreateChat(req) {
  if (!req.session.aiSessionId) {
    req.session.aiSessionId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  let chat = await AiChat.findOne({ sessionId: req.session.aiSessionId });
  if (!chat) {
    chat = await AiChat.create({ sessionId: req.session.aiSessionId, messages: [] });
  }
  return chat;
}

/** GET /ai/history - JSON: existing chat history for the widget to render on open */
const getHistory = asyncHandler(async (req, res) => {
  const chat = await getOrCreateChat(req);
  res.json({
    messages: chat.messages,
    aiConfigured: Boolean(process.env.OPENROUTER_API_KEY),
  });
});

/** POST /ai/ask - JSON in, JSON out: { userPrompt } -> { reply } (used by the floating widget) */
const askAssistant = asyncHandler(async (req, res) => {
  const { userPrompt } = req.body;

  if (!userPrompt || !userPrompt.trim()) {
    return res.status(400).json({ error: 'Message cannot be empty.' });
  }

  const chat = await getOrCreateChat(req);

  let replyText;
  try {
    replyText = await askOpenRouter(chat.messages, userPrompt);
  } catch (err) {
    console.error('[ai] error contacting OpenRouter API:', err.message);
    replyText = 'Sorry, the AI assistant is temporarily unavailable. Please try again shortly.';
  }

  chat.messages.push({ role: 'user', text: userPrompt });
  chat.messages.push({ role: 'assistant', text: replyText });
  await chat.save();

  res.json({ reply: replyText });
});

module.exports = { getHistory, askAssistant };
