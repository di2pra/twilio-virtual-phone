import { useState, useCallback, useEffect } from 'react';

function isEmpty(obj: any) {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
}

export interface FormSchema {
  [key: string]: {
    value: string;
    errorMessage: string;
    isInvalid: boolean;
  };
}

export interface ValidationSchema {
  [key: string]: {
    required: boolean;
    validator?: {
      regEx: RegExp;
      errorMessage: string;
    },
    resetAfterSubmit?: boolean,
    isEqualTo?: string;
    hasToMatch?: {
      value: string;
      errorMessage: string;
    }
  };
}

const useFormValidation = (
  stateSchema: FormSchema,
  validationSchema: ValidationSchema = {},
  callback: (state: FormSchema) => void,
  resetForm: boolean
) => {

  const [state, setState] = useState<FormSchema>(stateSchema);

  useEffect(() => {
    setState(stateSchema);
  }, [resetForm])

  // Used to disable submit button if there's an error in state
  // or the required field in state has no value.
  // Wrapped in useCallback to cached the function to avoid intensive memory leaked
  // in every re-render in component
  const validateState = useCallback(() => {

    let newState = {};

    const hasErrorInState = Object.keys(validationSchema).map(key => {
      const isInputFieldRequired = validationSchema[key].required;
      const stateValue = state[key].value; // state value
      const stateIsInvalid = state[key].isInvalid; // state error

      if (isInputFieldRequired && !stateValue && !stateIsInvalid) {

        newState = {
          ...newState,
          [key]: {
            value: stateValue,
            errorMessage: 'Ce champs est obligatoire.',
            isInvalid: true
          }
        } as FormSchema

      }

      return (isInputFieldRequired && !stateValue) || stateIsInvalid;
    });


    if (!isEmpty(newState)) {

      // update the current state with the new one
      setState(prevState => ({
        ...prevState,
        ...newState
      }));

    }


    return hasErrorInState.includes(true);

  }, [state, validationSchema]);



  // Used to handle every changes in every input
  const handleOnChange = useCallback(
    event => {

      const name = event.target.name;
      const value = event.target.value;

      let errorMessage = '';

      // equal match validation
      if (typeof validationSchema[name].hasToMatch === "object") {
        if (
          state[validationSchema[name].hasToMatch!.value].value !== '' &&
          state[validationSchema[name].hasToMatch!.value].value !== value
        ) {
          errorMessage = validationSchema[name].hasToMatch!.errorMessage;
        }
      }

      // regex validation
      if (typeof validationSchema[name].validator === 'object') {
        if (value && !validationSchema[name].validator!.regEx.test(value)) {
          errorMessage = validationSchema[name].validator!.errorMessage;
        }
      }

      let newState = {
        [name]: {
          value: value,
          errorMessage: errorMessage,
          isInvalid: (errorMessage !== '')
        }
      }

      // isEqual reset field on update
      if (typeof validationSchema[name].isEqualTo !== "undefined") {

        const inputName = validationSchema[name].isEqualTo!;

        newState = {
          ...newState,
          [inputName]: {}
        }

      }

      setState(prevState => ({
        ...prevState,
        ...newState
      }));


    },
    [validationSchema, state]
  );

  const handleOnSubmit = useCallback(
    event => {
      event.preventDefault();

      // Make sure that validateState returns false
      // Before calling the submit callback function
      if (!validateState()) {
        callback(state);
      }
    },
    [state, callback, validateState]
  );

  return { state, handleOnChange, handleOnSubmit };
}

export default useFormValidation;