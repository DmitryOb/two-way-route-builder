import React, {FC} from 'react';
import moment from "moment/moment";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {appStore, IMERITIN_RESORT} from "../App";
import "./ControlRow.css";

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
  const stateRoutes = appStore((state) => state.stateRoutes);

  const filterByPossibleFromNow = () => {
    // const nowDate = new Date();
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
