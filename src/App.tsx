import React, {FC, useEffect} from 'react';
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

export enum EnumPoints {
  SOVHOZ = `s9613229`,
  SOCHI = `c239`,
  IMERITIN_RESORT = `s9812789`,
  LOO = `c73078`,
  YAKORNAYA_SCHEL = `s9613005`,
  DAGOMIS = `c10992`,
  LAZURNIY = `s9613230`,
}

export const PointsDictionary = new Map<EnumPoints, string>([
  [EnumPoints.SOVHOZ, 'Совхоз'],
  [EnumPoints.SOCHI, 'Сочи'],
  [EnumPoints.IMERITIN_RESORT, 'Имертинка'],
  [EnumPoints.LOO, 'Лоо'],
  [EnumPoints.YAKORNAYA_SCHEL, 'Якорная'],
  [EnumPoints.DAGOMIS, 'Дагомыс'],
  [EnumPoints.LAZURNIY, 'Лазурный'],
])

export interface IAppState {
  staying: number;
  setStaying: (staying: number) => void;
  filterByPossible: boolean;
  setPossible: (boolValue: boolean) => void;
  filterBySpendTime: boolean;
  setSpendTime: (boolValue: boolean) => void;
  date: string; // 'YYYY-MM-DD'
  setDate: (yyyyMmDd: string) => void;
  goesTo: EnumPoints;
  setGoesTo: (point: EnumPoints) => void;
  goesFrom: EnumPoints;
  setGoesFrom: (point: EnumPoints) => void;
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
  goesTo: EnumPoints.SOCHI,
  setGoesTo: (point: EnumPoints) => set(
    (state: IAppState) => ({...state, goesTo: point})
  ),
  goesFrom: EnumPoints.SOVHOZ,
  setGoesFrom: (point: EnumPoints) => set(
    (state: IAppState) => ({...state, goesFrom: point})
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

interface IBindingRoute {
  straight: IRoute;
  reversed: IRoute;
  msInCity: number;
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
  const goesFrom = appStore((state) => state.goesFrom);
  const setRoutesState = appStore((state) => state.setRoutesState);
  const stateRoutes: IApiRoutes = appStore((state) => state.stateRoutes);

  const {data: routes, error, isLoading}: SWRResponse<IApiRoutesBE> = useSWR(
    `api/raspisanie?date=${date}&from=${goesFrom}&to=${goesTo}`,
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

      {stateRoutes !== undefined && Object.keys(stateRoutes).length !== 0 && !isLoading &&
        <>
          <ClassicRoutesView/>
          <ResultRoutes/>
        </>
      }
    </div>
  )
}


export const BindingRoute: FC<IBindingRoute> = ({straight, reversed, msInCity}) => {
  const cityTimeString = convertMsToHM(msInCity);

  return (
    <div style={{display: "flex", justifyContent: "space-between"}}>
      <span>В точку: {dateFormat(straight.arrivalTimeString)}</span>
      <span>
          Время на точке: {cityTimeString}
        </span>
      <span>Дома: {dateFormat(reversed.arrivalTimeString)}</span>
    </div>
  )
}

export default App
