import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { BrandMark } from "@/components/layout/brand-mark";
import { Card, CardContent } from "@/components/ui/card";
import {
  getDefaultAuthenticatedPath,
  getOptionalAuthContext,
} from "@/lib/auth/guards";
import { loginNextPathSchema } from "@/lib/validations/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    next?: string;
  }>;
}) {
  const authContext = await getOptionalAuthContext();

  if (authContext) {
    redirect(getDefaultAuthenticatedPath(authContext.profile.role));
  }

  const resolvedSearchParams = await searchParams;
  const parsedNext = loginNextPathSchema.safeParse(resolvedSearchParams.next);
  const nextPath = parsedNext.success ? parsedNext.data : undefined;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(38,79,93,0.16),transparent_30%),linear-gradient(180deg,#f3eee6_0%,#f8f5f0_45%,#fbfaf7_100%)] px-4 py-6 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl items-center">
        <div className="grid w-full gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="space-y-5">
            <BrandMark compact={false} />
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary/80">
                Phase 3 access control
              </p>
              <h1 className="font-heading text-4xl leading-tight text-foreground sm:text-[3.2rem]">
                Secure venue access for staff and admin workflows
              </h1>
              <p className="max-w-xl text-base leading-8 text-muted-foreground">
                Sign in to view service requests, manage venue setup, and keep
                access scoped to the right organization.
              </p>
            </div>

            <Card className="rounded-[1.75rem] border-white/80 bg-white/82 shadow-sm shadow-black/5">
              <CardContent className="space-y-3 p-5 text-sm leading-7 text-muted-foreground">
                <p>
                  The public table experience stays open for customers, while
                  staff and admin tools now require an authenticated venue
                  profile.
                </p>
                <p>
                  If your account exists but cannot sign in to a dashboard yet,
                  your profile row may still need to be linked in Supabase.
                </p>
              </CardContent>
            </Card>
          </div>

          <LoginForm nextPath={nextPath} />
        </div>
      </div>
    </div>
  );
}
