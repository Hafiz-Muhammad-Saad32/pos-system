require("dotenv").config();
const bcrypt = require("bcryptjs");
const { connectDB } = require("../config/db");
const User = require("../models/User");
const Food = require("../models/Food");
const mongoose = require("mongoose");

const FOODS = [

  // ─────────────────────────────────────────────
  // SALADS
  // ─────────────────────────────────────────────
  {
    id: "sal-001",
    name: "Fattoush Salad",
    description:
      "A vibrant Levantine classic — crisp romaine, juicy tomatoes, cool cucumber, and tangy sumac-dusted radishes tossed with golden toasted pita chips and a zesty lemon-pomegranate dressing.",
    category: "Salads",
    price: 1105,
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop",
    rating: 4.5,
    available: true,
    tagline: "Fresh Levantine flavours in every bite",
    prepTime: 10,
    popular: true,
    featured: false,
  },
  {
    id: "sal-002",
    name: "Chicken Caesar Salad",
    description:
      "Tender grilled chicken breast laid over crisp romaine hearts, shaved parmesan, and house-made croutons, all generously dressed in a rich, garlicky Caesar. A timeless classic done right.",
    category: "Salads",
    price: 1020,
    imageUrl: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600&auto=format&fit=crop",
    rating: 4.4,
    available: true,
    tagline: "The classic, done to perfection",
    prepTime: 12,
    popular: true,
    featured: false,
  },

  // ─────────────────────────────────────────────
  // STARTERS & APPETIZERS
  // ─────────────────────────────────────────────
  {
    id: "app-001",
    name: "Hummus with Pita Bread",
    description:
      "Silky smooth hummus blended from slow-cooked chickpeas, tahini, and fresh lemon, finished with a drizzle of extra virgin olive oil and a pinch of paprika. Served warm with soft, pillowy pita bread.",
    category: "Starters & Appetizers",
    price: 765,
    imageUrl: "https://images.unsplash.com/photo-1593001872095-7d5b3868fb1d?w=600&auto=format&fit=crop",
    rating: 4.6,
    available: true,
    tagline: "Creamy, dreamy, and utterly dippable",
    prepTime: 8,
    popular: true,
    featured: false,
  },
  {
    id: "app-002",
    name: "Dynamite Chicken with Fries",
    description:
      "Crispy fried chicken strips tossed in our fiery signature dynamite sauce — creamy, spicy, and utterly addictive. Served alongside a heaping portion of golden fries for the ultimate indulgent combo.",
    category: "Starters & Appetizers",
    price: 1148,
    imageUrl: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&auto=format&fit=crop",
    rating: 4.7,
    available: true,
    tagline: "Explosive flavour in every bite",
    prepTime: 15,
    popular: true,
    featured: true,
  },
  {
    id: "app-003",
    name: "Chicken Tosser Strips",
    description:
      "Juicy, tender chicken strips with a perfectly seasoned crispy coating, tossed in your choice of bold sauce. Crowd-pleasing, shareable, and impossible to stop at just one.",
    category: "Starters & Appetizers",
    price: 1148,
    imageUrl: "https://images.unsplash.com/photo-1562802378-063ec186a863?w=600&auto=format&fit=crop",
    rating: 4.5,
    available: true,
    tagline: "Bold, saucy, and totally shareable",
    prepTime: 15,
    popular: false,
    featured: false,
  },
  {
    id: "app-004",
    name: "Mayo Garlic Fries",
    description:
      "Crispy, golden fries loaded with a rich and creamy roasted garlic mayo drizzle. A simple upgrade that turns a side dish into the star of the table.",
    category: "Starters & Appetizers",
    price: 510,
    imageUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop",
    rating: 4.3,
    available: true,
    tagline: "The side dish that steals the show",
    prepTime: 10,
    popular: false,
    featured: false,
  },
  {
    id: "app-005",
    name: "French Fries",
    description:
      "Classic golden fries, perfectly salted, light and crispy on the outside with a fluffy interior. The essential companion to any meal — simple, satisfying, and always reliable.",
    category: "Starters & Appetizers",
    price: 425,
    imageUrl: "https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=600&auto=format&fit=crop",
    rating: 4.2,
    available: true,
    tagline: "Simple. Golden. Perfect.",
    prepTime: 8,
    popular: false,
    featured: false,
  },

  // ─────────────────────────────────────────────
  // SOUPS  (generated — category had no items)
  // ─────────────────────────────────────────────
  {
    id: "sop-001",
    name: "Lentil Soup",
    description:
      "A hearty, soul-warming red lentil soup simmered with cumin, turmeric, and caramelised onions. Finished with a squeeze of lemon and a drizzle of crispy fried garlic oil. A Pakistani dining staple.",
    category: "Soups",
    price: 595,
    imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop",
    rating: 4.4,
    available: true,
    tagline: "Comfort in a bowl",
    prepTime: 20,
    popular: true,
    featured: false,
  },
  {
    id: "sop-002",
    name: "Chicken Corn Soup",
    description:
      "A beloved Pakistani restaurant classic — silky egg-drop broth loaded with shredded chicken, sweet corn, and a whisper of white pepper. Thickened to a velvety consistency and served piping hot.",
    category: "Soups",
    price: 680,
    imageUrl: "https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=600&auto=format&fit=crop",
    rating: 4.6,
    available: true,
    tagline: "A Pakistani dinner table favourite",
    prepTime: 15,
    popular: true,
    featured: true,
  },
  {
    id: "sop-003",
    name: "Mutton Paya Soup",
    description:
      "Traditional slow-cooked trotters braised overnight in aromatic whole spices — star anise, cinnamon, and black cardamom — until the broth turns rich, gelatinous, and deeply nourishing. A winter staple.",
    category: "Soups",
    price: 850,
    imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop",
    rating: 4.5,
    available: true,
    tagline: "Old-school nourishment, slow-cooked all night",
    prepTime: 25,
    popular: false,
    featured: false,
  },
  {
    id: "sop-004",
    name: "Tomato Shorba",
    description:
      "A fragrant Pakistani-style tomato soup blended with ginger, garlic, and whole spices, simmered until rich and velvety. Garnished with fresh cream and coriander — elegant, warming, and deeply satisfying.",
    category: "Soups",
    price: 595,
    imageUrl: "https://images.unsplash.com/photo-1629821879602-89b1d3e4a6bb?w=600&auto=format&fit=crop",
    rating: 4.3,
    available: true,
    tagline: "Spiced, silky, and full of warmth",
    prepTime: 15,
    popular: false,
    featured: false,
  },
  {
    id: "sop-005",
    name: "Hot & Sour Soup",
    description:
      "A tangy, peppery broth loaded with mushrooms, bamboo shoots, tofu, and shredded chicken — balanced between bold heat and sharp vinegar. A crowd favourite that has earned its place on every Pakistani menu.",
    category: "Soups",
    price: 680,
    imageUrl: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=600&auto=format&fit=crop",
    rating: 4.5,
    available: true,
    tagline: "The perfect spicy-sour balance",
    prepTime: 15,
    popular: true,
    featured: false,
  },

  // ─────────────────────────────────────────────
  // BBQ & KABAB
  // ─────────────────────────────────────────────
  {
    id: "bbq-001",
    name: "Charcoal Chicken",
    description:
      "Whole chicken slow-marinated in a blend of aromatic spices and grilled low over real charcoal until irresistibly smoky, juicy, and golden with a crisp, blistered skin. Pure, honest grilling at its finest.",
    category: "BBQ & Kabab",
    price: 1615,
    imageUrl: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&auto=format&fit=crop",
    rating: 4.8,
    available: true,
    tagline: "Real charcoal. Real flavour.",
    prepTime: 35,
    popular: true,
    featured: true,
  },
  {
    id: "bbq-002",
    name: "Chicken Shish Taouk Boti",
    description:
      "Marinated cubes of tender chicken threaded onto skewers and grilled over charcoal — infused with yoghurt, garlic, lemon, and a blend of warm spices. Juicy on the inside, lightly charred on the outside.",
    category: "BBQ & Kabab",
    price: 1445,
    imageUrl: "https://images.unsplash.com/photo-1529059997568-3d847b1154f0?w=600&auto=format&fit=crop",
    rating: 4.6,
    available: true,
    tagline: "Tender skewers with a smoky kiss",
    prepTime: 25,
    popular: true,
    featured: false,
  },
  {
    id: "bbq-003",
    name: "Mutton Boneless Boti",
    description:
      "Carefully selected boneless mutton pieces marinated overnight in robust spices, then skewered and charcoal-grilled to smoky, melt-in-your-mouth perfection. A carnivore's dream.",
    category: "BBQ & Kabab",
    price: 2975,
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop",
    rating: 4.7,
    available: true,
    tagline: "Overnight marinated. Charcoal kissed.",
    prepTime: 30,
    popular: true,
    featured: false,
  },
  {
    id: "bbq-004",
    name: "Mutton Chops",
    description:
      "Premium mutton chops marinated in a bold, aromatic spice rub and grilled over high heat until the exterior is gloriously charred and the inside remains succulent and pink. A dish for true meat lovers.",
    category: "BBQ & Kabab",
    price: 3230,
    imageUrl: "https://images.unsplash.com/photo-1558030006-450675393462?w=600&auto=format&fit=crop",
    rating: 4.8,
    available: true,
    tagline: "For those who take their meat seriously",
    prepTime: 30,
    popular: true,
    featured: true,
  },
  {
    id: "bbq-005",
    name: "Chicken Faham (No Rice)",
    description:
      "The beloved Lebanese Faham chicken — marinated in a distinctive blend of black pepper, cardamom, and warming spices, then grilled over glowing charcoal for that unmistakable smoky char. Served solo.",
    category: "BBQ & Kabab",
    price: 1530,
    imageUrl: "https://images.unsplash.com/photo-1598103442097-8b74394b95c7?w=600&auto=format&fit=crop",
    rating: 4.6,
    available: true,
    tagline: "Smoky, spiced, and simply stunning",
    prepTime: 25,
    popular: false,
    featured: false,
  },
  {
    id: "bbq-006",
    name: "Chicken Turkish Kabab",
    description:
      "Spiced minced chicken shaped around flat skewers and grilled over charcoal in true Turkish style — juicy, aromatic, with caramelised edges and a beautifully seasoned interior. Served with flatbread and fresh sides.",
    category: "BBQ & Kabab",
    price: 1275,
    imageUrl: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=600&auto=format&fit=crop",
    rating: 4.5,
    available: true,
    tagline: "Authentic Turkish style on the grill",
    prepTime: 20,
    popular: false,
    featured: false,
  },
  {
    id: "bbq-007",
    name: "Beef Adana Kabab",
    description:
      "Named after Turkey's southern city of Adana, this fiery kabab is made from hand-minced beef mixed with red chillies and spices, pressed onto wide skewers and grilled until smoky and perfectly charred.",
    category: "BBQ & Kabab",
    price: 1275,
    imageUrl: "https://images.unsplash.com/photo-1529059997568-3d847b1154f0?w=600&auto=format&fit=crop",
    rating: 4.5,
    available: true,
    tagline: "Fiery, smoky, straight from Adana",
    prepTime: 20,
    popular: false,
    featured: false,
  },
  {
    id: "bbq-008",
    name: "Chicken Chops Spicy",
    description:
      "Bone-in chicken chops marinated in a bold, fiery spice blend and grilled until the outside crackles with heat and flavour while the inside stays juicy and tender. For those who like it hot.",
    category: "BBQ & Kabab",
    price: 1275,
    imageUrl: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=600&auto=format&fit=crop",
    rating: 4.4,
    available: true,
    tagline: "Hot. Juicy. Unapologetically spicy.",
    prepTime: 20,
    popular: false,
    featured: false,
  },
  {
    id: "bbq-009",
    name: "Beef Bihari Boti",
    description:
      "A legendary Pakistani street food classic — thinly sliced beef marinated in raw papaya, yoghurt, and a fragrant Bihari spice paste, then skewered and grilled until tender, smoky, and deeply flavoured.",
    category: "BBQ & Kabab",
    price: 1445,
    imageUrl: "https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?w=600&auto=format&fit=crop",
    rating: 4.7,
    available: true,
    tagline: "A Lahori street classic, elevated",
    prepTime: 25,
    popular: true,
    featured: false,
  },
  {
    id: "bbq-010",
    name: "Malai Boti",
    description:
      "Melt-in-your-mouth chicken cubes marinated in a velvety blend of cream, cheese, and subtle spices, then grilled until lightly golden. Delicate, creamy, and luxuriously soft — a crowd absolute favourite.",
    category: "BBQ & Kabab",
    price: 1445,
    imageUrl: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&auto=format&fit=crop",
    rating: 4.8,
    available: true,
    tagline: "Creamy, melt-in-your-mouth magic",
    prepTime: 25,
    popular: true,
    featured: true,
  },
  {
    id: "bbq-011",
    name: "Irani Boti",
    description:
      "Inspired by Persian culinary tradition, these tender meat skewers are marinated in saffron, yoghurt, and aromatic spices, then grilled over charcoal for a subtly fragrant and beautifully caramelised finish.",
    category: "BBQ & Kabab",
    price: 1360,
    imageUrl: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&auto=format&fit=crop",
    rating: 4.5,
    available: true,
    tagline: "Persian-inspired saffron-kissed skewers",
    prepTime: 25,
    popular: false,
    featured: false,
  },

  // ─────────────────────────────────────────────
  // KARAHI & CURRIES  (generated — category had no items)
  // ─────────────────────────────────────────────
  {
    id: "kar-001",
    name: "Chicken Karahi",
    description:
      "Pakistan's most iconic dish — tender chicken pieces cooked in a blazing hot wok with vine-ripened tomatoes, fresh ginger, green chillies, and fragrant spices. Finished with butter and fresh coriander for that signature dhaba richness.",
    category: "Karahi & Curries",
    price: 1700,
    imageUrl: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&auto=format&fit=crop",
    rating: 4.8,
    available: true,
    tagline: "The king of Pakistani cooking",
    prepTime: 25,
    popular: true,
    featured: true,
  },
  {
    id: "kar-002",
    name: "Mutton Karahi",
    description:
      "Slow-cooked bone-in mutton simmered with fresh tomatoes, whole spices, and loads of ginger in a cast-iron karahi. Charcoal-finished for that authentic smoky depth. Rich, robust, and wickedly satisfying.",
    category: "Karahi & Curries",
    price: 2975,
    imageUrl: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=600&auto=format&fit=crop",
    rating: 4.9,
    available: true,
    tagline: "Slow-cooked richness in every morsel",
    prepTime: 40,
    popular: true,
    featured: true,
  },
  {
    id: "kar-003",
    name: "Butter Chicken",
    description:
      "Charcoal-grilled chicken morsels folded into a luscious, mildly spiced tomato-butter sauce enriched with cream and fenugreek. Velvety, aromatic, and absolutely irresistible — a North Indian classic beloved across Pakistan.",
    category: "Karahi & Curries",
    price: 1870,
    imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop",
    rating: 4.7,
    available: true,
    tagline: "Creamy tomato bliss in a bowl",
    prepTime: 25,
    popular: true,
    featured: false,
  },
  {
    id: "kar-004",
    name: "Daal Makhani",
    description:
      "Black lentils and kidney beans slow-cooked overnight with butter, cream, and whole spices — developing an impossibly rich, velvety depth that only time can create. A vegetarian masterpiece equally loved by meat-eaters.",
    category: "Karahi & Curries",
    price: 1105,
    imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop",
    rating: 4.6,
    available: true,
    tagline: "Slow-cooked overnight, silky and rich",
    prepTime: 20,
    popular: false,
    featured: false,
  },
  {
    id: "kar-005",
    name: "Palak Gosht",
    description:
      "Tender mutton pieces slow-braised in a vibrant spinach gravy seasoned with cumin, coriander, and warming spices. A wholesome Pakistani classic that delivers bold flavour and nourishment in every spoonful.",
    category: "Karahi & Curries",
    price: 2550,
    imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop",
    rating: 4.5,
    available: true,
    tagline: "Spinach and mutton — a timeless pairing",
    prepTime: 35,
    popular: false,
    featured: false,
  },

  // ─────────────────────────────────────────────
  // BIRYANI & RICE  (generated — category had no items)
  // ─────────────────────────────────────────────
  {
    id: "bry-001",
    name: "Chicken Biryani",
    description:
      "Long-grain basmati rice layered with bone-in chicken marinated in yoghurt and whole spices, slow-cooked dum-style until every grain is fragrant with saffron and the chicken melts off the bone. Served with raita and salad.",
    category: "Biryani & Rice",
    price: 1530,
    imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop",
    rating: 4.8,
    available: true,
    tagline: "Dum-cooked Karachi-style biryani",
    prepTime: 45,
    popular: true,
    featured: true,
  },
  {
    id: "bry-002",
    name: "Mutton Biryani",
    description:
      "Slow-cooked bone-in mutton layered between aromatic saffron-kissed basmati, sealed and dum-cooked to let the flavours meld into something truly extraordinary. A Sunday family staple — hearty, fragrant, and deeply satisfying.",
    category: "Biryani & Rice",
    price: 2125,
    imageUrl: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop",
    rating: 4.9,
    available: true,
    tagline: "The ultimate Sunday feast",
    prepTime: 55,
    popular: true,
    featured: true,
  },
  {
    id: "bry-003",
    name: "Beef Biryani",
    description:
      "Tender slow-braised beef cubes layered between fluffy saffron basmati and sealed with a tight lid for the dum — allowing steam and spice to create rice of unrivalled depth. Served with mint raita.",
    category: "Biryani & Rice",
    price: 1870,
    imageUrl: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&auto=format&fit=crop",
    rating: 4.7,
    available: true,
    tagline: "Bold, beefy, and packed with spice",
    prepTime: 50,
    popular: false,
    featured: false,
  },
  {
    id: "bry-004",
    name: "Chicken Pulao",
    description:
      "Delicate, fragrant rice cooked in a slow-simmered chicken broth infused with whole spices and caramelised onions. Lighter than biryani but equally comforting — the go-to dish for effortless elegance.",
    category: "Biryani & Rice",
    price: 1275,
    imageUrl: "https://images.unsplash.com/photo-1512058454905-6b841e7ad132?w=600&auto=format&fit=crop",
    rating: 4.5,
    available: true,
    tagline: "Light, fragrant, and effortlessly elegant",
    prepTime: 35,
    popular: false,
    featured: false,
  },
  {
    id: "bry-005",
    name: "Special Prawn Biryani",
    description:
      "Jumbo tiger prawns marinated in a fiery coastal spice blend, layered with saffron basmati and sealed dum-style. An indulgent, aromatic seafood biryani that brings the flavours of Karachi's harbour to your table.",
    category: "Biryani & Rice",
    price: 2550,
    imageUrl: "https://images.unsplash.com/photo-1630851840633-f96999247032?w=600&auto=format&fit=crop",
    rating: 4.7,
    available: true,
    tagline: "Karachi's coastal biryani, elevated",
    prepTime: 45,
    popular: true,
    featured: false,
  },

  // ─────────────────────────────────────────────
  // MANDI & PLATTERS
  // ─────────────────────────────────────────────
  {
    id: "mnd-001",
    name: "Arabian Feast Platter (2 Person)",
    description:
      "An indulgent spread of grilled meats, fragrant rice, fresh salads, and warm bread — a curated taste of authentic Arabian hospitality on one magnificent platter, perfectly portioned for two.",
    category: "Mandi & Platters",
    price: 2848,
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop",
    rating: 4.7,
    available: true,
    tagline: "Arabian hospitality on one platter",
    prepTime: 40,
    popular: true,
    featured: false,
  },
  {
    id: "mnd-002",
    name: "Arabian Feast Platter (4 Person)",
    description:
      "Gather your people for this grand celebration platter — an abundant selection of charcoal-grilled meats, aromatic rice, garden-fresh salads, dips, and bread that brings the full flavour of the Arabian table to your gathering.",
    category: "Mandi & Platters",
    price: 5355,
    imageUrl: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&auto=format&fit=crop",
    rating: 4.8,
    available: true,
    tagline: "Gather your people. This is the one.",
    prepTime: 45,
    popular: true,
    featured: true,
  },
  {
    id: "mnd-003",
    name: "Meshwi Platter (2 Persons)",
    description:
      "A smoky, sizzling assortment of premium charcoal-grilled meats — succulent kebabs, tender chops, and juicy skewers served with warm bread, grilled vegetables, and fresh accompaniments for two.",
    category: "Mandi & Platters",
    price: 4675,
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop",
    rating: 4.8,
    available: true,
    tagline: "A smoky grilled meat lover's paradise",
    prepTime: 40,
    popular: true,
    featured: true,
  },
  {
    id: "mnd-004",
    name: "Mandi Platter",
    description:
      "The crown jewel of Arabian cuisine. Slow-cooked whole meats infused with a signature blend of Mandi spices, layered over an enormous bed of long-grain saffron rice. A feast worthy of any celebration.",
    category: "Mandi & Platters",
    price: 8925,
    imageUrl: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&auto=format&fit=crop",
    rating: 4.9,
    available: true,
    tagline: "The crown jewel of Arabian feasting",
    prepTime: 60,
    popular: true,
    featured: true,
  },
  {
    id: "mnd-005",
    name: "Mutton Mandi",
    description:
      "Slow-smoked mutton cooked in the traditional underground pit method, absorbing rich Mandi spices until fall-off-the-bone tender. Served over fragrant basmati rice with a smoky broth.",
    category: "Mandi & Platters",
    price: 2975,
    imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop",
    rating: 4.8,
    available: true,
    tagline: "Pit-smoked tradition on your plate",
    prepTime: 60,
    popular: true,
    featured: false,
  },
  {
    id: "mnd-006",
    name: "Mutton Harara",
    description:
      "Bold, fiery, and deeply aromatic — mutton slow-cooked in a spiced Harara sauce that builds warmth with every bite. A robust dish for those who crave depth and heat in equal measure.",
    category: "Mandi & Platters",
    price: 2975,
    imageUrl: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=600&auto=format&fit=crop",
    rating: 4.6,
    available: true,
    tagline: "Heat, depth, and bold Arabian spice",
    prepTime: 50,
    popular: false,
    featured: false,
  },
  {
    id: "mnd-007",
    name: "Mutton Madfoon",
    description:
      "Tender mutton buried and slow-cooked in the ancient Madfoon tradition, sealed in fragrant spices until the meat melts into the richly flavoured rice beneath it. A true heritage dish.",
    category: "Mandi & Platters",
    price: 2975,
    imageUrl: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&auto=format&fit=crop",
    rating: 4.7,
    available: true,
    tagline: "Ancient tradition. Unforgettable flavour.",
    prepTime: 55,
    popular: false,
    featured: false,
  },
  {
    id: "mnd-008",
    name: "Mutton Dasti",
    description:
      "Slow-braised mutton shoulder marinated in aromatic spices and cooked low and slow until incredibly juicy and tender. Rich, flavourful, and utterly satisfying — a dish that commands attention.",
    category: "Mandi & Platters",
    price: 5610,
    imageUrl: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&auto=format&fit=crop",
    rating: 4.7,
    available: true,
    tagline: "Slow-braised shoulder. Pure luxury.",
    prepTime: 60,
    popular: false,
    featured: false,
  },
  {
    id: "mnd-009",
    name: "Full Spicy Mutton",
    description:
      "The ultimate showpiece — a whole spiced mutton, marinated for hours in layers of bold aromatic spices, slow-roasted to glistening perfection. Reserved for grand occasions and unforgettable feasts.",
    category: "Mandi & Platters",
    price: 46000,
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop",
    rating: 4.9,
    available: true,
    tagline: "The showpiece for grand occasions",
    prepTime: 180,
    popular: false,
    featured: false,
  },
  {
    id: "mnd-010",
    name: "Chicken Mandi",
    description:
      "Whole chicken slow-smoked in the traditional Mandi style with a perfect blend of aromatic spices, served over fluffy long-grain rice that soaks up every drop of the smoky, spiced cooking broth.",
    category: "Mandi & Platters",
    price: 1828,
    imageUrl: "https://images.unsplash.com/photo-1598103442097-8b74394b95c7?w=600&auto=format&fit=crop",
    rating: 4.7,
    available: true,
    tagline: "Traditional Mandi smoke, every bite",
    prepTime: 50,
    popular: true,
    featured: false,
  },
  {
    id: "mnd-011",
    name: "Chicken Madbee",
    description:
      "Succulent chicken prepared in the authentic Madbee style — rubbed with a signature spice blend and slow-cooked until deeply flavourful and golden, served with fragrant rice and fresh accompaniments.",
    category: "Mandi & Platters",
    price: 1828,
    imageUrl: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=600&auto=format&fit=crop",
    rating: 4.6,
    available: true,
    tagline: "Authentic Madbee, golden and aromatic",
    prepTime: 45,
    popular: false,
    featured: false,
  },
  {
    id: "mnd-012",
    name: "Chicken Faham (With Rice)",
    description:
      "A Lebanese charcoal grilling classic — chicken marinated in a bold blend of black pepper, cardamom, and spices, grilled over open flame until perfectly charred. Served alongside aromatic basmati rice.",
    category: "Mandi & Platters",
    price: 1828,
    imageUrl: "https://images.unsplash.com/photo-1606728035253-49e8a23146de?w=600&auto=format&fit=crop",
    rating: 4.6,
    available: true,
    tagline: "Charcoal char meets fragrant rice",
    prepTime: 30,
    popular: false,
    featured: false,
  },

  // ─────────────────────────────────────────────
  // SHAWARMA & ROLLS
  // ─────────────────────────────────────────────
  {
    id: "shw-001",
    name: "Chicken Shawarma",
    description:
      "Layers of marinated chicken slow-cooked on a vertical rotisserie, shaved and wrapped in warm flatbread with garlic sauce, pickles, and fresh vegetables. A Middle Eastern street food legend.",
    category: "Shawarma & Rolls",
    price: 1063,
    imageUrl: "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=600&auto=format&fit=crop",
    rating: 4.6,
    available: true,
    tagline: "Rotisserie perfection, wrapped and ready",
    prepTime: 12,
    popular: true,
    featured: false,
  },
  {
    id: "shw-002",
    name: "Fish Madbee",
    description:
      "Fresh, whole fish seasoned with a carefully crafted Madbee spice blend and slow-cooked to flaky, moist perfection. A coastal Arabian delicacy that celebrates the sea's finest flavours.",
    category: "Shawarma & Rolls",
    price: 2720,
    imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop",
    rating: 4.5,
    available: true,
    tagline: "Coastal Arabian seafood at its finest",
    prepTime: 30,
    popular: false,
    featured: false,
  },
  {
    id: "shw-003",
    name: "Full Grilled Mushka",
    description:
      "A whole Mushka fish, marinated in fragrant herbs and spices, then expertly grilled over charcoal until the skin is gloriously crisp and the flesh inside is tender, flaky, and bursting with flavour.",
    category: "Shawarma & Rolls",
    price: 3825,
    imageUrl: "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=600&auto=format&fit=crop",
    rating: 4.7,
    available: true,
    tagline: "Whole fish, charcoal-grilled to perfection",
    prepTime: 35,
    popular: true,
    featured: false,
  },
  {
    id: "shw-004",
    name: "Full Grilled Mushka (With Rice)",
    description:
      "Our signature whole charcoal-grilled Mushka fish, perfectly spiced and served with a generous bed of fragrant rice cooked in aromatic fish broth — a complete, satisfying seafood experience.",
    category: "Shawarma & Rolls",
    price: 5100,
    imageUrl: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=600&auto=format&fit=crop",
    rating: 4.7,
    available: true,
    tagline: "The complete Mushka experience",
    prepTime: 40,
    popular: false,
    featured: false,
  },

  // ─────────────────────────────────────────────
  // FRIED CHICKEN & WINGS
  // ─────────────────────────────────────────────
  {
    id: "frc-001",
    name: "Chicken Honey Wings with Fries",
    description:
      "Succulent chicken wings glazed in a sweet-and-sticky honey sauce with a subtle kick of heat. Oven-charred to perfection and served with crispy golden fries — the perfect crowd-pleaser.",
    category: "Fried Chicken & Wings",
    price: 1020,
    imageUrl: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=600&auto=format&fit=crop",
    rating: 4.6,
    available: true,
    tagline: "Sweet, sticky, and dangerously good",
    prepTime: 20,
    popular: true,
    featured: false,
  },

  // ─────────────────────────────────────────────
  // BURGERS  (generated — category had no items)
  // ─────────────────────────────────────────────
  {
    id: "bur-001",
    name: "Classic Beef Burger",
    description:
      "A thick, hand-pressed 200g beef patty seasoned with house spices and grilled to juicy perfection, stacked with cheddar, crisp lettuce, tomato, pickles, and our signature smoky burger sauce in a toasted brioche bun.",
    category: "Burgers",
    price: 1148,
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop",
    rating: 4.6,
    available: true,
    tagline: "The burger that started it all",
    prepTime: 15,
    popular: true,
    featured: false,
  },
  {
    id: "bur-002",
    name: "Zinger Burger",
    description:
      "A fiery crispy chicken fillet — double-coated in our signature spiced batter and deep-fried to shattering crunch — loaded into a toasted sesame bun with coleslaw, jalapeños, and sriracha mayo. Pakistan's favourite spicy burger.",
    category: "Burgers",
    price: 1020,
    imageUrl: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&auto=format&fit=crop",
    rating: 4.7,
    available: true,
    tagline: "Pakistan's spicy crispy chicken obsession",
    prepTime: 15,
    popular: true,
    featured: true,
  },
  {
    id: "bur-003",
    name: "Smash Burger",
    description:
      "Two thin beef patties smashed hard on a screaming-hot griddle to maximise crust and caramelisation, double-stacked with American cheese, caramelised onions, pickles, and special smash sauce in a potato bun.",
    category: "Burgers",
    price: 1275,
    imageUrl: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop",
    rating: 4.8,
    available: true,
    tagline: "Double-smashed, double-cheesed, double trouble",
    prepTime: 12,
    popular: true,
    featured: true,
  },
  {
    id: "bur-004",
    name: "BBQ Mutton Burger",
    description:
      "A generous mutton patty marinated in smoky BBQ spices, grilled over charcoal and crowned with crispy fried onions, fresh rocket, and tangy BBQ sauce in a toasted brioche bun. Bold, rustic, and deeply satisfying.",
    category: "Burgers",
    price: 1445,
    imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop",
    rating: 4.5,
    available: true,
    tagline: "Charcoal-grilled mutton in a bun",
    prepTime: 20,
    popular: false,
    featured: false,
  },
  {
    id: "bur-005",
    name: "Malai Chicken Burger",
    description:
      "Creamy malai-marinated chicken breast, grilled until golden and pillowy-soft, layered with garlic aioli, lettuce, and melted mozzarella in a soft potato bun. Delicate, luscious, and a welcome departure from the ordinary.",
    category: "Burgers",
    price: 1148,
    imageUrl: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=600&auto=format&fit=crop",
    rating: 4.5,
    available: true,
    tagline: "Creamy, gentle, and utterly irresistible",
    prepTime: 15,
    popular: false,
    featured: false,
  },

  // ─────────────────────────────────────────────
  // PIZZA  (generated — category had no items)
  // ─────────────────────────────────────────────
  {
    id: "piz-001",
    name: "Chicken Tikka Pizza",
    description:
      "Stone-baked pizza topped with tandoori-spiced chicken tikka, sliced onions, capsicum, and a drizzle of mint chutney over a rich tomato base, finished with stretchy mozzarella. Desi flavours on an Italian canvas.",
    category: "Pizza",
    price: 1700,
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop",
    rating: 4.7,
    available: true,
    tagline: "Desi tikka meets Italian dough",
    prepTime: 20,
    popular: true,
    featured: true,
  },
  {
    id: "piz-002",
    name: "BBQ Beef Pizza",
    description:
      "Crispy thin-crust pizza smothered in smoky BBQ sauce and loaded with seasoned beef mince, caramelised onions, jalapeños, and a generous blanket of mozzarella. Bold, hearty, and unapologetically satisfying.",
    category: "Pizza",
    price: 1870,
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop",
    rating: 4.6,
    available: true,
    tagline: "BBQ beef boldness on every slice",
    prepTime: 22,
    popular: true,
    featured: false,
  },
  {
    id: "piz-003",
    name: "Mix Pide",
    description:
      "Turkey's beloved flatbread, fresh from the stone oven with a crisp golden crust and a soft, chewy interior — generously topped with a satisfying mix of seasoned meats, peppers, and melted cheese.",
    category: "Pizza",
    price: 1445,
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop",
    rating: 4.5,
    available: true,
    tagline: "Turkish stone-oven flatbread perfection",
    prepTime: 18,
    popular: false,
    featured: false,
  },
  {
    id: "piz-004",
    name: "Chicken Pide",
    description:
      "A boat-shaped Turkish flatbread straight from the stone oven, piled high with tender, seasoned chicken and bubbling cheese. The perfect balance of crispy crust and richly flavoured topping.",
    category: "Pizza",
    price: 1445,
    imageUrl: "https://images.unsplash.com/photo-1571066811602-716837d681de?w=600&auto=format&fit=crop",
    rating: 4.5,
    available: true,
    tagline: "Crispy crust, juicy chicken, bubbling cheese",
    prepTime: 18,
    popular: false,
    featured: false,
  },
  {
    id: "piz-005",
    name: "Pepperoni Pide",
    description:
      "The classic Turkish pide gets a bold upgrade — stone-baked to golden perfection and loaded with spiced pepperoni and stretchy melted cheese. Crispy edges, smoky flavour, and completely irresistible.",
    category: "Pizza",
    price: 1445,
    imageUrl: "https://images.unsplash.com/photo-1520201163981-8cc95007dd2a?w=600&auto=format&fit=crop",
    rating: 4.6,
    available: true,
    tagline: "Smoky pepperoni on Turkish stone-baked dough",
    prepTime: 18,
    popular: true,
    featured: false,
  },

  // ─────────────────────────────────────────────
  // CHINESE  (generated — category had no items)
  // ─────────────────────────────────────────────
  {
    id: "chi-001",
    name: "Chicken Chow Mein",
    description:
      "Wok-tossed egg noodles stir-fried with shredded chicken, cabbage, carrots, spring onions, and a glossy soy-oyster sauce — cooked over a raging flame for that essential smoky wok hei. Pakistan's go-to Chinese comfort dish.",
    category: "Chinese",
    price: 1105,
    imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop",
    rating: 4.6,
    available: true,
    tagline: "Wok hei noodles, Pakistan-style",
    prepTime: 15,
    popular: true,
    featured: false,
  },
  {
    id: "chi-002",
    name: "Chicken Fried Rice",
    description:
      "Fragrant day-old jasmine rice stir-fried in a blazing wok with shredded chicken, egg, spring onions, and a seasoned soy-sesame glaze. Simple, satisfying, and the backbone of every Pakistani Chinese menu.",
    category: "Chinese",
    price: 1020,
    imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&auto=format&fit=crop",
    rating: 4.5,
    available: true,
    tagline: "Wok-tossed rice with soy-sesame depth",
    prepTime: 12,
    popular: true,
    featured: false,
  },
  {
    id: "chi-003",
    name: "Manchurian Chicken",
    description:
      "Crispy battered chicken chunks tossed in a bold, tangy Manchurian sauce made from soy, garlic, ginger, and fiery red chillies. A Pakistani-Chinese fusion classic that is equal parts addictive and saucy.",
    category: "Chinese",
    price: 1275,
    imageUrl: "https://images.unsplash.com/photo-1598515213692-a73e4fa95567?w=600&auto=format&fit=crop",
    rating: 4.7,
    available: true,
    tagline: "Crispy, saucy, and impossibly addictive",
    prepTime: 18,
    popular: true,
    featured: true,
  },
  {
    id: "chi-004",
    name: "Beef Chilli Dry",
    description:
      "Tender strips of beef stir-fried with a trio of bell peppers, onions, and green chillies in a thick, punchy garlic-soy-chilli glaze. Finished with a handful of sesame seeds — bold, dry, and deeply satisfying.",
    category: "Chinese",
    price: 1445,
    imageUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop",
    rating: 4.6,
    available: true,
    tagline: "Dry-tossed beef with bold chilli heat",
    prepTime: 18,
    popular: false,
    featured: false,
  },
  {
    id: "chi-005",
    name: "Honey Chilli Prawn",
    description:
      "Crispy battered prawns glazed in a sweet-heat honey-chilli sauce with a hint of soy and vinegar. A crowd-pleasing fusion appetiser that balances fire and sweetness in every delicate, crunchy bite.",
    category: "Chinese",
    price: 1700,
    imageUrl: "https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?w=600&auto=format&fit=crop",
    rating: 4.7,
    available: true,
    tagline: "Sweet heat meets crispy prawn perfection",
    prepTime: 18,
    popular: true,
    featured: false,
  },

  // ─────────────────────────────────────────────
  // BREADS & NAAN
  // ─────────────────────────────────────────────
  {
    id: "brd-001",
    name: "Arabic Bread",
    description:
      "Freshly baked, pillowy-soft Arabic flatbread with a slight char and a light, airy texture. The perfect vessel for dips, grills, or simply enjoyed warm on its own straight from the oven.",
    category: "Breads & Naan",
    price: 128,
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop",
    rating: 4.3,
    available: true,
    tagline: "Warm, pillowy, and fresh from the oven",
    prepTime: 8,
    popular: false,
    featured: false,
  },
  {
    id: "brd-002",
    name: "Pita Bread",
    description:
      "Classic round pita bread, warm and fresh with that signature pocket ready to be stuffed or torn and dipped. Soft, lightly golden, and the perfect companion to every dish on the table.",
    category: "Breads & Naan",
    price: 60,
    imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop",
    rating: 4.2,
    available: true,
    tagline: "The perfect pocket for every dip",
    prepTime: 6,
    popular: false,
    featured: false,
  },
  {
    id: "brd-003",
    name: "Puri Paratha",
    description:
      "Light, flaky layers of hand-rolled paratha, pan-fried to a crispy golden finish with a soft, buttery interior. A South Asian bread staple that pairs beautifully with curries, dips, and grills alike.",
    category: "Breads & Naan",
    price: 85,
    imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop",
    rating: 4.3,
    available: true,
    tagline: "Flaky, buttery, and made by hand",
    prepTime: 8,
    popular: false,
    featured: false,
  },

  // ─────────────────────────────────────────────
  // DESSERTS
  // ─────────────────────────────────────────────
  {
    id: "des-001",
    name: "Pistachio Kunafa",
    description:
      "A showstopping dessert — crispy shredded pastry layered over a molten sweet cheese filling, soaked in fragrant rose water syrup and crowned with a generous scatter of crushed pistachios. Pure luxury.",
    category: "Desserts",
    price: 1700,
    imageUrl: "https://images.unsplash.com/photo-1569642270602-04b07b0ada0e?w=600&auto=format&fit=crop",
    rating: 4.9,
    available: true,
    tagline: "The dessert that silences a table",
    prepTime: 20,
    popular: true,
    featured: true,
  },
  {
    id: "des-002",
    name: "Chocolate Kunafa",
    description:
      "A decadent modern twist on the Arabian classic — golden, crispy pastry encasing a luscious, flowing chocolate and cheese centre. Drizzled in sweet syrup and served warm. Dessert perfection.",
    category: "Desserts",
    price: 1148,
    imageUrl: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=600&auto=format&fit=crop",
    rating: 4.8,
    available: true,
    tagline: "A choco-lava twist on a classic",
    prepTime: 18,
    popular: true,
    featured: false,
  },
  {
    id: "des-003",
    name: "Cream Kunafa",
    description:
      "Delicate threads of golden pastry wrapped around a rich, cloud-like cream filling, soaked in light sugar syrup and finished with a dusting of crushed nuts. Soft, sweet, and utterly comforting.",
    category: "Desserts",
    price: 1148,
    imageUrl: "https://images.unsplash.com/photo-1609167830220-7164aa360951?w=600&auto=format&fit=crop",
    rating: 4.7,
    available: true,
    tagline: "Cloud-like cream in crispy gold pastry",
    prepTime: 18,
    popular: false,
    featured: false,
  },

  // ─────────────────────────────────────────────
  // BEVERAGES
  // ─────────────────────────────────────────────
  {
    id: "bev-001",
    name: "Water",
    description:
      "Pure, chilled mineral water to keep you refreshed through every course. The perfect palate cleanser between the bold, aromatic flavours of your meal.",
    category: "Beverages",
    price: 94,
    imageUrl: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&auto=format&fit=crop",
    rating: 4.0,
    available: true,
    tagline: "Pure and refreshing between every bite",
    prepTime: 1,
    popular: false,
    featured: false,
  },
  {
    id: "bev-002",
    name: "Soft Drink",
    description:
      "Ice-cold carbonated soft drink — bubbly, sweet, and perfectly refreshing. The ideal companion to balance the rich and smoky flavours of your favourite grilled dishes.",
    category: "Beverages",
    price: 162,
    imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop",
    rating: 4.1,
    available: true,
    tagline: "Icy cold bubbles to cut through the richness",
    prepTime: 1,
    popular: false,
    featured: false,
  },
  {
    id: "bev-003",
    name: "Mango Lassi",
    description:
      "Fresh Chaunsa mango blended with thick, chilled dahi and a pinch of cardamom — poured tall and frothy. Pakistan's most beloved summer drink and the ultimate companion to a spicy meal.",
    category: "Beverages",
    price: 340,
    imageUrl: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=600&auto=format&fit=crop",
    rating: 4.8,
    available: true,
    tagline: "Pakistan's favourite summer sip",
    prepTime: 5,
    popular: true,
    featured: false,
  },
  {
    id: "bev-004",
    name: "Rooh Afza Sharbat",
    description:
      "The iconic Pakistani rose-and-herb concentrate diluted with chilled water and crushed ice — a nostalgic, deeply refreshing drink that has graced Pakistani iftaar tables and summer afternoons for generations.",
    category: "Beverages",
    price: 255,
    imageUrl: "https://images.unsplash.com/photo-1560508180-03f285f67ded?w=600&auto=format&fit=crop",
    rating: 4.6,
    available: true,
    tagline: "Nostalgia in a chilled glass",
    prepTime: 3,
    popular: true,
    featured: false,
  },
  {
    id: "bev-005",
    name: "Mint Lemonade",
    description:
      "Freshly squeezed lemon juice blended with crushed fresh mint leaves, sugar, and ice — served blended or on the rocks. Cool, sharp, and endlessly refreshing; the perfect antidote to Karachi heat.",
    category: "Beverages",
    price: 340,
    imageUrl: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600&auto=format&fit=crop",
    rating: 4.7,
    available: true,
    tagline: "Cool, sharp, and made for the heat",
    prepTime: 5,
    popular: true,
    featured: false,
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
