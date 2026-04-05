import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
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
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(38,79,93,0.08),transparent_34%),linear-gradient(180deg,#f4efe7_0%,#f7f4ee_46%,#fbfaf7_100%)] px-4 py-6 sm:px-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_center,rgba(38,79,93,0.06),transparent_62%)]" />
      <div className="pointer-events-none absolute left-1/2 top-24 h-56 w-56 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-lg items-center justify-center">
        <div className="w-full max-w-md">
          <LoginForm nextPath={nextPath} />
        </div>
      </div>
    </div>
  );
}
