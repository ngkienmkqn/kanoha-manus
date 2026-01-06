import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  ArrowRight, 
  Anchor,
  Wind,
  Map as MapIcon,
  FileText,
  ShieldCheck,
  Globe,
  ChevronRight,
  MessageSquare,
  Home as HomeIcon,
  HelpCircle,
  Package,
  Truck,
  Headphones,
  ShoppingBag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// --- Components ---

const Section = ({ id, className, children }: { id: string, className?: string, children: React.ReactNode }) => (
  <section id={id} className={`min-h-screen w-full relative py-32 md:py-40 ${className}`}>
    {children}
  </section>
);

const AuthorityButton = ({ children, onClick, variant = "primary", className = "" }: { children: React.ReactNode, onClick?: () => void, variant?: "primary" | "secondary", className?: string }) => (
  <Button 
    onClick={onClick}
    className={`
      relative overflow-hidden font-sans font-bold tracking-wide transition-all duration-300 rounded-none px-10 py-7 text-lg uppercase
      ${variant === "primary" 
        ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl hover:-translate-y-1" 
        : "bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"}
      ${className}
    `}
  >
    <span className="relative z-10 flex items-center gap-3">{children}</span>
  </Button>
);

const FadeInText = ({ text, delay = 0, className = "" }: { text: string, delay?: number, className?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      className={className}
    >
      {text}
    </motion.div>
  );
};

const CommandNavigation = () => {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "products", "services", "process", "contact"];
      const scrollPosition = window.scrollY + window.innerHeight * 0.4;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home", label: "Home", icon: HomeIcon },
    { id: "about", label: "About", icon: Globe },
    { id: "products", label: "Products", icon: Package },
    { id: "services", label: "Services", icon: Anchor },
    { id: "process", label: "Process", icon: ChevronRight },
    { id: "contact", label: "Contact", icon: MessageSquare },
  ];

  return (
    <nav className="fixed right-0 top-0 h-full w-[88px] bg-[#0B1120]/95 backdrop-blur-sm z-50 flex flex-col justify-between py-8 border-l border-white/10 shadow-2xl hidden lg:flex">
      <div className="flex flex-col w-full">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
            }}
            className={`
              group relative flex flex-col items-center justify-center py-5 w-full transition-all duration-300
              ${activeSection === item.id ? "bg-white/5" : "hover:bg-white/5"}
            `}
          >
            <div 
              className={`
                absolute left-0 top-0 bottom-0 w-1 bg-secondary transition-all duration-300
                ${activeSection === item.id ? "opacity-100" : "opacity-0 group-hover:opacity-50"}
              `} 
            />
            <item.icon 
              className={`
                w-6 h-6 mb-1.5 transition-colors duration-300
                ${activeSection === item.id ? "text-white" : "text-white/70 group-hover:text-white"}
              `} 
            />
            <span 
              className={`
                text-[10px] font-bold uppercase tracking-wider transition-colors duration-300
                ${activeSection === item.id ? "text-white" : "text-white/70 group-hover:text-white"}
              `}
            >
              {item.label}
            </span>
          </a>
        ))}
      </div>

      <div className="w-full px-2">
        <button
          onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          className="w-full flex flex-col items-center justify-center bg-secondary hover:bg-secondary/90 text-primary py-4 rounded-sm transition-all duration-300 group shadow-lg"
        >
          <MessageSquare className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-center leading-tight">
            Consult
          </span>
        </button>
      </div>
    </nav>
  );
};

