// Builds the exact Food JSON shape the frontend's Food type requires:
// { id, name, description, category, price, image, rating, available,
//   tagline?, prepTime?, popular?, featured? }
function serializePublicFood(food) {
  const json = food.toJSON ? food.toJSON() : food;
  return {
    id: json.id,
    name: json.name,
    description: json.description || "",
    category: json.category,
    price: json.price,
    image: json.image || json.imageUrl || "",
    rating: json.rating,
    available: json.available,
    tagline: json.tagline || undefined,
    prepTime: json.prepTime ?? undefined,
    popular: json.popular ?? undefined,
    featured: json.featured ?? undefined,
  };
}

module.exports = { serializePublicFood };
