import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, ArrowRight, Search, X, Filter, ChevronLeft, ChevronRight, ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import productData from "@/data/products.json";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

// Mock Data Structure (Fallback if JSON is empty initially)
interface Product {
  id: string;
  name: string;
  price: string;
  category: string;
  img: string;
  description: string;
  features: string[];
}

import { useLocation } from "wouter";

const ITEMS_PER_PAGE = 12;

export default function Products() {
  const [, setLocation] = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { items, addToCart, removeFromCart, updateQuantity, clearCart, itemCount } = useCart();

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("Inquiry submitted successfully! We will contact you shortly.");
      clearCart();
      setIsCartOpen(false);
      setIsSubmitting(false);
      setFormData({ name: "", email: "", phone: "", message: "" });
    }, 1500);
  };

  useEffect(() => {
    // Load data from JSON
    // In a real app, this might be an API call
    if (Array.isArray(productData) && productData.length > 0) {
      setProducts(productData);
    }
  }, []);

  // Extract unique categories dynamically
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ["All", ...Array.from(cats).sort()];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, products]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pt-20 lg:pr-[88px]">
      {/* Header */}
      <div className="container py-16">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-12 bg-primary" />
              <span className="text-primary font-bold tracking-widest uppercase">Our Inventory</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-serif font-bold text-foreground mb-8">
              World-Class Products.
            </h1>
          </div>

          {/* Cart Button */}
          <Button
            onClick={() => setIsCartOpen(true)}
            className="relative bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-6 rounded-none shadow-lg"
          >
            <ShoppingCart className="w-6 h-6 mr-2" />
            <span className="font-bold uppercase tracking-wider">Inquiry List</span>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-secondary text-primary w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs border-2 border-background">
                {itemCount}
              </span>
            )}
          </Button>
        </div>

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
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar max-w-full md:max-w-[60%]">
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
          {paginatedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {paginatedProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="group bg-background border border-border overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full"
                    onClick={() => setLocation(`/product/${product.id}`)}
                  >
                    <div className="aspect-square relative overflow-hidden bg-white p-8 flex items-center justify-center">
                      <img
                        src={product.img}
                        alt={product.name}
                        loading="lazy"
                        className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => { (e.target as HTMLImageElement).src = "/images/products/placeholder.webp"; }}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="bg-white text-black px-6 py-2 font-bold uppercase tracking-wider text-sm">View Details</span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">{product.category}</span>
                        {product.price && product.price !== "Contact for Price" && (
                          <span className="text-sm font-bold text-foreground">{product.price}</span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">{product.name}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-grow">{product.description}</p>
                      <div className="flex items-center text-sm font-bold text-primary mt-auto">
                        View Specs <ArrowRight className="w-4 h-4 ml-2" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                  </Button>
                  <span className="text-sm font-bold text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </>
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
            <div className="flex flex-col md:flex-row h-full max-h-[80vh] overflow-y-auto md:overflow-hidden">
              <div className="md:w-1/2 bg-white p-12 flex items-center justify-center border-r border-border min-h-[300px]">
                <img
                  src={selectedProduct.img}
                  alt={selectedProduct.name}
                  className="max-w-full max-h-[300px] object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).src = "/images/products/placeholder.webp"; }}
                />
              </div>
              <div className="md:w-1/2 p-8 flex flex-col">
                <DialogHeader>
                  <span className="text-xs font-bold text-primary uppercase tracking-wider mb-2">{selectedProduct.category}</span>
                  <DialogTitle className="text-2xl md:text-3xl font-serif font-bold mb-4">{selectedProduct.name}</DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-lg text-foreground/80 mb-6">
                  {selectedProduct.description}
                </DialogDescription>

                {selectedProduct.features && selectedProduct.features.length > 0 && (
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
                )}

                <div className="mt-auto pt-6 border-t border-border">
                  <Button
                    className="w-full text-lg py-6 font-bold uppercase tracking-wider"
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                  >
                    Add to Inquiry List
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
          <Button size="lg" variant="secondary" className="text-lg px-8 py-6" onClick={() => window.location.href = '/member'}>
            Start Dropshipping Today
          </Button>
        </div>
      </div>

      {/* Inquiry Cart Dialog */}
      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent className="max-w-6xl bg-background border-border p-0 overflow-hidden flex flex-col md:flex-row h-[95vh] md:h-[750px] shadow-2xl rounded-xl">
          {/* Cart Items Section */}
          <div className="flex-[1.4] p-8 md:p-10 overflow-y-auto border-b md:border-b-0 md:border-r border-border bg-[#FAFAFA] dark:bg-muted/5">
            <DialogHeader className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-1 bg-primary rounded-full"></div>
                <DialogTitle className="text-3xl font-serif font-bold text-foreground">Your Inquiry List</DialogTitle>
              </div>
              <DialogDescription className="text-base text-muted-foreground">
                Review your selected items below before requesting a quote.
              </DialogDescription>
            </DialogHeader>

            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground border-2 border-dashed border-border/60 rounded-2xl bg-background/50 m-4">
                <div className="w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mb-6">
                  <ShoppingCart className="w-12 h-12 text-muted-foreground/40" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">Your list is empty</h3>
                <p className="max-w-xs text-center mb-8 text-muted-foreground">Looks like you haven't added any products to your inquiry list yet.</p>
                <Button onClick={() => setIsCartOpen(false)} size="lg" className="px-8">
                  Browse Catalog
                </Button>
              </div>
            ) : (
              <div className="space-y-4 pr-2">
                {items.map((item) => (
                  <div key={item.id} className="group flex gap-5 p-4 bg-background rounded-xl border border-border/50 hover:border-primary/30 shadow-sm hover:shadow-md transition-all duration-300 items-start">
                    <div className="w-24 h-24 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-border/20 p-2 flex items-center justify-center">
                      <img src={item.img} alt={item.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1 block">{item.category}</span>
                          <h4 className="text-lg font-bold text-foreground line-clamp-2 leading-tight">{item.name}</h4>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-muted-foreground/40 hover:text-destructive transition-colors p-1"
                          title="Remove item"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-1 bg-muted/30 rounded-lg p-1 border border-border/50">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center bg-background hover:bg-white shadow-sm rounded-md transition-all disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-bold w-10 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center bg-background hover:bg-white shadow-sm rounded-md transition-all"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Quantity
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Checkout Form Section */}
          <div className="w-full md:w-[420px] bg-background flex flex-col relative z-10 shadow-[-5px_0_30px_-15px_rgba(0,0,0,0.1)]">
            <div className="p-8 md:p-10 flex flex-col h-full bg-background border-l border-border/50">
              <div className="mb-8">
                <h3 className="text-2xl font-bold font-serif mb-2">Request Quote</h3>
                <p className="text-sm text-muted-foreground">Complete your details to receive pricing.</p>
              </div>

              <form onSubmit={handleSubmitInquiry} className="flex-1 flex flex-col gap-5 overflow-y-auto pr-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Full Name</Label>
                  <Input
                    id="name"
                    required
                    placeholder="Enter your full name"
                    className="h-11 bg-muted/20 border-border focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="name@company.com"
                    className="h-11 bg-muted/20 border-border focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    className="h-11 bg-muted/20 border-border focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5 mb-2">
                  <Label htmlFor="message" className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Notes</Label>
                  <Textarea
                    id="message"
                    placeholder="Specific quantity requirements or questions..."
                    className="resize-none h-24 bg-muted/20 border-border focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <div className="mt-auto pt-4 border-t border-border/50">
                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-bold uppercase tracking-wider shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 bg-primary text-primary-foreground"
                    disabled={items.length === 0 || isSubmitting}
                  >
                    {isSubmitting ? (
                      "Processing..."
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Submit Request <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                  <p className="text-[10px] text-center text-muted-foreground mt-3 opacity-70">
                    By submitting, you agree to our Terms of Service.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
