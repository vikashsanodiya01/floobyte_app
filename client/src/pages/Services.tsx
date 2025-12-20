import { Layout } from "@/components/Layout";
import { ServiceCard } from "@/components/ServiceCard";
import { Code, Smartphone, Database, Globe, ShoppingCart, Hotel, Search, Server, Shield, Cloud } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function Services() {
  const fallback = [
    {
      icon: Globe,
      title: "Web Development",
      description: "From simple landing pages to complex web applications, we build responsive, SEO-friendly, and high-performance websites using React, Next.js, and modern frameworks."
    },
    {
      icon: Smartphone,
      title: "Mobile App Development",
      description: "We create native and cross-platform mobile apps for iOS and Android. Our apps are user-friendly, fast, and built to scale with your business."
    },
    {
      icon: Hotel,
      title: "Hospitality & Travel Tech",
      description: "Specialized solutions for the travel industry including Hotel Booking Engines, Channel Managers, OTA integrations, and Travel Agency Management Systems."
    },
    {
      icon: ShoppingCart,
      title: "E-Commerce Solutions",
      description: "Robust online stores built on platforms like Shopify, WooCommerce, or custom solutions. We handle payment gateways, inventory, and secure checkout flows."
    },
    {
      icon: Database,
      title: "CRM & ERP Systems",
      description: "Streamline your business operations with custom CRM and ERP software designed to fit your specific workflow and improve efficiency."
    },
    {
      icon: Search,
      title: "SEO & Digital Marketing",
      description: "Increase your visibility online with our data-driven SEO strategies, content marketing, and social media management services."
    },
    {
      icon: Code,
      title: "Custom Software Dev",
      description: "Have a unique problem? We build unique solutions. Our custom software development services cover everything from automation tools to specialized SaaS products."
    },
    {
      icon: Cloud,
      title: "Cloud Services",
      description: "Migration, management, and optimization of cloud infrastructure on AWS, Azure, or Google Cloud Platform."
    },
    {
      icon: Shield,
      title: "Cyber Security",
      description: "Protect your digital assets with our security audits, penetration testing, and implementation of best security practices."
    }
  ];

  type Service = {
    id: number;
    title: string;
    description: string | null;
    category: string | null;
    icon: string | null;
    imageUrl: string | null;
    videoUrl?: string | null;
  };

  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
    queryFn: async () => {
      const res = await fetch("/api/services");
      if (!res.ok) throw new Error("Failed to fetch services");
      return res.json();
    },
  });

  return (
    <Layout>
      <div className="pt-10 pb-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              Our <span className="text-primary">Services</span>
            </h1>
            <p className="text-muted-foreground text-xl leading-relaxed">
              Comprehensive IT solutions designed to help your business grow, innovate, and succeed in the digital age.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {isLoading ? (
              <div className="col-span-3 text-center text-muted-foreground">Loading services...</div>
            ) : services.length > 0 ? (
              services.map((svc) => (
                <ServiceCard 
                  key={svc.id}
                  imageUrl={svc.imageUrl || undefined}
                  icon={svc.imageUrl ? undefined : Server}
                  title={svc.title}
                  description={svc.description || ""}
                  link={`/services/${svc.id}`}
                />
              ))
            ) : (
              fallback.map((service, index) => (
                <ServiceCard 
                  key={index}
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
