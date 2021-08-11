import { type FieldHandler } from './FieldHandler'

export type FormContextType = {
  values: Object,
  util: Object,
  errors: Object,
  hasError: boolean,
  formError: ?string,

  change: (path: string, value: any) => void,
  submit: () => Promise<void>,


  registerField: (name: string, handler: FieldHandler) => number,
  unregisterField: (name: string, fieldId: number) => boolean
}
