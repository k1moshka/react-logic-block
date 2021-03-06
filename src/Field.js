import React from 'react'

import { useField } from './useField'
import { type FieldInput } from './types'

export type FieldProps = {
  input: FieldInput
}

type Props = {
  name: string,
  validate: (value: any) => ?string,
  component: Function
}

export default function Field(props: Props) {
  const { name, component: Component, validate, ...componentProps } = props

  const input = useField(name, validate)

  return (
    <Component {...componentProps} input={input} />
  )
}
