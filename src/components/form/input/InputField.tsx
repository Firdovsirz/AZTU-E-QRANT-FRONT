import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  type?: "text" | "number" | "email" | "password" | "date" | "time" | string;
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string | number;
  className?: string;
  success?: boolean;
  error?: boolean;
  hint?: string;
  required?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      id,
      name,
      placeholder,
      value,
      onChange,
      onKeyDown,
      onBlur,
      className = "",
      min,
      max,
      step,
      disabled = false,
      success = false,
      error = false,
      hint,
      required,
      ...rest
    },
    ref
  ) => {
    let inputClasses = `h-11 w-full rounded-xl border appearance-none px-3.5 py-2 text-sm shadow-theme-xs placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-4 focus:-translate-y-px dark:bg-gray-900/60 dark:text-white/90 dark:placeholder:text-white/30 ${className}`;

    if (disabled) {
      inputClasses += ` text-gray-500 border-gray-200 opacity-60 bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
    } else if (error) {
      inputClasses += ` border-error-400 bg-error-25 focus:border-error-400 focus:ring-error-500/15 dark:bg-error-500/[0.04] dark:text-error-400 dark:border-error-500/60 dark:focus:border-error-500`;
    } else if (success) {
      inputClasses += ` border-success-400 bg-success-25 focus:border-success-400 focus:ring-success-500/15 dark:text-success-400 dark:border-success-500/60`;
    } else {
      inputClasses += ` bg-white/70 backdrop-blur text-gray-800 border-gray-200 hover:border-gray-300 focus:border-brand-400 focus:ring-brand-500/15 dark:border-white/10 dark:hover:border-white/20 dark:text-white/90 dark:focus:border-brand-500`;
    }

    return (
      <div className="relative">
        <input
          ref={ref}
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          required={required}
          className={inputClasses}
          {...rest}
        />
        {hint && (
          <p
            className={`mt-1.5 text-xs ${
              error
                ? "text-error-500"
                : success
                ? "text-success-500"
                : "text-gray-500"
            }`}
          >
            {hint}
          </p>
        )}
      </div>
    );
  }
);

export default Input;