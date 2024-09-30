import {Button} from '@aemforms/af-react-vanilla-components';
import { MapTo } from '@adobe/aem-react-editable-components';
const ButtonEditConfig = {
  emptyLabel: 'Button',
  isEmpty(props) {
    return !props;
  },
};
export default MapTo('${appId}/components/adaptiveForm/button')(Button, ButtonEditConfig);