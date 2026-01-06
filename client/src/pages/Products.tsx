import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, ArrowRight, Search, X, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

// Mock Data Structure
interface Product {
  id: string;
  name: string;
  category: string;
  img: string;
  description: string;
  features: string[];
}

const products: Product[] = [
  { id: "1", name: "DVD Player", category: "Consumer Electronics", img: "/images/products/product_dvd_player.webp", description: "High-definition DVD player with HDMI output and USB playback support.", features: ["1080p Upscaling", "USB Media Playback", "Compact Design"] },
  { id: "2", name: "PA System", category: "Audio Systems", img: "/images/products/product_pa_system.webp", description: "Professional portable PA system with wireless microphone and Bluetooth connectivity.", features: ["2000W Peak Power", "Bluetooth 5.0", "Wireless Mic Included"] },
  { id: "3", name: "Switch Kit", category: "Gaming & Accessories", img: "/images/products/product_switch_kit.webp", description: "Complete accessory kit for Nintendo Switch including case, screen protector, and grips.", features: ["Hard Shell Case", "Tempered Glass", "Joy-Con Grips"] },
  { id: "4", name: "Yellow Speaker", category: "Portable Audio", img: "/images/products/product_speaker_yellow.webp", description: "Rugged waterproof Bluetooth speaker with 24-hour battery life.", features: ["IPX7 Waterproof", "24h Battery", "360° Sound"] },
  // Duplicate for demo purposes to fill grid
  { id: "5", name: "Home Theater System", category: "Consumer Electronics", img: "/images/products/product_dvd_player.webp", description: "5.1 Channel surround sound system for immersive movie experiences.", features: ["Dolby Digital", "Wireless Rear Speakers", "1000W Total Power"] },
  { id: "6", name: "DJ Controller", category: "Audio Systems", img: "/images/products/product_pa_system.webp", description: "2-channel DJ controller compatible with Serato DJ Lite.", features: ["Touch-sensitive Jog Wheels", "16 Performance Pads", "Built-in Sound Card"] },
  { id: "7", name: "Gaming Headset", category: "Gaming & Accessories", img: "/images/products/product_switch_kit.webp", description: "Over-ear gaming headset with noise-cancelling microphone.", features: ["7.1 Surround Sound", "Memory Foam Earcups", "RGB Lighting"] },
  { id: "8", name: "Retro Radio", category: "Portable Audio", img: "/images/products/product_speaker_yellow.webp", description: "Vintage style AM/FM radio with modern Bluetooth functionality.", features: ["Wooden Cabinet", "Analog Tuning", "Aux Input"] },
];

const categories = ["All", "Consumer Electronics", "Audio Systems", "Gaming & Accessories", "Portable Audio", "Kitchen Appliances", "Home & Garden"];

export default function Products() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

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
        
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-6 mt-12 p-6 bg-muted/20 border border-border rounded-lg">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input 
              placeholder="Search products..." 
              className="pl-10 bg-background border-border h-12 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`
                  px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all
                  ${selectedCategory === cat 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "bg-background border border-border hover:border-primary text-muted-foreground hover:text-foreground"}
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="bg-muted/10 py-12 min-h-[600px]">
        <div className="container">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <motion.div 
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group bg-background border border-border overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="aspect-square relative overflow-hidden bg-white p-8 flex items-center justify-center">
                    <img 
                      src={product.img} 
                      alt={product.name} 
                      className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="bg-white text-black px-6 py-2 font-bold uppercase tracking-wider text-sm">View Details</span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider mb-2">{product.category}</span>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-grow">{product.description}</p>
                    <div className="flex items-center text-sm font-bold text-primary mt-auto">
                      View Specs <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">No products found</h3>
              <p className="text-muted-foreground">Try adjusting your search or category filter.</p>
              <Button 
                variant="link" 
                onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                className="mt-4 text-primary"
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="max-w-3xl bg-background border-border p-0 overflow-hidden">
          {selectedProduct && (
            <div className="flex flex-col md:flex-row h-full">
              <div className="md:w-1/2 bg-white p-12 flex items-center justify-center border-r border-border">
                <img 
                  src={selectedProduct.img} 
                  alt={selectedProduct.name} 
                  className="max-w-full max-h-[300px] object-contain"
                />
              </div>
              <div className="md:w-1/2 p-8 flex flex-col">
                <DialogHeader>
                  <span className="text-xs font-bold text-primary uppercase tracking-wider mb-2">{selectedProduct.category}</span>
                  <DialogTitle className="text-3xl font-serif font-bold mb-4">{selectedProduct.name}</DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-lg text-foreground/80 mb-6">
                  {selectedProduct.description}
                </DialogDescription>
                
                <div className="mb-8">
                  <h4 className="font-bold mb-3 uppercase text-sm tracking-wide text-muted-foreground">Key Features</h4>
                  <ul className="space-y-2">
                    {selectedProduct.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-6 border-t border-border">
                  <Button className="w-full text-lg py-6">
                    Request Quote
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
