import { Layout } from "@/components/Layout";
import { Hero } from "@/components/Hero";
import { ServiceCard } from "@/components/ServiceCard";
import { PortfolioItem } from "@/components/PortfolioItem";
import { Button } from "@/components/ui/button";
import { 
  Code, 
  Smartphone, 
  Database, 
  Globe, 
  ShoppingCart, 
  Hotel 
} from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import teamImg from "@assets/generated_images/team_of_it_professionals_working_in_modern_office.png";
import codingImg from "@assets/generated_images/web_development_and_coding_concept.png";
import heroBg from "@assets/generated_images/modern_tech_hero_background_with_yellow_accents.png";

export default function Home() {
  type Service = { id: number; title: string; description: string | null; imageUrl: string | null };
  type Project = { id: number; title: string; category: string | null; imageUrl: string | null; description: string | null; linkUrl?: string | null };
  type Post = { id: number; title: string; slug: string | null; excerpt: string | null };
  type Stats = { totalPosts: number; totalProjects: number; totalServices: number; totalMessages: number; unreadMessages: number; totalCareers: number; publishedPosts: number; draftPosts: number };

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/services"],
    queryFn: async () => (await fetch("/api/services")).json(),
  });
  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    queryFn: async () => (await fetch("/api/projects")).json(),
  });
  const { data: posts = [] } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
    queryFn: async () => (await fetch("/api/posts")).json(),
  });
  const { data: stats } = useQuery<Stats>({
    queryKey: ["/api/stats"],
    queryFn: async () => (await fetch("/api/stats")).json(),
  });
  const { data: statsSetting } = useQuery<{ key: string; value: string | null }>({
    queryKey: ["/api/settings/home.stats"],
    queryFn: async () => {
      const res = await fetch("/api/settings/home.stats");
      if (!res.ok) throw new Error("Failed to fetch home stats setting");
      return res.json();
    },
  });
  const dynamicStats: Array<{ label: string; value: number }> = (() => { try { return statsSetting?.value ? JSON.parse(statsSetting.value) : []; } catch { return []; } })();
  return (
    <Layout>
      <Hero />

      {/* Services Section */}
      <section className="py-20 md:py-32 bg-background relative">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
              Our Core <span className="text-primary">Services</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              We deliver end-to-end IT solutions tailored to your business needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(services.slice(0,6)).map((svc) => (
              <ServiceCard 
                key={svc.id}
                title={svc.title}
                description={svc.description || ""}
                imageUrl={svc.imageUrl || undefined}
                link={`/services/${svc.id}`}
              />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/services">
              <Button variant="outline" size="lg" className="rounded-full border-primary/20 text-primary hover:bg-primary hover:text-black">
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-card border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 relative">
              <div className="absolute -inset-4 bg-primary/20 rounded-2xl blur-xl" />
              <img 
                src={teamImg} 
                alt="Our Team" 
                className="relative rounded-2xl shadow-2xl border border-white/10"
              />
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
                Why Partner with <span className="text-primary">Floobyte?</span>
              </h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <span className="font-bold text-xl">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Expert Team</h3>
                    <p className="text-muted-foreground">Our team consists of senior developers and designers with years of experience in the industry.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <span className="font-bold text-xl">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Tailored Solutions</h3>
                    <p className="text-muted-foreground">We don't believe in one-size-fits-all. Every solution is customized to meet your specific business goals.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <span className="font-bold text-xl">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Ongoing Support</h3>
                    <p className="text-muted-foreground">We build long-term relationships. Our support continues long after the project is launched.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Work Preview */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
                Featured <span className="text-primary">Projects</span>
              </h2>
              <p className="text-muted-foreground text-lg">Some of our best work.</p>
            </div>
            <Link href="/portfolio">
              <Button className="hidden md:flex">View All Projects</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(projects.slice(0,3)).map((p) => (
              <PortfolioItem 
                key={p.id}
                title={p.title}
                category={p.category || "Project"}
                image={p.imageUrl || codingImg}
                description={p.description || ""}
                href={p.linkUrl ? p.linkUrl : `/portfolio/${p.id}`}
                external={!!p.linkUrl}
              />
            ))}
          </div>
          
          <div className="mt-8 md:hidden text-center">
             <Link href="/portfolio">
              <Button className="w-full">View All Projects</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Blog Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
                Latest <span className="text-primary">Blog</span>
              </h2>
              <p className="text-muted-foreground text-lg">Fresh articles from our team.</p>
            </div>
            <Link href="/blog">
              <Button className="hidden md:flex">View All Posts</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(posts.slice(0,3)).map((post) => (
              <div key={post.id} className="p-6 bg-card border border-white/5 rounded-xl">
                <h3 className="font-display font-bold text-xl text-white mb-2">{post.title}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2">{post.excerpt || ""}</p>
                <div className="mt-4">
                  <Link href={post.slug ? `/blog/${post.slug}` : "/blog"}>
                    <Button variant="outline" className="rounded-full border-primary/20 text-primary hover:bg-primary hover:text-black">Read More</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Stats Section */}
      <section className="py-20 bg-card border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
              Our <span className="text-primary">Stats</span>
            </h2>
            <p className="text-muted-foreground text-lg">A quick snapshot of what we’ve built and published.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dynamicStats.length > 0 ? (
              dynamicStats.map((s, i) => (
                <div key={i} className="text-center p-6 bg-card/50 rounded-xl border border-white/5">
                  <div className="text-sm text-muted-foreground">{s.label}</div>
                  <div className="text-4xl font-bold text-primary">{s.value}</div>
                </div>
              ))
            ) : (
              <>
                <div className="text-center p-6 bg-card/50 rounded-xl border border-white/5">
                  <div className="text-sm text-muted-foreground">Total Services</div>
                  <div className="text-4xl font-bold text-primary">{stats?.totalServices ?? 0}</div>
                </div>
                <div className="text-center p-6 bg-card/50 rounded-xl border border-white/5">
                  <div className="text-sm text-muted-foreground">Projects</div>
                  <div className="text-4xl font-bold text-primary">{stats?.totalProjects ?? 0}</div>
                </div>
                <div className="text-center p-6 bg-card/50 rounded-xl border border-white/5">
                  <div className="text-sm text-muted-foreground">Blog Posts</div>
                  <div className="text-4xl font-bold text-primary">{stats?.totalPosts ?? 0}</div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5 pattern-grid-lg opacity-20" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-black mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-black/80 text-xl max-w-2xl mx-auto mb-10 font-medium">
            Let's discuss your project and build something amazing together.
          </p>
          <Link href="/quote">
            <Button size="lg" className="bg-black text-white hover:bg-black/80 font-bold h-14 px-10 text-lg rounded-full border-none">
              Get A Free Quote
            </Button>
          </Link>
        </div>
      </section>

      {/* legacy: removed subscribe modal */}
    </Layout>
  );
}
// legacy: subscribe modal removed
