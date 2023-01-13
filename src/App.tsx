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
import {StoreApi} from "zustand/vanilla";
import {UseBoundStore} from "zustand/react";

export enum EnumGoesTo {
  SOVHOZ = `s9613229`,
  SOCHI = `c239`,
  IMERITIN_RESORT = `s9812789`,
}

export interface IAppState {
  staying: number;
  setStaying: (staying: number) => void;
  filterByPossible: boolean;
  setPossible: (boolValue: boolean) => void;
  filterBySpendTime: boolean;
  setSpendTime: (boolValue: boolean) => void;
  date: string;
  setDate: (yyyyMmDd: string) => void;
  goesTo: EnumGoesTo;
  setGoesTo: (point: EnumGoesTo) => void;
  stateRoutes: IApiRoutes;
  setRoutesState: (routes: IApiRoutes) => void;
}

export const appStore: UseBoundStore<StoreApi<IAppState>> = create((set): IAppState => ({
  staying: 60,
  setStaying: (minutes: number) => set(
    (state: IAppState) => ({...state, staying: minutes})
  ),
  filterByPossible: false,
  setPossible: (boolValue: boolean) => set(
    (state: IAppState) => ({...state, filterByPossible: boolValue})
  ),
  filterBySpendTime: false,
  setSpendTime: (boolValue: boolean) => set(
    (state: IAppState) => ({...state, filterBySpendTime: boolValue})
  ),
  date: moment().format('YYYY-MM-DD'),
  setDate: (yyyyMmDd: string) => set(
    (state: IAppState) => ({...state, date: yyyyMmDd})
  ),
  goesTo: EnumGoesTo.SOCHI,
  setGoesTo: (point: EnumGoesTo) => set(
    (state: IAppState) => ({...state, goesTo: point})
  ),
  stateRoutes: {} as IApiRoutes,
  setRoutesState: (routes: IApiRoutes) => set(
    (state: IAppState) => ({...state, stateRoutes: routes})
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
  const date = appStore((state) => state.date);
  const goesTo = appStore((state) => state.goesTo);
  const setRoutesState = appStore((state) => state.setRoutesState);
  const stateRoutes: IApiRoutes = appStore((state) => state.stateRoutes);

  const {data: routes, error, isLoading}: SWRResponse<IApiRoutesBE> = useSWR(
    `api/raspisanie?date=${date}&from=${EnumGoesTo.SOVHOZ}&to=${goesTo}`,
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
