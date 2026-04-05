import Link from "next/link";

import { BrandMark } from "@/components/layout/brand-mark";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f3eee6_0%,#f8f5f0_45%,#fbfaf7_100%)] px-4 py-6 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-3xl items-center justify-center">
        <Card className="w-full rounded-[2rem] border-white/80 bg-white/92 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
          <CardHeader className="space-y-4 p-6 text-center">
            <div className="flex justify-center">
              <BrandMark compact subtitle={null} href={undefined} />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary/80">
                Unauthorized
              </p>
              <CardTitle className="font-heading text-[2rem] leading-tight">
                Your account does not have access to this area
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 px-6 pb-6 text-center">
            <p className="text-sm leading-7 text-muted-foreground">
              Staff can access the staff dashboard, while only admins can open
              the admin workspace for a venue.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/staff">Go to staff</Link>
              </Button>
              <Button asChild className="rounded-full">
                <Link href="/login">Back to login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
