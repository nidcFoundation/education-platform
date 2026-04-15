"use client";

import React from "react";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";

type BaseProps = {
  name: string;
  control: any;
  label?: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
};

/* ─────────────────────────────────────────────
   TEXT / PASSWORD INPUT
───────────────────────────────────────────── */
type InputProps = BaseProps & {
  type?: "text" | "email" | "password";
  placeholder?: string;
  autoComplete?: string;
  isPassword?: boolean;
};

/* ─────────────────────────────────────────────
   CHECKBOX
───────────────────────────────────────────── */
type CheckboxProps = BaseProps & {
  type: "checkbox";
};

type Props = InputProps | CheckboxProps;

export function FormField(props: Props) {
  const { name, control, label, icon: Icon } = props as BaseProps;

  const isCheckbox = props.type === "checkbox";
  const isPassword = (props as InputProps).isPassword;

  const [visible, setVisible] = React.useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {/* ───────── LABEL ───────── */}
          {label && !isCheckbox && (
            <FieldLabel htmlFor={name} className="text-xs">
              {label}
            </FieldLabel>
          )}

          {/* ───────── CHECKBOX ───────── */}
          {isCheckbox ? (
            <div className="flex items-start gap-3 pt-0.5">
              <input
                id={name}
                type="checkbox"
                checked={field.value}
                onChange={field.onChange}
                className="mt-1 accent-primary"
              />

              <label
                htmlFor={name}
                className="text-[11px] text-muted-foreground leading-relaxed cursor-pointer"
              >
                {label}
              </label>

              {fieldState.invalid && (
                <FieldError
                  errors={[fieldState.error]}
                  className="text-xs mt-1"
                />
              )}
            </div>
          ) : (
            /* ───────── INPUTS ───────── */
            <div className="relative">
              {Icon && (
                <Icon className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              )}

              <Input
                {...field}
                id={name}
                type={
                  isPassword
                    ? visible
                      ? "text"
                      : "password"
                    : props.type || "text"
                }
                placeholder={(props as InputProps).placeholder}
                autoComplete={(props as InputProps).autoComplete}
                className={cn(
                  "h-9 text-sm",
                  Icon && "pl-8",
                  isPassword && "pr-10"
                )}
                aria-invalid={fieldState.invalid}
              />

              {/* PASSWORD TOGGLE */}
              {isPassword && (
                <button
                  type="button"
                  onClick={() => setVisible((v) => !v)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition"
                  aria-label={visible ? "Hide password" : "Show password"}
                >
                  {visible ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              )}

              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} className="text-xs" />
              )}
            </div>
          )}
        </Field>
      )}
    />
  );
}
