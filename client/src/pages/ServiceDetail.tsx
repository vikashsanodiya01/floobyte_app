import { Layout } from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";

type Service = {
  id: number;
  title: string;
  description: string | null;
  category: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
};

export default function ServiceDetail() {
  const [, params] = useRoute("/services/:id");
  const id = Number(params?.id);

  const { data: svc } = useQuery<Service | null>({
    queryKey: ["/api/services", id],
    queryFn: async () => {
      const res = await fetch(`/api/services/${id}`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: Number.isFinite(id),
  });

  return (
    <Layout>
      <div className="pt-10 pb-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          {!svc ? (
            <div className="text-center text-muted-foreground">Service not found.</div>
          ) : (
            <div className="space-y-6">
              <h1 className="text-4xl font-display font-bold text-white">{svc.title}</h1>
              {svc.videoUrl ? (
                <div className="aspect-video w-full rounded-xl overflow-hidden border border-white/10">
                  <iframe
                    src={svc.videoUrl}
                    title={svc.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                svc.imageUrl && (
                  <img src={svc.imageUrl} alt={svc.title} className="w-full rounded-xl border border-white/10" />
                )
              )}
              {svc.description && (
                <p className="text-muted-foreground whitespace-pre-line">{svc.description}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
