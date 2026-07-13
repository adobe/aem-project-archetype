import React, { useEffect, useState } from 'react';
import { MapTo, ResponsiveGrid } from '@adobe/aem-react-editable-components';
import { createFormInstance } from '@aemforms/af-core';
import { FormContext } from '@aemforms/af-react-renderer';
import {AuthoringUtils} from "@adobe/aem-spa-page-model-manager";

// importing the default canvas theme css
import '@aemforms/af-canvas-theme/dist/theme.css';

// edit config
const FormContainerEditConfig = {
  emptyLabel: 'Adaptive Form Container',
  isEmpty(params) {
    return params.cqItems == null || params.cqItems.length === 0;
  },
};

const AdaptiveFormContainer = (formJson) => {
  const [state, setState] = useState(null);
  const isInEditor = AuthoringUtils.isInEditor();
  // if form json changes, execute this code (written to support re-render of container in both authoring and at runtime)
  useEffect(() => {
    const form = createFormInstance({ ...formJson })
    const localState = { model: form, id: form.getUniqueId() };
    // if in editor, update the new state as per the editor json received
    if (isInEditor && state?.model) {
      setState(localState);
    } else if (!state?.model) {
      // if there is no model initially, initialize the new state
      setState(localState);
    }
    let afPath = form?.properties?.['fd:path'];
    // submit success handler
    form.subscribe((action) => {
      const body = action.payload?.body;
      if (body) {
        if (body.redirectUrl) {
          window.location.href = body.redirectUrl;
        } else if (body.thankYouMessage) {
          const formContainerElement = document.querySelector(`[data-cmp-path='${afPath}']`);
          const thankYouMessage = document.createElement('div');
          thankYouMessage.setAttribute('class', 'tyMessage');
          thankYouMessage.innerHTML = body.thankYouMessage;
          formContainerElement.replaceWith(thankYouMessage);
        } else {
          // if anything else, then it should be an error
          window.alert('Error during form submission'); // todo localize this
        }
      }
    }, 'submitSuccess');

    // submit error handler
    form.subscribe((action) => {
      const defaultSubmissionError = 'Error during form submission'; // todo localize this
      window.alert(defaultSubmissionError);
    }, 'submitError');

  }, [formJson]);

  if (!state) {
    return null;
  }
  const formState = state?.model?.getState();
  const formPath = formState?.properties?.['fd:path'];
  return (
    <FormContext.Provider value={{ form: state.model, modelId: state.model.id }}>
      <form data-cmp-path={formPath} data-cmp-is="adaptiveFormContainer">
        {formState?.label?.value ? <h2>{formState.label.value}</h2> : null}
        <ResponsiveGrid config={FormContainerEditConfig} {...formState} />
      </form>
    </FormContext.Provider>
  );
}

export default MapTo('${appId}/components/adaptiveForm/formcontainer')(AdaptiveFormContainer, FormContainerEditConfig);