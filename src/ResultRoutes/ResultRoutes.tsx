import React, { FC } from 'react';
import {appStore, BindingRoute, IRoute} from "../App";
import {dateFormat, getMsInCity} from "../date";
import moment from "moment";

const getResultedGroups = (straightRoutes: IRoute[], reversedRoutes: IRoute[]) => {
  const resultedGroups: IGroup[] = [];
  for (const straightRoute of straightRoutes) {
    const group = {
      startFrom: straightRoute.departureTimeString,
      bindingRoutes: []
    };
    const possibleBackWayRoutes: IRoute[] = reversedRoutes.filter(
      (reverseRoute: any) => new Date(reverseRoute.departureTimeString) > new Date(straightRoute.arrivalTimeString)
    )
    for (const possibleBackWayRoute of possibleBackWayRoutes) {
      const msInCity = getMsInCity(possibleBackWayRoute.departureTimeString, straightRoute.arrivalTimeString);
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
}

export interface IBindingRoutes {
  straight: IRoute,
  reversed: IRoute,
  msInCity: number,
}

interface IGroup {
  startFrom: string; // '2023-01-13T22:10:00+03:00'
  bindingRoutes: IBindingRoutes[]
}

const ResultRoutes: FC<ResultRoutesProps> = () => {
  const routes = appStore((state) => state.stateRoutes);
  const resultedGroups: IGroup[] = getResultedGroups(routes.straightRoutes, routes.reversedRoutes);

  const filterByPossibleIsActive = appStore((state) => state.filterByPossible);
  const filteredResultedGroups = !filterByPossibleIsActive ?
    resultedGroups :
    resultedGroups.filter((group: IGroup) => moment().isBefore(group.startFrom));

  return (
    <div className={'result-routes'}>
      {filteredResultedGroups.map(group =>
        <Group key={group.startFrom}
               bindingRoutes={group.bindingRoutes}
               startFrom={group.startFrom}
        />
      )}
    </div>
  )
}

export default ResultRoutes;

export const RANGE_MINUTE = 30;

const getMinMax = (stayingFilterMs: number) => {
  const rangeMinutesInMs = RANGE_MINUTE * 60 * 1000;

  return {
    minimumMs: stayingFilterMs - rangeMinutesInMs,
    maximumMs: stayingFilterMs + rangeMinutesInMs,
  }
}

interface IGroupComponent {
  bindingRoutes: IBindingRoutes[];
  startFrom: string;
}

export const Group: FC<IGroupComponent> = ({bindingRoutes, startFrom}) => {
  const stayingFilterMs = appStore((state) => state.staying) * 60 * 1000;
  const filterBySpendTime = appStore((state) => state.filterBySpendTime);

  const {minimumMs, maximumMs} = getMinMax(stayingFilterMs);

  const bindingRoutesFiltered = bindingRoutes.filter((bindingRoute: IBindingRoutes) => {
    if (!filterBySpendTime) {
      return true
    }
    if (bindingRoute.msInCity < minimumMs || bindingRoute.msInCity > maximumMs) {
      return false;
    }

    return true
  })

  if (bindingRoutesFiltered.length < 1) {
    return null
  }

  return (
    <div className={'result-routes-group'}>
      <p>
        Отправление в <span style={{fontSize: '20px'}}>{dateFormat(startFrom)}</span>
      </p>
      <div>
        {bindingRoutesFiltered.map((binRoute: IBindingRoutes) => (
          <BindingRoute
            key={binRoute.straight.arrivalTimeString + binRoute.reversed.arrivalTimeString}
            reversed={binRoute.reversed}
            straight={binRoute.straight}
            msInCity={binRoute.msInCity}
          />
        ))}
      </div>
    </div>
  );
}
