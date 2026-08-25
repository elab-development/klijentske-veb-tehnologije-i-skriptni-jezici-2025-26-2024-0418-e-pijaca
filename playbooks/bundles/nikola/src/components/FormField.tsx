import type { InputHTMLAttributes, ReactNode } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  error?: string;
}

export default function FormField({ label, icon, error, className = '', id, ...rest }: FormFieldProps) {
  const inputId = id ?? rest.name;
  return (
    <div className={`field ${className}`.trim()}>
      <label htmlFor={inputId} className="field__label">{label}</label>
      <div className="field__control">
        {icon && <span className="field__icon">{icon}</span>}
        <input id={inputId} className={`field__input ${icon ? 'field__input--icon' : ''}`.trim()} {...rest} />
      </div>
      {error && <span className="field__error">{error}</span>}
    </div>
  );
}
