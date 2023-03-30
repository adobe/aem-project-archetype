

import React from 'react';
import { useRuleEngine } from '@aemforms/af-react-renderer';
import { AuthoringUtils } from '@adobe/aem-spa-page-model-manager';

// Wrapper over useRuleEngine hook to interact with adaptive form sdk
export function withRuleEngine(Component) {
  return function WrappedComponent(props) {
    const { isInEditor } = props;
    let convertedProps = { ...props };
    if (!isInEditor) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [state, handlers] = useRuleEngine(props);
      convertedProps = {
        ...convertedProps,
        ...state,
        handlers,
      };
    }
    const isInEditorUpdated = AuthoringUtils.isInEditor();
    const visible = typeof convertedProps.visible === 'undefined' || convertedProps.visible;
    return visible ? <Component isInEditor={isInEditorUpdated} {...convertedProps} /> : null;
  };
}