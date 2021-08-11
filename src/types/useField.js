export type FieldValidateFunction = (any) => ?string
export type FieldInput<T> = {
  name: string,
  value: T,
  error: ?string,
  onChange: (value: T) => void
}

declare export function useField<T>(name: string, validate: FieldValidateFunction<T>): FieldInput<T>
