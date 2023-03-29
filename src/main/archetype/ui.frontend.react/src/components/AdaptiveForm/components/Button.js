import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { MapTo } from '@adobe/aem-react-editable-components';
import { withRuleEngine } from '../RuleEngineHook';

const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  }
}));

// Customer's component
const ButtonComponent = (props) => {
  const classes = useStyles();
  const { label, enabled, visible, onClick } = props;
  const isVisible = typeof visible === 'undefined' || visible;
  const isEnabled = enabled === false ? false : true;
  return isVisible ? (
    <Button
      variant="contained"
      color="primary"
      size="medium"
      onClick={onClick}
      className={classes.button}
      disabled={!isEnabled}
    >
      {label?.value}
    </Button>
  ) : null;

}

// wrapper component to wrap adaptive form capabilities
const AdaptiveFormButton = (props) => {
  const { handlers, ...state } = props
  return <ButtonComponent {...state} onClick={handlers?.dispatchClick} />;
}
const ButtonEditConfig = {
  emptyLabel: 'Button',
  isEmpty(props) {
    return !props;
  },
};
export default MapTo(['${appId}/components/adaptiveForm/button', '${appId}/components/adaptiveForm/actions/submit', '${appId}/components/adaptiveForm/actions/reset'])(withRuleEngine(AdaptiveFormButton), ButtonEditConfig);
