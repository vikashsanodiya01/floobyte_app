import { Layout } from "@/components/Layout";

export default function DevelopTool() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-display font-bold text-white mb-6">Develop Tool by Floobyte</h1>
        <p className="text-muted-foreground max-w-3xl">
          A demo page introducing Floobyte's internal development toolkit: project scaffolding, CI helpers, performance monitoring snippets, and integrations. Contact us to learn how we customize developer tools for faster delivery.
        </p>
      </div>
    </Layout>
  );
}
