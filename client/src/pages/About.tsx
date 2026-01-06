import { motion } from "framer-motion";
import { CheckCircle, Globe, Users, Shield } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans pt-20">
      <div className="container py-16">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px w-12 bg-primary" />
          <span className="text-primary font-bold tracking-widest uppercase">About Us</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-8 leading-tight">
              Bridging Global Markets with Trust & Efficiency.
            </h1>
            <p className="text-xl text-muted-foreground font-medium leading-relaxed mb-8">
              KANOHA LIMITED is a premier import entrustment and logistics agency dedicated to simplifying global trade for businesses in Vietnam. We act as your legal and operational gateway, ensuring seamless compliance, efficient transport, and reliable sourcing.
            </p>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 border-2 border-primary/20 z-0" />
            <img 
              src="/images/hero-global.jpg" 
              alt="Global Trade" 
              className="w-full relative z-10 shadow-2xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            { icon: Globe, title: "Global Reach", desc: "Connecting you to suppliers worldwide with established trade routes." },
            { icon: Shield, title: "Compliance First", desc: "Navigating complex customs and legal regulations so you don't have to." },
            { icon: Users, title: "Client Centric", desc: "Tailored solutions designed to meet the specific needs of your business." }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-muted/10 p-8 border border-border hover:border-primary transition-colors"
            >
              <item.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-primary/5 p-12 border border-primary/10">
          <h2 className="text-3xl font-serif font-bold mb-6 text-center">Our Mission</h2>
          <p className="text-xl text-center max-w-3xl mx-auto leading-relaxed">
            "To empower Vietnamese businesses by providing secure, transparent, and efficient access to global goods, fostering growth and international collaboration."
          </p>
        </div>
      </div>
    </div>
  );
}
