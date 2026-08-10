require("dotenv").config();
const bcrypt = require("bcryptjs");
const { connectDB } = require("../config/db");
const User = require("../models/User");
const Food = require("../models/Food");
const mongoose = require("mongoose");

const FOODS = [
  { "name": "Fattoush Salad", "price": 1105, "available": true },
  { "name": "Chicken Caesar Salad", "price": 1020, "available": true },
  { "name": "Hummus with Pita Bread", "price": 765, "available": false },
  { "name": "Dynamite Chicken with Fries", "price": 1148, "available": true },
  { "name": "Chicken Tosser Strips", "price": 1148, "available": true },
  { "name": "Chicken Honey Wings with Fries", "price": 1020, "available": true },
  { "name": "Mayo Garlic Fries", "price": 510, "available": true },
  { "name": "French Fries", "price": 425, "available": true },

  { "name": "Arabian Feast Platter (2 Person)", "price": 2848, "available": true },
  { "name": "Arabian Feast Platter (4 Person)", "price": 5355, "available": true },
  { "name": "Meshwi Platter (2 Persons)", "price": 4675, "available": true },
  { "name": "Mandi Platter", "price": 8925, "available": true },

  { "name": "Mutton Mandi", "price": 2975, "available": true },
  { "name": "Mutton Harara", "price": 2975, "available": true },
  { "name": "Mutton Madfoon", "price": 2975, "available": true },
  { "name": "Mutton Dasti", "price": 5610, "available": false },
  { "name": "Full Spicy Mutton", "price": 46000, "available": false },

  { "name": "Chicken Mandi", "price": 1828, "available": true },
  { "name": "Chicken Madbee", "price": 1828, "available": true },
  { "name": "Chicken Faham (With Rice)", "price": 1828, "available": true },

  { "name": "Fish Madbee", "price": 2720, "available": false },
  { "name": "Full Grilled Mushka", "price": 3825, "available": true },
  { "name": "Full Grilled Mushka (With Rice)", "price": 5100, "available": true },

  { "name": "Charcoal Chicken", "price": 1615, "available": true },
  { "name": "Chicken Shish Taouk Boti", "price": 1445, "available": true },
  { "name": "Mutton Boneless Boti", "price": 2975, "available": true },
  { "name": "Mutton Chops", "price": 3230, "available": true },
  { "name": "Chicken Faham (No Rice)", "price": 1530, "available": true },
  { "name": "Chicken Turkish Kabab", "price": 1275, "available": true },
  { "name": "Beef Adana Kabab", "price": 1275, "available": true },
  { "name": "Chicken Chops Spicy", "price": 1275, "available": true },
  { "name": "Beef Bihari Boti", "price": 1445, "available": true },
  { "name": "Malai Boti", "price": 1445, "available": true },
  { "name": "Irani Boti", "price": 1360, "available": true },

  { "name": "Mix Pide", "price": 1445, "available": true },
  { "name": "Chicken Pide", "price": 1445, "available": true },
  { "name": "Pepperoni Pide", "price": 1445, "available": true },
  { "name": "Chicken Shawarma", "price": 1063, "available": false },

  { "name": "Pistachio Kunafa", "price": 1700, "available": false },
  { "name": "Chocolate Kunafa", "price": 1148, "available": true },
  { "name": "Cream Kunafa", "price": 1148, "available": true },

  { "name": "Arabic Bread", "price": 128, "available": true },
  { "name": "Pita Bread", "price": 60, "available": true },
  { "name": "Puri Paratha", "price": 85, "available": true },

  { "name": "Water", "price": 94, "available": true },
  { "name": "Soft Drink", "price": 162, "available": false }
];

async function upsertUser({ name, email, password, role }) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.findOneAndUpdate(
    { email },
    { name, email, passwordHash, role },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log(`[seed] user ready: ${user.email} (${user.role})`);
}

async function seedFoods() {
  for (const food of FOODS) {
    await Food.findOneAndUpdate({ name: food.name }, food, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });
  }
  console.log(`[seed] ${FOODS.length} foods ready`);
}

async function run() {
  await connectDB(process.env.MONGO_URI);

  await upsertUser({
    name: "Admin User",
    email: "admin@restaurant.com",
    password: "admin123",
    role: "admin",
  });

  await upsertUser({
    name: "Cashier User",
    email: "cashier@restaurant.com",
    password: "cashier123",
    role: "cashier",
  });

  await seedFoods();

  console.log("[seed] done");
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("[seed] failed:", err);
  process.exit(1);
});
