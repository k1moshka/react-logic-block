/* eslint-disable no-unused-vars */
import { createContext } from 'react'

export const FormContext = createContext({
  meta: {},
  values: {},
  submit: (data: Object) => {},
  setMeta: (key: string, value: any) => {},
  change: (path: string, value: any): any => {}
})
