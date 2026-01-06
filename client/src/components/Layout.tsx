import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  Home as HomeIcon, 
  Globe, 
  Package, 
  Anchor, 
  ChevronRight, 
  MessageSquare,
  FileText,
  Users,
  Menu,
  X
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const CommandNavigation = () => {
  const [location] = useLocation();
  const [activeSection, setActiveSection] = useState("home");

  // Only track scroll on home page
  useEffect(() => {
    if (location !== "/") return;

    const handleScroll = () => {
      const sections = ["home", "about", "process", "contact"];
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
  }, [location]);

  const navItems = [
    { id: "home", label: "Home", icon: HomeIcon, path: "/" },
    { id: "about", label: "About", icon: Globe, path: "/about" },
    { id: "products", label: "Products", icon: Package, path: "/products" },
    { id: "services", label: "Services", icon: Anchor, path: "/services" },
    { id: "contact", label: "Contact", icon: MessageSquare, path: "/contact" },
    { id: "member", label: "Member", icon: Users, path: "/member" },
    { id: "policy", label: "Policy", icon: FileText, path: "/policy" },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="fixed right-0 top-0 h-full w-[88px] bg-[#0B1120]/95 backdrop-blur-sm z-50 flex flex-col justify-between py-8 border-l border-white/10 shadow-2xl hidden lg:flex">
        <div className="flex flex-col w-full">
        {navItems.map((item) => {
          const isActive = location === item.path || (location === "/" && activeSection === item.id && item.path.startsWith("/#"));
          
          return (
            <Link key={item.id} href={item.path}>
              <a
                className={`
                  group relative flex flex-col items-center justify-center py-5 w-full transition-all duration-300 cursor-pointer
                  ${isActive ? "bg-white/5" : "hover:bg-white/5"}
                `}
              >
                <div 
                  className={`
                    absolute left-0 top-0 bottom-0 w-1 bg-secondary transition-all duration-300
                    ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50"}
                  `} 
                />
                <item.icon 
                  className={`
                    w-6 h-6 mb-1.5 transition-colors duration-300
                    ${isActive ? "text-white" : "text-white/70 group-hover:text-white"}
                  `} 
                />
                <span 
                  className={`
                    text-[10px] font-bold uppercase tracking-wider transition-colors duration-300
                    ${isActive ? "text-white" : "text-white/70 group-hover:text-white"}
                  `}
                >
                  {item.label}
                </span>
              </a>
            </Link>
          );
        })}
      </div>

      <div className="w-full px-2">
        <Link href="/contact">
          <button
            className="w-full flex flex-col items-center justify-center bg-secondary hover:bg-secondary/90 text-primary py-4 rounded-sm transition-all duration-300 group shadow-lg"
          >
            <MessageSquare className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-center leading-tight">
              Consult
            </span>
          </button>
        </Link>
      </div>
    </nav>

    {/* Mobile Navigation */}
    <div className="fixed top-6 right-6 z-50 lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <button className="bg-[#0B1120] text-white p-3 rounded-full shadow-lg hover:bg-[#0B1120]/90 transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] bg-[#0B1120] border-l border-white/10 p-0">
          <div className="flex flex-col h-full py-8">
            <div className="px-6 mb-8">
              <span className="font-serif text-2xl font-bold text-white tracking-tighter">KANOHA</span>
            </div>
            
            <div className="flex-1 flex flex-col">
              {navItems.map((item) => {
                const isActive = location === item.path;
                return (
                  <Link key={item.id} href={item.path}>
                    <a className={`
                      flex items-center gap-4 px-6 py-4 transition-colors
                      ${isActive ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"}
                    `}>
                      <item.icon className="w-5 h-5" />
                      <span className="font-bold uppercase tracking-wider text-sm">{item.label}</span>
                    </a>
                  </Link>
                );
              })}
            </div>

            <div className="px-6 mt-auto">
              <Link href="/contact">
                <button className="w-full flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/90 text-primary py-4 rounded-sm transition-all duration-300 font-bold uppercase tracking-wider text-sm">
                  <MessageSquare className="w-5 h-5" />
                  Consult Now
                </button>
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
    </>
  );
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary overflow-x-hidden">
      <CommandNavigation />
      
      {/* BRAND HEADER */}
      <div className="fixed top-8 left-8 z-50">
        <Link href="/">
          <a className="font-serif text-3xl font-bold tracking-tighter cursor-pointer text-black">
            KANOHA
          </a>
        </Link>
      </div>

      {children}
    </div>
  );
}
