import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useState } from "react";
import codingImg from "@assets/generated_images/web_development_and_coding_concept.png";

interface PortfolioItemProps {
  title: string;
  category: string;
  image: string;
  description: string;
  href?: string;
  external?: boolean;
}

export function PortfolioItem({ title, category, image, description, href, external }: PortfolioItemProps) {
  const [src, setSrc] = useState(image || codingImg);
  return (
    <Card className="group overflow-hidden border-0 bg-transparent">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl mb-4">
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10" />
        <img 
          src={src} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={() => setSrc(codingImg)}
        />
        
        <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {href ? (
            external ? (
              <a href={href} target="_blank" rel="noopener noreferrer">
                <Button className="rounded-full bg-primary text-black font-bold hover:bg-white hover:text-black transition-colors">
                  View Project <ExternalLink className="ml-2 w-4 h-4" />
                </Button>
              </a>
            ) : (
              <a href={href}>
                <Button className="rounded-full bg-primary text-black font-bold hover:bg-white hover:text-black transition-colors">
                  View Project <ExternalLink className="ml-2 w-4 h-4" />
                </Button>
              </a>
            )
          ) : (
            <Button className="rounded-full bg-primary text-black font-bold hover:bg-white hover:text-black transition-colors">
              View Project <ExternalLink className="ml-2 w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
      
      <div>
        <Badge variant="secondary" className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-0">
          {category}
        </Badge>
        <h3 className="font-display font-bold text-xl text-white mb-1 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2">
          {description}
        </p>
      </div>
    </Card>
  );
}
