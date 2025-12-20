import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject is required"),
  message: z.string().min(10, "Message is required"),
});

export default function Contact() {
  const { toast } = useToast();
  const { data: contactSetting } = useQuery<{ key: string; value: string | null }>({
    queryKey: ["/api/settings/contactInfo"],
    queryFn: async () => {
      const res = await fetch("/api/settings/contactInfo");
      if (!res.ok) throw new Error("Failed to fetch contact info");
      return res.json();
    },
  });
  const contactInfo = (() => { try { return contactSetting?.value ? JSON.parse(contactSetting.value) : {}; } catch { return {}; } })();
  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    }
  });

  async function onSubmit(data: z.infer<typeof contactSchema>) {
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromName: data.name, email: data.email, subject: data.subject, message: data.message }),
      });
      if (!res.ok) throw new Error("Failed to send message");
      toast({ title: "Message Sent!", description: "We'll get back to you as soon as possible." });
      form.reset();
    } catch (err) {
      toast({ title: "Failed to send", description: "Please try again later.", variant: "destructive" });
    }
  }

  return (
    <Layout>
      <div className="pt-10 pb-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
                Get in <span className="text-primary">Touch</span>
              </h1>
              <p className="text-muted-foreground text-xl">
                Have a project in mind? We'd love to hear from you.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-display font-bold text-white mb-6">Contact Information</h2>
                <div className="space-y-8 mb-12">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <Phone size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-1">Phone</h3>
                      <p className="text-muted-foreground">{contactInfo.phone || "+91 123 456 7890"}</p>
                      <p className="text-muted-foreground">{contactInfo.altPhone || "+91 987 654 3210"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-1">Email</h3>
                      <p className="text-muted-foreground">{contactInfo.email || "info@floobyte.com"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-1">Address</h3>
                      <p className="text-muted-foreground">{contactInfo.address || "123 Tech Park, Vijay Nagar, Indore, Madhya Pradesh, India - 452010"}</p>
                    </div>
                  </div>
                </div>

                <Card className="bg-card/50 border-white/5 p-6">
                  <h3 className="font-bold text-white mb-4">Business Hours</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span>10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between text-destructive">
                      <span>Sunday</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="bg-card border-white/5 p-8">
                <h2 className="text-2xl font-display font-bold text-white mb-6">Send us a Message</h2>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Name" {...field} className="bg-background/50 border-white/10" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="your@email.com" {...field} className="bg-background/50 border-white/10" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="Project Inquiry" {...field} className="bg-background/50 border-white/10" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Tell us about your project..." {...field} className="bg-background/50 border-white/10 min-h-[120px]" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full bg-primary text-black font-bold hover:bg-primary/90">
                      Send Message
                    </Button>
                  </form>
                </Form>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
