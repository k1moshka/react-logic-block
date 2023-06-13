import { createContext } from "react";
import { FieldValidateFunction } from "./useField";

export type FormErrors = {
  [x: string]: string | FormErrors;
};

export type FieldHandler<T = any> = {
  validate?: FieldValidateFunction<T>;
}

export type FormContextType<
  TValues = Record<string, any>,
  TUtil = Record<string, any>
> = {
  values: TValues;
  util: TUtil;
  errors: undefined | FormErrors;
  submitted: boolean;
  hasError: boolean;
  formError: undefined | string;

  change: (path: string, value: any) => void;
  submit: () => Promise<void>;

  registerField: (name: string, handler: FieldHandler) => number;
  unregisterField: (name: string, fieldId: number) => boolean;
};

export const FormContext = createContext<FormContextType>({
  values: {},
  util: {},
  errors: {},
  hasError: false,
  formError: undefined,
  submitted: false,

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  change: (path, value) => {},
  submit: () => Promise.resolve(),

  registerField: (name, handler) => -1,
  unregisterField: (name, fieldId) => true,
});
