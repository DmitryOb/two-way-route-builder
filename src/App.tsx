import React, {useState} from 'react';
import moment from 'moment';
import {convertMsToHM, dateFormat} from "./date";
import useSWR from 'swr'
import DiscreteSliderLabel from "./DiscreteSliderLabel";
import create from "zustand";
import ClassicRoutesView from "./ClassicRoutesView/ClassicRoutesView";
import ResultRoutes from "./ResultRoutes/ResultRoutes";

// @ts-ignore
export const appStore = create((set) => ({
  staying: 60,
  setStaying: (minutes: any) => set(
    (state: any) => ({...state, staying: minutes})
  ),
  filter: false,
  setFilter: (boolValue: any) => set(
    (state: any) => ({...state, filter: boolValue})
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
export const BindingRoute = ({straight, reversed, msInCity}) => {
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

const SOVHOZ = `s9613229`; // Sovhoz
const SOCHI = `c239`; // Sochi

function App() {
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));

  const {data: routes, error, isLoading} = useSWR(
    `api/raspisanie?date=${date}&from=${SOVHOZ}&to=${SOCHI}`,
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
