import React, {useState} from 'react';
import moment from 'moment';
import {convertMsToHM, dateFormat, getMsInCity} from "./date";
import useSWR from 'swr'
import DiscreteSliderLabel from "./DiscreteSliderLabel";
import create from "zustand";
import ClassicRoutesView from "./ClassicRoutesView/ClassicRoutesView";
import ResultRoutes, {IBindingRoutes} from "./ResultRoutes/ResultRoutes";

// @ts-ignore
export const appStore = create((set) => ({
  staying: 60,
  setStaying: (minutes: any) => set(
    (state: any) => ({...state, staying: minutes})
  ),
}))

export interface IRoute {
  from: string;
  to: string;
  // '2022-12-28T07:22:00+03:00'
  departure: string; // убытие
  arrival: string; // прибытие
}

// @ts-ignore
const BindingRoute = ({straight, reversed, msInCity}) => {
  const cityTimeString = convertMsToHM(msInCity);

  return (
    <div style={{display: "flex", justifyContent: "space-between"}}>
      <span>В Сочи: {dateFormat(straight.arrival)}</span>
      <span>
          Время в городе: {cityTimeString}
        </span>
      <span>Дома: {dateFormat(reversed.arrival)}</span>
    </div>
  )
}

const getMinMax = (stayingFilterMs: number) => {
  const thirtyMinutesInMs = 30 * 60 * 1000;

  return {
    minimumMs: stayingFilterMs - thirtyMinutesInMs,
    maximumMs: stayingFilterMs + thirtyMinutesInMs,
  }
}

// @ts-ignore
export const Group = ({bindingRoutes, startFrom}) => {
  // @ts-ignore
  const stayingFilterMs = appStore((state) => state.staying) * 60 * 1000;
  const {minimumMs, maximumMs} = getMinMax(stayingFilterMs);

  const bindingRoutesFiltered = bindingRoutes.filter((bindingRoute: IBindingRoutes) => {
    if (bindingRoute.msInCity < minimumMs || bindingRoute.msInCity > maximumMs) {
      return false;
    }

    return true
  })

  if (bindingRoutesFiltered.length < 1) {
    return null
  }

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
            msInCity={binRoute.msInCity}
          />
        ))}
      </div>
    </div>
  );
}

function App() {
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));

  const {data: routes, error, isLoading} = useSWR(
    `api/raspisanie?date=${date}`,
    // @ts-ignore
    (...args: any[]) => fetch(...args).then(res => res.json())
  )
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
      <DiscreteSliderLabel/>
      <br/>
      {isLoading && <div>загрузка...</div>}
      {error && <div>ошибка загрузки</div>}
      {routes &&
        <>
          <ClassicRoutesView routes={routes}/>
          <ResultRoutes routes={routes}/>
        </>
      }
    </div>
  )
}

export default App
