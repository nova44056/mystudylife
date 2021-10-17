import { Field } from "formik";
import React from "react";
import { v4 as uuidv4 } from "uuid";
import css from "./FormikBasicSelectInput.module.css";

interface Option {
  key: any;
  value: any;
  label: string;
}

interface Props {
  label: string;
  name: string;
  options?: Option[];
}

export const FormikBasicSelectInput: React.FC<Props> = ({
  label,
  name,
  options,
  children,
}) => {
  const id = uuidv4();
  const [focused, setFocused] = React.useState(false);

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <div
        style={{
          border: focused ? "1px solid var(--primary)" : "1px solid #e3e3e3",
          marginTop: "0.5rem",
        }}
      >
        <Field
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={css.select}
          as="select"
          name={name}
        >
          {options?.map((option) => (
            <option value={option.value} key={option.key}>
              {option.label}
            </option>
          ))}
        </Field>
        {children}
      </div>
    </div>
  );
};