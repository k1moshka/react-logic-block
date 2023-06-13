# react-logic-block
Utils and components for using logic-block in react apps.

## Typescript
The library originally written in typescript, so it fully support typescript.
Provided types:
- FieldValidateFunction
- FieldInput
- FieldComponentProps
- FormErrors
- FormContextType
- FormProps
- Form

The `Form` component implemented with generics, it is pretty cool to use it with it.
```typescript
//block description
type FormValues = { data: string; };
type FormUtil = { calcDataHash: () => string; };
const SomeBlock = Block<FormValues, FormUtil>({ ... });

//... at some component
<Form<FormValues, FormUtil> block={SomeBlock}>

</Form>
```

## Form API

Content:
+ [Form](#form)
+ [Field](#field)
+ [useForm](#useform)
+ [useField](#usefield)
+ [FormContext](#formcontext)

### Form
Form is a wrapper component for you fields. Form provides block values and some handy meta data for form, all values are provided via `useForm` hook or `FormContext`

#### **Props:**
| Name            | Type                         | Optional? | Description                                                                                                                                          |
| --------------- | ---------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| block           | `BlockFactory`               | Mandatory | Block which will use for handling form values                                                                                                        |
| initialValues   | `Partial<TFormValues>`       | Optional  | Initial values for form. Be carefull, if `initialValues` changes during life-time the component will re-render this new initialValues to form values |
| children        | `React.Node`                 | Optional  | Any react components for rendering form. All nested components can use `FormContext`, `Field` and `useField` utils                                   |
| validate        | `(values: Object) => Object` | Optional  | Validation function, returns object with errors. Keys for errors should be the same as keys for invalid values in values parameter of that function  |
| onSubmit        | `(values: Object) => void`   | Optional  | Callback of form submit action, in that moment values passed all validations                                                                         |
| onSubmitFailed  | `() => void`                 | Optional  | Callback for failed submit action                                                                                                                    |
| onSubmitSuccess | `() => void`                 | Optional  | Callback for successful submit action (Invokes once after submit action call)                                                                        |

### Field
Field is a wrapper component for inputs or any other component that should be able to change form values. All extra props to the component will pass to rendering `component`

#### **Props:**
| Name      | Type                            | Optional? | Description                               |
| --------- | ------------------------------- | --------- | ----------------------------------------- |
| name      | `string`                        | Mandatory | The path to form value (field)            |
| component | `React.Component`               | Mandatory | Component that will be rendered for field |
| validate  | `(fieldValue: any) => undefined | string`   | Optional                                  | Field level validation function. It applies only field value on every change of field. Use for validation statically defined function, don't construct function in render body of a component |

### useForm
React hook for gettings all the utilities for the form in which component wrapped. This hook does not apply any arguments, and returns the `FormContext` values.
```typescript
// ...
const {
  values,
  util,
  submit,
  // ...etcs
} = useForm();
// ...
```


### useField
React hook for field rendering functional component

#### **Arguments:**
| Name     | Type                            | Optional? | Description                    |
| -------- | ------------------------------- | --------- | ------------------------------ |
| name     | `string`                        | Mandatory | The path to form value (field) |
| validate | `(fieldValue: any) => undefined | string`   | Optional                       | Field level validation function. It applies only field value on every change of field. Use for validation statically defined function, don't construct function in render body of a component |

### FormContext
Context of current form

#### **Values:**
| Name            | Type                                            | Description                                                                            |
| --------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------- |
| values          | `TFormValues extends Object`                    | Current values of form                                                                 |
| util            | `TFormUtil extends Object`                      | Current util values of form                                                            |
| errors          | `Object`                                        | Current errors of form                                                                 |
| hasError        | `boolean`                                       | Shows if form has any error                                                            |
| formError       | `undefined                                      | string`                                                                                | Message of the form error |
| submitted       | `boolean`                                       | Shows if the form where successfully submitted                                         |
| change          | `(fieldName: string, value: any) => void`       | Change field value function                                                            |
| submit          | `() => void`                                    | Submit action function                                                                 |
| registerField   | `(name: string, field: FieldHandler) => number` | Registering field function. Custom field component should be registered on mount       |
| unregisterField | `(name: string, fieldId: number) => boolean`    | Unregistering field function. Custom field component should be unregistered on unmount |


## Author
[Ilya Melishnikov](https://www.linkedin.com/in/ilya-melishnikov/)

## LICENSE
[MIT](./LICENSE.md)

