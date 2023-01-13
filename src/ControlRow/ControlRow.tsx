import React, {FC} from 'react';
import moment from "moment/moment";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {appStore, EnumGoesTo} from "../App";
import "./ControlRow.css";

interface ControlRowProps {
}

const ControlRow: FC<ControlRowProps> = () => {
  const date = appStore((state) => state.date);
  const setDate = appStore((state) => state.setDate);
  const setGoesTo = appStore((state) => state.setGoesTo);


  //TODO:
  const filterByPossible = appStore((state) => state.filterByPossible);
  const setPossible = appStore((state) => state.setPossible);
  const filterByPossibleFromNow = () => {
  //   const filteredRoutes: IApiRoutes = Object.assign(stateRoutes, {});
  //   for (const [key, routes] of Object.entries(filteredRoutes)) {
  //     let curKey = key as 'straightRoutes' | 'reversedRoutes';
  //     let currentRoutes: IRoute[] = routes;
  //   }
  //   setRoutesState(filteredRoutes);
  }
  // // @ts-ignore
  // const stateRoutes: IApiRoutes = appStore((state) => state.stateRoutes);
  // @ts-ignore
  // const setRoutesState = appStore((state) => state.setRoutesState);


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
        <button onClick={() => setGoesTo(EnumGoesTo.IMERITIN_RESORT)}>
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
