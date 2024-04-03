import {Email} from '@aemforms/af-react-vanilla-components'
import { MapTo } from '@adobe/aem-react-editable-components';

const EmailEditConfig = {
  emptyLabel: 'Email',
  isEmpty(props) {
    return !props;
  },
};
export default MapTo('${appId}/components/adaptiveForm/emailinput')(Email, EmailEditConfig);