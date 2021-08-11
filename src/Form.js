import React, { type Node, Component } from 'react'
import getPath from 'lodash/get'
import setPath from 'lodash/set'
import merge from 'lodash/merge'
import omitBy from 'lodash/omitBy'
import Block, { reduce, fields, value } from 'logic-block'

import { FormContext } from './context'
import { wasPropChanged } from './util'

type FieldHandler = {
  validate: (any) => ?string
}

type FieldConfig = {
  [x: number]: FieldHandler
}

type FormConfig = {
  [x: string]: FieldConfig
}

type Props = {
  block: Block,
  initialValues: Object,
  children: Node,

  validate: (formValues: Object) => ?Object | void,
  onSubmit: (formValues: Object) => *,
  onSubmitFailed: () => *,
  onSubmitSuccess: () => *
}

type State = {
  form: {
    values: Object,
    util: Object
  },
  errors: Object
}

type Handler = { cancel: Function, callback: Function }
const handler = (cb) => {
  let fn = cb
  let cancelled = false

  return {
    cancel: () => {
      cancelled = true
      fn = null
    },
    callback: (...args) => {
      if (cancelled) {
        return
      }
      return fn && fn(...args)
    }
  }
}

export default class Form extends Component<Props, State> {
  constructor(props) {
    super(props)

    this.initFormBlock()
    this.blockInstance = this.createBlockInstance(this.props.initialValues)

    this.state = {
      form: this.blockInstance()
    }
  }

  // eslint-disable-next-line react/sort-comp
  __field_id = 0
  block: Block
  blockInstance: Function
  config: FormConfig = {}
  updateHandler: Handler

  componentDidUpdate(prevProps) {
    if (wasPropChanged(this.props, prevProps, 'initialValues')) {
      this.blockInstance = this.createBlockInstance(this.props.initialValues)

      this.setState({
        form: this.blockInstance({ values: this.props.initialValues })
      })
    }
    if (wasPropChanged(this.props, prevProps, 'block', 'utilBlock')) {
      this.initFormBlock()
      this.blockInstance = this.createBlockInstance(this.state.form)

      this.setState({
        form: this.blockInstance()
      })
    }
  }

  componentWillUnmount() {
    this.updateHandler && this.updateHandler.cancel()
  }

  createBlockInstance(initialData) {
    this.updateHandler && this.updateHandler.cancel()
    this.updateHandler = handler((value) => this.setState({ form: value }))
    return this.block({ values: initialData }, { handleUpdate: this.updateHandler.callback })
  }

  initFormBlock = () => {
    this.block = Block({
      values: this.props.block,

      submitErrors:
        value({}),

      validationErrors:
        fields(this.validate, ['values']),

      errors:
        reduce(({ validationErrors, submitErrors }) => {
          return merge(
            {},
            validationErrors,
            submitErrors
          )
        }),

      hasError:
        fields(
          errors => typeof errors === 'object' && Object.keys(errors).length > 0,
          ['errors']
        ),

      hasValidationError:
        fields(
          errors => typeof errors === 'object' && Object.keys(errors).length > 0,
          ['validationErrors']
        )
    })
  }

  getContextValue = () => {
    const { form: { values: { __util: util, ...values }, errors, hasError } } = this.state

    return {
      registerField: this.registerField,
      unregisterField: this.unregisterField,

      values,
      util,
      errors,
      hasError,

      formError: getPath(errors, 'formError'),
      change: this.updateForm,
      submit: this.submit
    }
  }

  registerField = (name: string, field: FieldHandler) => {
    const fieldConfig = this.config[name] || { fields: {} }
    const id = ++this.__field_id

    this.config[name] = {
      ...fieldConfig,

      fields: {
        ...fieldConfig.validators,
        [id]: field
      }
    }

    return id
  }

  unregisterField = (name: string, fieldId: number) => {
    const fieldConfig = this.config[name]

    if (!fieldConfig) {
      return false
    }

    delete fieldConfig.fields[fieldId]

    return true
  }

  validate = (values: Object) => {
    const { validate } = this.props
    const result = {}

    for (const fieldName in this.config) {
      const fieldConfig = this.config[fieldName]

      for (const fieldKey in fieldConfig.fields) {
        const field = fieldConfig.fields[fieldKey]

        if (field.validate) {
          const error = field.validate(getPath(values, fieldName))

          if (error) {
            setPath(result, fieldName, error)
            // break on first found error
            break
          }
        }
      }
    }

    const errors = merge(
      result,
      typeof validate === 'function' ? validate(values) : {}
    )

    return omitBy(errors, v => typeof v === 'undefined')
  }

  updateForm = (path, value) => {
    this.setState({
      form: this.blockInstance(setPath({}, `values.${path}`, value))
    })
  }

  updateUtil = (path: string, value) => {
    this.setState({
      form: this.blockInstance(setPath({}, `util.${path}`, value))
    })
  }

  submit = async () => {
    const { form: { values, hasValidationError } } = this.state
    if (hasValidationError) {
      return
    }

    const { onSubmit, onSubmitSuccess, onSubmitFailed } = this.props

    if (onSubmit) {
      const errors = await onSubmit(values)

      if (typeof errors === 'object') {
        this.setState({
          form: this.blockInstance({ submitErrors: errors })
        }, onSubmitFailed)
      } else {
        onSubmitSuccess && onSubmitSuccess()
      }
    }
  }

  render() {
    return (
      <FormContext.Provider value={this.getContextValue()}>
        {this.props.children}
      </FormContext.Provider>
    )
  }
}
