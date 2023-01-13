import React, {useEffect} from 'react';
import moment from 'moment';
import {convertMsToHM, dateFormat} from "./date";
import useSWR from 'swr'
import DiscreteSliderLabel from "./DiscreteSliderLabel";
import create from "zustand";
import ClassicRoutesView, {IApiRoutes, IApiRoutesBE, IRouteBE} from "./ClassicRoutesView/ClassicRoutesView";
import ResultRoutes from "./ResultRoutes/ResultRoutes";
import ControlRow from "./ControlRow/ControlRow";
import {SWRResponse} from "swr/_internal";

const SOVHOZ = `s9613229`; // Sovhoz
const SOCHI = `c239`; // Sochi
export const IMERITIN_RESORT = `s9812789`; // Imeretinskiy Kurort

// @ts-ignore
export const appStore = create((set) => ({
  staying: 60,
  setStaying: (minutes: any) => set(
    (state: any) => ({...state, staying: minutes})
  ),
  filter: false,
  setSpendTime: (boolValue: any) => set(
    (state: any) => ({...state, filter: boolValue})
  ),
  date: moment().format('YYYY-MM-DD'),
  setDate: (yyyyMmDd: string) => set(
    (state: any) => ({...state, date: yyyyMmDd})
  ),
  goesTo: SOCHI,
  setGoesTo: (point: string) => set(
    (state: any) => ({...state, goesTo: point})
  ),
  stateRoutes: {} as IApiRoutes,
  setRoutesState: (routes: IApiRoutes) => set(
    (state: any) => ({...state, stateRoutes: routes})
  ),
}))

export interface IRoute {
  from: string;
  to: string;
  departureTimeString: string; // время убытия '2022-12-28T07:22:00+03:00'
  arrivalTimeString: string; // время прибытия '2022-12-28T07:22:00+03:00'
}

// @ts-ignore
export const BindingRoute = ({straight, reversed, msInCity}) => {
  const cityTimeString = convertMsToHM(msInCity);

  return (
    <div style={{display: "flex", justifyContent: "space-between"}}>
      <span>В Сочи: {dateFormat(straight.arrivalTimeString)}</span>
      <span>
          Время в городе: {cityTimeString}
        </span>
      <span>Дома: {dateFormat(reversed.arrivalTimeString)}</span>
    </div>
  )
}

const fromBeToFEMapFunc = (route: IRouteBE): IRoute => ({
  arrivalTimeString: route.arrival,
  departureTimeString: route.departure,
  from: route.from,
  to: route.to
})

function App() {
  // @ts-ignore
  const date = appStore((state) => state.date);
  // @ts-ignore
  const goesTo = appStore((state) => state.goesTo);
  // @ts-ignore
  const setRoutesState = appStore((state) => state.setRoutesState);
  // @ts-ignore
  const stateRoutes: IApiRoutes = appStore((state) => state.stateRoutes);

  const {data: routes, error, isLoading}: SWRResponse<IApiRoutesBE> = useSWR(
    `api/raspisanie?date=${date}&from=${SOVHOZ}&to=${goesTo}`,
    // @ts-ignore
    (...args: any[]) => fetch(...args).then((res) => res.json()),
    {
      fallbackData: {} as IApiRoutesBE,
    }
  )
  useEffect(() => {
    if (routes !== undefined && Object.keys(routes).length !== 0) {
      const firstComing = routes.straightRoutes[0].arrival;

      const reversedRoutesFE: IRoute[] = routes.reversedRoutes
        .filter((route: IRouteBE) => new Date(route.departure) > new Date(firstComing))
        .map(fromBeToFEMapFunc);

      setRoutesState({
        straightRoutes: routes.straightRoutes.map(fromBeToFEMapFunc),
        reversedRoutes: reversedRoutesFE,
      });
    }
  }, [routes])

  return (
    <div className="App">
      <ControlRow/>

      <DiscreteSliderLabel/>
      <br/>
      {isLoading && <div>загрузка...</div>}
      {error && <div>ошибка загрузки</div>}
      {stateRoutes.straightRoutes && stateRoutes.reversedRoutes &&
        <>
          <ClassicRoutesView/>
          <ResultRoutes/>
        </>
      }
    </div>
  )
}

export default App
