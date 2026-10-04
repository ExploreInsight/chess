// ** import utils
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-sm border border-line bg-surface px-4 py-2.5 text-sm text-ink transition-colors hover:bg-surface-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-45",
  {
    variants: {
      variant: {
        default: "bg-surface hover:bg-surface-raised",
        accent: "bg-square-selected text-ink hover:brightness-110",
        ghost: "border-transparent bg-transparent hover:bg-surface",
      },
      size: {
        default: "px-4 py-2.5",
        sm: "px-3 py-1.5 text-xs",
        lg: "px-6 py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Component = asChild ? Slot : "button";
  return <Component className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
