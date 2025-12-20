import { Layout } from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";

export default function Terms() {
  const { data } = useQuery<{ key: string; value: string | null }>({
    queryKey: ["/api/settings/terms"],
    queryFn: async () => (await fetch("/api/settings/terms")).json(),
  });
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-display font-bold text-white mb-6">Terms & Conditions</h1>
        <div className="prose prose-invert max-w-3xl">
          <p className="text-muted-foreground whitespace-pre-line">
            {data?.value || "Demo Terms & Conditions. Use of our services constitutes acceptance of these terms. We reserve the right to update terms at any time."}
          </p>
        </div>
      </div>
    </Layout>
  );
}
