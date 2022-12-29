import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {convertMsToHM, dateFormat} from "./date";
import useSWR from 'swr'

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

// @ts-ignore
const OriginalRoutesTable = ({routes, name = 'no-name'}) => {
  return (
    <table id={name}>
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

// @ts-ignore
const fetcher = (...args: any[]) => fetch(...args).then(res => res.json())

function App() {
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));

  const {data: routes, error, isLoading} = useSWR(`api/raspisanie?date=${date}`, fetcher)
  if (routes) {
    const firstComing = routes.straightRoutes[0].arrival;
    routes.reversedRoutes = routes.reversedRoutes.filter((route: any) => new Date(route.departure) > new Date(firstComing));
  }

  return (
    <div className="App">
      <div className={'control-row'}>
        <span>Дата: {date}</span>
        <button style={{background: '#f3e3e3'}} onClick={() => setDate(moment().add(1, 'd').format('YYYY-MM-DD'))}>
          Завтра
        </button>
        <button style={{background: '#f3e3e3'}} onClick={() => setDate(moment().format('YYYY-MM-DD'))}>
          Сегодня
        </button>
      </div>
      <br/>
      {isLoading && <div>загрузка...</div>}
      {error && <div>ошибка загрузки</div>}
      {routes &&
        <>
          <div className={'tablesTitle'}>
            <span>Туда</span>
            <span>Обратно</span>
          </div>
          <OriginalRoutesTable routes={routes.straightRoutes} name={'straightRoutes'}/>
          <OriginalRoutesTable routes={routes.reversedRoutes} name={'reversedRoutes'}/>
          <ResultRoutes routes={routes}/>
        </>
      }
    </div>
  )
}

export default App
