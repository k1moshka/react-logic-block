/* eslint-disable no-unused-vars */
import { createContext } from 'react'
import { type FormContextType } from './types'

export const FormContext = createContext({
  values: {},
  util: {},
  errors: {},
  hasError: false,
  formError: undefined,
  submitted: false,

  change: (path, value) => {},
  submit: () => Promise.resolve(),


  registerField: (name, handler) => -1,
  unregisterField: (name, fieldId) => true
})
