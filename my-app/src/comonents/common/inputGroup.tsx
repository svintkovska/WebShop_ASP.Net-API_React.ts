import classNames from "classnames";
import { InputHTMLAttributes } from "react";

interface InputGoupProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  field: string;
  touched?: boolean | null;
  error?: string | null;
  type?:
    | "text"
    | "email"
    | "password"
    | "file"
    | "number"
    | "hidden"
    | "string";
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputGroup: React.FC<InputGoupProps> = ({
  label,
  field,
  touched = null,
  error = null,
  type = "text",
  value,
  onChange,
  ...porps
}: InputGoupProps) => {
  return (
    <div className="mb-3">
      <label htmlFor={field} className="form-label text-info">
        {label}
      </label>
      <input
        type={type}
        className={classNames("form-control", {
          "is-invalid": touched && error,
          "is-valid": touched && !error,
        })}
        id={field}
        name={field}
        value={value}
        onChange={onChange}
      />
      {touched && error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default InputGroup;