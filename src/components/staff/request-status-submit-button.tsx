"use client";

import { LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

interface RequestStatusSubmitButtonProps {
  label: string;
  pendingLabel: string;
}

export function RequestStatusSubmitButton({
  label,
  pendingLabel,
}: RequestStatusSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      size="sm"
      disabled={pending}
      aria-busy={pending}
      className="rounded-full px-4 active:scale-[0.985]"
    >
      {pending ? (
        <>
          <LoaderCircle className="size-4 animate-spin" />
          {pendingLabel}
        </>
      ) : (
        label
      )}
    </Button>
  );
}
