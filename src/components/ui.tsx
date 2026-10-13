import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function buttonClasses(variant: "primary" | "ink" | "secondary" | "ghost" = "primary") {
  return cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50",
    variant === "primary" && "bg-flame text-ink hover:bg-flame-deep",
    variant === "ink" && "bg-ink text-cream hover:bg-ink/85",
    variant === "secondary" && "bg-paper text-ink ring-1 ring-ink/15 hover:ring-ink/40",
    variant === "ghost" && "text-ink hover:bg-ink/5",
  );
}

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ink" | "secondary" | "ghost" }) {
  return <button className={cn(buttonClasses(variant), className)} {...props} />;
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      {children}
      {hint ? <span className="mt-1.5 block text-xs leading-5 text-ink/60">{hint}</span> : null}
    </label>
  );
}

const fieldClass =
  "min-h-12 w-full rounded-2xl bg-paper px-4 text-base text-ink ring-1 ring-inset ring-ink/15 outline-none placeholder:text-ink/40 focus:ring-flame";

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(fieldClass, props.className)} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(fieldClass, "min-h-32 py-3 leading-6", props.className)} />;
}

export function DemoBadge({ children = "Demo" }: { children?: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-flame px-2.5 py-0.5 text-xs font-semibold text-ink">
      {children}
    </span>
  );
}

export function ChoiceGroup({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = option === value;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option)}
              className={cn(
                "min-h-11 rounded-full px-4 text-sm font-medium",
                selected ? "bg-ink text-cream" : "bg-paper text-ink ring-1 ring-inset ring-ink/15",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
