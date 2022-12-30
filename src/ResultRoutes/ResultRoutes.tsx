import React, { FC } from 'react';
import {Group, IGroup, IRoute} from "../App";
import { IApiRoutes } from '../ClassicRoutesView/ClassicRoutesView';

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
      // @ts-ignore
      group.bindingRoutes.push({
        straight: straightRoute,
        reversed: possibleBackWayRoute,
      })
    }
    resultedGroups.push(group);
  }

  return resultedGroups;
}

interface ResultRoutesProps {
  routes: IApiRoutes
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
