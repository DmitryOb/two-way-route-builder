import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {convertMsToHM, dateFormat} from "./date";
import useSWR from 'swr'
import {OriginalRoutesTable} from "./OriginalRoutesTable";
import DiscreteSliderLabel from "./DiscreteSliderLabel";
import create from "zustand";

// @ts-ignore
const appStore = create((set) => ({
  staying: 60,
  setStaying: (minutes: any) => set(
    (state: any) => ({...state, staying: minutes})
  ),
}))

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
  const [cityTime, setCityTime] = useState({
    ms: 0,
    string: '',
  });

  // @ts-ignore
  const stayingFilterMs = appStore((state) => state.staying) * 60 * 1000;
  const objFilterMs = {
    min: stayingFilterMs - stayingFilterMs / 100 * 15,
    max: stayingFilterMs + stayingFilterMs / 100 * 15
  }
  const cond1 = cityTime.ms > objFilterMs.min;
  const cond2 = cityTime.ms < objFilterMs.max;

  useEffect(() => {
    const date1 = Date.parse(new Date(reversed.departure).toString());
    const date2 = Date.parse(new Date(straight.arrival).toString());
    const msInCity: number = date1 - date2;
    setCityTime({
      ms: msInCity,
      string: convertMsToHM(msInCity),
    })
  }, [])

  return cond1 && cond2 && (
    <div style={{display: "flex", justifyContent: "space-between"}}>
      <span>В Сочи: {dateFormat(straight.arrival)}</span>
      <span>
          Время в городе: {cityTime.string}
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

// @ts-ignore
const ResultRoutes = ({routes}) => {
  const straightRoutes: IRoute[] = routes.straightRoutes;
  const reversedRoutes: IRoute[] = routes.reversedRoutes;

  const resultedGroups: IGroup[] = getResultedGroups(straightRoutes, reversedRoutes);

  return (
    <div id={'result-routes'}>
      {resultedGroups.map(group =>
        <Group key={group.startFrom} bindingRoutes={group.bindingRoutes} startFrom={group.startFrom}/>
      )}
    </div>
  )
}

// @ts-ignore
const fetcher = (...args: any[]) => fetch(...args).then(res => res.json())

function App() {
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));

  // @ts-ignore
  const setStaying = appStore((state) => state.setStaying);
  const handleSliderChange = (event: any) => {
    setStaying(event.target.value)
  }

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
      <DiscreteSliderLabel onSliderChange={handleSliderChange}/>
      <br/>
      {isLoading && <div>загрузка...</div>}
      {error && <div>ошибка загрузки</div>}
      {routes &&
        <>
          <OriginalRoutesTable routes={routes.straightRoutes} name={'straightRoutes'}/>
          <OriginalRoutesTable routes={routes.reversedRoutes} name={'reversedRoutes'}/>
          <ResultRoutes routes={routes}/>
        </>
      }
    </div>
  )
}

export default App
