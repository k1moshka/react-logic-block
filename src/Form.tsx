import React, { Component } from "react";
import getPath from "lodash/get";
import setPath from "lodash/set";
import merge from "lodash/merge";
import omitBy from "lodash/omitBy";
import Block, {
  reduce,
  fields,
  value,
  BlockFactory,
  BlockInstance,
} from "logic-block";

import {
  FormContext,
  FormErrors,
  FieldHandler,
  FormContextType,
} from "./context";
import { wasPropChanged } from "./util";

type FieldConfig = {
  fields: { [x: string]: FieldHandler };
};

type FormConfig = {
  [x: string]: FieldConfig;
};

type HandlerCallback = (...args: Array<any>) => void;
type Handler = { cancel: () => void; callback: HandlerCallback };
const handler = (cb: HandlerCallback): Handler => {
  let fn: null | HandlerCallback = cb;
  let cancelled = false;

  return {
    cancel: () => {
      cancelled = true;
      fn = null;
    },
    callback: (...args) => {
      if (cancelled) {
        return;
      }
      return fn && fn(...args);
    },
  };
};

type FormBlockInstance<TFormValues, TFormUtil> = {
  values: TFormValues & {
    __util: TFormUtil;
  };
  // eslint-disable-next-line @typescript-eslint/ban-types
  errors: undefined | {} | FormErrors;
  submitErrors: undefined | FormErrors;
  hasError: boolean;
  hasValidationError: boolean;
};

export type FormProps<TFormValues = any> = {
  block: BlockFactory<TFormValues>;
  initialValues?: Partial<TFormValues>;
  children: React.ReactNode;

  validate?: (formValues: TFormValues) => FormErrors | void;
  onSubmit?: (formValues: TFormValues) => void;
  onSubmitFailed?: () => void;
  onSubmitSuccess?: () => void;
};

type State<TFormValues = any, TFormUtil = any> = {
  form: FormBlockInstance<TFormValues, TFormUtil>;
  errors?: FormErrors;
  submitted: boolean;
};

export default class Form<
  TFormValues = any,
  TFormUtil extends FormContextType<
    Record<string, any>,
    Record<string, any>
  > = any
