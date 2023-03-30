import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import { MapTo } from '@adobe/aem-react-editable-components';
import { isEmpty } from '@aemforms/af-core';
import { withRuleEngine } from '../RuleEngineHook';
import { richTextString, DEFAULT_ERROR_MESSAGE } from '../richTextString';

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    minWidth: 200,
  }
}));
// Customer's component
const RadioGroupComponent = (props) => {
  const {
    label, required, enumNames, enum: enums,
    visible, value, onChange, description, valid, name
  } = props;
  const errorMessage = props.errorMessage || DEFAULT_ERROR_MESSAGE;
  const validateState = valid === false ? 'invalid' : ((valid === undefined || isEmpty(value)) ? undefined : 'valid');
  const error = validateState === 'invalid';

  const options = enumNames && enumNames.length ? enumNames : enums || [];
  const isVisible = typeof visible === 'undefined' || visible;
  const classes = useStyles();

  const changeHandler = (event) => {
    onChange(event.target.value);
  };

  return isVisible ? (
    <FormControl required={required} error={error} className={classes.formControl}>
      <FormLabel>{label?.value}</FormLabel>
      <RadioGroup
        name={name}
        value={value}
        onChange={changeHandler}
      >
        {
          options.map((opt, index) => (
            <FormControlLabel value={enums[index]} key={enums[index]} control={<Radio color="primary"/>} label={opt} />
          ))
        }
      </RadioGroup>
      {error && <FormHelperText>{errorMessage}</FormHelperText>}
      {description && !error && <FormHelperText>{richTextString(description)}</FormHelperText>}
    </FormControl>
  ) : null;
}

// wrapper component to wrap adaptive form capabilities
const AdaptiveFormRadioGroup = (props) => {
  const { handlers, ...state } = props
  return <RadioGroupComponent {...state} onChange={handlers?.dispatchChange} />;
}
const RadioGroupEditConfig = {
  emptyLabel: 'Radio Group',
  isEmpty(props) {
    return !props;
  },
};
export default MapTo('${appId}/components/adaptiveForm/radiobutton')(withRuleEngine(AdaptiveFormRadioGroup), RadioGroupEditConfig);
