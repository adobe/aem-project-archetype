import { MapTo, ResponsiveGrid } from '@adobe/aem-react-editable-components';
import React from 'react';

const Panel = (props)=>{
  console.log({props});
  return (
    <div className='cmp-container'>
        <label className='cmp-container__label' >{props?.label?.value}</label>
        <div>
          <ResponsiveGrid config={PanelEditConfig} {...props} />
        </div>
    </div>
)}
const PanelEditConfig = {
  emptyLabel: 'Adaptive Form Panel',
  isEmpty(props) {
    return props.cqItems == null || props.cqItems.length === 0;
  },
};

export default MapTo('${appId}/components/adaptiveForm/panelcontainer')(Panel, PanelEditConfig);