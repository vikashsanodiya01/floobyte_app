import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import teamImg from "@assets/generated_images/team_of_it_professionals_working_in_modern_office.png";
import { useQuery } from "@tanstack/react-query";

export default function About() {
  type Stats = { totalPosts: number; totalProjects: number; totalServices: number };
  const { data: stats } = useQuery<Stats>({
    queryKey: ["/api/stats"],
    queryFn: async () => (await fetch("/api/stats")).json(),
  });
  const { data: statsSetting } = useQuery<{ key: string; value: string | null }>({
    queryKey: ["/api/settings/home.stats"],
    queryFn: async () => {
      const res = await fetch("/api/settings/home.stats");
      if (!res.ok) throw new Error("Failed to fetch stats setting");
      return res.json();
    },
  });
  const dynamicStats: Array<{ label: string; value: number }> = (() => { try { return statsSetting?.value ? JSON.parse(statsSetting.value) : []; } catch { return []; } })();
  return (
    <Layout>
      <div className="pt-10 pb-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
                About <span className="text-primary">Floobyte</span>
              </h1>
              <p className="text-muted-foreground text-xl leading-relaxed">
                We are a team of passionate technologists dedicated to empowering businesses through innovation.
              </p>
            </div>

            <div className="mb-16">
              <img 
                src={teamImg} 
                alt="Our Team" 
                className="w-full h-[400px] object-cover rounded-2xl shadow-2xl border border-white/10 mb-12"
              />
              
              <h2 className="text-3xl font-display font-bold text-white mb-6">Who We Are</h2>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                Floobyte IT Solutions is a premier software development company based in Indore, India. Since our inception, we have been helping startups, SMEs, and large enterprises navigate the digital landscape.
              </p>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                Our mission is simple: to deliver technology that works for you. We specialize in the hospitality and travel sectors but have successfully delivered projects across various industries including healthcare, e-commerce, and education.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                With a team of over 50 skilled professionals, we bring a wealth of experience in web development, mobile apps, and custom software solutions. We believe in a collaborative approach, working closely with our clients to understand their unique challenges and goals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <Card className="bg-card border-white/5 p-8">
                <h3 className="text-2xl font-display font-bold text-white mb-4">Our Vision</h3>
                <p className="text-muted-foreground">
                  To be a global leader in IT solutions, recognized for our innovation, quality, and commitment to client success. We aim to create a digital ecosystem where businesses of all sizes can thrive.
                </p>
              </Card>
              <Card className="bg-card border-white/5 p-8">
                <h3 className="text-2xl font-display font-bold text-white mb-4">Our Values</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center gap-3"><CheckCircle className="text-primary w-5 h-5" /> Innovation & Creativity</li>
                  <li className="flex items-center gap-3"><CheckCircle className="text-primary w-5 h-5" /> Client-Centric Approach</li>
                  <li className="flex items-center gap-3"><CheckCircle className="text-primary w-5 h-5" /> Transparency & Integrity</li>
                  <li className="flex items-center gap-3"><CheckCircle className="text-primary w-5 h-5" /> Excellence in Quality</li>
                </ul>
              </Card>
            </div>

            <div>
              <h2 className="text-3xl font-display font-bold text-white mb-8 text-center">Our Stats</h2>
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
          </div>
        </div>
      </div>
    </Layout>
  );
}
