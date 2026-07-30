import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type FieldBase = {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
};

export type FormFieldProps = FieldBase & {
  children?: ReactNode;
};

export function FormField({ label, name, error, hint, required, className, children }: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={name} className="block text-sm font-medium text-forest">
        {label}
        {required ? <span className="ml-0.5 text-canada-red">*</span> : null}
      </label>
      {children}
      {hint && !error ? <p className="text-xs text-muted">{hint}</p> : null}
      {error ? (
        <p className="text-xs text-canada-red" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const controlCls =
  "w-full max-w-full rounded-xl border border-border bg-white px-3.5 py-3 text-base text-foreground outline-none transition placeholder:text-muted/70 focus:border-agri focus:ring-2 focus:ring-agri/20 sm:py-2.5 sm:text-sm";

export type TextInputProps = FieldBase & InputHTMLAttributes<HTMLInputElement>;

export function TextInput({ label, name, error, hint, required, className, ...rest }: TextInputProps) {
  return (
    <FormField label={label} name={name} error={error} hint={hint} required={required} className={className}>
      <input id={name} name={name} required={required} className={controlCls} aria-invalid={!!error} {...rest} />
    </FormField>
  );
}

export type TextTextareaProps = FieldBase & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextTextarea({
  label,
  name,
  error,
  hint,
  required,
  className,
  rows = 4,
  ...rest
}: TextTextareaProps) {
  return (
    <FormField label={label} name={name} error={error} hint={hint} required={required} className={className}>
      <textarea
        id={name}
        name={name}
        required={required}
        rows={rows}
        className={cn(controlCls, "resize-y")}
        aria-invalid={!!error}
        {...rest}
      />
    </FormField>
  );
}

export type TextSelectProps = FieldBase &
  SelectHTMLAttributes<HTMLSelectElement> & {
    options: { value: string; label: string }[];
    placeholder?: string;
  };

export function TextSelect({
  label,
  name,
  error,
  hint,
  required,
  className,
  options,
  placeholder,
  ...rest
}: TextSelectProps) {
  return (
    <FormField label={label} name={name} error={error} hint={hint} required={required} className={className}>
      <select
        id={name}
        name={name}
        required={required}
        className={controlCls}
        aria-invalid={!!error}
        {...rest}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}

export default FormField;
