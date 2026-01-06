import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, Star, TrendingUp, ShieldCheck } from "lucide-react";

export default function Member() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans pt-20">
      <div className="container py-16">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px w-12 bg-primary" />
          <span className="text-primary font-bold tracking-widest uppercase">Membership</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-5xl font-serif font-bold text-foreground mb-8 leading-tight">
              Unlock Exclusive Benefits.
            </h1>
            <p className="text-xl text-muted-foreground mb-12">
              Join our network of successful importers and get access to premium pricing, priority support, and exclusive market insights.
            </p>

            <div className="space-y-6 mb-12">
              {[
                { icon: Star, title: "Wholesale Pricing", desc: "Access our lowest tier pricing for bulk orders." },
                { icon: TrendingUp, title: "Market Insights", desc: "Monthly reports on trending products and import regulations." },
                { icon: ShieldCheck, title: "Priority Support", desc: "Dedicated account manager for your business." }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border p-8 shadow-2xl rounded-lg">
            <h2 className="text-2xl font-bold mb-2 text-center">Become a Member</h2>
            <p className="text-muted-foreground text-center mb-8">Fill out the form below to apply.</p>
            
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <Input placeholder="John" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <Input placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Company Name</label>
                <Input placeholder="Your Company Ltd." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <Input type="email" placeholder="john@company.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <Input placeholder="+84 90 123 4567" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Business Type</label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option>Retailer</option>
                  <option>Wholesaler</option>
                  <option>Distributor</option>
                  <option>Other</option>
                </select>
              </div>
              
              <Button className="w-full text-lg py-6 mt-4">Submit Application</Button>
              <p className="text-xs text-center text-muted-foreground mt-4">
                By submitting, you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
