const Food = require("../models/Food");
const ApiError = require("../utils/ApiError");

// Validates requested items against live Food docs.
// Throws ApiError(400, "<n> is out of stock") etc. Returns resolved item list.
// (Extracted verbatim from the original webhookController.js implementation —
// behavior is unchanged, only the location moved so it can be shared.)
async function resolveAndValidateItems(items, session) {
  const resolved = [];

  for (const reqItem of items) {
    const query = Food.findById(reqItem.foodId);
    if (session) query.session(session);
    const food = await query;

    if (!food) {
      throw new ApiError(400, `Item ${reqItem.foodId} was not found.`);
    }
    if (!food.available) {
      throw new ApiError(400, `${food.name} is not available.`);
    }
    if (typeof food.stock === "number" && food.stock < reqItem.quantity) {
      throw new ApiError(400, `${food.name} is out of stock.`);
    }

    resolved.push({
      food,
      foodId: food._id,
      name: food.name,
      quantity: reqItem.quantity,
      price: food.price,
    });
  }

  return resolved;
}

// Decrements stock, flips availability at 0. Same logic that used to live
// inline in webhookController.js's createOrderWithSession.
async function decrementStock(resolvedItems, session) {
  for (const item of resolvedItems) {
    if (typeof item.food.stock === "number") {
      item.food.stock -= item.quantity;
      if (item.food.stock <= 0) {
        item.food.stock = 0;
        item.food.available = false;
      }
      await item.food.save({ session });
    }
  }
}

module.exports = { resolveAndValidateItems, decrementStock };
