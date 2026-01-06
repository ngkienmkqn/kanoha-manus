import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  ShieldCheck, 
  FileText, 
  Calculator, 
  Truck, 
  Anchor, 
  AlertTriangle, 
  CheckCircle2, 
  Menu, 
  X, 
  ArrowRight,
  Globe,
  Radar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  <section id={id} className={`min-h-screen w-full relative overflow-hidden py-20 ${className}`}>
    {children}
  </section>
);

const CyberButton = ({ children, onClick, variant = "primary", className = "" }: { children: React.ReactNode, onClick?: () => void, variant?: "primary" | "secondary", className?: string }) => (
  <Button 
    onClick={onClick}
    className={`
      relative overflow-hidden font-mono uppercase tracking-wider transition-all duration-300
      ${variant === "primary" 
        ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(0,240,255,0.5)]" 
        : "bg-transparent border border-primary text-primary hover:bg-primary/10"}
      ${className}
    `}
  >
    <span className="relative z-10 flex items-center gap-2">{children}</span>
    {variant === "primary" && (
      <div className="absolute inset-0 bg-white/20 translate-y-full hover:translate-y-0 transition-transform duration-300" />
    )}
  </Button>
);

const GlitchText = ({ text, className = "" }: { text: string, className?: string }) => {
  return (
    <span className={`relative inline-block group ${className}`}>
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-primary opacity-0 group-hover:opacity-70 group-hover:translate-x-[2px] transition-all duration-100 select-none">
        {text}
      </span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-secondary opacity-0 group-hover:opacity-70 group-hover:-translate-x-[2px] transition-all duration-100 select-none">
        {text}
      </span>
    </span>
  );
};

