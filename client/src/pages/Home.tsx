import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  ArrowRight, 
  Menu, 
  X, 
  ChevronDown,
  Anchor,
  Wind,
  Map,
  FileText
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// --- Components ---

const Section = ({ id, className, children }: { id: string, className?: string, children: React.ReactNode }) => (
  <section id={id} className={`min-h-screen w-full relative py-24 md:py-32 ${className}`}>
    {children}
  </section>
);

const PoeticButton = ({ children, onClick, variant = "primary", className = "" }: { children: React.ReactNode, onClick?: () => void, variant?: "primary" | "secondary", className?: string }) => (
  <Button 
    onClick={onClick}
    variant="ghost"
    className={`
      relative overflow-hidden font-sans tracking-wide transition-all duration-500 rounded-full px-8 py-6 text-base
      ${variant === "primary" 
        ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20" 
        : "bg-transparent border border-primary/20 text-primary hover:bg-primary/5"}
      ${className}
    `}
  >
    <span className="relative z-10 flex items-center gap-3">{children}</span>
  </Button>
);

const FadeInText = ({ text, delay = 0, className = "" }: { text: string, delay?: number, className?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, delay, ease: "easeOut" }}
      className={className}
    >
      {text}
    </motion.div>
  );
};

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "Services", href: "#services" },
    { name: "Process", href: "#process" },
    { name: "Transparency", href: "#transparency" },
    { name: "Risk Control", href: "#risk-control" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-700 ${
          isScrolled ? "bg-background/80 backdrop-blur-md py-4 shadow-sm" : "bg-transparent py-8"
        }`}
      >
        <div className="container flex justify-between items-center">
          <a href="#home" className="font-serif text-2xl tracking-tight text-primary">
            KANOHA
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a 
                key={item.name} 
                href={item.href} 
                className="text-sm font-sans text-muted-foreground hover:text-primary transition-colors duration-300 soft-underline"
              >
                {item.name}
              </a>
            ))}
            <PoeticButton 
              variant="primary" 
              className="px-6 py-4 text-sm"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            >
              Request Consultation
            </PoeticButton>
          </nav>

          {/* Mobile Nav Toggle */}
          <button 
            className="md:hidden text-primary"
            onClick={() => setIsOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-full sm:w-[400px] bg-background border-l border-border/50 p-0">
          <div className="h-full flex flex-col p-8 justify-center items-center space-y-8">
            <button 
              className="absolute top-8 right-8 text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-8 h-8" />
            </button>
            
            {navItems.map((item) => (
              <a 
                key={item.name} 
                href={item.href} 
                onClick={() => setIsOpen(false)}
                className="text-3xl font-serif text-primary hover:text-secondary transition-colors duration-500"
              >
                {item.name}
              </a>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default function Home() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-secondary/20 selection:text-primary overflow-x-hidden">
      <div className="grain-overlay" />
      <Navigation />

      {/* SECTION 1: HERO */}
      <Section id="home" className="h-screen flex items-center justify-center p-0 relative overflow-hidden">
        <motion.div 
          style={{ y, opacity }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="/images/hero-cinematic.jpg" 
            alt="Calm sea horizon" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-background/80" />
        </motion.div>

        <div className="container relative z-10 text-center md:text-left pt-20">
          <div className="max-w-3xl mx-auto md:mx-0">
            <FadeInText 
              text="Your trusted partner in bringing goods home." 
              className="text-5xl md:text-7xl font-serif leading-[1.1] text-primary mb-8"
            />
            <FadeInText 
              text="Across borders and regulations, we quietly handle the complexity of importing — so your business can move forward with confidence." 
              delay={0.3}
              className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed mb-12 max-w-2xl"
            />
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 items-center md:items-start"
            >
              <PoeticButton onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
                Request a Consultation <ArrowRight className="w-4 h-4" />
              </PoeticButton>
              <button 
                onClick={() => document.getElementById("process")?.scrollIntoView({ behavior: "smooth" })}
                className="text-primary hover:text-secondary transition-colors duration-300 flex items-center gap-2 text-sm tracking-wide uppercase"
              >
                See the journey
              </button>
            </motion.div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-primary/30 animate-bounce duration-[3000ms]"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </Section>

      {/* SECTION 2: SERVICES */}
      <Section id="services" className="bg-background">
        <div className="container">
          <FadeInText 
            text="What we take care of, end to end." 
            className="text-4xl md:text-5xl font-serif text-primary mb-24 text-center md:text-left"
          />

          <div className="space-y-24 max-w-4xl mx-auto">
            {[
              {
                title: "Import Entrustment",
                desc: "We act as your legal importer, carrying the responsibility so you don’t have to.",
                icon: Anchor
              },
              {
                title: "Customs & Documentation",
                desc: "Carefully prepared documents, reviewed before they ever reach customs.",
                icon: FileText
              },
              {
                title: "Duties & VAT Guidance",
                desc: "Clear explanations. No surprises.",
                icon: Map
              },
              {
                title: "Shipment Coordination",
                desc: "From the moment goods leave the supplier to their arrival in Vietnam.",
                icon: Wind
              }
            ].map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, delay: i * 0.1 }}
                className="flex flex-col md:flex-row gap-8 md:gap-16 items-start group"
              >
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-primary group-hover:bg-secondary/20 transition-colors duration-500 shrink-0">
                  <service.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 border-b border-border/50 pb-12 group-hover:border-secondary/50 transition-colors duration-700">
                  <h3 className="text-2xl md:text-3xl font-serif text-primary mb-4">{service.title}</h3>
                  <p className="text-lg text-muted-foreground font-light leading-relaxed">{service.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* SECTION 3: PROCESS */}
      <Section id="process" className="bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 opacity-40 pointer-events-none">
           <img src="/images/process-mist.jpg" alt="Mist texture" className="w-full h-full object-cover" />
        </div>

        <div className="container relative z-10">
          <div className="text-center mb-24">
            <FadeInText 
              text="A clear path, from origin to arrival." 
              className="text-4xl md:text-5xl font-serif text-primary mb-6"
            />
          </div>

          <div className="relative max-w-3xl mx-auto pl-8 md:pl-0">
            {/* Timeline Line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-primary/20 -translate-x-1/2" />

            {[
              { step: "We listen", desc: "Understanding your cargo, origin, and expectations." },
              { step: "We prepare", desc: "Checking regulations, documents, and costs before anything moves." },
              { step: "We coordinate", desc: "Working quietly with suppliers, forwarders, and authorities." },
              { step: "We clear", desc: "Customs handled with care and attention." },
              { step: "We deliver", desc: "Goods arrive. Documents are archived. The journey closes." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 1.5, delay: i * 0.2 }}
                className={`relative flex flex-col md:flex-row items-start md:items-center gap-8 mb-24 ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}
              >
                <div className="hidden md:block w-1/2" />
                
                <div className="absolute left-0 md:left-1/2 -translate-x-1/2 w-3 h-3 bg-background border border-primary rounded-full z-10" />

                <div className={`flex-1 pl-8 md:pl-0 ${i % 2 === 0 ? "md:text-right md:pr-12" : "md:pl-12"}`}>
                  <h3 className="text-2xl font-serif text-primary mb-2">{item.step}</h3>
                  <p className="text-muted-foreground font-light">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* SECTION 4: TRANSPARENCY */}
      <Section id="transparency" className="bg-background flex items-center">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <h2 className="text-4xl md:text-5xl font-serif text-primary mb-8">
                Clarity, before commitment.
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground font-light leading-relaxed">
                <p>
                  Before we proceed, you receive a clear explanation of expected costs — service fees, duties, taxes, and logistics — in writing.
                </p>
                <p>
                  No charts. No dashboards.
                </p>
                <p className="text-primary font-normal">
                  Just honest numbers, explained in plain language.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
              className="bg-muted/30 p-12 rounded-sm border border-border/50 relative"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-secondary/30" />
              <div className="font-serif text-2xl text-primary mb-8 italic">"Trust is built on transparency."</div>
              <div className="space-y-4 font-sans text-sm text-muted-foreground">
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span>Service Fee</span>
                  <span>Fixed Rate</span>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span>Import Duties</span>
                  <span>Per HS Code</span>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span>VAT</span>
                  <span>Standard Rate</span>
                </div>
                <div className="flex justify-between pt-2 text-primary font-medium">
                  <span>Total Estimated Cost</span>
                  <span>Provided Upfront</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* SECTION 5: RISK CONTROL */}
      <Section id="risk-control" className="bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay">
           <img src="/images/map-watercolor.jpg" alt="Map texture" className="w-full h-full object-cover" />
        </div>
        
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <FadeInText 
              text="Handled with foresight." 
              className="text-4xl md:text-5xl font-serif mb-16"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
              {[
                "Regulations reviewed before shipping",
                "HS codes considered carefully",
                "Documents checked, not rushed",
                "Compliance treated as protection, not paperwork"
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2.5 shrink-0" />
                  <p className="text-xl md:text-2xl font-light leading-relaxed text-primary-foreground/90">
                    {item}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* SECTION 6: FAQs */}
      <Section id="faqs" className="bg-background">
        <div className="container max-w-3xl">
          <FadeInText 
            text="Common Questions" 
            className="text-3xl md:text-4xl font-serif text-primary mb-12 text-center"
          />
          
          <Accordion type="single" collapsible className="w-full space-y-6">
            {[
              { q: "Do I need my own import license?", a: "Not necessarily. We act as the importer-of-record, handling the legal requirements so you can focus on your business." },
              { q: "Can you handle sea and air shipments?", a: "Yes. Whether it's a container by sea or urgent cargo by air, we coordinate the entire journey." },
              { q: "How do you estimate duties and VAT?", a: "We carefully review your goods and their HS codes to provide a precise estimate before you commit." },
              { q: "Do you support regulated goods?", a: "Yes. We screen all regulations beforehand to ensure full compliance and safety." },
              { q: "How do I track progress?", a: "We keep you informed at every key milestone, personally and proactively." }
            ].map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b border-border/50 px-0">
                <AccordionTrigger className="font-serif text-xl text-primary hover:text-secondary hover:no-underline py-6 text-left">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-lg font-light leading-relaxed pb-6">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>

      {/* SECTION 7: CONTACT */}
      <Section id="contact" className="bg-muted/30">
        <div className="container max-w-2xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-primary mb-6">Let’s talk about your shipment.</h2>
            <p className="text-muted-foreground font-light text-lg">
              Tell us what you need to move, and we'll help you find the best way home.
            </p>
          </div>

          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs uppercase tracking-widest text-muted-foreground">Name</Label>
                  <Input id="name" className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors" placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs uppercase tracking-widest text-muted-foreground">Email</Label>
                  <Input id="email" type="email" className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors" placeholder="Your email" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs uppercase tracking-widest text-muted-foreground">Phone</Label>
                  <Input id="phone" className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors" placeholder="Your phone number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="origin" className="text-xs uppercase tracking-widest text-muted-foreground">Origin Country</Label>
                  <Input id="origin" className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors" placeholder="Where is it coming from?" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label htmlFor="cargo" className="text-xs uppercase tracking-widest text-muted-foreground">Cargo Description</Label>
                  <Input id="cargo" className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors" placeholder="What are you shipping?" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value" className="text-xs uppercase tracking-widest text-muted-foreground">Estimated Value</Label>
                  <Input id="value" className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors" placeholder="Approximate value" />
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <Label htmlFor="message" className="text-xs uppercase tracking-widest text-muted-foreground">Message</Label>
                <Textarea id="message" className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors min-h-[100px] resize-none" placeholder="Any specific details or questions?" />
              </div>
            </div>

            <div className="pt-8 text-center">
              <PoeticButton className="w-full md:w-auto min-w-[200px]">
                Send Request
              </PoeticButton>
            </div>
          </form>
        </div>
      </Section>

      {/* FOOTER */}
      <footer id="footer" className="bg-background py-24 border-t border-border/30">
        <div className="container text-center">
          <h2 className="text-2xl font-serif text-primary mb-8">KANOHA LIMITED</h2>
          
          <div className="text-sm text-muted-foreground font-light space-y-2 mb-12">
            <p>RM 1307, 13/F, KENBO COMMERCIAL BUILDING</p>
            <p>335–339 QUEEN'S ROAD WEST, HONG KONG</p>
            <div className="pt-4 flex justify-center gap-6">
              <a href="tel:8007897618" className="hover:text-primary transition-colors">(800) 789 7618</a>
              <a href="mailto:kanohalimited@gmail.com" className="hover:text-primary transition-colors">kanohalimited@gmail.com</a>
            </div>
          </div>

          <div className="w-12 h-px bg-border mx-auto mb-12" />

          <p className="text-lg font-serif text-primary italic">
            "Every shipment matters."
          </p>
        </div>
      </footer>
    </div>
  );
}
