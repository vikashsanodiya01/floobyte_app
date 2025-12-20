import { Layout } from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";

export default function Disclaimer() {
  const { data } = useQuery<{ key: string; value: string | null }>({
    queryKey: ["/api/settings/disclaimer"],
    queryFn: async () => (await fetch("/api/settings/disclaimer")).json(),
  });
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-display font-bold text-white mb-6">Disclaimer</h1>
        <div className="prose prose-invert max-w-3xl">
          <p className="text-muted-foreground whitespace-pre-line">
            {data?.value || "Demo Disclaimer. Information provided on this site is for general purposes only and may change without notice."}
          </p>
        </div>
      </div>
    </Layout>
  );
}
