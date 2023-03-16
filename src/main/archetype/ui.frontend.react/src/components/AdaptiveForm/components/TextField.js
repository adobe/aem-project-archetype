import React, { useState } from 'react';
import { MapTo } from '@adobe/aem-react-editable-components';
import {isEmpty} from '@aemforms/af-core';
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { richTextString, DEFAULT_ERROR_MESSAGE } from '../richTextString';
import { withRuleEngine } from '../RuleEngineHook';


const useStyles = makeStyles((theme) => ({
  formControl: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    minWidth: 200,
  }
}));

const TextFieldComponent = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    id, label, value, required, readOnly = false, properties, placeholder,
    description , visible, format, onChange, onBlur, maxLength, valid, appliedCssClassNames
  } = props;
  const errorMessage = props.errorMessage || DEFAULT_ERROR_MESSAGE;


  const validateState = valid === false ? 'invalid' : ((valid === undefined  || isEmpty(value)) ? undefined : 'valid');
  const error = validateState === 'invalid';
  const { inputType } = properties || {};
  const isVisible = typeof visible === 'undefined' || visible;
  const isPassword = inputType === 'password';
  const classes = useStyles();

  const handleClick = () => {
    setShowPassword(!showPassword)
  };

  const keyChangeFn = (event) => {
    let thisVal = event?.target?.value;
    const textValLen = thisVal?.length;

    if (format === 'date') {
      if (event?.keyCode && event.keyCode !== 8) {
        if (textValLen === 4 || textValLen === 7) {
          thisVal += '-';
          // eslint-disable-next-line no-param-reassign
          event.target.value = thisVal;
        }
      }
    } else if (properties?.format === 'ssn' || properties?.format === 'zip') {
      if (event?.keyCode && event.keyCode !== 8) {
        const zipCheck = properties.format === 'zip' && textValLen === 5;
        const ssnCheck = properties.format === 'ssn' && (textValLen === 3 || textValLen === 7);
        if (ssnCheck || zipCheck) {
          thisVal += '-';
        }
        // eslint-disable-next-line no-param-reassign
        event.target.value = thisVal;
      }
      const newVal = thisVal.replace(/-/g, '');
      onChange(newVal);
      return true;
    }
    onChange(thisVal);
  };

  const handleChange = (event) => {
    const thisVal = event.target.value;
    if (maxLength && thisVal.length === maxLength + 1) {
      return;
    }
    keyChangeFn(event);
  };

  const handleKeyDown = (event) => {
    keyChangeFn(event);
  };

  const handleBlur = (event) => {
    onBlur(event.target.value);
  };

  const getPasswordIcon = () => {
    return (
      <InputAdornment position="end">
        <IconButton
          aria-label="toggle password visibility"
          onClick={handleClick}
        >
          {showPassword ? <Visibility /> : <VisibilityOff />}
        </IconButton>
      </InputAdornment>
    )
  }

  const Cmp = 'outlined' === appliedCssClassNames ? OutlinedInput : Input;

  return isVisible ? (
    <FormControl required={required} error={error} className={classes.formControl}>
      <InputLabel htmlFor={id}>{label?.value}</InputLabel>
      <Cmp
        id={id}
        type={showPassword ? "password" : "text"}
        value={value || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        endAdornment={isPassword ? getPasswordIcon() : null}
        placeholder={placeholder}
        required={required}
        readOnly={readOnly}
      />
      {error && <FormHelperText>{errorMessage}</FormHelperText>}
      {description && !error && <FormHelperText>{richTextString(description)}</FormHelperText>}
    </FormControl>
  ) : null;
}

// wrapper component to wrap adaptive form capabilities
const AdaptiveFormTextInput = (props) => {
  const { handlers, ...state } = props
  return <TextFieldComponent {...state} onChange={handlers?.dispatchChange} onBlur={handlers?.dispatchChange} />;
}
const TextFieldEditConfig = {
  emptyLabel: 'Text Field',
  isEmpty(props) {
    return !props;
  },
};

export default MapTo('${appId}/components/adaptiveForm/textinput')(withRuleEngine(AdaptiveFormTextInput), TextFieldEditConfig);
