import { useContext } from "react";

import { FormContext, FormContextType } from "./context";

export function useForm<
  TFormValues = Record<string, any>,
  TFormUtil = Record<string, any>
>() {
  return useContext(FormContext) as FormContextType<TFormValues, TFormUtil>;
}
