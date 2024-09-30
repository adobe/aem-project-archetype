import {DropDown} from '@aemforms/af-react-vanilla-components'
import { MapTo } from '@adobe/aem-react-editable-components';

const DropDownEditConfig = {
  emptyLabel: 'Drop Down',
  isEmpty(props) {
    return !props;
  },
};
export default MapTo('${appId}/components/adaptiveForm/dropdown')(DropDown, DropDownEditConfig);