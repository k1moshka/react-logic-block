import { useEffect, useMemo, useContext } from 'react'
import getPath from 'lodash/get'

import { FormContext } from './context'

export type FieldInput = {
  name: string,
  value: any,
  error?: ?string,
  onChange: Function
}

export default function useField(name: string, validate: Function): FieldInput {
  const { values, change, errors, registerField, unregisterField } = useContext(FormContext)

  useEffect(() => {
    const fieldId = registerField(name, { validate })

    return () => unregisterField(name, fieldId)
  }, [name, validate, registerField, unregisterField])

  const value = getPath(values, name)
  const fieldError = useMemo(() => getPath(errors, name), [errors, name])

  return useMemo(() => {
    return {
      name,
      value,
      error: fieldError,
      onChange: (value: any) => {
        change(name, value)
      }
    }
  }, [name, value, fieldError, change])
}