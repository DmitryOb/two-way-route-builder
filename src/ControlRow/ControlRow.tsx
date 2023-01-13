import React, {FC} from 'react';
import moment from "moment/moment";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {appStore, IMERITIN_RESORT, IRoute} from "../App";
import "./ControlRow.css";
import {IApiRoutes} from "../ClassicRoutesView/ClassicRoutesView";

interface ControlRowProps {
}

const ControlRow: FC<ControlRowProps> = () => {
  // @ts-ignore
  const date = appStore((state) => state.date);
  // @ts-ignore
  const setDate = appStore((state) => state.setDate);
  // @ts-ignore
  const setGoesTo = appStore((state) => state.setGoesTo);
  // @ts-ignore
  const stateRoutes: IApiRoutes = appStore((state) => state.stateRoutes);
  // @ts-ignore
  const setRoutesState = appStore((state) => state.setRoutesState);

  const filterByPossibleFromNow = () => {
    console.log(stateRoutes);


    const filteredRoutes: IApiRoutes = Object.assign(stateRoutes, {});
    // TODO:
    // for (const [key, routes] of Object.entries(filteredRoutes)) {
    //   let curKey = key as 'straightRoutes' | 'reversedRoutes';
    //   let currentRoutes: IRoute[] = routes;
    //   // тут нужно straightRoutes отфильтровать так:
    //   // если new Date()
    // }

    // const filteredRoutes: IApiRoutes = stateRoutes.map(
    //   (stateRoute) => {
    //     return stateRoute
    //   }
    // )
    // const filteredRoutes = (stateRoutes): IApiRoutes => {
    //   return {
    //     straightRoutes: [],
    //     reversedRoutes: [],
    //   }
    // }
    setRoutesState(filteredRoutes);
  }

  // TODO: показать кнопку если после нажатия на неё дата станет = сегодня или больше чем сегодня
  const isShowBackButton = true;

  return (
    <div className={'control-row'}>
      <div className={'control-column-first'}>
        {isShowBackButton &&
          <button onClick={() => setDate(moment(date).subtract(1, 'd').format('YYYY-MM-DD'))}>
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
        <button onClick={() => setDate(moment(date).add(1, 'd').format('YYYY-MM-DD'))}>
          <ArrowForwardIosIcon fontSize={"small"}/>
        </button>
      </div>
      <div className={'control-column-second'}>
        <button onClick={() => setGoesTo(IMERITIN_RESORT)}>
          Хочу на курорт!
        </button>
        <button onClick={filterByPossibleFromNow}>
          Куда успеваю?
        </button>
      </div>
    </div>
  )
};

export default ControlRow;