const CommandConsole = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "Services", href: "#services" },
    { name: "Process", href: "#process" },
    { name: "Cost Map", href: "#transparency" },
    { name: "Risk Radar", href: "#risk-control" },
    { name: "FAQs", href: "#faqs" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <>
      {/* Floating CTA */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="fixed bottom-8 right-8 z-50 hidden md:block"
      >
        <CyberButton onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
          Get a Quote
        </CyberButton>
      </motion.div>

      {/* Mobile/Tablet Toggle */}
      <div className="fixed bottom-4 right-4 z-50 md:hidden">
        <Button size="icon" onClick={() => setIsOpen(true)} className="bg-primary text-primary-foreground rounded-none h-12 w-12">
          <Menu />
        </Button>
      </div>

      {/* Full Screen Console (Footer/Nav) */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="bottom" className="h-[90vh] bg-background border-t border-primary/50 p-0">
          <div className="h-full w-full cyber-grid p-8 flex flex-col relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-4 right-4 text-primary hover:text-primary/80 hover:bg-primary/10"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-8 w-8" />
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 h-full">
              {/* Navigation */}
              <div className="flex flex-col justify-center space-y-6">
                <h2 className="text-primary font-mono text-sm tracking-widest mb-4 border-b border-primary/30 pb-2">
                  SYSTEM NAVIGATION
                </h2>
                {navItems.map((item) => (
                  <a 
                    key={item.name} 
                    href={item.href} 
                    onClick={() => setIsOpen(false)}
                    className="text-4xl md:text-6xl font-mono font-bold text-muted-foreground hover:text-primary transition-colors duration-300 uppercase tracking-tighter flex items-center gap-4 group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 text-sm text-primary transition-opacity">
                      {">"}
                    </span>
                    <GlitchText text={item.name} />
                  </a>
                ))}
              </div>

              {/* Quick Quote Console */}
              <div className="flex flex-col justify-center bg-card/50 p-8 border border-primary/20 backdrop-blur-sm">
                <h2 className="text-primary font-mono text-sm tracking-widest mb-6 border-b border-primary/30 pb-2">
                  QUICK QUOTE TERMINAL
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-mono text-muted-foreground">CARGO TYPE</Label>
                      <Input className="bg-background/50 border-primary/30 font-mono" placeholder="e.g. Electronics" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-mono text-muted-foreground">ORIGIN</Label>
                      <Input className="bg-background/50 border-primary/30 font-mono" placeholder="e.g. China" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-mono text-muted-foreground">EST. VALUE (USD)</Label>
                    <Input className="bg-background/50 border-primary/30 font-mono" placeholder="0.00" />
                  </div>
                  <div className="pt-4">
                    <CyberButton className="w-full" onClick={() => {
                      setIsOpen(false);
                      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                    }}>
                      Initialize Request
                    </CyberButton>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer Info */}
            <div className="mt-auto pt-8 border-t border-primary/20 flex flex-col md:flex-row justify-between items-end text-xs font-mono text-muted-foreground">
              <div>
                <p className="text-primary mb-2">KANOHA LIMITED</p>
                <p>RM 1307, 13/F, KENBO COMMERCIAL BUILDING</p>
                <p>335–339 QUEEN'S ROAD WEST, HONG KONG</p>
              </div>
              <div className="text-right mt-4 md:mt-0">
                <p>STATUS: ONLINE</p>
                <p>VERSION: 2.0.45</p>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default function Home() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-background overflow-x-hidden">
      
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-40 bg-background/80 backdrop-blur-md border-b border-primary/20">
        <div className="container flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary flex items-center justify-center">
              <span className="font-mono font-bold text-background text-xl">K</span>
            </div>
            <span className="font-mono font-bold tracking-widest text-lg hidden sm:block">KANOHA LIMITED</span>
          </div>
          <div className="flex items-center gap-6 text-xs font-mono">
            <span className="hidden md:block text-muted-foreground">
              <span className="text-primary">●</span> SUPPORT: MON–FRI 9AM–5PM PST
            </span>
            <a href="tel:8007897618" className="hover:text-primary transition-colors">(800) 789 7618</a>
          </div>
        </div>
      </header>

      {/* Progress Line */}
      <motion.div 
        className="fixed left-0 top-0 h-1 bg-primary z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* SECTION 1: HERO */}
      <Section id="home" className="flex items-center justify-center pt-32">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background z-10" />
          <img 
            src="/images/hero-bg.jpg" 
            alt="Global Port" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 cyber-grid opacity-20 z-10" />
        </div>

        <div className="container relative z-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-block border border-primary/50 px-3 py-1 text-xs font-mono text-primary bg-primary/10">
              IMPORT ENTRUSTMENT // VIETNAM
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tighter">
              YOUR TRUSTED <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary text-glow">
                PARTNER
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg border-l-2 border-primary/50 pl-6">
              Efficiently managing international imports requires expertise, precision, and reliability. 
              Our Import Entrustment Service simplifies the process, ensuring efficiency and <a href="#risk-control" className="text-primary hover:underline">legal compliance</a> from origin to delivery.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <CyberButton onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
                Get a Quote
              </CyberButton>
              <CyberButton variant="secondary" onClick={() => document.getElementById("process")?.scrollIntoView({ behavior: "smooth" })}>
                See How It Works
              </CyberButton>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-white/10">
              {[
                "Importer-of-Record Execution",
                "Customs & Doc Readiness",
                "Traceable Milestone Reporting"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Hero Visual Element - Animated Globe/Map Placeholder */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden lg:flex justify-center items-center relative"
          >
            <div className="w-[500px] h-[500px] rounded-full border border-primary/20 relative flex items-center justify-center animate-[spin_60s_linear_infinite]">
              <div className="absolute inset-0 border border-dashed border-primary/10 rounded-full scale-125" />
              <div className="absolute inset-0 border border-dotted border-primary/30 rounded-full scale-75" />
              <Globe className="w-64 h-64 text-primary/20" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="text-4xl font-mono font-bold text-primary">100%</div>
              <div className="text-xs font-mono text-muted-foreground">COMPLIANCE RATE</div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* SECTION 2: SERVICES */}
      <Section id="services" className="bg-background">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">KEY SERVICES</h2>
            <div className="h-1 w-24 bg-primary" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Import Entrustment",
                desc: "We act as the legal importing entity and manage compliance responsibilities.",
                icon: ShieldCheck,
                link: "#risk-control",
                linkText: "Risk & Compliance"
              },
              {
                title: "Customs Clearance",
                desc: "HS code guidance, declarations, and document validation.",
                icon: FileText,
                link: "#process",
                linkText: "Process Overview"
              },
              {
                title: "Duty & VAT Guidance",
                desc: "Transparent duty and VAT estimation support based on HS codes.",
                icon: Calculator,
                link: "#transparency",
                linkText: "Cost Breakdown"
              },
              {
                title: "Shipment Coordination",
                desc: "We coordinate suppliers, forwarders, and timelines for you.",
                icon: Anchor,
                link: "#process",
                linkText: "Execution Steps"
              },
              {
                title: "Door-to-Door Delivery",
                desc: "From port or airport directly to your warehouse.",
                icon: Truck,
                link: "#contact",
                linkText: "Request Quote"
              }
            ].map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-card/50 border-primary/20 hover:border-primary transition-colors duration-300 h-full group">
                  <CardHeader>
                    <service.icon className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform duration-300" />
                    <CardTitle className="font-mono text-xl uppercase">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col h-full justify-between gap-4">
                    <p className="text-muted-foreground">{service.desc}</p>
                    <a href={service.link} className="text-xs font-mono text-primary flex items-center gap-2 hover:translate-x-2 transition-transform">
                      {service.linkText} <ArrowRight className="w-3 h-3" />
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* SECTION 3: PROCESS */}
      <Section id="process" className="bg-muted/30">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">TRACEABLE PROCESS</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A clear, 5-step execution plan designed for transparency and speed.
            </p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            {/* Vertical Line */}
            <div className="absolute left-[15px] md:left-1/2 top-0 bottom-0 w-px bg-primary/30 -translate-x-1/2" />

            {[
              { step: "01", title: "Intake", desc: "Cargo details, origin, estimated value, document checklist.", action: "Start a Quote", href: "#contact" },
              { step: "02", title: "Screening & Cost", desc: "Policy screening, HS code estimate, duty/VAT estimate.", action: "View Cost Map", href: "#transparency" },
              { step: "03", title: "Contract", desc: "Entrustment agreement and responsibilities authorization.", action: "Compliance Rules", href: "#risk-control" },
              { step: "04", title: "Execution", desc: "Documents, shipping coordination, customs clearance.", action: "Risk Control", href: "#risk-control" },
              { step: "05", title: "Delivery", desc: "Handover, final statement, document archiving.", action: "Request Quote", href: "#contact" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative flex items-center gap-8 mb-12 ${i % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"}`}
              >
                <div className="hidden md:block w-1/2" />
                
                <div className="absolute left-[15px] md:left-1/2 -translate-x-1/2 w-8 h-8 bg-background border-2 border-primary rounded-full flex items-center justify-center z-10">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                </div>

                <div className="flex-1 pl-12 md:pl-0">
                  <div className={`bg-card border border-primary/20 p-6 relative hover:border-primary/50 transition-colors ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                    <div className="text-4xl font-mono font-bold text-primary/10 absolute top-2 right-4 select-none">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-bold mb-2 font-mono uppercase">{item.title}</h3>
                    <p className="text-muted-foreground mb-4 text-sm">{item.desc}</p>
                    <Button 
                      variant="link" 
                      className="text-primary p-0 h-auto font-mono text-xs uppercase"
                      onClick={() => document.getElementById(item.href.substring(1))?.scrollIntoView({ behavior: "smooth" })}
                    >
                      {item.action} →
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* SECTION 4: TRANSPARENCY */}
      <Section id="transparency" className="bg-background">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              TRANSPARENT <br />
              <span className="text-primary">COST STRUCTURE</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              No hidden fees. We break down every component of your import cost so you know exactly what you're paying for.
            </p>
            
            <div className="space-y-4 mb-8">
              {[
                "Entrustment Service Fee",
                "Customs Clearance & Documentation",
                "Duties & VAT (HS Code Based)",
                "Logistics (If Included)",
                "Optional Inspections"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border border-white/5 bg-white/5">
                  <div className="w-2 h-2 bg-secondary" />
                  <span className="font-mono uppercase">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <CyberButton onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
                Estimate My Cost
              </CyberButton>
              <CyberButton variant="secondary" onClick={() => document.getElementById("risk-control")?.scrollIntoView({ behavior: "smooth" })}>
                HS Code & Risk
              </CyberButton>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <div className="relative bg-card border border-primary/30 p-8 cyber-grid">
              <div className="flex justify-between items-center mb-8 border-b border-primary/20 pb-4">
                <span className="font-mono text-sm text-muted-foreground">COST MAP VISUALIZATION</span>
                <Calculator className="text-primary" />
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span>GOODS VALUE</span>
                    <span>BASE</span>
                  </div>
                  <div className="h-2 bg-white/10 w-full overflow-hidden">
                    <div className="h-full bg-white/30 w-full" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span>DUTIES & VAT</span>
                    <span className="text-secondary">VARIABLE</span>
                  </div>
                  <div className="h-2 bg-white/10 w-full overflow-hidden">
                    <div className="h-full bg-secondary w-[40%]" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span>SERVICE FEE</span>
                    <span className="text-primary">FIXED %</span>
                  </div>
                  <div className="h-2 bg-white/10 w-full overflow-hidden">
                    <div className="h-full bg-primary w-[15%]" />
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-primary/20 text-center">
                <p className="font-mono text-xs text-muted-foreground">
                  *Final costs depend on cargo classification and current regulations.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* SECTION 5: RISK CONTROL */}
      <Section id="risk-control" className="bg-black relative">
        <div className="absolute inset-0 opacity-30">
           <img src="/images/risk-radar.jpg" alt="Risk Radar" className="w-full h-full object-cover" />
        </div>
        
        <div className="container relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-4">
              <Radar className="w-12 h-12 text-destructive animate-pulse" />
              RISK RADAR
            </h2>
            <p className="text-xl text-muted-foreground">What can go wrong, and how we prevent it.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Wrong HS Code", risk: "Penalties", color: "text-destructive" },
              { title: "Missing Docs", risk: "Delays", color: "text-secondary" },
              { title: "Regulated Goods", risk: "Inspection Failure", color: "text-destructive" },
              { title: "Cost Ambiguity", risk: "Disputes", color: "text-secondary" }
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="bg-card/80 backdrop-blur-sm border border-white/10 p-6 hover:border-primary/50 transition-all group"
              >
                <AlertTriangle className={`w-8 h-8 ${item.color} mb-4`} />
                <h3 className="font-mono font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">Risk: <span className={item.color}>{item.risk}</span></p>
                <a href="#process" className="text-xs font-mono text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                  Where It's Controlled →
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* SECTION 6: FAQs */}
      <Section id="faqs" className="bg-background">
        <div className="container max-w-3xl">
          <h2 className="text-4xl font-bold mb-12 text-center">FREQUENTLY ASKED</h2>
          
          <Accordion type="single" collapsible className="w-full space-y-4">
            {[
              { q: "Do I need my own import license?", a: "Not necessarily. We act as the importer-of-record.", link: "#services" },
              { q: "Can you handle sea and air shipments?", a: "Yes, we handle both sea and air freight logistics.", link: "#contact" },
              { q: "How do you estimate duties and VAT?", a: "Based on HS code and declared value of your goods.", link: "#transparency" },
              { q: "Do you support regulated goods?", a: "Yes, with strict policy screening beforehand.", link: "#risk-control" },
              { q: "How do I track progress?", a: "Through our milestone reporting system.", link: "#process" }
            ].map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border border-white/10 px-4 bg-card/30">
                <AccordionTrigger className="font-mono hover:text-primary text-left">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.a} <a href={item.link} className="text-primary ml-2 hover:underline">Learn more →</a>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>

      {/* SECTION 7: CONTACT */}
      <Section id="contact" className="bg-muted/20">
        <div className="container max-w-4xl">
          <div className="bg-card border border-primary/30 p-8 md:p-12 cyber-grid relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
            
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">CREATE TICKET REQUEST</h2>
              <p className="text-muted-foreground">Initialize your import entrustment request.</p>
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">NAME</Label>
                  <Input id="name" className="bg-background/50 border-white/10 focus:border-primary" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">EMAIL</Label>
                  <Input id="email" type="email" className="bg-background/50 border-white/10 focus:border-primary" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">PHONE / WHATSAPP</Label>
                  <Input id="phone" className="bg-background/50 border-white/10 focus:border-primary" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cargo">CARGO TYPE</Label>
                  <Input id="cargo" className="bg-background/50 border-white/10 focus:border-primary" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="origin">ORIGIN COUNTRY</Label>
                  <Input id="origin" className="bg-background/50 border-white/10 focus:border-primary" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value">EST. VALUE (USD)</Label>
                  <Input id="value" className="bg-background/50 border-white/10 focus:border-primary" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">MESSAGE (OPTIONAL)</Label>
                <Textarea id="message" className="bg-background/50 border-white/10 focus:border-primary min-h-[100px]" />
              </div>

              <div className="pt-6">
                <CyberButton className="w-full h-12 text-lg">
                  SUBMIT REQUEST
                </CyberButton>
              </div>
            </form>

            <div className="mt-12 flex justify-center gap-8 text-sm font-mono">
              <a href="tel:8007897618" className="flex items-center gap-2 hover:text-primary transition-colors">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                CALL NOW
              </a>
              <a href="mailto:kanohalimited@gmail.com" className="flex items-center gap-2 hover:text-primary transition-colors">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                EMAIL US
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* SECTION 8: FOOTER / CONSOLE TRIGGER */}
      <footer id="console" className="bg-black py-12 border-t border-white/10">
        <div className="container text-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold font-mono mb-2">KANOHA LIMITED</h2>
            <p className="text-muted-foreground text-sm">IMPORT COMMAND CONSOLE</p>
          </div>
          
          <Button 
            variant="outline" 
            className="border-primary text-primary hover:bg-primary hover:text-background mb-12"
            onClick={() => (document.querySelector('button[aria-haspopup="dialog"]') as HTMLElement)?.click()}
          >
            OPEN FULL CONSOLE
          </Button>

          <div className="text-xs text-muted-foreground font-mono space-y-2">
            <p>RM 1307, 13/F, KENBO COMMERCIAL BUILDING, 335–339 QUEEN'S ROAD WEST, HONG KONG</p>
            <p>© {new Date().getFullYear()} KANOHA LIMITED. ALL RIGHTS RESERVED.</p>
            <p className="opacity-50 mt-4 max-w-2xl mx-auto">
              DISCLAIMER: Information is for reference only. Final compliance and costs depend on cargo classification and current regulations.
            </p>
          </div>
        </div>
      </footer>

      <CommandConsole />
    </div>
  );
}
