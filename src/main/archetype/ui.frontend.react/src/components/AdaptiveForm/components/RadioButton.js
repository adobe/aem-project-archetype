import {RadioGroup} from '@aemforms/af-react-vanilla-components';
import { MapTo } from '@adobe/aem-react-editable-components';

const RadioGroupEditConfig = {
  emptyLabel: 'Radio Group',
  isEmpty(props) {
    return !props;
  },
};
export default MapTo('${appId}/components/adaptiveForm/radiobutton')(RadioGroup, RadioGroupEditConfig);