# react-logic-block
Utils and components for using logic-block in react apps.


## Form API

Content:
+ [Form](#form)
+ [Field](#field)
+ [useField](#usefield)
+ [FormContext](#formcontext)

### Form
Form is a wrapper component for you fields. Form provides block values and some handy meta data for form, all values provides via `FormContext`

#### **Props:**
| Name            | Type                         | Optional? | Description                                                                                                                                          |
| --------------- | ---------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| block           | `BlockFactory`               | Mandatory | Block which will use for handling form values                                                                                                        |
| initialValues   | `Object`                     | Optional  | Initial values for form. Be carefull, if `initialValues` changes during life-time the component will re-render this new initialValues to form values |
| children        | `React.Node`                 | Optional  | Any react components for rendering form. All nested components can use `FormContext`, `Field` and `useField` utils                                   |
| validate        | `(values: Object) => Object` | Optional  | Validation function, returns object with errors. Keys for errors should be the same as keys for invalid values in values parameter of that function  |
| onSubmit        | `(values: Object) => void`   | Optional  | Callback of form submit action, in that moment values passed all validations                                                                         |
| onSubmitFailed  | `Function`                   | Optional  | Callback for failed submit action                                                                                                                    |
| onSubmitSuccess | `Function`                   | Optional  | Callback for successful submit action (Invokes once after submit action call)                                                                        |

### Field
Field is a wrapper component for inputs or any other component that should be able to change form values. All extra props to the component will pass to rendering `component`

#### **Props:**
| Name      | Type                           | Optional? | Description                                                                                                                                                                                   |
| --------- | ------------------------------ | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name      | `string`                       | Mandatory | The path to form value (field)                                                                                                                                                                |
| component | `React.Component`              | Mandatory | Component that will be rendered for field                                                                                                                                                     |
| validate  | `(fieldValue: any) => ?string` | Optional  | Field level validation function. It applies only field value on every change of field. Use for validation statically defined function, don't construct function in render body of a component |

### useField
React hook for field rendering functional component

#### **Arguments:**
| Name     | Type                           | Optional? | Description                                                                                                                                                                                   |
| -------- | ------------------------------ | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name     | `string`                       | Mandatory | The path to form value (field)                                                                                                                                                                |
| validate | `(fieldValue: any) => ?string` | Optional  | Field level validation function. It applies only field value on every change of field. Use for validation statically defined function, don't construct function in render body of a component |

### FormContext
Context of current form

#### **Values:**
| Name            | Type                                            | Description                                                                            |
| --------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------- |
| values          | `Object`                                        | Current values of form                                                                 |
| util            | `Object`                                        | Current util values of form                                                            |
| errors          | `Object`                                        | Current errors of form                                                                 |
| hasError        | `boolean`                                       | Shows if form has any error                                                            |
| formError       | `?string`                                       | Message of the form error                                                              |
| change          | `(fieldName: string, value: any) => void`       | Change field value function                                                            |
| submit          | `Function`                                      | Submit action function                                                                 |
| registerField   | `(name: string, field: FieldHandler) => number` | Registering field function. Custom field component should be registered on mount       |
| unregisterField | `(name: string, fieldId: number) => boolean`    | Unregistering field function. Custom field component should be unregistered on unmount |


## Author
[Ilya Melishnikov](https://www.linkedin.com/in/ilya-melishnikov/)

## LICENSE
[MIT](./LICENSE.md)

