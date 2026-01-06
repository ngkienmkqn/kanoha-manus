import { motion } from "framer-motion";
import { Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = [
  { name: "Consumer Electronics", img: "/images/products/product_dvd_player.webp", items: ["DVD Players", "Home Theater", "Televisions", "Projectors"] },
  { name: "Audio Systems", img: "/images/products/product_pa_system.webp", items: ["PA Systems", "Speakers", "Microphones", "DJ Equipment"] },
  { name: "Gaming & Accessories", img: "/images/products/product_switch_kit.webp", items: ["Consoles", "Controllers", "Headsets", "Cases"] },
  { name: "Portable Audio", img: "/images/products/product_speaker_yellow.webp", items: ["Bluetooth Speakers", "Radios", "MP3 Players", "Boomboxes"] },
  { name: "Kitchen Appliances", img: "/images/products/product_switch_kit.webp", items: ["Air Fryers", "Blenders", "Toasters", "Kettles"] }, // Placeholder img
  { name: "Home & Garden", img: "/images/products/product_dvd_player.webp", items: ["Wall Mounts", "Clocks", "Fans", "Heaters"] } // Placeholder img
];

const allTags = [
  "Air Fryers", "Drinkware", "Dinnerware", "Hello Kitty", "Kitchen Gadgets", 
  "Wall Mounts", "Flatware", "Car Audio", "PA Systems", "Cups", "Stovetop Kettles",
  "Alarm Clocks", "Bar Stools", "Bluetooth", "Bulk Accessories", "Canister Storage",
  "Chaffing Dishes", "Cookware", "Cutlery", "Dish Racks", "Gaming Accessories",
  "Health & Beauty", "Home Stereo", "Kids Electronics", "LCD Screens", "Melamine",
  "Musical Instruments", "Nostalgia Systems", "Novelty Products", "Office Supplies",
  "Outdoor Gear", "Personal Care", "Pro Audio", "Tableware"
];

export default function Products() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans pt-20 lg:pr-[88px]">
      {/* Header */}
      <div className="container py-16">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px w-12 bg-primary" />
          <span className="text-primary font-bold tracking-widest uppercase">Our Inventory</span>
        </div>
        <h1 className="text-6xl md:text-7xl font-serif font-bold text-foreground mb-8">
          World-Class Products.
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Explore our extensive catalog of over 3,000 high-demand items. From cutting-edge electronics to essential home goods, we stock what sells.
        </p>
      </div>

      {/* Featured Categories */}
      <div className="bg-muted/20 py-20">
        <div className="container">
          <h2 className="text-3xl font-serif font-bold mb-12">Featured Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group bg-background border border-border overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-video relative overflow-hidden bg-white p-8">
                  <img 
                    src={cat.img} 
                    alt={cat.name} 
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">{cat.name}</h3>
                  <ul className="space-y-2 mb-6">
                    {cat.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                    View Catalog <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Category List */}
      <div className="container py-20">
        <h2 className="text-3xl font-serif font-bold mb-12">All Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {allTags.map((tag, i) => (
            <div key={i} className="bg-background border border-border py-4 px-4 text-sm font-bold text-muted-foreground hover:text-primary hover:border-primary transition-colors cursor-default flex items-center justify-center text-center h-full">
              {tag}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-primary text-primary-foreground py-20">
        <div className="container text-center">
          <h2 className="text-4xl font-serif font-bold mb-6">Ready to stock your store?</h2>
          <p className="text-xl opacity-80 mb-8 max-w-2xl mx-auto">
            Join thousands of successful retailers who trust Kanoha for their inventory needs.
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
            Start Dropshipping Today
          </Button>
        </div>
      </div>
    </div>
  );
}
