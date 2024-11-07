import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder: string; // Added a placeholder member
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, placeholder, ...props }, ref) => {
    return (
      <input
        className={cn(
          "flex min-h-[40px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        placeholder={placeholder} // Passing the placeholder prop
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
