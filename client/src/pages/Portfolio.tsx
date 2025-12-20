import { Layout } from "@/components/Layout";
import { PortfolioItem } from "@/components/PortfolioItem";
import { useQuery } from "@tanstack/react-query";
import codingImg from "@assets/generated_images/web_development_and_coding_concept.png";

interface Project {
  id: number;
  title: string;
  client: string | null;
  category: string | null;
  description: string | null;
  imageUrl: string | null;
  linkUrl?: string | null;
  videoUrl?: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export default function Portfolio() {
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    queryFn: async () => {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");
      return res.json();
    },
  });

  return (
    <Layout>
      <div className="pt-10 pb-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              Our <span className="text-primary">Portfolio</span>
            </h1>
            <p className="text-muted-foreground text-xl leading-relaxed">
              We take pride in delivering high-quality solutions. Check out some of our recent success stories.
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-16">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-top-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading projects...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <PortfolioItem 
                  key={project.id}
                  title={project.title}
                  category={project.category || "Project"}
                  image={project.imageUrl || codingImg}
                  description={project.description || ""}
                  href={project.linkUrl ? project.linkUrl : `/portfolio/${project.id}`}
                  external={!!project.linkUrl}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
