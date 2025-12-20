import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import codingImg from "@assets/generated_images/web_development_and_coding_concept.png";
import { Link } from "wouter";

interface Post {
  id: number;
  title: string;
  content: string | null;
  status: string | null;
  imageUrl?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  author?: string | null;
  category?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  publishedAt?: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export default function Blog() {
  const [visibleCount, setVisibleCount] = useState(6);
  const { data: posts = [], isLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
    queryFn: async () => {
      const res = await fetch("/api/posts");
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json();
    },
  });

  const pageTitle = "Blog | Floobyte";
  const pageDescription = "Latest insights, news, and technical deep dives from the Floobyte team.";
  const pageKeywords = Array.from(new Set(posts
    .map(p => p?.category || "")
    .filter(Boolean)
    .slice(0, 10))).join(", ") || "blog, floobyte, insights, technology, development";

  if (typeof document !== "undefined") {
    document.title = pageTitle;
    const ensureMeta = (name: string) => {
      let el = document.querySelector(`meta[name='${name}']`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      return el;
    };
    const desc = ensureMeta("description");
    desc.setAttribute("content", pageDescription);
    const kw = ensureMeta("keywords");
    kw.setAttribute("content", pageKeywords);
    const ogTitle = document.querySelector("meta[property='og:title']") as HTMLMetaElement | null;
    if (ogTitle) ogTitle.setAttribute("content", pageTitle);
    const ogDesc = document.querySelector("meta[property='og:description']") as HTMLMetaElement | null;
    if (ogDesc) ogDesc.setAttribute("content", pageDescription);
  }

  return (
    <Layout>
      <div className="pt-10 pb-20 bg-background min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              Latest <span className="text-primary">Insights</span>
            </h1>
            <p className="text-muted-foreground text-xl leading-relaxed">
              News, trends, and technical deep dives from the Floobyte team.
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-16">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading posts...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.slice(0, visibleCount).map((post) => (
                <Card key={post.id} className="bg-card border-white/5 overflow-hidden group hover:border-primary/30 transition-colors">
                  <div className="aspect-video overflow-hidden relative">
                    <img 
                      src={post.imageUrl || codingImg} 
                      alt={post.title} 
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = codingImg; }}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye size={12} />
                        {typeof (post as any).views === "number" ? (post as any).views : 0}
                      </div>
                      {post.status && (
                        <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-bold">
                          {post.status}
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-xl font-display font-bold text-white group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm line-clamp-4">
                      {post.excerpt || post.content || ""}
                    </p>
                    <div className="mt-3">
                      <Link href={`/blog/${post.slug || post.id}`}>
                        <Button variant="link" className="text-primary p-0 h-auto font-semibold">Read More</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {posts.length > visibleCount && (
            <div className="mt-16 text-center">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-white/10 hover:bg-white/5 text-white"
                onClick={() => setVisibleCount((c) => c + 6)}
              >
                Load More Articles
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
