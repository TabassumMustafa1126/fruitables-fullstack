require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Product = require('../models/Product');
const Testimonial = require('../models/Testimonial');
const BlogPost = require('../models/BlogPost');
const Review = require('../models/Review');
const User = require('../models/User');
const Coupon = require('../models/Coupon');

const products = [
  { name: 'Ripe Banana', category: 'fruit', price: 150, unit: 'dozen', image: 'fruite-item-1.jpg', rating: 4, description: 'Naturally ripened bananas, rich in potassium.' },
  { name: 'Green Grapes', category: 'fruit', price: 480, unit: 'kg', image: 'fruite-item-2.jpg', rating: 4, description: 'Juicy seedless green grapes, perfect for snacking.' },
  { name: 'Fresh Apple', category: 'fruit', price: 350, oldPrice: 420, unit: 'kg', image: 'fruite-item-3.jpg', rating: 5, description: 'Crisp, sweet apples picked fresh from orchard trees.' },
  { name: 'Sweet Orange', category: 'fruit', price: 220, unit: 'kg', image: 'fruite-item-4.jpg', rating: 5, description: 'Juicy citrus oranges bursting with vitamin C.' },
  { name: 'Fresh Strawberry', category: 'fruit', price: 600, unit: 'box', image: 'fruite-item-5.jpg', rating: 5, description: 'Hand-picked strawberries, sweet and fragrant.' },
  { name: 'Watermelon', category: 'fruit', price: 300, unit: 'piece', image: 'fruite-item-6.jpg', rating: 4, description: 'Large, juicy watermelon - perfect for summer.' },
  { name: 'Organic Tomato', category: 'vegetable', price: 140, unit: 'kg', image: 'vegetable-item-1.jpg', rating: 4, description: 'Vine-ripened organic tomatoes, great for salads.' },
  { name: 'Fresh Carrot', category: 'vegetable', price: 120, unit: 'kg', image: 'vegetable-item-2.jpg', rating: 4, description: 'Crunchy, sweet carrots full of beta-carotene.' },
  { name: 'Green Capsicum', category: 'vegetable', price: 200, unit: 'kg', image: 'vegetable-item-3.png', rating: 3, description: 'Crisp bell peppers, great for stir-fry and salads.' },
  { name: 'Broccoli', category: 'vegetable', price: 280, unit: 'kg', image: 'vegetable-item-4.jpg', rating: 5, description: 'Fresh green broccoli, packed with nutrients.' },
  { name: 'Red Onion', category: 'vegetable', price: 100, unit: 'kg', image: 'vegetable-item-5.jpg', rating: 4, description: 'Pungent, flavorful red onions for everyday cooking.' },
  { name: 'Potato', category: 'vegetable', price: 90, unit: 'kg', image: 'vegetable-item-6.jpg', rating: 4, description: 'Farm-fresh potatoes, versatile for any recipe.' },
];

const coupons = [
  { code: 'SAVE20', discountType: 'percentage', discountValue: 20, maxDiscount: 300, minPurchase: 500 },
  { code: 'FLAT100', discountType: 'fixed', discountValue: 100, minPurchase: 300 },
  { code: 'WELCOME10', discountType: 'percentage', discountValue: 10, minPurchase: 0 },
];

const testimonials = [
  { name: 'Sarah Malik', profession: 'Regular Customer', photo: 'testimonial-1.jpg', message: 'The vegetables are always fresh and the delivery is super fast. Highly recommend Fruitables!' },
  { name: 'Ahmed Khan', profession: 'Home Chef', photo: 'testimonial-1.jpg', message: 'Best quality fruits I have found online. The AI assistant even helped me pick a recipe!' },
  { name: 'Ayesha Raza', profession: 'Nutritionist', photo: 'testimonial-1.jpg', message: 'I recommend Fruitables to all my clients looking for organic produce.' },
];

const blogPosts = [
  {
    title: '5 Reasons to Eat More Seasonal Vegetables',
    image: 'vegetable-item-4.jpg',
    excerpt: 'Seasonal vegetables are fresher, cheaper, and better for the environment.',
    content:
      'Eating seasonally means choosing produce that is naturally ready to harvest at a given time of year. ' +
      'It usually tastes better, costs less, and has a smaller environmental footprint since it does not need ' +
      'to travel as far or sit in cold storage for months. In Pakistan, that means carrots and broccoli in winter, ' +
      'and mangoes, watermelons, and tomatoes in the summer months. Try to build your weekly meals around whatever ' +
      'looks freshest at the market - your wallet and your health will both benefit.',
    author: 'Fruitables Team',
  },
  {
    title: 'How We Source Our Fruits Directly From Farms',
    image: 'fruite-item-5.jpg',
    excerpt: 'A behind-the-scenes look at how Fruitables works with local growers.',
    content:
      'Every morning, our sourcing team visits orchards and farms across Punjab and Sindh to hand-select the best ' +
      'produce of the day. By cutting out middlemen, we are able to pay farmers a fairer price while keeping costs ' +
      'lower for our customers. Produce is typically on a delivery truck within hours of being picked, which is why ' +
      'our fruits and vegetables taste noticeably fresher than what you might find sitting on a supermarket shelf.',
    author: 'Fruitables Team',
  },
  {
    title: 'Simple Ways to Store Fruits & Vegetables Longer',
    image: 'vegetable-item-2.jpg',
    excerpt: 'A few small habits that can double the shelf life of your produce.',
    content:
      'Not all produce should go in the fridge - potatoes and onions actually last longer in a cool, dark, dry place. ' +
      'Leafy greens stay fresh longer when wrapped loosely in a damp cloth before refrigeration. Bananas ripen faster ' +
      'next to other fruit, so keep them separate if you want to slow things down. Small habits like these can ' +
      'significantly reduce food waste at home and help your groceries go further.',
    author: 'Fruitables Team',
  },
];

async function seed() {
  await connectDB();

  await Product.deleteMany({});
  await Testimonial.deleteMany({});
  await BlogPost.deleteMany({});
  await Review.deleteMany({});
  await Coupon.deleteMany({});

  const insertedProducts = await Product.insertMany(products);
  await Testimonial.insertMany(testimonials);
  await BlogPost.insertMany(blogPosts);
  await Coupon.insertMany(coupons);

  // Sample reviews for the first couple of products, so the shop-detail
  // page's Reviews tab isn't empty on first run.
  const sampleReviews = [
    { product: insertedProducts[0]._id, name: 'Bilal Ahmed', rating: 5, comment: 'Great quality, exactly as described!' },
    { product: insertedProducts[0]._id, name: 'Fatima Noor', rating: 4, comment: 'Fresh and delivered on time.' },
    { product: insertedProducts[2]._id, name: 'Usman Tariq', rating: 5, comment: 'Best apples I have bought online.' },
  ];
  await Review.insertMany(sampleReviews);

  // Create (or update) one admin account so /admin/products and /admin/blog are
  // reachable right away. Change ADMIN_EMAIL / ADMIN_PASSWORD in .env before
  // deploying anywhere public.
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@fruitables.pk').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  await User.deleteOne({ email: adminEmail });
  await User.create({ name: 'Admin', email: adminEmail, password: adminPassword, role: 'admin' });
  console.log(`[seed] Admin account ready -> email: ${adminEmail} / password: ${adminPassword}`);

  console.log(
    `[seed] Inserted ${products.length} products, ${testimonials.length} testimonials, ${blogPosts.length} blog posts, ${sampleReviews.length} reviews, and ${coupons.length} coupons (try SAVE20, FLAT100, WELCOME10 at checkout).`
  );
  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error('[seed] Failed:', err);
  process.exit(1);
});
