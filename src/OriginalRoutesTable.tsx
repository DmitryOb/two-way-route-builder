import {dateFormat} from "./date";
import React, {FC} from "react";
import {IRoute} from "./App";

enum EnumNameDictionary {
  straightRoutes = 'Туда',
  reversedRoutes = 'Обратно',
}

const nameDictionary: Record<string, EnumNameDictionary> = {
  straightRoutes: EnumNameDictionary.straightRoutes,
  reversedRoutes: EnumNameDictionary.reversedRoutes,
}

interface ClassicRoutesViewProps {
  routes: IRoute[];
  name: string;
}

export const OriginalRoutesTable: FC<ClassicRoutesViewProps> = ({routes, name}) => {
  const tableName = nameDictionary[name];

  return (
    <div className={'original-routes-table-wrapper'}>
      {tableName && <div>{tableName}</div>}
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
        {routes.map((route: any) => (
          <tr key={route.from + route.to + route.departureTimeString + route.arrivalTimeString}>
            <td>{route.from}</td>
            <td>{route.to}</td>
            <td>{dateFormat(route.departureTimeString)}</td>
            <td>{dateFormat(route.arrivalTimeString)}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}
