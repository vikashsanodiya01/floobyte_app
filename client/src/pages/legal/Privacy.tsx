import { Layout } from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";

export default function Privacy() {
  const { data } = useQuery<{ key: string; value: string | null }>({
    queryKey: ["/api/settings/privacyPolicy"],
    queryFn: async () => (await fetch("/api/settings/privacyPolicy")).json(),
  });
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-display font-bold text-white mb-6">Privacy Policy</h1>
        <div className="prose prose-invert max-w-3xl">
          <p className="text-muted-foreground whitespace-pre-line">
            {data?.value || "This is a demo Privacy Policy. We respect your privacy and protect your personal information. Your data is used to deliver and improve our services, and is never sold to third parties."}
          </p>
        </div>
      </div>
    </Layout>
  );
}
