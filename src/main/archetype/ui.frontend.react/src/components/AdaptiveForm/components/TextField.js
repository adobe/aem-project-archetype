import { MapTo } from '@adobe/aem-react-editable-components';
import {TextField} from '@aemforms/af-react-vanilla-components';


const TextFieldEditConfig = {
  emptyLabel: 'Text Field',
  isEmpty(props) {
    return !props;
  },
};

export default MapTo('${appId}/components/adaptiveForm/textinput')(TextField, TextFieldEditConfig);