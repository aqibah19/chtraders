export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  rating: number;
  reviews: number;
  badge?: "New" | "Best Seller" | "Flash Sale" | "Premium";
  oldPrice?: number;
  description: string;
  model?: string;
  image?: string;
};

export const categories = [
  { slug: "sandwich-makers", name: "Sandwich Makers", icon: "Sandwich" },
  { slug: "blenders", name: "Blenders", icon: "Soup" },
  { slug: "juicers", name: "Juicers", icon: "Citrus" },
  { slug: "choppers", name: "Choppers", icon: "Scissors" },
  { slug: "irons", name: "Irons", icon: "Shirt" },
  { slug: "kettles", name: "Kettles", icon: "Coffee" },
  { slug: "air-fryers", name: "Air Fryers", icon: "Flame" },
  { slug: "microwave-ovens", name: "Microwave Ovens", icon: "Microwave" },
  { slug: "electric-stoves", name: "Electric Stoves", icon: "CookingPot" },
  { slug: "cookware-sets", name: "Cookware Sets", icon: "Utensils" },
  { slug: "crockery-items", name: "Crockery Items", icon: "UtensilsCrossed" },
  { slug: "kitchen-appliances", name: "Kitchen Appliances", icon: "ChefHat" },
] as const;

export const products: Product[] = [
  // Sandwich Makers
  {
    id: "haa-318",
    name: "Sandwich Maker HAA-318",
    model: "HAA-318",
    price: 3500,
    category: "sandwich-makers",
    rating: 4.5,
    reviews: 84,
    description: "National HAA 2-slice compact sandwich maker. Non-stick heating plates, cool-touch handle, and power indicator lights.",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop"
  },
  {
    id: "haa-319",
    name: "Sandwich Maker HAA-319",
    model: "HAA-319",
    price: 3500,
    category: "sandwich-makers",
    rating: 4.6,
    reviews: 92,
    description: "National HAA classic sandwich press with durable non-stick Teflon coating, fast 750W heating, and cool-touch housing.",
    image: "/products/haa-319.jpg"
  },
  {
    id: "haa-320",
    name: "Sandwich Maker HAA-320",
    model: "HAA-320",
    price: 3500,
    category: "sandwich-makers",
    rating: 4.6,
    reviews: 128,
    badge: "Best Seller",
    description: "National HAA 2-slice sandwich toaster. Features non-stick plates, vertical standing storage, and automatic thermostat control.",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop"
  },
  {
    id: "haa-321",
    name: "Sandwich Maker HAA-321",
    model: "HAA-321",
    price: 4000,
    category: "sandwich-makers",
    rating: 4.7,
    reviews: 96,
    description: "National HAA heavy-duty sandwich maker with deep grill plates, ideal for thick stuffed sandwiches and paninis.",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop"
  },
  {
    id: "haa-322",
    name: "Sandwich Maker HAA-322",
    model: "HAA-322",
    price: 5000,
    category: "sandwich-makers",
    rating: 4.8,
    reviews: 142,
    badge: "New",
    description: "Premium National HAA 4-slice family sandwich toaster with stainless steel top lid and automatic cut-off sensor.",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop"
  },
  {
    id: "haa-323",
    name: "Sandwich Maker HAA-323",
    model: "HAA-323",
    price: 8000,
    category: "sandwich-makers",
    rating: 4.9,
    reviews: 58,
    badge: "Premium",
    description: "Multi-function 3-in-1 Sandwich, Waffle & Grill maker with interchangeable non-stick plates and high power 1000W element.",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop"
  },
  {
    id: "haa-324",
    name: "Sandwich Maker HAA-324",
    model: "HAA-324",
    price: 3200,
    category: "sandwich-makers",
    rating: 4.4,
    reviews: 74,
    description: "Compact 2-slice National HAA sandwich maker with quick heating and easy-clean non-stick surfaces.",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop"
  },

  // Blenders & Juicers
  {
    id: "haa-101",
    name: "Blender HAA-101",
    model: "HAA-101",
    price: 2200,
    category: "blenders",
    rating: 4.4,
    reviews: 210,
    description: "National HAA 2-in-1 blender and dry grinder. Includes heavy-duty motor backed by 5 years warranty.",
    image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&auto=format&fit=crop"
  },
  {
    id: "haa-102",
    name: "Blender & Grinder HAA-102",
    model: "HAA-102",
    price: 2500,
    category: "blenders",
    rating: 4.6,
    reviews: 187,
    badge: "Best Seller",
    description: "National HAA commercial heavy-duty blender & grinder with 5 years warranty. Heavy copper motor for daily blending.",
    image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop"
  },
  {
    id: "haa-201",
    name: "Blender HAA-201",
    model: "HAA-201",
    price: 2500,
    category: "blenders",
    rating: 4.5,
    reviews: 156,
    description: "National HAA 3-in-1 blender, grinder, and mincer with 5 years warranty. Unbreakable jars and high-speed pulse control.",
    image: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800&auto=format&fit=crop"
  },
  {
    id: "haa-301",
    name: "Juicer HAA-301",
    model: "HAA-301",
    price: 4700,
    category: "juicers",
    rating: 4.6,
    reviews: 174,
    description: "National HAA 3-in-1 juicer, blender & grinder with 5 years warranty. Extract fresh juices effortlessly with 100% pure copper motor.",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&auto=format&fit=crop"
  },
  {
    id: "haa-333",
    name: "Premium Dynasty Juicer HAA-333",
    model: "HAA-333",
    price: 12000,
    category: "juicers",
    rating: 4.9,
    reviews: 92,
    badge: "Premium",
    description: "National HAA Premium Dynasty series 3-in-1 juicer extractor, blender, and grinder with stainless steel housing.",
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=800&auto=format&fit=crop"
  },
  {
    id: "haa-302",
    name: "Juicer Blender Grinder HAA-302",
    model: "HAA-302",
    price: 5200,
    category: "juicers",
    rating: 4.7,
    reviews: 121,
    description: "National HAA 3-in-1 juicing system with solid-state 2-speed control and heavy-duty commercial motor.",
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&auto=format&fit=crop"
  },
  {
    id: "haa-401",
    name: "Juicer HAA-401",
    model: "HAA-401",
    price: 5200,
    category: "juicers",
    rating: 4.8,
    reviews: 137,
    badge: "Best Seller",
    description: "National HAA 4-in-1 juicer, blender, drymill, and chopper. Equipped with 100% pure copper heavy duty motor.",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&auto=format&fit=crop"
  },
  {
    id: "haa-2000",
    name: "Food Processor HAA-2000",
    model: "HAA-2000",
    price: 9600,
    category: "kitchen-appliances",
    rating: 4.8,
    reviews: 78,
    badge: "Premium",
    description: "National HAA 11-in-1 Food Processor with unbreakable material, 100% pure copper motor, stainless steel spinner, and 1000ml glass container.",
    image: "https://images.unsplash.com/photo-1590794056226-77ef3a6c4743?w=800&auto=format&fit=crop"
  },
  {
    id: "haa-3000",
    name: "Food Processor 10-in-1 HAA-3000",
    model: "HAA-3000",
    price: 14500,
    category: "kitchen-appliances",
    rating: 4.9,
    reviews: 45,
    badge: "Premium",
    description: "Flagship National HAA 10-in-1 Master Food Preparation System with multi-blade slicing, shredding, dough kneading, and juicing attachments.",
    image: "https://images.unsplash.com/photo-1590794056226-77ef3a6c4743?w=800&auto=format&fit=crop"
  },
  {
    id: "comm-blender",
    name: "Commercial Blender",
    model: "COMM-800",
    price: 8000,
    category: "blenders",
    rating: 4.8,
    reviews: 88,
    badge: "Premium",
    description: "Heavy duty commercial blender with high-torque motor, variable speed control, and unbreakable polycarbonate jug.",
    image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&auto=format&fit=crop"
  },
  {
    id: "heavy-comm-blender",
    name: "Full Heavy Commercial Blender",
    model: "COMM-900",
    price: 9900,
    category: "blenders",
    rating: 4.9,
    reviews: 64,
    badge: "Premium",
    description: "Full heavy industrial commercial blender. Features high-velocity Japanese stainless steel blades and pulse mode.",
    image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&auto=format&fit=crop"
  },
  {
    id: "sound-proof-blender",
    name: "Sound Proof Blender",
    model: "SP-3600",
    price: 36000,
    oldPrice: 42000,
    category: "blenders",
    rating: 5.0,
    reviews: 32,
    badge: "Premium",
    description: "Ultra-quiet soundproof commercial blender with heavy acoustic enclosure shield, programmable timer, and ultra high-speed motor.",
    image: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800&auto=format&fit=crop"
  },

  // Choppers
  {
    id: "haa-501-black",
    name: "Chopper Black HAA-501",
    model: "HAA-501",
    price: 5300,
    category: "choppers",
    rating: 4.6,
    reviews: 110,
    description: "National HAA powerful 3-in-1 chopper in Sleek Black finish. Super quality stainless steel blades, 100% pure copper motor, 5 years warranty.",
    image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=800&auto=format&fit=crop"
  },
  {
    id: "haa-501-red",
    name: "Chopper Red HAA-501",
    model: "HAA-501",
    price: 5300,
    category: "choppers",
    rating: 4.7,
    reviews: 98,
    description: "National HAA powerful 3-in-1 chopper in Vibrant Metallic Red finish. High torque motor for vegetables, meat, and nuts.",
    image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=800&auto=format&fit=crop"
  },
  {
    id: "haa-503",
    name: "Meat Chopper HAA-503",
    model: "HAA-503",
    price: 3400,
    category: "choppers",
    rating: 4.5,
    reviews: 89,
    description: "National HAA electric meat chopper with stainless steel bowl, dual speed settings, and powerful copper motor.",
    image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=800&auto=format&fit=crop"
  },
  {
    id: "haa-504",
    name: "Meat Chopper HAA-504",
    model: "HAA-504",
    price: 3600,
    category: "choppers",
    rating: 4.6,
    reviews: 101,
    description: "National HAA 3-in-1 meat and vegetable chopper with quad stainless steel blades, ergonomic handle, and 1 year warranty.",
    image: "https://images.unsplash.com/photo-1590794056226-77ef3a6c4743?w=800&auto=format&fit=crop"
  },

  // Irons
  {
    id: "haa-601",
    name: "Heavy Dry Iron HAA-601",
    model: "HAA-601",
    price: 2600,
    category: "irons",
    rating: 4.5,
    reviews: 165,
    description: "National HAA heavy-weight dry iron with ceramic non-stick soleplate, variable temperature control, and 5 years warranty.",
    image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=800&auto=format&fit=crop"
  },
  {
    id: "haa-602",
    name: "Steam Iron HAA-602",
    model: "HAA-602",
    price: 3100,
    category: "irons",
    rating: 4.7,
    reviews: 198,
    badge: "Best Seller",
    description: "National HAA 2200W steam iron with ceramic soleplate, burst of steam, water spray mist, anti-drip system, and 280ml water tank.",
    image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=800&auto=format&fit=crop"
  },

  // Electric Kettles
  {
    id: "haa-701",
    name: "Plastic Kettle HAA-701",
    model: "HAA-701",
    price: 1350,
    category: "kettles",
    rating: 4.3,
    reviews: 144,
    description: "National HAA 2.0 Liter electric plastic kettle. Double body cool touch insulation, 1500 Watts rapid heating, and automatic shut-off.",
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f6?w=800&auto=format&fit=crop"
  },
  {
    id: "haa-703",
    name: "Electric Plastic Kettle HAA-703",
    model: "HAA-703",
    price: 1650,
    category: "kettles",
    rating: 4.5,
    reviews: 132,
    description: "National HAA 2.0L black electric kettle with LED indicator, 360 degree swivel base, boil-dry protection, and 1 year warranty.",
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f6?w=800&auto=format&fit=crop"
  },
  {
    id: "haa-702",
    name: "Panasonic Steel Kettle HAA-702",
    model: "HAA-702",
    price: 1000,
    oldPrice: 1400,
    category: "kettles",
    rating: 4.6,
    reviews: 220,
    badge: "Flash Sale",
    description: "Panasonic HAA 2.0 Liter stainless steel electric kettle. 1500 Watts fast boiling, 360 rotating removable base, boil-dry and overheat protection.",
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f6?w=800&auto=format&fit=crop"
  },
  {
    id: "haa-802",
    name: "Kenwood Steel Kettle HAA-802",
    model: "HAA-802",
    price: 1000,
    oldPrice: 1400,
    category: "kettles",
    rating: 4.6,
    reviews: 198,
    badge: "Flash Sale",
    description: "Kenwood 2.0L brushed stainless steel electric kettle with concealed heating element, auto shut-off, and indicator light.",
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f6?w=800&auto=format&fit=crop"
  },
  {
    id: "stc-222",
    name: "Steel Kettle STC-222",
    model: "STC-222",
    price: 1000,
    oldPrice: 1300,
    category: "kettles",
    rating: 4.4,
    reviews: 156,
    badge: "Flash Sale",
    description: "National HAA STC-222 stainless steel electric kettle. Designed to save up to 66% energy with rapid boil technology.",
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f6?w=800&auto=format&fit=crop"
  },

  // Cooking Appliances
  {
    id: "haa-801",
    name: "Electric Stove HAA-801",
    model: "HAA-801",
    price: 4600,
    category: "electric-stoves",
    rating: 4.6,
    reviews: 87,
    description: "National HAA 3500 Watt Infrared Electric Stove with wooden finish body, multi-function touch control (Fry, BBQ, Cook, Soup, Timer), and 1 year heater warranty.",
    image: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop"
  },
  {
    id: "haa-1000",
    name: "Microwave Oven HAA-1000",
    model: "HAA-1000",
    price: 13500,
    category: "microwave-ovens",
    rating: 4.7,
    reviews: 74,
    description: "National HAA 20 Liter Microwave Oven (700W output). Features 5 power levels, defrost by weight, 35-minute timer, and 255mm glass turntable.",
    image: "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=800&auto=format&fit=crop"
  },
  {
    id: "haa-1500",
    name: "Microwave Oven with Grill HAA-1500",
    model: "HAA-1500",
    price: 22500,
    category: "microwave-ovens",
    rating: 4.9,
    reviews: 58,
    badge: "Premium",
    description: "National HAA 25 Liter Microwave Oven with Grill function. Digital control panel, child safety lock, multi-stage cooking, and quick defrost.",
    image: "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=800&auto=format&fit=crop"
  },
  {
    id: "haa-2500",
    name: "Microwave Baking Oven HAA-2500",
    model: "HAA-2500",
    price: 28000,
    category: "microwave-ovens",
    rating: 5.0,
    reviews: 36,
    badge: "Premium",
    description: "3-in-1 Convection Baking, Grill & Microwave Oven HAA-2500 (30L). Ideal for cake baking, pizza, roasting, and heating with digital touch preset menus.",
    image: "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=800&auto=format&fit=crop"
  },

  // Small Appliances
  {
    id: "haa-1101",
    name: "Egg Beater HAA-1101",
    model: "HAA-1101",
    price: 2800,
    category: "kitchen-appliances",
    rating: 4.5,
    reviews: 94,
    description: "National HAA 120W 5-Speed Hand Mixer / Egg Beater. Double stick stainless steel configuration, standing design, and circulation cooling.",
    image: "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=800&auto=format&fit=crop"
  },
  {
    id: "haa-1201",
    name: "Hand Blender HAA-1201",
    model: "HAA-1201",
    price: 3400,
    category: "kitchen-appliances",
    rating: 4.6,
    reviews: 118,
    description: "National HAA 3-in-1 Hand Blender set with stainless steel thick blade, whisk attachment, chopper bowl, BPA-free material, and 1 year warranty.",
    image: "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=800&auto=format&fit=crop"
  },
  {
    id: "haa-1202",
    name: "Hand Blender HAA-1202",
    model: "HAA-1202",
    price: 3800,
    category: "kitchen-appliances",
    rating: 4.7,
    reviews: 82,
    description: "National HAA Heavy-Duty Hand Immersion Blender with Turbo mode, ergonomic soft-grip handle, and stainless steel anti-splash shaft.",
    image: "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=800&auto=format&fit=crop"
  },
  {
    id: "haa-1203",
    name: "Hand Blender 5-in-1 HAA-1203",
    model: "HAA-1203",
    price: 4800,
    category: "kitchen-appliances",
    rating: 4.9,
    reviews: 64,
    badge: "New",
    description: "National HAA 5-in-1 Master Hand Blender Kit. Includes immersion stick, balloon whisk, 500ml chopper bowl, beaker, and potato masher attachment.",
    image: "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=800&auto=format&fit=crop"
  },
  {
    id: "haa-901",
    name: "Air Fryer HAA-901",
    model: "HAA-901",
    price: 15500,
    category: "air-fryers",
    rating: 4.9,
    reviews: 162,
    badge: "Best Seller",
    description: "National HAA Master Chef 10-Liter extra large Air Fryer (1800W). LED touch screen display, non-stick cooking basket, 80-200°C temp control, and 5 years warranty.",
    image: "https://images.unsplash.com/photo-1626147311219-c603953457a4?w=800&auto=format&fit=crop"
  },

  // Cookware & Crockery
  {
    id: "panasonic-classic",
    name: "Panasonic Cookware Classic Set (17 Pcs)",
    model: "Classic-17",
    price: 8600,
    category: "cookware-sets",
    rating: 4.7,
    reviews: 76,
    description: "Panasonic 17-piece non-stick cookware gift set. Includes cooking pots, frypans, glass lids, and 6-piece cooking spoon set.",
    image: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop"
  },
  {
    id: "panasonic-platinum",
    name: "Panasonic Cookware Platinum Set (18 Pcs)",
    model: "Platinum-18",
    price: 9300,
    category: "cookware-sets",
    rating: 4.8,
    reviews: 81,
    badge: "Premium",
    description: "Panasonic 18-piece Platinum gift non-stick cookware set. Heavy-gauge aluminum construction, tempered glass lids, and heat-resistant handles.",
    image: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop"
  },
  {
    id: "reona-color",
    name: "Reona 5 Pieces Colour Set",
    model: "Reona-Color-5",
    price: 3400,
    category: "crockery-items",
    rating: 4.5,
    reviews: 65,
    description: "Reona 5-piece floral enamelware pot set with lids (sizes 14, 16, 18, 20, 22 cm). Heat resistant, durable enamel coating.",
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&auto=format&fit=crop"
  },
  {
    id: "reona-white",
    name: "Reona 5 Pieces White Set",
    model: "Reona-White-5",
    price: 3300,
    category: "crockery-items",
    rating: 4.5,
    reviews: 59,
    description: "Reona 5-piece elegant white enamelware pot set with subtle floral pattern (sizes 14, 16, 18, 20, 22 cm).",
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&auto=format&fit=crop"
  },
  {
    id: "reona-bowl",
    name: "Reona Bowl Plastic Storage Set",
    model: "Reona-Bowl-Plastic",
    price: 1250,
    category: "crockery-items",
    rating: 4.3,
    reviews: 88,
    description: "Reona 5-piece nested plastic bowl set with airtight snap lids. Vibrant floral design, ideal for food storage and serving.",
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&auto=format&fit=crop"
  },
];

export const getProduct = (id: string) => products.find((p) => p.id === id);
export const getByCategory = (slug: string) => products.filter((p) => p.category === slug);

export const formatPKR = (n: number) =>
  `Rs ${n.toLocaleString("en-PK")}`;