import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader } from "@/components/site/Layout";

export const Route = createFileRoute("/forgot-password")({ component: ForgotPage });

function ForgotPage() {
  return (
    <div>
      <PageHeader breadcrumb="Home / Forgot Password" title="Reset Password" subtitle="We'll send a reset link to your email." />
      <div className="container mx-auto px-4 py-16 max-w-md">
        <form onSubmit={(e) => { e.preventDefault(); toast.success("Reset link sent (demo)"); }} className="bg-card border rounded-2xl p-8 space-y-4">
          <label className="block"><span className="text-sm font-medium">Email</span><input type="email" required className="mt-1 w-full px-3 py-2 rounded-lg border bg-background" /></label>
          <button className="w-full bg-primary text-primary-foreground py-3 rounded-full font-semibold">Send Reset Link</button>
          <p className="text-center text-sm"><Link to="/login" className="text-primary">Back to Sign In</Link></p>
        </form>
      </div>
    </div>
  );
}