import React, { FC } from 'react';
import {Group, IRoute} from "../App";
import { IApiRoutes } from '../ClassicRoutesView/ClassicRoutesView';
import {getMsInCity} from "../date";

const getResultedGroups = (straightRoutes: IRoute[], reversedRoutes: IRoute[]) => {
  const resultedGroups: IGroup[] = [];
  for (const straightRoute of straightRoutes) {
    const group = {
      startFrom: straightRoute.departure,
      bindingRoutes: []
    };
    const possibleBackWayRoutes: IRoute[] = reversedRoutes.filter(
      (reverseRoute: any) => new Date(reverseRoute.departure) > new Date(straightRoute.arrival)
    )
    for (const possibleBackWayRoute of possibleBackWayRoutes) {
      const msInCity = getMsInCity(possibleBackWayRoute.departure, straightRoute.arrival);
      // @ts-ignore
      group.bindingRoutes.push({
        straight: straightRoute,
        reversed: possibleBackWayRoute,
        msInCity,
      })
    }
    resultedGroups.push(group);
  }

  return resultedGroups;
}

interface ResultRoutesProps {
  routes: IApiRoutes
}

export interface IBindingRoutes {
  straight: IRoute,
  reversed: IRoute,
  msInCity: number,
}

interface IGroup {
  startFrom: any;
  bindingRoutes: IBindingRoutes[]
}

const ResultRoutes: FC<ResultRoutesProps> = ({routes}) => {
  const straightRoutes = routes.straightRoutes;
  const reversedRoutes = routes.reversedRoutes;

  const resultedGroups: IGroup[] = getResultedGroups(straightRoutes, reversedRoutes);

  return (
    <div id={'result-routes'}>
      {resultedGroups.map(group =>
        <Group key={group.startFrom} bindingRoutes={group.bindingRoutes} startFrom={group.startFrom}/>
      )}
    </div>
  )
}

export default ResultRoutes;
