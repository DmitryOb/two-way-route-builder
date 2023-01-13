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

export interface IRouteBE {
  from: string;
  to: string;
  departure: string; // время убытия '2022-12-28T07:22:00+03:00'
  arrival: string; // время прибытия '2022-12-28T07:22:00+03:00'
}

export interface IApiRoutesBE {
  straightRoutes: IRouteBE[];
  reversedRoutes: IRouteBE[];
}

interface ClassicRoutesViewProps {
}

const ClassicRoutesView: FC<ClassicRoutesViewProps> = () => {
  const routes: IApiRoutes = appStore((state) => state.stateRoutes);

  //TODO: если фильтра активен красим в серый те маршруты по которым уже не успеваем
  const filterByPossible = appStore((state) => state.filterByPossible);

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
  )
};

export default ClassicRoutesView;
