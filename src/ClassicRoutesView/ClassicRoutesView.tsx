import React, {FC} from 'react';
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails";
import {OriginalRoutesTable} from "../OriginalRoutesTable";
import {appStore, IRoute} from '../App';

export interface IApiRoutes {
  straightRoutes: IRoute[];
  reversedRoutes: IRoute[];
}

interface ClassicRoutesViewProps {
}

const ClassicRoutesView: FC<ClassicRoutesViewProps> = () => {
  // @ts-ignore
  const routes = appStore((state) => state.stateRoutes);

  return (
  <Accordion>
    <AccordionSummary
      expandIcon={<ExpandMoreIcon/>}
      aria-controls="panel1a-content"
      id="panel1a-header"
    >
      <Typography>туда-обратно</Typography>
    </AccordionSummary>
    <AccordionDetails>
      <OriginalRoutesTable routes={routes.straightRoutes} name={'straightRoutes'}/>
      <OriginalRoutesTable routes={routes.reversedRoutes} name={'reversedRoutes'}/>
    </AccordionDetails>
  </Accordion>
)};

export default ClassicRoutesView;
