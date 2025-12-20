import { Layout } from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";

type Project = {
  id: number;
  title: string;
  client: string | null;
  category: string | null;
  description: string | null;
  imageUrl: string | null;
  linkUrl: string | null;
  videoUrl: string | null;
};

export default function ProjectDetail() {
  const [, params] = useRoute("/portfolio/:id");
  const id = Number(params?.id);

  const { data: project } = useQuery<Project | null>({
    queryKey: ["/api/projects", id],
    queryFn: async () => {
      const res = await fetch(`/api/projects/${id}`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: Number.isFinite(id),
  });

  return (
    <Layout>
      <div className="pt-10 pb-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          {!project ? (
            <div className="text-center text-muted-foreground">Project not found.</div>
          ) : (
            <div className="space-y-6">
              <h1 className="text-4xl font-display font-bold text-white">{project.title}</h1>
              {project.videoUrl ? (
                <div className="aspect-video w-full rounded-xl overflow-hidden border border-white/10">
                  <iframe
                    src={project.videoUrl}
                    title={project.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                project.imageUrl && (
                  <img src={project.imageUrl} alt={project.title} className="w-full rounded-xl border border-white/10" />
                )
              )}
              {project.description && (
                <p className="text-muted-foreground whitespace-pre-line">{project.description}</p>
              )}
              {project.linkUrl && (
                <div>
                  <a href={project.linkUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Visit project</a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
