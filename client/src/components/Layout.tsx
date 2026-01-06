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
  Users
} from "lucide-react";

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
  );
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary overflow-x-hidden lg:pr-[88px]">
      <CommandNavigation />
      
      {/* BRAND HEADER */}
      <div className="fixed top-8 left-8 z-50 mix-blend-difference text-white">
        <Link href="/">
          <a className="font-serif text-3xl font-bold tracking-tighter cursor-pointer">
            KANOHA
          </a>
        </Link>
      </div>

      {children}
    </div>
  );
}
