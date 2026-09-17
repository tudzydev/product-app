import { Product } from "../models";

export const sampleProducts = [
  {
    name: "Wireless Noise-Canceling Headphones",
    description: "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and spatial audio support.",
    price: 199.99,
    category: "Electronics",
    stock: 45,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    sku: "ELEC-HP-001",
    isActive: true,
  },
  {
    name: "Mechanical Gaming Keyboard RGB",
    description: "Hot-swappable mechanical switches, per-key RGB backlighting, aircraft-grade aluminum frame, and detachable USB-C cable.",
    price: 129.5,
    category: "Electronics",
    stock: 32,
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
    sku: "ELEC-KB-002",
    isActive: true,
  },
  {
    name: "34-inch Curved UltraWide Monitor",
    description: "144Hz refresh rate, 1ms response time, WQHD 3440x1440 resolution, HDR400, and USB-C 90W power delivery hub.",
    price: 499.0,
    category: "Electronics",
    stock: 14,
    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80",
    sku: "ELEC-MON-003",
    isActive: true,
  },
  {
    name: "Ergonomic Office Mesh Chair",
    description: "Breathable mesh back with adjustable 3D armrests, dynamic lumbar support, and tilt-lock mechanism for all-day comfort.",
    price: 289.0,
    category: "Furniture",
    stock: 18,
    imageUrl: "https://images.unsplash.com/photo-1580481077195-73ab013f636f?w=600&auto=format&fit=crop&q=80",
    sku: "FURN-CHR-001",
    isActive: true,
  },
  {
    name: "Electric Height-Adjustable Standing Desk",
    description: "Dual-motor motorized desk frame with memory presets, solid oak tabletop (60x30 inch), and built-in cable management tray.",
    price: 399.99,
    category: "Furniture",
    stock: 10,
    imageUrl: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=600&auto=format&fit=crop&q=80",
    sku: "FURN-DSK-002",
    isActive: true,
  },
  {
    name: "Minimalist Water-Resistant Laptop Backpack",
    description: "Durable recycled polyester exterior, dedicated padded 16-inch laptop compartment, hidden anti-theft pocket, and luggage strap.",
    price: 79.99,
    category: "Apparel",
    stock: 65,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
    sku: "APP-BP-001",
    isActive: true,
  },
  {
    name: "Organic Heavyweight Cotton Crewneck T-Shirt",
    description: "100% certified organic cotton, pre-shrunk, 240 GSM heavy jersey fabric with a relaxed modern streetwear fit.",
    price: 29.99,
    category: "Apparel",
    stock: 120,
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
    sku: "APP-TS-002",
    isActive: true,
  },
  {
    name: "Stainless Steel Double-Wall Vacuum Water Bottle",
    description: "32oz insulated bottle keeps drinks cold for 24 hours or hot for 12 hours. BPA-free leak-proof lid with carry loop.",
    price: 24.95,
    category: "Kitchen",
    stock: 85,
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80",
    sku: "KIT-BOT-001",
    isActive: true,
  },
  {
    name: "Precision Pour-Over Coffee Kettle & Dripper Set",
    description: "Gooseneck temperature-control electric kettle paired with a ceramic conical dripper and 100 unbleached paper filters.",
    price: 64.5,
    category: "Kitchen",
    stock: 28,
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
    sku: "KIT-COF-002",
    isActive: true,
  },
  {
    name: "Smart Ambient LED Desk Lamp",
    description: "Eye-caring diffused LED lighting with touch brightness slider, 5 color temperature modes, and wireless phone charging base.",
    price: 45.0,
    category: "Home",
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80",
    sku: "HOME-LMP-001",
    isActive: true,
  },
  {
    name: "Designing Data-Intensive Applications",
    description: "The definitive guide by Martin Kleppmann on distributed systems, storage engines, replication, and data processing.",
    price: 42.0,
    category: "Books",
    stock: 50,
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
    sku: "BOOK-DDIA-001",
    isActive: true,
  },
  {
    name: "Clean Code: A Handbook of Agile Software Craftsmanship",
    description: "Classic software engineering principles, patterns, and refactoring techniques by Robert C. Martin.",
    price: 36.99,
    category: "Books",
    stock: 0,
    imageUrl: "https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=600&auto=format&fit=crop&q=80",
    sku: "BOOK-CC-002",
    isActive: true,
  },
];

export const seedDatabase = async (force: boolean = false): Promise<{ count: number; message: string }> => {
  if (force) {
    await Product.destroy({ where: {}, truncate: true });
    const created = await Product.bulkCreate(sampleProducts);
    return { count: created.length, message: `Successfully reset and seeded ${created.length} products.` };
  }

  const existingCount = await Product.count();
  if (existingCount > 0) {
    return { count: existingCount, message: `Database already contains ${existingCount} products. Seeding skipped.` };
  }

  const created = await Product.bulkCreate(sampleProducts);
  return { count: created.length, message: `Successfully seeded ${created.length} products.` };
};
