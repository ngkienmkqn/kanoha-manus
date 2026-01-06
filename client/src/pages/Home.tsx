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
  HelpCircle
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
      const sections = ["home", "services", "process", "transparency", "risk-control", "faqs", "contact"];
      // Adjust offset to trigger earlier
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
    { id: "services", label: "Services", icon: Anchor },
    { id: "process", label: "Process", icon: ChevronRight },
    { id: "transparency", label: "Transparency", icon: FileText },
    { id: "risk-control", label: "Compliance", icon: ShieldCheck },
    { id: "faqs", label: "FAQs", icon: HelpCircle },
  ];

  return (
    <nav className="fixed right-0 top-0 h-full w-[88px] bg-[#0B1120]/95 backdrop-blur-sm z-50 flex flex-col justify-between py-8 border-l border-white/10 shadow-2xl hidden lg:flex">
      {/* Top Items */}
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
            {/* Active Indicator Line */}
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

      {/* Bottom CTA */}
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

      {/* BRAND HEADER (Left) */}
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
          {/* Strong gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
        </motion.div>

        <div className="container relative z-10 pt-20">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-12 bg-primary" />
              <span className="text-primary font-bold tracking-widest uppercase">Global Import Authority</span>
            </div>
            
            <FadeInText 
              text="Your trusted partner in bringing goods home." 
              className="text-6xl md:text-7xl lg:text-8xl font-serif font-bold leading-[1.1] text-foreground mb-8"
            />
            
            <FadeInText 
              text="Across borders and regulations, we quietly handle the complexity of importing — so your business can move forward with confidence." 
              delay={0.2}
              className="text-xl md:text-2xl text-foreground/80 font-medium leading-relaxed mb-12 max-w-2xl"
            />
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-6"
            >
              <AuthorityButton onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
                Request Consultation <ArrowRight className="w-5 h-5" />
              </AuthorityButton>
              <AuthorityButton 
                variant="secondary"
                onClick={() => document.getElementById("process")?.scrollIntoView({ behavior: "smooth" })}
              >
                See the journey
              </AuthorityButton>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* SECTION 2: SERVICES */}
      <Section id="services" className="bg-background relative">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <div className="lg:w-1/3 sticky top-32">
              <span className="text-9xl font-serif text-muted/20 font-bold absolute -top-20 -left-10 -z-10">01</span>
              <h2 className="text-5xl md:text-6xl font-serif font-bold text-primary mb-8 leading-tight">
                What we take care of, end to end.
              </h2>
              <div className="h-1 w-24 bg-secondary mb-8" />
              <img 
                src="/images/services-gateway.jpg" 
                alt="Import Gateway" 
                className="w-full rounded-sm shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>

            <div className="lg:w-2/3 space-y-12 pt-8">
              {[
                {
                  title: "Import Entrustment",
                  desc: "We act as your legal importer, carrying the responsibility so you don’t have to.",
                  icon: Globe
                },
                {
                  title: "Customs & Documentation",
                  desc: "Carefully prepared documents, reviewed before they ever reach customs.",
                  icon: FileText
                },
                {
                  title: "Duties & VAT Guidance",
                  desc: "Clear explanations. No surprises. We provide upfront calculations.",
                  icon: MapIcon
                },
                {
                  title: "Shipment Coordination",
                  desc: "From the moment goods leave the supplier to their arrival in Vietnam.",
                  icon: Wind
                }
              ].map((service, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="flex gap-8 group border-b border-border pb-12 last:border-0"
                >
                  <div className="w-16 h-16 bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 shrink-0">
                    <service.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-serif font-bold text-foreground mb-4 group-hover:text-primary transition-colors">{service.title}</h3>
                    <p className="text-xl text-muted-foreground font-medium leading-relaxed">{service.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* SECTION 3: PROCESS */}
      <Section id="process" className="bg-muted/20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
           <img src="/images/process-journey.jpg" alt="Journey texture" className="w-full h-full object-cover" />
        </div>

        <div className="container relative z-10">
          <div className="text-center mb-24">
            <span className="text-sm font-bold tracking-widest uppercase text-primary mb-4 block">The Journey</span>
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-foreground">
              A clear path, from origin to arrival.
            </h2>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Horizontal Line for Desktop */}
            <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-border" />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {[
                { step: "01", title: "We listen", desc: "Understanding your cargo, origin, and expectations." },
                { step: "02", title: "We prepare", desc: "Checking regulations, documents, and costs." },
                { step: "03", title: "We coordinate", desc: "Working quietly with suppliers and authorities." },
                { step: "04", title: "We clear", desc: "Customs handled with care and attention." },
                { step: "05", title: "We deliver", desc: "Goods arrive. The journey closes." }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="relative pt-8 md:pt-12 text-center md:text-left group"
                >
                  <div className="hidden md:block absolute top-10 left-0 w-4 h-4 bg-background border-4 border-primary rounded-full z-10 group-hover:scale-150 transition-transform duration-300" />
                  
                  <span className="text-6xl font-serif font-bold text-muted/20 absolute top-0 left-0 md:left-4 -z-10">{item.step}</span>
                  <h3 className="text-2xl font-serif font-bold text-primary mb-3 mt-4">{item.title}</h3>
                  <p className="text-lg text-muted-foreground font-medium leading-snug">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* SECTION 4: TRANSPARENCY */}
      <Section id="transparency" className="bg-primary text-primary-foreground flex items-center">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-9xl font-serif text-white/10 font-bold block mb-8">03</span>
              <h2 className="text-5xl md:text-6xl font-serif font-bold mb-8 leading-tight">
                Clarity, before commitment.
              </h2>
              <div className="space-y-8 text-xl md:text-2xl font-medium leading-relaxed text-primary-foreground/90">
                <p>
                  Before we proceed, you receive a clear explanation of expected costs — service fees, duties, taxes, and logistics — in writing.
                </p>
                <div className="pl-6 border-l-4 border-secondary">
                  <p className="italic">No charts. No dashboards.</p>
                  <p className="mt-2 text-secondary font-bold">Just honest numbers, explained in plain language.</p>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white text-foreground p-12 shadow-2xl relative"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-secondary" />
              <div className="font-serif text-3xl font-bold text-primary mb-10">Estimated Cost Breakdown</div>
              <div className="space-y-6 font-sans text-lg">
                <div className="flex justify-between border-b border-border pb-4">
                  <span className="font-bold text-muted-foreground">Service Fee</span>
                  <span className="font-bold">Fixed Rate</span>
                </div>
                <div className="flex justify-between border-b border-border pb-4">
                  <span className="font-bold text-muted-foreground">Import Duties</span>
                  <span className="font-bold">Per HS Code</span>
                </div>
                <div className="flex justify-between border-b border-border pb-4">
                  <span className="font-bold text-muted-foreground">VAT</span>
                  <span className="font-bold">Standard Rate</span>
                </div>
                <div className="flex justify-between pt-4 text-primary text-xl font-bold">
                  <span>Total Estimated Cost</span>
                  <span>Provided Upfront</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* SECTION 5: RISK CONTROL */}
      <Section id="risk-control" className="bg-background relative overflow-hidden">
        <div className="container relative z-10">
          <div className="flex flex-col lg:flex-row-reverse gap-16 items-center">
            <div className="lg:w-1/2">
              <img 
                src="/images/compliance-shield.jpg" 
                alt="Risk Control Shield" 
                className="w-full shadow-2xl"
              />
            </div>
            
            <div className="lg:w-1/2">
              <span className="text-sm font-bold tracking-widest uppercase text-primary mb-4 block">Risk Control</span>
              <h2 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-12">
                Handled with foresight.
              </h2>

              <div className="space-y-8">
                {[
                  "Regulations reviewed before shipping",
                  "HS codes considered carefully",
                  "Documents checked, not rushed",
                  "Compliance treated as protection, not paperwork"
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="flex items-center gap-6"
                  >
                    <div className="w-3 h-3 bg-secondary rotate-45 shrink-0" />
                    <p className="text-2xl font-medium text-foreground">
                      {item}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* SECTION 6: FAQs */}
      <Section id="faqs" className="bg-muted/30">
        <div className="container max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-16 text-center">
            Common Questions
          </h2>
          
          <Accordion type="single" collapsible className="w-full space-y-4">
            {[
              { q: "Do I need my own import license?", a: "Not necessarily. We act as the importer-of-record, handling the legal requirements so you can focus on your business." },
              { q: "Can you handle sea and air shipments?", a: "Yes. Whether it's a container by sea or urgent cargo by air, we coordinate the entire journey." },
              { q: "How do you estimate duties and VAT?", a: "We carefully review your goods and their HS codes to provide a precise estimate before you commit." },
              { q: "Do you support regulated goods?", a: "Yes. We screen all regulations beforehand to ensure full compliance and safety." },
              { q: "How do I track progress?", a: "We keep you informed at every key milestone, personally and proactively." }
            ].map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="bg-background border border-border px-8 py-2 shadow-sm">
                <AccordionTrigger className="font-serif text-xl font-bold text-foreground hover:text-primary hover:no-underline py-6 text-left">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-lg font-medium leading-relaxed pb-6">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>

      {/* SECTION 7: CONTACT */}
      <Section id="contact" className="bg-primary text-primary-foreground">
        <div className="container max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-serif font-bold mb-6">Let’s talk about your shipment.</h2>
            <p className="text-primary-foreground/80 font-medium text-xl">
              Tell us what you need to move, and we'll help you find the best way home.
            </p>
          </div>

          <form className="space-y-8 bg-white/5 p-12 backdrop-blur-sm border border-white/10" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-bold uppercase tracking-widest text-secondary">Name</Label>
                  <Input id="name" className="bg-transparent border-0 border-b-2 border-white/20 rounded-none px-0 py-4 text-xl focus-visible:ring-0 focus-visible:border-secondary transition-colors placeholder:text-white/30" placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-bold uppercase tracking-widest text-secondary">Email</Label>
                  <Input id="email" type="email" className="bg-transparent border-0 border-b-2 border-white/20 rounded-none px-0 py-4 text-xl focus-visible:ring-0 focus-visible:border-secondary transition-colors placeholder:text-white/30" placeholder="Your email" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-bold uppercase tracking-widest text-secondary">Phone</Label>
                  <Input id="phone" className="bg-transparent border-0 border-b-2 border-white/20 rounded-none px-0 py-4 text-xl focus-visible:ring-0 focus-visible:border-secondary transition-colors placeholder:text-white/30" placeholder="Your phone number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="origin" className="text-sm font-bold uppercase tracking-widest text-secondary">Origin Country</Label>
                  <Input id="origin" className="bg-transparent border-0 border-b-2 border-white/20 rounded-none px-0 py-4 text-xl focus-visible:ring-0 focus-visible:border-secondary transition-colors placeholder:text-white/30" placeholder="Where is it coming from?" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label htmlFor="cargo" className="text-sm font-bold uppercase tracking-widest text-secondary">Cargo Description</Label>
                  <Input id="cargo" className="bg-transparent border-0 border-b-2 border-white/20 rounded-none px-0 py-4 text-xl focus-visible:ring-0 focus-visible:border-secondary transition-colors placeholder:text-white/30" placeholder="What are you shipping?" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value" className="text-sm font-bold uppercase tracking-widest text-secondary">Estimated Value</Label>
                  <Input id="value" className="bg-transparent border-0 border-b-2 border-white/20 rounded-none px-0 py-4 text-xl focus-visible:ring-0 focus-visible:border-secondary transition-colors placeholder:text-white/30" placeholder="Approximate value" />
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <Label htmlFor="message" className="text-sm font-bold uppercase tracking-widest text-secondary">Message</Label>
                <Textarea id="message" className="bg-transparent border-0 border-b-2 border-white/20 rounded-none px-0 py-4 text-xl focus-visible:ring-0 focus-visible:border-secondary transition-colors min-h-[120px] resize-none placeholder:text-white/30" placeholder="Any specific details or questions?" />
              </div>
            </div>

            <div className="pt-8 text-center">
              <AuthorityButton className="w-full md:w-auto min-w-[240px] bg-secondary text-primary hover:bg-white">
                Send Request
              </AuthorityButton>
            </div>
          </form>
        </div>
      </Section>

      {/* FOOTER */}
      <footer id="footer" className="bg-background py-24 border-t border-border">
        <div className="container text-center">
          <h2 className="text-3xl font-serif font-bold text-primary mb-8">KANOHA LIMITED</h2>
          
          <div className="text-lg text-muted-foreground font-medium space-y-2 mb-12">
            <p>RM 1307, 13/F, KENBO COMMERCIAL BUILDING</p>
            <p>335–339 QUEEN'S ROAD WEST, HONG KONG</p>
            <div className="pt-6 flex justify-center gap-8">
              <a href="tel:8007897618" className="hover:text-primary transition-colors font-bold">(800) 789 7618</a>
              <a href="mailto:kanohalimited@gmail.com" className="hover:text-primary transition-colors font-bold">kanohalimited@gmail.com</a>
            </div>
          </div>

          <div className="w-24 h-1 bg-primary mx-auto mb-12" />

          <p className="text-2xl font-serif text-primary italic font-bold">
            "Every shipment matters."
          </p>
        </div>
      </footer>
    </div>
  );
}
