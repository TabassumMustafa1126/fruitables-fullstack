# Fruitables — Full Stack Fruit & Vegetable Store

A complete full-stack web app built on top of the **Fruitables** HTML template
(HTML Codex), rebuilt with a Node.js/Express backend, MongoDB database,
EJS server-rendered views, and an AI shop assistant.

## Tech Stack

| Layer      | Tech |
|------------|------|
| Backend    | Node.js + Express (CommonJS modules throughout) |
| Database   | MongoDB + Mongoose (open with **MongoDB Compass** using `MONGO_URI`) |
| Frontend   | EJS templates + the original Fruitables Bootstrap/CSS assets |
| Sessions   | `express-session` (cart + AI chat history are session-scoped) |
| AI         | OpenRouter API (`/ai` page), with an offline demo fallback if no key is set |

## Project Structure (MVC)

```
app.js                 Express app setup (middleware, view engine, routes)
server.js              Entry point — loads .env, connects DB, starts server
config/
  db.js                Mongoose connection
models/                Mongoose schemas (Product, Order, Contact, Testimonial, BlogPost, Review, User, AiChat)
controllers/           Business logic — one file per resource
routes/                Thin route definitions that call controllers
middlewares/
  cart.js              Attaches session cart + cart count to every request
  auth.js              Attaches logged-in user (if any) + requireAuth/requireAdmin guards
  errorHandler.js       asyncHandler wrapper + centralized error renderer
  notFound.js           404 handler
views/                 EJS templates
  partials/            layout.ejs, head.ejs, nav.ejs, footer.ejs (shared across all pages)
public/                Static assets copied from the original template (css, js, img, lib)
seed/
  seed.js              Populates MongoDB with sample products & testimonials
```

## Features

- **Home (`/`)** — hero, features, and live "Fresh From Our Store" / "Best Sellers"
  sections pulled straight from MongoDB.
- **Shop (`/shop`)** — full product listing matching the original template's layout:
  sidebar with search, category counts, a max-price range filter, "Organic" / "On
  Sale" checkboxes, a featured products list, and a promo banner - plus a "View More"
  button that loads more results without a separate pagination page.
- **Shop Detail (`/shop/:id`)** — full product page matching the original template's
  layout: image + price + add-to-cart, a sidebar (search box, category counts,
  featured products), Description/Reviews tabs, a specs table (weight, origin,
  quality, min order weight), a real "Leave a Reply" review form backed by a
  `Review` model, and a Related Products section.
- **Cart (`/cart`)** — session-based cart: add / update quantity / remove.
- **Checkout (`/checkout`)** — billing form, saves a real `Order` document to MongoDB,
  clears the cart, and shows an order confirmation page.
- **Contact (`/contact`)** — saves messages to the `Contact` collection, with validation
  errors shown back to the user.
- **About Us (`/about`)** — the story behind the store, sourcing info, and a live
  product count pulled from MongoDB. (The original template only had a dead footer
  link for this - now it's a real page.)
- **Blog (`/blog`, `/blog/:id`)** — fully DB-backed blog (`BlogPost` model) with a
  listing page, single-post detail page with "recent posts" sidebar, and a "Latest
  From The Blog" preview section on the home page. Also missing from the original
  template - added here as a real, editable feature.
- **Authentication** — `/register`, `/login`, `/logout`. Passwords are hashed with
  `bcryptjs` (never stored in plain text). Logged-in state is session-based; the
  navbar shows "Login / Register" when signed out, or "Hi, Name" + a Logout button
  when signed in. This is available for customer accounts, but **`/admin/products`
  and `/admin/blog` are currently open to anyone** (no login required) - see the
  security note below before deploying anywhere public.
- **Testimonial (`/testimonial`)** — pulled from the `Testimonial` collection.
- **Admin Panel** — no need to open MongoDB Compass:
  - `/admin/products` — add, edit, or delete products
  - `/admin/blog` — add, edit, or delete blog posts
  Both use full CRUD (`GET/POST/PUT/DELETE`) via `method-override` (plain HTML forms
  can't send PUT/DELETE natively). Linked from the navbar's "Pages" dropdown.
- **Floating AI Chat Widget** — a chat bubble icon fixed in the bottom-right corner on
  every page (see `views/partials/ai-widget.ejs`, included from the shared layout).
  Clicking it opens a small chat panel powered by AJAX (`fetch`) calls to
  `GET /ai/history` and `POST /ai/ask` — no page reload, and no separate `/ai` page.
  It's a **general-purpose assistant** (not limited to fruits/vegetables) — ask it
  anything, paste any text/quote/code, and it will reply. Backed by the OpenRouter
  API (`https://openrouter.ai`), using the OpenAI-compatible `/chat/completions`
  format. Conversation history is persisted per-session in the `AiChat` collection.
  If `OPENROUTER_API_KEY` isn't set, it runs in a safe demo/fallback mode instead of
  crashing (a small note appears in the widget saying so).
- Centralized **error handling** (`middlewares/errorHandler.js`) — Mongoose validation
  and cast errors are turned into friendly messages, everything else renders a
  generic error page (with stack trace only in development).
- **404 page** for unmatched routes.

## Getting Started

### 1. Prerequisites
- Node.js v18+ (native `fetch` is used for the AI feature)
- MongoDB running locally, or a MongoDB Atlas connection string
- [MongoDB Compass](https://www.mongodb.com/products/compass) (optional, for GUI inspection)

### 2. Install
```bash
npm install
```

### 3. Configure environment
Copy the example env file and fill in your own values:
```bash
cp .env.example .env
```
```
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/fruitablesdb
SESSION_SECRET=some_long_random_string
OPENROUTER_API_KEY=            # optional — leave blank to use demo mode
OPENROUTER_MODEL=openai/gpt-4o-mini
SITE_URL=http://localhost:3000
```
`.env` is git-ignored — **never commit real secrets**. Open the same `MONGO_URI` in
MongoDB Compass to browse the `fruitablesdb` database visually.

### 4. Seed the database
```bash
npm run seed
```
This inserts sample fruits, vegetables, testimonials, blog posts, and reviews so the
site isn't empty on first run. It also creates one **admin account** using
`ADMIN_EMAIL` / `ADMIN_PASSWORD` from your `.env` (defaults: `admin@fruitables.pk` /
`admin123` if not set) - log in with this account at `/login` to reach
`/admin/products` and `/admin/blog`. **Change these credentials before deploying
anywhere public.**

### 5. Run the app
```bash
npm run dev     # with nodemon, auto-restarts on file changes
# or
npm start
```
Visit `http://localhost:3000`.

## Notes on Practices Followed

- **No hardcoded secrets** — DB URI, session secret, and API key all come from `.env`.
- **One module system** — CommonJS (`require`/`module.exports`) used consistently
  across every file.
- **MVC structure** — routes only wire URLs to controllers; controllers contain the
  logic and talk to Mongoose models; views only render data passed to them.
- **DRY views** — a single `partials/layout.ejs` (+ `head`/`nav`/`footer` partials)
  is shared by every page instead of repeating markup.
- **Error handling** — `asyncHandler` wraps every async controller so errors are
  forwarded to the centralized error middleware instead of crashing the server.

## Credits
Original front-end template: **Fruitables — Vegetable Website Template** by
[HTML Codex](https://htmlcodex.com/vegetable-website-template), distributed by
ThemeWagon. Backend, database layer, EJS conversion, and AI assistant added on top
of that template for this project.
