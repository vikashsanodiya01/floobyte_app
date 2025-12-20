import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Eye, User, Tag } from "lucide-react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import codingImg from "@assets/generated_images/web_development_and_coding_concept.png";

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
  views?: number | null;
}

export default function BlogDetail() {
  const [match, params] = useRoute("/blog/:slug");
  const slug = params?.slug || "";
  const { data: post, isLoading, error } = useQuery<Post>({
    queryKey: ["/api/post", slug],
    queryFn: async () => {
      const isNumeric = /^\d+$/.test(slug);
      const url = isNumeric ? `/api/posts/${slug}` : `/api/posts/slug/${slug}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch post");
      return res.json();
    },
    enabled: !!slug,
  });

  const pageTitle = post?.metaTitle || `${post?.title || "Blog"} | Floobyte`;
  const pageDescription = post?.metaDescription || post?.excerpt || "Floobyte blog article";
  const pageKeywords = post?.metaKeywords || post?.category || "blog, article";

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
    ensureMeta("description").setAttribute("content", pageDescription || "");
    ensureMeta("keywords").setAttribute("content", pageKeywords || "");
  }

  return (
    <Layout>
      <div className="pt-10 pb-20 bg-background min-h-screen">
        <div className="container mx-auto px-4 max-w-4xl">
          {isLoading ? (
            <div className="text-center py-16 text-muted-foreground">Loading article...</div>
          ) : error ? (
            <div className="text-center py-16 text-destructive">Failed to load article.</div>
          ) : !post ? (
            <div className="text-center py-16 text-muted-foreground">Article not found.</div>
          ) : (
            <Card className="bg-card border-white/5 overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.imageUrl || codingImg}
                  alt={post.title}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = codingImg; }}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-3xl text-white">{post.title}</CardTitle>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}</span>
                  {post.author && (<span className="flex items-center gap-1"><User size={14} /> {post.author}</span>)}
                  {post.category && (<span className="flex items-center gap-1"><Tag size={14} /> {post.category}</span>)}
                  <span className="flex items-center gap-1"><Eye size={14} /> {post.views ?? 0}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none">
                  {post.content ? (
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                  ) : (
                    <p>{post.excerpt || ""}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
