import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Briefcase, 
  Info, 
  Mail, 
  Menu, 
  X,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Monitor,
  Newspaper,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const { data: contactSetting } = useQuery<{ key: string; value: string | null }>({
    queryKey: ["/api/settings/contactInfo"],
    queryFn: async () => {
      const res = await fetch("/api/settings/contactInfo");
      if (!res.ok) throw new Error("Failed to fetch contact info");
      return res.json();
    },
  });
  const contactInfo = (() => { try { return contactSetting?.value ? JSON.parse(contactSetting.value) : {}; } catch { return {}; } })();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Services", href: "/services", icon: Monitor },
    { name: "Portfolio", href: "/portfolio", icon: Briefcase },
    { name: "Careers", href: "/career", icon: Users },
    { name: "Blog", href: "/blog", icon: Newspaper },
    { name: "About", href: "/about", icon: Info },
    { name: "Contact", href: "/contact", icon: Mail },
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
          scrolled ? "bg-background/80 backdrop-blur-md border-border py-3" : "bg-transparent py-5"
        )}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="font-display font-bold text-xl text-black">F</span>
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-white">
              Floobyte<span className="text-primary">.</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location === link.href ? "text-primary" : "text-muted-foreground"
              )}>
                {link.name}
              </Link>
            ))}
            <Link href="/quote">
              <Button className="bg-primary text-black hover:bg-primary/90 font-bold">
                Get A Quote
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Toggle (Top Bar) */}
          <button 
            className="md:hidden text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (App-like) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 pb-safe">
        <div className="flex items-center justify-around py-3">
          {navLinks.map((link) => {
            const isActive = location === link.href;
            const Icon = link.icon;
            return (
              <Link key={link.name} href={link.href} className="flex flex-col items-center gap-1 min-w-[60px]">
                <div className={cn(
                  "p-1.5 rounded-full transition-colors",
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
                )}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={cn(
                  "text-[10px] font-medium",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>
                  {link.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile Menu Overlay (For extra items if needed, primarily for Quote/Auth in future) */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-background pt-24 px-6 md:hidden animate-in slide-in-from-top-10">
          <div className="flex flex-col gap-6">
            <Link href="/quote">
              <Button className="w-full bg-primary text-black hover:bg-primary/90 font-bold h-12 text-lg">
                Get A Quote
              </Button>
            </Link>
            
            <div className="mt-8 p-6 bg-card rounded-xl border border-border">
              <h3 className="font-display font-bold text-lg mb-4">Contact Us</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone size={18} className="text-primary" />
                  <span>{contactInfo.phone || "+91 123 456 7890"}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin size={18} className="text-primary" />
                  <span>{contactInfo.address || "Indore, Madhya Pradesh, India"}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail size={18} className="text-primary" />
                  <span>{contactInfo.email || "contact@floobyte.com"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function Footer() {
  type Badge = { id: number; label: string; imageUrl: string; linkUrl?: string | null; enabled?: boolean | null };
  const { data: badges = [] } = useQuery<Badge[]>({
    queryKey: ["/api/badges"],
    queryFn: async () => {
      const res = await fetch("/api/badges");
      if (!res.ok) throw new Error("Failed to fetch badges");
      return res.json();
    },
  });
  const { data: toolsHeadingSetting } = useQuery<{ key: string; value: string | null }>({
    queryKey: ["/api/settings/tools.heading"],
    queryFn: async () => {
      const res = await fetch("/api/settings/tools.heading");
      if (!res.ok) throw new Error("Failed to fetch tools heading");
      return res.json();
    },
  });
  const { data: toolsUrlSetting } = useQuery<{ key: string; value: string | null }>({
    queryKey: ["/api/settings/tools.url"],
    queryFn: async () => {
      const res = await fetch("/api/settings/tools.url");
      if (!res.ok) throw new Error("Failed to fetch tools url");
      return res.json();
    },
  });
  const toolsHeading = toolsHeadingSetting?.value || "Tools";
  const toolsUrl = toolsUrlSetting?.value || "/tools";
  const toolsLabel = "Development Tools by Floobyte";
  return (
    <footer className="bg-card border-t border-border pt-16 pb-24 md:pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <span className="font-display font-bold text-lg text-black">F</span>
              </div>
              <span className="font-display font-bold text-xl text-white">
                Floobyte<span className="text-primary">.</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Empowering businesses with cutting-edge IT solutions. From web development to complex CRM systems, we build the future.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display font-bold text-lg mb-6 text-white">Services</h3>
            <ul className="space-y-3">
              <li><Link href="/services" className="text-muted-foreground hover:text-primary text-sm transition-colors">Web Development</Link></li>
              <li><Link href="/services" className="text-muted-foreground hover:text-primary text-sm transition-colors">Mobile Apps</Link></li>
              <li><Link href="/services" className="text-muted-foreground hover:text-primary text-sm transition-colors">CRM Solutions</Link></li>
              <li><Link href="/services" className="text-muted-foreground hover:text-primary text-sm transition-colors">Travel Technology</Link></li>
              <li><Link href="/services" className="text-muted-foreground hover:text-primary text-sm transition-colors">Digital Marketing</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold text-lg mb-6 text-white">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary text-sm transition-colors">About Us</Link></li>
              <li><Link href="/portfolio" className="text-muted-foreground hover:text-primary text-sm transition-colors">Portfolio</Link></li>
              <li><Link href="/career" className="text-muted-foreground hover:text-primary text-sm transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary text-sm transition-colors">Contact</Link></li>
              <li><Link href="/quote" className="text-muted-foreground hover:text-primary text-sm transition-colors">Get A Quote</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold text-lg mb-6 text-white">{toolsHeading}</h3>
            <ul className="space-y-3">
              <li>
                {/^https?:\/\//i.test(toolsUrl) ? (
                  <a href={toolsUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary text-sm transition-colors">{toolsLabel}</a>
                ) : (
                  <Link href={toolsUrl} className="text-muted-foreground hover:text-primary text-sm transition-colors">{toolsLabel}</Link>
                )}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold text-lg mb-6 text-white">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-muted-foreground hover:text-primary text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-primary text-sm transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/return-policy" className="text-muted-foreground hover:text-primary text-sm transition-colors">Return Policy</Link></li>
              <li><Link href="/disclaimer" className="text-muted-foreground hover:text-primary text-sm transition-colors">Disclaimer</Link></li>
              <li><Link href="/payment-policy" className="text-muted-foreground hover:text-primary text-sm transition-colors">Payment Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-muted-foreground text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} Floobyte IT Solutions. All rights reserved.
          </p>
          
          <div className="flex flex-wrap items-center gap-6 opacity-90 transition-all">
            {badges.filter(b => b.enabled ?? true).map((b) => (
              b.linkUrl ? (
                <a key={b.id} href={b.linkUrl!} target="_blank" rel="noopener noreferrer">
                  <img src={b.imageUrl} alt={b.label} className="h-12 object-contain hover:scale-105 transition-transform" />
                </a>
              ) : (
                <img key={b.id} src={b.imageUrl} alt={b.label} className="h-12 object-contain hover:scale-105 transition-transform" />
              )
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans text-foreground selection:bg-primary selection:text-black">
      <Navbar />
      <main className="flex-1 pt-20 md:pt-24">
        {children}
      </main>
      <Footer />
    </div>
  );
}