> extends Component<FormProps<TFormValues>, State<TFormValues, TFormUtil>> {
  constructor(props) {
    super(props);

    this.initFormBlock();
    this.blockInstance = this.createBlockInstance(this.props.initialValues);

    this.state = {
      form: this.blockInstance(),
      submitted: false,
    };
  }

  // eslint-disable-next-line react/sort-comp
  __field_id = 0;
  block: BlockFactory<FormBlockInstance<TFormValues, TFormUtil>>;
  blockInstance: BlockInstance<FormBlockInstance<TFormValues, TFormUtil>>;
  config: FormConfig = {};
  updateHandler: Handler;

  componentDidUpdate(prevProps) {
    if (wasPropChanged(this.props, prevProps, "initialValues")) {
      this.blockInstance = this.createBlockInstance(this.props.initialValues);

      this.setState({
        form: this.blockInstance({ values: this.props.initialValues } as any),
      });
    }
    if (wasPropChanged(this.props, prevProps, "block", "utilBlock")) {
      this.initFormBlock();
      this.blockInstance = this.createBlockInstance(this.state.form);

      this.setState({
        form: this.blockInstance(),
      });
    }
  }

  componentWillUnmount() {
    this.updateHandler && this.updateHandler.cancel();
  }

  createBlockInstance(initialData: any) {
    this.updateHandler && this.updateHandler.cancel();
    this.updateHandler = handler((value) => this.setState({ form: value }));
    return this.block(
      { values: initialData },
      { handleUpdate: this.updateHandler.callback }
    );
  }

  initFormBlock = () => {
    this.block = Block({
      values: this.props.block,

      submitErrors: value({}),

      validationErrors: fields<
        // eslint-disable-next-line @typescript-eslint/ban-types
        FormErrors | {} | undefined,
        [values: TFormValues]
      >(this.validate, ["values"]),

      errors: reduce(({ validationErrors, submitErrors }) => {
        return merge({}, validationErrors, submitErrors);
      }),

      hasError: fields<boolean, [undefined | FormErrors]>(
        (errors) =>
          typeof errors === "object" && Object.keys(errors).length > 0,
        ["errors"]
      ),

      hasValidationError: fields<boolean, [undefined | FormErrors]>(
        (errors) =>
          typeof errors === "object" && Object.keys(errors).length > 0,
        ["validationErrors"]
      ),
    });
  };

  getContextValue = (): FormContextType<
    Omit<TFormValues, "__util">,
    TFormUtil
  > => {
    const {
      form: {
        values: { __util: util, ...values },
        errors,
        hasError,
      },
      submitted,
    } = this.state;

    return {
      registerField: this.registerField,
      unregisterField: this.unregisterField,

      values,
      util,
      errors,
      hasError,
      submitted,

      formError: getPath(errors, "formError"),
      change: this.updateForm,
      update: this.updateValuesBlock,
      submit: this.submit,
    };
  };

  registerField = (name: string, field: FieldHandler) => {
    const fieldConfig = this.config[name] || { fields: {} };
    const id = ++this.__field_id;

    this.config[name] = {
      ...fieldConfig,

      fields: {
        ...fieldConfig.fields,
        [id]: field,
      },
    };

    return id;
  };

  unregisterField = (name: string, fieldId: number) => {
    const fieldConfig = this.config[name];

    if (!fieldConfig) {
      return false;
    }

    delete fieldConfig.fields[fieldId];

    return true;
  };

  validate = (values: TFormValues) => {
    const { validate } = this.props;
    const result = {};

    const s = {
      username: {
        fields: {
          [1]: { validate: () => null },
          [2]: { validate: () => null },
        },
      },
      "extra.password": {
        fields: {},
      },
    };

    for (const fieldName in this.config) {
      const fieldConfig = this.config[fieldName];

      for (const fieldKey in fieldConfig.fields) {
        const field = fieldConfig.fields[fieldKey];

        if (field.validate) {
          const error = field.validate(getPath(values, fieldName));

          if (error) {
            setPath(result, fieldName, error);
            // break on first found error
            break;
          }
        }
      }
    }

    const errors = merge(
      result,
      typeof validate === "function" ? validate(values) : {}
    );

    return omitBy(errors, (v) => typeof v === "undefined");
  };

  selfValidate = () => {
    return new Promise((resolve) => {
      this.setState(
        {
          form: this.blockInstance(
            (v) =>
              ({
                // @ts-expect-error _svaldiate is only for internal usage, and should not be in types
                values: { __svalidate: (v.values.__svalidate ?? 0) + 1 },
              } as any)
          ),
        },
        resolve as () => void
      );
    });
  };

  updateValuesBlock: FormContextType["update"] = (valuesSlice) => {
    this.setState({
      form: this.blockInstance({ values: valuesSlice } as any),
    });
  };

  updateForm = (path, value) => {
    this.setState({
      form: this.blockInstance(setPath({}, `values.${path}`, value)),
    });
  };

  updateUtil = (path: string, value) => {
    this.setState({
      form: this.blockInstance(setPath({}, `values.__util.${path}`, value)),
    });
  };

  submit = async () => {
    await this.selfValidate();

    const {
      form: { values, hasValidationError },
    } = this.state;
    this.setState({ submitted: true });

    if (hasValidationError) {
      return;
    }

    const { onSubmit, onSubmitSuccess, onSubmitFailed } = this.props;

    if (onSubmit) {
      const errors = await onSubmit(values);

      if (typeof errors === "object") {
        this.setState(
          {
            form: this.blockInstance({ submitErrors: errors }),
          },
          onSubmitFailed
        );
      } else {
        onSubmitSuccess && onSubmitSuccess();
      }
    }
  };

  render() {
    return (
      <FormContext.Provider value={this.getContextValue()}>
        {this.props.children}
      </FormContext.Provider>
    );
  }
}
