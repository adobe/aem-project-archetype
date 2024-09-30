import {DateInput} from '@aemforms/af-react-vanilla-components'
import { MapTo } from '@adobe/aem-react-editable-components';

const DateInputEditConfig = {
  emptyLabel: 'Date Picker',
  isEmpty(props) {
    return !props;
  },
};
export default MapTo('${appId}/components/adaptiveForm/datepicker')(DateInput, DateInputEditConfig);