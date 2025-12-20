import { Layout } from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";

export default function ReturnPolicy() {
  const { data } = useQuery<{ key: string; value: string | null }>({
    queryKey: ["/api/settings/returnPolicy"],
    queryFn: async () => (await fetch("/api/settings/returnPolicy")).json(),
  });
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-display font-bold text-white mb-6">Return Policy</h1>
        <div className="prose prose-invert max-w-3xl">
          <p className="text-muted-foreground whitespace-pre-line">
            {data?.value || "Demo Return Policy. As a software services company, returns are not applicable. For subscription products, cancellations are governed by your plan terms."}
          </p>
        </div>
      </div>
    </Layout>
  );
}
