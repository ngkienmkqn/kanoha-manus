import { motion } from "framer-motion";
import { ShieldCheck, FileText, Globe, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function EntrustedImport() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans pt-20 lg:pr-[88px]">
      <div className="container py-16">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px w-12 bg-primary" />
          <Link href="/services">
            <a className="text-primary font-bold tracking-widest uppercase hover:underline">Services</a>
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground font-bold tracking-widest uppercase">Entrusted Import</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-8 leading-tight">
              Seamless Importation. Total Compliance.
            </h1>
            <p className="text-xl text-muted-foreground font-medium leading-relaxed mb-8">
              Looking for a reliable partner for your international imports? Our Import Entrustment Service simplifies the process, ensuring efficiency and legal compliance. We act as your legal gateway to global markets.
            </p>
            <Button size="lg" className="text-lg px-8 py-6">
              Consult an Expert
            </Button>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 border-2 border-primary/20 z-0" />
            <img 
              src="/images/services/service_entrusted_import.webp" 
              alt="Entrusted Import" 
              className="w-full relative z-10 shadow-2xl"
            />
          </div>
        </div>

        <div className="bg-muted/20 py-20 -mx-4 px-4 md:-mx-8 md:px-8 lg:-mx-0 lg:px-0 lg:rounded-lg">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-serif font-bold mb-12 text-center">What We Provide</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {[
                { 
                  icon: FileText,
                  title: "Regulatory Guidance", 
                  desc: "Expert advice on import regulations, HS codes, and duty rates to ensure full compliance." 
                },
                { 
                  icon: Handshake,
                  title: "Supplier Negotiation", 
                  desc: "We handle communications and negotiations with international suppliers on your behalf." 
                },
                { 
                  icon: ShieldCheck,
                  title: "Customs Management", 
                  desc: "Complete handling of customs clearance, documentation, and tax payments." 
                },
                { 
                  icon: Globe,
                  title: "Door-to-Door Delivery", 
                  desc: "Seamless logistics from the supplier's factory directly to your warehouse." 
                }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex gap-6"
                >
                  <div className="w-16 h-16 bg-background border border-border flex items-center justify-center shrink-0">
                    <item.icon className="w-8 h-8 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="py-20 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-serif font-bold mb-6">Why Choose Our Entrusted Service?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Our team manages the entire import process, ensuring transparency and efficiency. We provide cost-effective solutions while strictly adhering to legal guidelines to protect your business.
          </p>
          <div className="p-8 bg-primary text-primary-foreground">
            <p className="text-lg font-medium italic">
              "Let us simplify the import process so you can focus on growing your business!"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
