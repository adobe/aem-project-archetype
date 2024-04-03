import {NumberField} from '@aemforms/af-react-vanilla-components'
import { MapTo } from '@adobe/aem-react-editable-components';

const NumberFieldEditConfig = {
  emptyLabel: 'Number Input',
  isEmpty(props) {
    return !props;
  },
};
export default MapTo('${appId}/components/adaptiveForm/numberinput')(NumberField, NumberFieldEditConfig);