import React, { type Node, type ComponentType } from 'react'

export type FormProps = {
  block: Function,
  initialValues: Object,
  children: Node,

  validate: (formValues: Object) => ?Object | void,
  onSubmit: (formValues: Object) => *,
  onSubmitFailed: () => *,
  onSubmitSuccess: () => *
}

declare export var Form: ComponentType<FormProps>
