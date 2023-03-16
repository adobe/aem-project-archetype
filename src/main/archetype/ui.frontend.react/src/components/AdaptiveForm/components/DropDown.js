import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { MapTo } from '@adobe/aem-react-editable-components';
import {isEmpty} from '@aemforms/af-core';
import { withRuleEngine } from '../RuleEngineHook';
import { richTextString, DEFAULT_ERROR_MESSAGE } from '../richTextString';

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    minWidth: 200,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));
// Customer's component
const DropDownComponent = (props) => {
  const {
    label, id, required, enumNames, enum: enums,
    visible, value, onChange, description, valid, onBlur
  } = props;
  const errorMessage = props.errorMessage || DEFAULT_ERROR_MESSAGE;
  const validateState = valid === false ? 'invalid' : ((valid === undefined  || isEmpty(value)) ? undefined : 'valid');
  const error = validateState === 'invalid';
  
  const dropdownData = enumNames && enumNames.length ? enumNames : enums || [];
  const isVisible = typeof visible === 'undefined' || visible;
  const classes = useStyles();

  const changeHandler = (event) => {
    onChange(event.target.value);
  };

  const handleBlur = (event) => {
    onBlur(event.target.value || '');
  };

  return isVisible ? (
    <FormControl required={required} error={error} className={classes.formControl}>
      <InputLabel id={`${symbol_dollar}{id}-label`}>{label?.value}</InputLabel>
      <Select
        labelId={`${symbol_dollar}{id}-label`}
        id={id}
        value={value}
        onChange={changeHandler}
        onBlur={handleBlur}
        displayEmpty
        className={classes.selectEmpty}
      >
        {
          dropdownData.map((text, index) => (
            <MenuItem value={enums[index]} key={enums[index]}>{text}</MenuItem>
          ))
        }
      </Select>
      {error && <FormHelperText>{errorMessage}</FormHelperText>}
      {description && !error && <FormHelperText>{richTextString(description)}</FormHelperText>}
    </FormControl>
  ) : null;
}

// wrapper component to wrap adaptive form capabilities
const AdaptiveFormDropDown = (props) => {
  const { handlers, ...state } = props
  const selectedKey = state?.value != null ? `${symbol_dollar}{state.value}` : state.value;
  return <DropDownComponent {...state} selectedKey={selectedKey} onChange={handlers?.dispatchChange} onBlur={handlers?.dispatchChange} />;
}
const DropDownEditConfig = {
  emptyLabel: 'Drop Down',
  isEmpty(props) {
    return !props;
  },
};
export default MapTo('${appId}/components/adaptiveForm/dropdown')(withRuleEngine(AdaptiveFormDropDown), DropDownEditConfig);
