// @ts-ignore
import {dateFormat} from "./date";
import React from "react";

const nameDictionary = {
  straightRoutes: 'Туда',
  reversedRoutes: 'Обратно',
}

// @ts-ignore
export const OriginalRoutesTable = ({routes, name = 'no-name'}) => {
  // @ts-ignore
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
