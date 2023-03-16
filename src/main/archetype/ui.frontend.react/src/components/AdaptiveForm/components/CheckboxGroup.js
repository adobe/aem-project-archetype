import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
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
const CheckboxGroupComponent = (props) => {
  const {
    label, id, required, enumNames, enum: enums,
    visible, value, onChange, description, valid, name
  } = props;
  const errorMessage = props.errorMessage || DEFAULT_ERROR_MESSAGE;
  const validateState = valid === false ? 'invalid' : ((valid === undefined || isEmpty(value)) ? undefined : 'valid');
  const error = validateState === 'invalid';
  const options = enumNames && enumNames.length ? enumNames : enums || [];
  const isVisible = typeof visible === 'undefined' || visible;
  const valueArr = value == null ? [] : value instanceof Array ? value : [value]
  const classes = useStyles();

  const changeHandler = (event) => {
    const checked = event.target.checked;
    const val = event.target.value;
    let finalVal = [...valueArr];
    if (checked) {
      finalVal.push(val);
    }
    const index = finalVal.findIndex((a) => a === val);
    if (index !== -1 && !checked) {
      finalVal.splice(index, 1);
    }
    onChange(finalVal);
  };

  return isVisible ? (
    <FormControl required={required} error={error} className={classes.formControl}>
      <FormLabel>{label?.value}</FormLabel>
      <FormGroup>
        {
          options.map((opt, index) => (
            <FormControlLabel
              key={enums[index]}
              control={<Checkbox color="primary" name={name} value={enums[index]} checked={valueArr.includes(enums[index])} onChange={changeHandler} />}
              label={opt}
            />
          ))
        }
      </FormGroup>
      {error && <FormHelperText>{errorMessage}</FormHelperText>}
      {description && !error && <FormHelperText>{richTextString(description)}</FormHelperText>}
    </FormControl>
  ) : null;
}

// wrapper component to wrap adaptive form capabilities
const AdaptiveFormCheckboxGroup = (props) => {
  const { handlers, ...state } = props
  return <CheckboxGroupComponent {...state} onChange={handlers?.dispatchChange} />;
}
const CheckboxGroupEditConfig = {
  emptyLabel: 'Checkbox Group',
  isEmpty(props) {
    return !props;
  },
};
export default MapTo('${appId}/components/adaptiveForm/checkboxgroup')(withRuleEngine(AdaptiveFormCheckboxGroup), CheckboxGroupEditConfig);
