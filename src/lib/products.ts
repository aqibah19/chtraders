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
};

export const categories = [
  { slug: "juicers", name: "Juicers", icon: "Citrus" },
  { slug: "blenders", name: "Blenders", icon: "Soup" },
  { slug: "choppers", name: "Choppers", icon: "Scissors" },
  { slug: "sandwich-makers", name: "Sandwich Makers", icon: "Sandwich" },
  { slug: "kettles", name: "Kettles", icon: "Coffee" },
  { slug: "irons", name: "Irons", icon: "Shirt" },
  { slug: "air-fryers", name: "Air Fryers", icon: "Flame" },
  { slug: "microwave-ovens", name: "Microwave Ovens", icon: "Microwave" },
  { slug: "electric-stoves", name: "Electric Stoves", icon: "CookingPot" },
  { slug: "cookware-sets", name: "Cookware Sets", icon: "Utensils" },
  { slug: "crockery-items", name: "Crockery Items", icon: "UtensilsCrossed" },
  { slug: "kitchen-appliances", name: "Kitchen Appliances", icon: "ChefHat" },
] as const;

const d = (s: string) =>
  `${s} — built with premium materials, tested for everyday reliability and backed by the CH TRADERS quality promise. Energy-efficient, easy to clean and designed to elevate your kitchen experience.`;

