import React from 'react';
import {useEffect, useState} from 'react'
import './App.css'
import moment from 'moment';


function padTo2Digits(num: number) {
  return num.toString().padStart(2, '0');
}

function convertMsToHM(milliseconds: number) {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  seconds = seconds % 60;
  minutes = seconds >= 30 ? minutes + 1 : minutes;
  minutes = minutes % 60;
  hours = hours % 24;

  return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}`;
}

const dateFormat = (date: string) => {
  const toLoc = new Date(date).toLocaleTimeString();
  return toLoc.substring(0, toLoc.length - 3);
}

// @ts-ignore
const RoutesTable = ({routes, name = 'no-name'}) => {

  return (
    <table>
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
        <tr key={route.from + route.to + route.departure + route.arrival}>
          <td>{route.from}</td>
          <td>{route.to}</td>
          <td>{dateFormat(route.departure)}</td>
          <td>{dateFormat(route.arrival)}</td>
        </tr>
      ))}
      </tbody>
    </table>
  );
}

interface IRoute {
  from: string;
  to: string;
  // '2022-12-28T07:22:00+03:00'
  departure: string; // убытие
  arrival: string; // прибытие
}

interface IBindingRoutes {
  straight: IRoute,
  reversed: IRoute,
}

interface IGroup {
  startFrom: any;
  bindingRoutes: IBindingRoutes[]
}

// @ts-ignore
const BindingRoute = ({straight, reversed}) => {
  const [cityTime, setCityTime] = useState('');

  useEffect(() => {
    const date1 = Date.parse(new Date(reversed.departure).toString());
    const date2 = Date.parse(new Date(straight.arrival).toString());
    const msInCity: number = date1 - date2;
    setCityTime(convertMsToHM(msInCity))
  })

  return (
    <div style={{display: "flex", justifyContent: "space-between"}}>
      <span>В Сочи: {dateFormat(straight.arrival)}</span>
      <span>
        Время в городе: {cityTime}
      </span>
      <span>Дома: {dateFormat(reversed.arrival)}</span>
    </div>
  )
}

// @ts-ignore
const Group = ({bindingRoutes, startFrom}) => {
  return (
    <div style={{padding: '20px', border: '1px solid'}}>
      <p>
        Отправление в <span style={{fontSize: '20px'}}>{dateFormat(startFrom)}</span>
      </p>
      <div>
        {bindingRoutes.map((binRoute: IBindingRoutes) => (
          <BindingRoute
            key={binRoute.straight.arrival + binRoute.reversed.arrival}
            reversed={binRoute.reversed}
            straight={binRoute.straight}
          />
        ))}
      </div>
    </div>
  );
}

// @ts-ignore
const ResultRoutes = ({routes}) => {
  const straightRoutes: IRoute[] = routes.straightRoutes;
  const reversedRoutes: IRoute[] = routes.reversedRoutes;

  const resultedGroups: IGroup[] = [];
  for (const straightRoute of straightRoutes) {
    const group = {
      startFrom: straightRoute.departure,
      bindingRoutes: []
    };
    const possibleBackWayRoutes: IRoute[] = reversedRoutes.filter(
      reverseRoute => new Date(reverseRoute.departure) > new Date(straightRoute.arrival)
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

  return (
    <div id={'result-routes'}>
      {resultedGroups.map(group =>
        <Group key={group.startFrom} bindingRoutes={group.bindingRoutes} startFrom={group.startFrom}/>
      )}
    </div>
  )
}

const today = moment().format('YYYY-MM-DD');

function App() {
  const [routes, setRoutes] = useState<any>({
    straightRoutes: [],
    reversedRoutes: [],
  });

  useEffect(() => {
    fetch('api/raspisanie?date=' + today)
      .then(r => r.json())
      .then(routes => {
        const firstComing = routes.straightRoutes[0].arrival;
        routes.reversedRoutes = routes.reversedRoutes
          .filter((route: any) => new Date(route.departure) > new Date(firstComing))
        setRoutes(routes)
      })
  }, [])

  return (
    <div className="App">
      <p>Дата: {today}</p>
      <div className={'tablesTitle'}>
        <span>Туда</span>
        <span>Обратно</span>
      </div>
      <RoutesTable routes={routes.straightRoutes} name={'straightRoutes'}/>
      <RoutesTable routes={routes.reversedRoutes} name={'reversedRoutes'}/>
      <ResultRoutes routes={routes}/>
    </div>
  )
}

export default App
