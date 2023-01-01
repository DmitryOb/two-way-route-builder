import React, {useState} from 'react';
import moment from 'moment';
import {convertMsToHM, dateFormat} from "./date";
import useSWR from 'swr'
import DiscreteSliderLabel from "./DiscreteSliderLabel";
import create from "zustand";
import ClassicRoutesView from "./ClassicRoutesView/ClassicRoutesView";
import ResultRoutes from "./ResultRoutes/ResultRoutes";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

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
const IMERITIN_RESORT = `s9812789`; // Imeretinskiy Kurort

function App() {
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [goesTo, setGoesTo] = useState(SOCHI);

  const {data: routes, error, isLoading} = useSWR(
    `api/raspisanie?date=${date}&from=${SOVHOZ}&to=${goesTo}`,
    // @ts-ignore
    (...args: any[]) => fetch(...args).then(res => res.json())
  )
  if (routes) {
    const firstComing = routes.straightRoutes[0].arrival;
    routes.reversedRoutes = routes.reversedRoutes.filter((route: any) => new Date(route.departure) > new Date(firstComing));
  }

  // показать кнопку если после нажатия на неё дата станет = сегодня или больше чем сегодня

  const isShowBackButton = true;

  return (
    <div className="App">
      <div className={'control-row'}>
        <div className={'control-row-first'}>
          {isShowBackButton &&
            <button onClick={() => {
              setDate(moment(date).subtract(1, 'd').format('YYYY-MM-DD'))
            }}>
              <ArrowBackIosNewIcon fontSize={"small"}/>
            </button>
          }
          <div>
            <span>{date}</span>
            <br/>
            {date === moment().format('YYYY-MM-DD') &&
              <span>Сегодня</span>
            }
          </div>
          <button onClick={() => {
            setDate(moment(date).add(1, 'd').format('YYYY-MM-DD'))
          }}>
            <ArrowForwardIosIcon fontSize={"small"}/>
          </button>
        </div>
        <div>
          <button onClick={() => {
            setGoesTo(IMERITIN_RESORT)
          }}>
            Хочу на курорт!
          </button>
        </div>
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
