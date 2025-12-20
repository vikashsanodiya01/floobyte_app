import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const quoteSchema = z.object({
  name: z.string().min(2, "Name is required"),
  company: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  services: z.array(z.string()).refine((value) => value.length > 0, {
    message: "You have to select at least one service.",
  }),
  budget: z.string().optional(),
  details: z.string().min(10, "Please provide some details"),
});

const serviceOptions = [
  { id: "web", label: "Web Development" },
  { id: "mobile", label: "Mobile App" },
  { id: "crm", label: "CRM/ERP Solution" },
  { id: "ecommerce", label: "E-Commerce" },
  { id: "marketing", label: "Digital Marketing" },
  { id: "other", label: "Other" },
];

export default function Quote() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof quoteSchema>>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      services: [],
      budget: "",
      details: ""
    }
  });

  async function onSubmit(data: z.infer<typeof quoteSchema>) {
    try {
      const payload = {
        name: data.name,
        company: data.company || undefined,
        email: data.email,
        phone: data.phone,
        services: JSON.stringify(data.services),
        budget: data.budget || undefined,
        details: data.details,
        source: "Quote",
        status: "New",
      };
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Failed to submit lead");
      }
      toast({
        title: "Quote Request Received!",
        description: "Our team will analyze your requirements and contact you shortly.",
      });
      form.reset();
    } catch (e: any) {
      toast({ title: "Submission failed", description: e?.message || "Please try again later.", variant: "destructive" });
    }
  }

  return (
    <Layout>
      <div className="pt-10 pb-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
                Get A <span className="text-primary">Quote</span>
              </h1>
              <p className="text-muted-foreground text-xl">
                Tell us about your project requirements and we will get back to you with a custom proposal.
              </p>
            </div>

            <Card className="bg-card border-white/5 p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} className="bg-background/50 border-white/10" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Company Ltd." {...field} className="bg-background/50 border-white/10" />
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
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="john@example.com" {...field} className="bg-background/50 border-white/10" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+91 98765 43210" {...field} className="bg-background/50 border-white/10" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="services"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Interested Services</FormLabel>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {serviceOptions.map((item) => (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name="services"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={(field.value ?? []).includes(item.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...(field.value ?? []), item.id])
                                            : field.onChange(
                                                (field.value ?? []).filter(
                                                  (value) => value !== item.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">
                                      {item.label}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estimated Budget (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="$1,000 - $5,000" {...field} className="bg-background/50 border-white/10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="details"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Details</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your project, goals, and any specific requirements..." 
                            {...field} 
                            className="bg-background/50 border-white/10 min-h-[150px]" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" size="lg" className="w-full bg-primary text-black font-bold hover:bg-primary/90 text-lg h-12">
                    Submit Quote Request
                  </Button>
                </form>
              </Form>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
