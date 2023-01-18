import React, {FC} from "react";
import {appStore, IRoute} from "./App";
import moment from "moment";

export enum EnumNameDictionary {
  straightRoutes = 'Туда',
  reversedRoutes = 'Обратно',
}

const nameDictionary: Record<string, EnumNameDictionary> = {
  straightRoutes: EnumNameDictionary.straightRoutes,
  reversedRoutes: EnumNameDictionary.reversedRoutes,
}

interface ClassicRoutesViewProps {
  routes: IRoute[];
  name: EnumNameDictionary;
}

export const OriginalRoutesTable: FC<ClassicRoutesViewProps> = ({routes, name}) => {
  const tableName = nameDictionary[name];

  const filterByPossible = appStore((state) => state.filterByPossible);
  const isTooLateForRoute = (route: IRoute): boolean => {
    return filterByPossible && moment().isAfter(route.departureTimeString);
  }

  return (
    <div className={'original-routes-table-wrapper'}>
      <div>{tableName}</div>
      <table id={name} className={'original-routes-table'}>
        <thead>
        <tr>
          <th>Откуда</th>
          <th>Куда</th>
          <th>Убыл</th>
          <th>Прибыл</th>
        </tr>
        </thead>
        <tbody>
        {routes.map((route: IRoute) => (
          <tr style={{opacity: isTooLateForRoute(route) ? '15%' : '100%'}}
              key={route.from + route.to + route.departureTimeString + route.arrivalTimeString}
          >
            <td>{route.from}</td>
            <td>{route.to}</td>
            <td>
              {moment(route.departureTimeString).format('HH:mm')}
            </td>
            <td>
              {moment(route.arrivalTimeString).format('HH:mm')}
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}
