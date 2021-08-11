import { type ComponentType } from 'react'

import { type FieldInput } from './useField'

export type FieldWrapperProps = {
  name: string,
  validate: (value: any) => ?string,
  component: Function
}
export type FieldProps = {
  input: FieldInput
}

declare export var Field: ComponentType<FieldWrapperProps>
