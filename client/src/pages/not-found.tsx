import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();
  const [remaining, setRemaining] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining((r) => (r > 0 ? r - 1 : 0));
    }, 1000);
    const timer = setTimeout(() => {
      setLocation("/");
    }, 5000);
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [setLocation]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <Card className="w-full max-w-md mx-4 bg-card border-border">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2 items-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <h1 className="text-2xl font-bold text-white">404 Page Not Found</h1>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            This page doesn’t exist. Redirecting to Home in {remaining}s.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
