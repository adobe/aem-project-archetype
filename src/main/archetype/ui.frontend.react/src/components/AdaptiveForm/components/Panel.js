import React from 'react';
import Grid from '@material-ui/core/Grid';
import { MapTo, ResponsiveGrid } from '@adobe/aem-react-editable-components';
import {withRuleEngine} from "../RuleEngineHook";

const PanelEditConfig = {
  emptyLabel: 'Adaptive Form Panel',
  isEmpty(props) {
    return props.cqItems == null || props.cqItems.length === 0;
  },
};

// Customer's component
const PanelComponent = (props) => {
  return (
    <Grid container>
      <div>{props?.label?.value}</div>
      <ResponsiveGrid config={PanelEditConfig} {...props} />
    </Grid>
  );
}
export default MapTo('${appId}/components/adaptiveForm/panelcontainer')(withRuleEngine(PanelComponent), PanelEditConfig);
