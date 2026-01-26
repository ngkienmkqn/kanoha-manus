import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { useCart } from "@/contexts/CartContext";
import productData from "@/data/products.json";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, ShoppingCart } from "lucide-react";
import NotFound from "./NotFound";

interface Product {
  id: string;
  name: string;
  price: string;
  category: string;
  img: string;
  description: string;
  features: string[];
}

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const [product, setProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (params?.id) {
      const found = (productData as Product[]).find((p) => p.id === params.id);
      if (found) {
        setProduct(found);
      }
    }
  }, [params]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  if (!params?.id) return <NotFound />;
  if (!product && productData.length > 0 && params.id) {
     // If data is loaded but product not found
     const found = (productData as Product[]).find((p) => p.id === params.id);
     if(!found) return <NotFound />; 
     // If found in sync, it would be set in useEffect, but for safety in first render:
     // actually useEffect handles it. If it stays null after effect, it's not found.
     // simpler: just wait for effect or check directly.
  }

  // Direct check for render (since json is imported directly it is available immediately)
  const currentProduct = product || (productData as Product[]).find((p) => p.id === params?.id);

  if (!currentProduct) {
      return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pt-24 lg:pr-[88px] pb-20">
      <div className="container mx-auto px-4">
        <Button 
          variant="ghost" 
          className="mb-8 pl-0 hover:bg-transparent hover:text-primary"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Products
        </Button>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Image Section */}
          <div className="w-full lg:w-1/2 bg-white rounded-lg p-8 md:p-16 flex items-center justify-center border border-border">
            <img // turbo-all
              src={currentProduct.img}
              alt={currentProduct.name}
              className="max-w-full max-h-[500px] object-contain"
              onError={(e) => { (e.target as HTMLImageElement).src = "/images/products/placeholder.webp"; }}
            />
          </div>

          {/* Details Section */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="mb-2">
              <span className="inline-block px-3 py-1 bg-muted rounded-full text-xs font-bold text-primary uppercase tracking-wider">
                {currentProduct.category}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-serif font-bold mb-6 leading-tight">
              {currentProduct.name}
            </h1>

            <div className="text-2xl font-bold text-primary mb-8">
              {currentProduct.price}
            </div>

            <div className="prose prose-lg text-muted-foreground mb-10">
              <p>{currentProduct.description}</p>
            </div>

            {currentProduct.features && currentProduct.features.length > 0 && (
              <div className="mb-10 bg-muted/20 p-6 rounded-lg border border-border">
                <h3 className="font-bold mb-4 uppercase text-sm tracking-wide text-foreground">Key Features</h3>
                <ul className="space-y-3">
                  {currentProduct.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1 w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-auto">
              <Button 
                size="lg"
                className={`w-full md:w-auto text-lg py-8 px-12 font-bold uppercase tracking-wider transition-all duration-300 ${
                  isAdded ? "bg-green-600 hover:bg-green-700" : ""
                }`}
                onClick={handleAddToCart}
              >
                {isAdded ? (
                  <>
                    <Check className="w-6 h-6 mr-2" />
                    Added to List
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-6 h-6 mr-2" />
                    Add to Inquiry List
                  </>
                )}
              </Button>
              <p className="mt-4 text-sm text-muted-foreground">
                * Add items to your inquiry list to request a custom quote.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
