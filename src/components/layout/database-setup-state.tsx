import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DatabaseSetupStateProps {
  title: string;
  description: string;
}

export function DatabaseSetupState({
  title,
  description,
}: DatabaseSetupStateProps) {
  return (
    <Card className="rounded-[2rem] border-border/60 bg-white/88 shadow-lg shadow-black/5">
      <CardHeader className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
          Supabase setup
        </p>
        <CardTitle className="font-heading text-3xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
