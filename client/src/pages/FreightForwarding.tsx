import { motion } from "framer-motion";
import { Plane, Ship, Truck, Train, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function FreightForwarding() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans pt-20 lg:pr-[88px]">
      <div className="container py-16">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px w-12 bg-primary" />
          <Link href="/services">
            <a className="text-primary font-bold tracking-widest uppercase hover:underline">Services</a>
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground font-bold tracking-widest uppercase">Freight Forwarding</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-8 leading-tight">
              Your Trusted Partner in Global Logistics.
            </h1>
            <p className="text-xl text-muted-foreground font-medium leading-relaxed mb-8">
              Efficiently managing the transportation of goods requires expertise, precision, and reliability. Our Freight Forwarding Service is designed to connect your business with global markets, ensuring seamless delivery from origin to destination.
            </p>
            <Button size="lg" className="text-lg px-8 py-6">
              Get a Quote
            </Button>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 border-2 border-primary/20 z-0" />
            <img 
              src="/images/services/service_freight_forwarding.webp" 
              alt="Freight Forwarding" 
              className="w-full relative z-10 shadow-2xl"
            />
          </div>
        </div>

        <div className="bg-muted/20 py-20 -mx-4 px-4 md:-mx-8 md:px-8 lg:-mx-0 lg:px-0 lg:rounded-lg">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-serif font-bold mb-12 text-center">Why Work with Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { title: "End-to-End Logistics", desc: "From pick-up to delivery, we manage every step of the shipping process." },
                { title: "Multimodal Options", desc: "Choose the mode that best suits your needs: air, sea, road, or rail." },
                { title: "Global Network", desc: "Our extensive network of partners ensures your goods reach their destination safely." },
                { title: "Real-time Tracking", desc: "Complete transparency with real-time updates on your shipment's status." }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-background p-8 border border-border"
                >
                  <CheckCircle className="w-8 h-8 text-secondary mb-4" />
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="py-20">
          <h2 className="text-3xl font-serif font-bold mb-12 text-center">Our Key Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Plane, title: "Air Freight", desc: "Fast and reliable for time-sensitive shipments." },
              { icon: Ship, title: "Sea Freight", desc: "Cost-effective solutions for bulk goods." },
              { icon: Truck, title: "Road Freight", desc: "Flexible domestic and cross-border transport." },
              { icon: Train, title: "Rail Freight", desc: "Efficient long-distance overland shipping." }
            ].map((service, i) => (
              <div key={i} className="text-center p-6 border border-border hover:border-primary transition-colors">
                <service.icon className="w-12 h-12 mx-auto text-primary mb-4" />
                <h3 className="text-lg font-bold mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
