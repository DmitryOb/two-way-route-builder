import React, {FC} from 'react';
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails";
import {OriginalRoutesTable} from "../OriginalRoutesTable";
import {IRoute} from '../App';


export interface IApiRoutes {
  straightRoutes: IRoute[];
  reversedRoutes: IRoute[];
}

interface ClassicRoutesViewProps {
  routes: IApiRoutes
}

const ClassicRoutesView: FC<ClassicRoutesViewProps> = ({routes}) => (
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
);

export default ClassicRoutesView;
