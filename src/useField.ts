import { useEffect, useMemo, useContext } from "react";
import getPath from "lodash/get";

import { FormContext } from "./context";

export type FieldValidateFunction<T = any> = (value: T) => undefined | string;
export type FieldInput<T = any> = {
  name: string;
  value: T;
  submitted: boolean;
  error: undefined | string;
  onChange: (value: T) => void;
};

export function useField<T>(
  name: string,
  validate?: FieldValidateFunction<T>
): FieldInput<T> {
  const { values, change, errors, submitted, registerField, unregisterField }
    = useContext(FormContext);

  useEffect(() => {
    const fieldId = registerField(name, { validate });

    return () => {
      unregisterField(name, fieldId);
    };
  }, [name, validate, registerField, unregisterField]);

  const value = getPath(values, name);
  const fieldError = useMemo(
    () => getPath(errors, name) as string | undefined,
    [errors, name]
  );

  return useMemo(() => {
    return {
      name,
      value,
      error: fieldError,
      submitted,
      onChange: (value: T) => {
        change(name, value);
      },
    };
  }, [name, value, submitted, fieldError, change]);
}
