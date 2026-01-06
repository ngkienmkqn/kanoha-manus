import { motion } from "framer-motion";
import { Truck, Package, ShoppingBag, Headphones, ShieldCheck, Globe, Anchor, BarChart } from "lucide-react";

const services = [
  {
    title: "Drop Shipping",
    desc: "Ship directly to your customers without holding inventory. We handle the logistics, so you can focus on sales.",
    icon: Truck,
    features: ["No upfront inventory cost", "Blind shipping (your brand)", "Fast processing times", "Real-time tracking"]
  },
  {
    title: "Wholesale Distribution",
    desc: "Bulk purchasing options for retailers looking to stock their own shelves with high-margin products.",
    icon: Package,
    features: ["Volume discounts", "Exclusive product access", "Flexible payment terms", "Priority shipping"]
  },
  {
    title: "Fulfillment Services",
    desc: "Let us handle the picking, packing, and shipping of your orders from our state-of-the-art warehouses.",
    icon: ShoppingBag,
    features: ["Inventory management", "Custom packaging options", "Returns processing", "Integration with major platforms"]
  },
  {
    title: "Global Sourcing",
    desc: "We leverage our international network to find the best products at the best prices for your market.",
    icon: Globe,
    features: ["Quality control inspections", "Supplier negotiation", "Import/Export compliance", "Trend forecasting"]
  }
];

export default function Services() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans pt-20 lg:pr-[88px]">
      {/* Header */}
      <div className="container py-16">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px w-12 bg-primary" />
          <span className="text-primary font-bold tracking-widest uppercase">Our Expertise</span>
        </div>
        <h1 className="text-6xl md:text-7xl font-serif font-bold text-foreground mb-8">
          Comprehensive Solutions.
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          We provide end-to-end supply chain services designed to help your business scale without the operational headaches.
        </p>
      </div>

      {/* Main Services Grid */}
      <div className="bg-muted/20 py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {services.map((service, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-background p-10 border border-border hover:border-primary transition-colors duration-300 shadow-sm hover:shadow-md"
              >
                <service.icon className="w-12 h-12 text-secondary mb-6" />
                <h3 className="text-3xl font-serif font-bold mb-4">{service.title}</h3>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  {service.desc}
                </p>
                <ul className="space-y-4">
                  {service.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <ShieldCheck className="w-3 h-3" />
                      </div>
                      <span className="font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Value Props */}
      <div className="container py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6 text-secondary">
              <Headphones className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-4">Dedicated Support</h3>
            <p className="text-muted-foreground">
              Our team is available Mon-Fri 9am-5pm PST to assist with any questions or issues.
            </p>
          </div>
          <div>
            <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6 text-secondary">
              <Anchor className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-4">Risk-Free Partnership</h3>
            <p className="text-muted-foreground">
              Cancel at any time if you are not satisfied. We believe in earning your business every day.
            </p>
          </div>
          <div>
            <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6 text-secondary">
              <BarChart className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-4">Growth Focused</h3>
            <p className="text-muted-foreground">
              Our tools and services are built with one goal in mind: helping you sell more.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
