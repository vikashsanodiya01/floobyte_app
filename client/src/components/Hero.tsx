import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Code, Shield, Globe, Smartphone } from "lucide-react";
import heroBg from "@assets/generated_images/modern_tech_hero_background_with_yellow_accents.png";
import { useQuery } from "@tanstack/react-query";

export function Hero() {
  const { data: heroTitle } = useQuery<{ key: string; value: string | null }>({
    queryKey: ["/api/settings/home.heroTitle"],
    queryFn: async () => (await fetch("/api/settings/home.heroTitle")).json(),
  });
  const { data: heroSubtitle } = useQuery<{ key: string; value: string | null }>({
    queryKey: ["/api/settings/home.heroSubtitle"],
    queryFn: async () => (await fetch("/api/settings/home.heroSubtitle")).json(),
  });
  const { data: ctaText } = useQuery<{ key: string; value: string | null }>({
    queryKey: ["/api/settings/home.ctaText"],
    queryFn: async () => (await fetch("/api/settings/home.ctaText")).json(),
  });
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBg} 
          alt="Tech Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm gradient-mask-b-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
      </div>

      <div className="container relative z-10 px-4 pt-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              🚀 Transforming Ideas into Digital Reality
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-[1.1] mb-6 tracking-tight">
              {heroTitle?.value || (
                <>We Build <span className="text-primary text-glow">Smart Digital</span><br />Solutions For Future</>
              )}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              {heroSubtitle?.value || "Floobyte is a premier IT agency specializing in custom software, mobile apps, and enterprise solutions. We help businesses scale with cutting-edge technology."}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/quote">
                <Button size="lg" className="bg-primary text-black hover:bg-primary/90 font-bold h-14 px-8 text-lg w-full sm:w-auto rounded-full">
                  {ctaText?.value || "Get Started Now"}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg w-full sm:w-auto rounded-full border-white/10 bg-white/5 hover:bg-white/10 hover:text-white">
                  View Our Work
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Floating Icons/Badges */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { icon: Code, label: "Custom Development" },
              { icon: Globe, label: "Web Solutions" },
              { icon: Smartphone, label: "Mobile Apps" },
              { icon: Shield, label: "Cyber Security" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-card/50 border border-white/5 backdrop-blur-md hover:border-primary/50 transition-colors"
              >
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <item.icon size={24} />
                </div>
                <span className="font-display font-semibold text-white">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
