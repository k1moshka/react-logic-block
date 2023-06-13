import React from "react";

import { useField, FieldInput } from "./useField";

export type FieldComponentProps<
  T = any,
  TExtraProps = Record<string, any>
> = TExtraProps & {
  input: FieldInput<T>;
};

type Props<TValue = any, TComponentProps = any> = {
  name: string;
  validate?: (value: TValue) => undefined | string;
  component: TComponentProps;
};

export default function Field(props: Props) {
  const { name, component: Component, validate, ...componentProps } = props;

  const input = useField(name, validate);

  return <Component {...componentProps} input={input} />;
}
