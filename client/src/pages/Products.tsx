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
        <DialogContent className="max-w-4xl bg-background border-border p-0 overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-[600px]">
          {/* Cart Items Section */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto border-b md:border-b-0 md:border-r border-border bg-muted/10">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-serif font-bold">Your Inquiry List</DialogTitle>
              <DialogDescription>Review items before submitting your quote request.</DialogDescription>
            </DialogHeader>

            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <ShoppingCart className="w-12 h-12 mb-4 opacity-20" />
                <p>Your list is empty.</p>
                <Button variant="link" onClick={() => setIsCartOpen(false)} className="mt-2">
                  Browse Products
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 bg-background p-4 rounded-lg border border-border shadow-sm">
                    <div className="w-20 h-20 bg-white rounded-md overflow-hidden flex-shrink-0 border border-border">
                      <img src={item.img} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <h4 className="font-bold line-clamp-1">{item.name}</h4>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3 bg-muted/30 rounded-md p-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center hover:bg-background rounded-sm transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center hover:bg-background rounded-sm transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-destructive hover:bg-destructive/10 p-2 rounded-md transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Checkout Form Section */}
          <div className="w-full md:w-[400px] p-6 md:p-8 bg-background flex flex-col">
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-1">Contact Details</h3>
              <p className="text-sm text-muted-foreground">Where should we send the quote?</p>
            </div>

            <form onSubmit={handleSubmitInquiry} className="space-y-4 flex-1 flex flex-col">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="john@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Additional Notes (Optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Any specific requirements?"
                  className="resize-none h-24"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <div className="mt-auto pt-4">
                <Button
                  type="submit"
                  className="w-full py-6 text-lg font-bold uppercase tracking-wider"
                  disabled={items.length === 0 || isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Submit Request"}
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-4">
                  By submitting, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
