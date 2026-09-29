export default function FormField({ id, label, error, hint, as: Field = 'input', ...inputProps }) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <Field id={id} name={id} aria-invalid={!!error} aria-describedby={describedBy} {...inputProps} />
      {hint && !error && <small id={`${id}-hint`} className="muted">{hint}</small>}
      {error && <small id={`${id}-error`} className="field-error">{error}</small>}
    </div>
  );
}
