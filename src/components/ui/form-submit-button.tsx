"use client";

import type { ComponentProps } from "react";
import { LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

interface FormSubmitButtonProps
  extends Omit<ComponentProps<typeof Button>, "children" | "type"> {
  label: string;
  pendingLabel: string;
}

export function FormSubmitButton({
  label,
  pendingLabel,
  disabled,
  ...props
}: FormSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={disabled || pending}
      aria-busy={pending}
      {...props}
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