export const products: Product[] = [
  // Sandwich Makers
  { id: "haa-320", name: "Sandwich HAA-320", price: 2500, category: "sandwich-makers", rating: 4.5, reviews: 128, badge: "Best Seller", description: d("Non-stick 2-slice sandwich maker with cool-touch handle") },
  { id: "haa-321", name: "Sandwich HAA-321", price: 2500, category: "sandwich-makers", rating: 4.4, reviews: 96, description: d("Classic triangle sandwich press for crispy melts") },
  { id: "haa-322", name: "Sandwich HAA-322", price: 2650, category: "sandwich-makers", rating: 4.6, reviews: 142, badge: "New", description: d("Premium sandwich maker with indicator lights") },
  // Blenders
  { id: "haa-101", name: "2 In 1 Blender HAA-101", price: 2200, category: "blenders", rating: 4.3, reviews: 210, description: d("2-in-1 blender with grinder jar") },
  { id: "haa-102", name: "2 In 1 Blender & Grinder HAA-102", price: 2500, category: "blenders", rating: 4.5, reviews: 187, badge: "Best Seller", description: d("Powerful motor for daily blending and dry grinding") },
  { id: "haa-201", name: "3 In 1 Blender HAA-201", price: 2500, category: "blenders", rating: 4.4, reviews: 156, description: d("Three jars for blending, grinding and chopping") },
  { id: "comm-blender", name: "Commercial Blender", price: 8000, category: "blenders", rating: 4.7, reviews: 88, badge: "Premium", description: d("Heavy duty commercial blender for shops and cafes") },
  { id: "heavy-comm-blender", name: "Full Heavy Commercial Blender", price: 9900, category: "blenders", rating: 4.8, reviews: 64, badge: "Premium", description: d("Industrial-grade blender with reinforced housing") },
  { id: "sound-proof-blender", name: "Sound Proof Blender", price: 36000, category: "blenders", rating: 4.9, reviews: 32, badge: "Premium", oldPrice: 42000, description: d("Whisper-quiet commercial blender with acoustic enclosure") },
  // Juicers
  { id: "haa-301", name: "3 In 1 Juicer HAA-301", price: 4700, category: "juicers", rating: 4.5, reviews: 174, description: d("3-in-1 juicer with extractor, blender and grinder") },
  { id: "haa-333", name: "Premium Dynasty 3 In 1 Juicer HAA-333", price: 12000, category: "juicers", rating: 4.9, reviews: 92, badge: "Premium", description: d("Flagship juicer with chrome finish and quiet motor") },
  { id: "haa-302", name: "Juicer Blender Grinder HAA-302", price: 5200, category: "juicers", rating: 4.6, reviews: 121, description: d("All-in-one juicing system for the modern kitchen") },
  { id: "haa-401", name: "4 In 1 Juicer HAA-401", price: 5200, category: "juicers", rating: 4.6, reviews: 137, badge: "Best Seller", description: d("4-function juicing station with safety lock") },
  // Food Processor
  { id: "haa-2000", name: "Food Processor HAA-2000", price: 9600, category: "kitchen-appliances", rating: 4.7, reviews: 78, badge: "Premium", description: d("Multi-blade food processor for prep, chop and knead") },
  // Choppers
  { id: "haa-501", name: "3 In 1 Chopper HAA-501", price: 5300, category: "choppers", rating: 4.5, reviews: 110, description: d("Three-speed chopper with stainless blades") },
  { id: "haa-503", name: "Meat Chopper HAA-503", price: 3400, category: "choppers", rating: 4.4, reviews: 89, description: d("Powerful meat chopper for everyday cooking") },
  { id: "haa-504", name: "3 In 1 Chopper HAA-504", price: 3600, category: "choppers", rating: 4.5, reviews: 101, description: d("Compact chopper with three attachment jars") },
  // Irons
  { id: "haa-601", name: "Heavy Iron HAA-601", price: 2600, category: "irons", rating: 4.3, reviews: 165, description: d("Heavy-base dry iron with ceramic soleplate") },
  { id: "haa-602", name: "Steam Iron HAA-602", price: 3100, category: "irons", rating: 4.5, reviews: 198, badge: "Best Seller", description: d("Variable steam iron with anti-drip system") },
  // Kettles
  { id: "haa-701", name: "Plastic Kettle HAA-701", price: 1350, category: "kettles", rating: 4.2, reviews: 144, description: d("Cordless plastic kettle with auto shut-off") },
  { id: "haa-703", name: "Electric Plastic Kettle HAA-703", price: 1650, category: "kettles", rating: 4.3, reviews: 132, description: d("Fast-boil electric kettle with light indicator") },
  { id: "haa-702", name: "Panasonic Electric Steel Kettle HAA-702", price: 1000, category: "kettles", rating: 4.4, reviews: 220, badge: "Flash Sale", oldPrice: 1400, description: d("Brushed steel electric kettle, 1.8L capacity") },
  { id: "haa-802", name: "Kenwood Electric Steel Kettle HAA-802", price: 1000, category: "kettles", rating: 4.4, reviews: 198, badge: "Flash Sale", oldPrice: 1400, description: d("Premium steel kettle with concealed element") },
  { id: "stc-222", name: "Steel Kettle STC-222", price: 1000, category: "kettles", rating: 4.3, reviews: 156, badge: "Flash Sale", oldPrice: 1300, description: d("Compact stainless steel kettle") },
  // Cooking Appliances
  { id: "haa-801", name: "Electric Stove HAA-801", price: 4600, category: "electric-stoves", rating: 4.4, reviews: 87, description: d("Twin-burner electric stove with adjustable heat") },
  { id: "haa-1000", name: "Microwave Oven HAA-1000", price: 13500, category: "microwave-ovens", rating: 4.6, reviews: 74, description: d("25L microwave with auto-cook menus") },
  { id: "haa-1500", name: "Microwave Oven With Grill HAA-1500", price: 22500, category: "microwave-ovens", rating: 4.8, reviews: 58, badge: "Premium", description: d("Convection + grill microwave for full meals") },
  { id: "haa-901", name: "Air Fryer HAA-901", price: 15500, category: "air-fryers", rating: 4.8, reviews: 162, badge: "Best Seller", description: d("Large-capacity air fryer with digital touch panel") },
  // Kitchen Appliances
  { id: "haa-1101", name: "Egg Beater HAA-1101", price: 2800, category: "kitchen-appliances", rating: 4.4, reviews: 94, description: d("5-speed hand mixer with stainless beaters") },
  { id: "haa-1201", name: "Hand Blender 3 In 1 HAA-1201", price: 3400, category: "kitchen-appliances", rating: 4.5, reviews: 118, description: d("Hand blender with whisk and chopper attachments") },
  // Cookware & Crockery
  { id: "panasonic-classic", name: "Panasonic Cookware Classic Set", price: 8600, category: "cookware-sets", rating: 4.6, reviews: 76, description: d("Non-stick cookware set with glass lids") },
  { id: "panasonic-platinum", name: "Panasonic Cookware Platinum Set", price: 9300, category: "cookware-sets", rating: 4.7, reviews: 81, badge: "Premium", description: d("Premium platinum-finish cookware set") },
  { id: "reona-color", name: "Reona 5 Pieces Colour Set", price: 3400, category: "crockery-items", rating: 4.3, reviews: 65, description: d("5-piece colourful melamine serving set") },
  { id: "reona-white", name: "Reona 5 Pieces White Set", price: 3300, category: "crockery-items", rating: 4.3, reviews: 59, description: d("5-piece elegant white serving set") },
  { id: "reona-bowl", name: "Reona Bowl Plastic Set", price: 1250, category: "crockery-items", rating: 4.1, reviews: 88, description: d("Lightweight bowl set for everyday dining") },
];

export const getProduct = (id: string) => products.find((p) => p.id === id);
export const getByCategory = (slug: string) => products.filter((p) => p.category === slug);

export const formatPKR = (n: number) =>
  `Rs ${n.toLocaleString("en-PK")}`;