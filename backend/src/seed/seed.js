require("dotenv").config();
const bcrypt = require("bcryptjs");
const { connectDB } = require("../config/db");
const User = require("../models/User");
const Food = require("../models/Food");
const mongoose = require("mongoose");

const SAMPLE_FOODS = [
  {
    name: "Bruschetta Trio",
    description: "Toasted baguette with tomato-basil, mushroom, and olive tapenade toppings.",
    category: "Starters",
    price: 8.5,
    stock: 40,
  },
  {
    name: "Crispy Calamari",
    description: "Lightly fried calamari rings served with lemon aioli.",
    category: "Starters",
    price: 10.0,
    stock: 30,
  },
  {
    name: "Herb-Crusted Salmon",
    description: "Pan-seared salmon fillet with a herb crust, served with seasonal veg.",
    category: "Mains",
    price: 22.0,
    stock: 25,
  },
  {
    name: "Wild Mushroom Risotto",
    description: "Creamy arborio rice with wild mushrooms and parmesan.",
    category: "Mains",
    price: 18.5,
    stock: null,
  },
  {
    name: "Charcoal Ribeye",
    description: "12oz ribeye grilled over charcoal, served with chimichurri.",
    category: "Grill",
    price: 32.0,
    stock: 15,
  },
  {
    name: "Spiced Lamb Skewers",
    description: "Grilled lamb skewers marinated in North African spices.",
    category: "Grill",
    price: 24.0,
    stock: 20,
  },
  {
    name: "Molten Chocolate Cake",
    description: "Warm chocolate cake with a liquid center, served with vanilla ice cream.",
    category: "Desserts",
    price: 9.0,
    stock: 35,
  },
  {
    name: "Sparkling Elderflower",
    description: "Refreshing sparkling elderflower cordial over ice.",
    category: "Beverages",
    price: 5.0,
    stock: null,
  },
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
  for (const food of SAMPLE_FOODS) {
    await Food.findOneAndUpdate({ name: food.name }, food, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });
  }
  console.log(`[seed] ${SAMPLE_FOODS.length} sample foods ready`);
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
