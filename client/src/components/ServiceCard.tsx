import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, LucideIcon } from "lucide-react";
import { Link } from "wouter";

interface ServiceCardProps {
  icon?: LucideIcon;
  imageUrl?: string;
  title: string;
  description: string;
  delay?: number;
  link?: string;
}

export function ServiceCard({ icon: Icon, imageUrl, title, description, link }: ServiceCardProps) {
  return (
    <Card className="group relative overflow-hidden border-white/5 bg-card/40 hover:bg-card/60 transition-all duration-300 hover:border-primary/30 hover:-translate-y-1">
      <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowRight className="text-primary -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
      </div>
      
      <CardHeader>
        {imageUrl ? (
          <div className="mb-4 rounded-md overflow-hidden h-32 bg-black/20">
            <img 
              src={imageUrl} 
              alt={title} 
              className="w-full h-full object-cover" 
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform duration-300">
            {Icon && <Icon size={24} />}
          </div>
        )}
        <CardTitle className="font-display text-xl text-white group-hover:text-primary transition-colors">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Link href={link || "/services"}>
          <span className="text-sm font-semibold text-primary cursor-pointer hover:underline">Learn more</span>
        </Link>
      </CardFooter>
    </Card>
  );
}