export default function Home() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary overflow-x-hidden lg:pr-[88px]">
      <CommandNavigation />

      {/* BRAND HEADER */}
      <div className="fixed top-8 left-8 z-50 mix-blend-difference text-white">
        <a href="#home" className="font-serif text-3xl font-bold tracking-tighter">
          KANOHA
        </a>
      </div>

      {/* SECTION 1: HERO */}
      <Section id="home" className="h-screen flex items-center p-0 relative overflow-hidden">
        <motion.div 
          style={{ y }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="/images/hero-global.jpg" 
            alt="Global trade network" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
        </motion.div>

        <div className="container relative z-10 pt-20">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-12 bg-primary" />
              <span className="text-primary font-bold tracking-widest uppercase">Global Distribution Authority</span>
            </div>
            
            <FadeInText 
              text="Exclusive Brands. Unbeatable Prices. Global Reach." 
              className="text-6xl md:text-7xl lg:text-8xl font-serif font-bold leading-[1.1] text-foreground mb-8"
            />
            
            <FadeInText 
              text="We provide access to over 3,000 of today's most in-demand items. Elevate your online store without upfront investment." 
              delay={0.2}
              className="text-xl md:text-2xl text-foreground/80 font-medium leading-relaxed mb-12 max-w-2xl"
            />
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-6"
            >
              <AuthorityButton onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}>
                Explore Products <ArrowRight className="w-5 h-5" />
              </AuthorityButton>
              <AuthorityButton 
                variant="secondary"
                onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
              >
                Why Choose Us
              </AuthorityButton>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* SECTION 2: ABOUT / WHY US */}
      <Section id="about" className="bg-background relative">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <span className="text-sm font-bold tracking-widest uppercase text-primary mb-4 block">Why Partner With Us</span>
              <h2 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-8 leading-tight">
                Grow your business without the inventory risk.
              </h2>
              <p className="text-xl text-muted-foreground font-medium leading-relaxed mb-8">
                The biggest advantage of drop shipping is that you can run a business without investing thousands of dollars in inventory. Leave that to us.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  "Over 3,000 in-demand items",
                  "Fast processing & shipping",
                  "Blind dropshipping support",
                  "Dedicated support team"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-secondary rotate-45" />
                    <span className="text-lg font-bold text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="absolute -inset-4 border-2 border-primary/20 z-0" />
              <img 
                src="/images/services-gateway.jpg" 
                alt="Warehouse Operations" 
                className="w-full relative z-10 shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* SECTION 3: PRODUCTS */}
      <Section id="products" className="bg-muted/20">
        <div className="container">
          <div className="text-center mb-16">
            <span className="text-sm font-bold tracking-widest uppercase text-primary mb-4 block">Our Inventory</span>
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-foreground">
              High-demand categories.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              { name: "Consumer Electronics", img: "/images/products/product_dvd_player.webp" },
              { name: "Audio Systems", img: "/images/products/product_pa_system.webp" },
              { name: "Gaming Accessories", img: "/images/products/product_switch_kit.webp" },
              { name: "Portable Audio", img: "/images/products/product_speaker_yellow.webp" }
            ].map((cat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative aspect-square bg-white overflow-hidden shadow-lg"
              >
                <img 
                  src={cat.img} 
                  alt={cat.name} 
                  className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-bold text-xl uppercase tracking-widest border-b-2 border-secondary pb-1">
                    {cat.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-center">
            {[
              "Air Fryers", "Kitchen Gadgets", "Dinnerware", "Car Audio", 
              "Home Theater", "Headphones", "Personal Care", "Wall Mounts",
              "Smart Home", "Office Supplies", "Outdoor Gear", "Kids Electronics"
            ].map((tag, i) => (
              <div key={i} className="bg-background border border-border py-3 px-2 text-sm font-bold text-muted-foreground hover:text-primary hover:border-primary transition-colors cursor-default">
                {tag}
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* SECTION 4: SERVICES */}
      <Section id="services" className="bg-primary text-primary-foreground">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-1/3">
              <span className="text-9xl font-serif text-white/10 font-bold absolute -mt-20 -ml-10">04</span>
              <h2 className="text-5xl md:text-6xl font-serif font-bold mb-8 leading-tight relative z-10">
                Comprehensive Distribution Services.
              </h2>
              <p className="text-xl text-primary-foreground/80 font-medium leading-relaxed">
                We are dedicated to providing you with an opportunity to expand or start your business by utilizing our incredible selection.
              </p>
            </div>

            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-12">
              {[
                {
                  title: "Drop Shipping",
                  desc: "Ship directly to your customers without holding inventory. We handle the logistics.",
                  icon: Truck
                },
                {
                  title: "Wholesale Distribution",
                  desc: "Bulk purchasing options for retailers looking to stock their own shelves.",
                  icon: Package
                },
                {
                  title: "Fulfillment Services",
                  desc: "Let us handle the picking, packing, and shipping of your orders.",
                  icon: ShoppingBag
                },
                {
                  title: "Customer Support",
                  desc: "Dedicated team available Mon-Fri 9am-5pm PST to assist you.",
                  icon: Headphones
                }
              ].map((service, i) => (
                <div key={i} className="border-l-2 border-secondary pl-8">
                  <service.icon className="w-10 h-10 text-secondary mb-6" />
                  <h3 className="text-2xl font-serif font-bold mb-4">{service.title}</h3>
                  <p className="text-lg text-primary-foreground/70">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* SECTION 5: PROCESS */}
      <Section id="process" className="bg-background relative overflow-hidden">
        <div className="container relative z-10">
          <div className="text-center mb-24">
            <span className="text-sm font-bold tracking-widest uppercase text-primary mb-4 block">How It Works</span>
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-foreground">
              Simple steps to start selling.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-border -z-10" />
            
            {[
              { step: "01", title: "Join the Family", desc: "Sign up to access our exclusive catalog and pricing." },
              { step: "02", title: "List Products", desc: "Add our high-demand items to your online store or marketplace." },
              { step: "03", title: "We Ship", desc: "When you get an order, we ship it directly to your customer." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="bg-background pt-8 text-center group"
              >
                <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center text-3xl font-serif font-bold mx-auto mb-8 shadow-xl group-hover:scale-110 transition-transform duration-300 relative z-10">
                  {item.step}
                </div>
                <h3 className="text-3xl font-serif font-bold text-primary mb-4">{item.title}</h3>
                <p className="text-xl text-muted-foreground font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* SECTION 6: CONTACT */}
      <Section id="contact" className="bg-muted/30">
        <div className="container max-w-4xl text-center">
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-primary mb-8">
            Ready to grow your business?
          </h2>
          <p className="text-2xl text-muted-foreground font-medium mb-12">
            Join Kanoha today and unlock access to thousands of products.
          </p>

          <div className="bg-background p-12 shadow-2xl border border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
              <div>
                <h3 className="text-xl font-bold uppercase tracking-widest text-primary mb-6">Contact Us</h3>
                <div className="space-y-4 text-lg font-medium text-foreground">
                  <p className="flex items-center gap-4">
                    <MessageSquare className="w-5 h-5 text-secondary" />
                    (800) 788 7618
                  </p>
                  <p className="flex items-center gap-4">
                    <Globe className="w-5 h-5 text-secondary" />
                    kanohalimited@gmail.com
                  </p>
                  <p className="flex items-center gap-4">
                    <MapIcon className="w-5 h-5 text-secondary" />
                    RM 1307, 13/F, KENBO COMMERCIAL BLDG<br/>335–339 QUEEN'S ROAD WEST, HK
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold uppercase tracking-widest text-primary mb-6">Support Hours</h3>
                <div className="space-y-4 text-lg font-medium text-foreground">
                  <p>Monday - Friday</p>
                  <p className="text-2xl font-bold text-primary">9:00 AM - 5:00 PM PST</p>
                  <p className="text-muted-foreground">Dedicated support team ready to assist.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-12 pt-12 border-t border-border">
              <AuthorityButton className="w-full text-xl py-8">
                Become a Member
              </AuthorityButton>
            </div>
          </div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="bg-[#0B1120] text-white py-12 border-t border-white/10">
        <div className="container text-center">
          <p className="text-white/50 font-medium">
            © {new Date().getFullYear()} KANOHA LIMITED. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
