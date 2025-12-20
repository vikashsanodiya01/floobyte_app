import { Layout } from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";

export default function PaymentPolicy() {
  const { data } = useQuery<{ key: string; value: string | null }>({
    queryKey: ["/api/settings/paymentPolicy"],
    queryFn: async () => (await fetch("/api/settings/paymentPolicy")).json(),
  });
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-display font-bold text-white mb-6">Payment Policy</h1>
        <div className="prose prose-invert max-w-3xl">
          <p className="text-muted-foreground whitespace-pre-line">
            {data?.value || `Demo Payment Policy (Razorpay). All payments are processed securely via Razorpay. Refunds, disputes, and chargebacks follow Razorpay's guidelines. Taxes as applicable. For subscription services, billing cycles and cancellations are outlined in your plan.`}
          </p>
        </div>
      </div>
    </Layout>
  );
}
