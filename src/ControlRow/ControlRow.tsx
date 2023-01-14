import React, {FC} from 'react';
import moment from "moment/moment";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {appStore, EnumGoesTo} from "../App";
import "./ControlRow.css";
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

interface ControlRowProps {
}

const ControlRow: FC<ControlRowProps> = () => {
  const date = appStore((state) => state.date); // 'YYYY-MM-DD'
  const setDate = appStore((state) => state.setDate);
  const setGoesTo = appStore((state) => state.setGoesTo);
  const setPossible = appStore((state) => state.setPossible);
  const filterByPossible = appStore((state) => state.filterByPossible);

  // TODO: показать кнопку если после нажатия на неё дата станет = сегодня или больше чем сегодня
  const isShowBackButton = true;
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPossible(event.target.checked)
  };

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
        <FormGroup>
          <FormControlLabel control={
            <Switch checked={filterByPossible}
                    onChange={handleChange}
                    inputProps={{ 'aria-label': 'controlled' }}
            />
          }
                            label="Куда успеваю?"
          />
        </FormGroup>
      </div>
    </div>
  )
};

export default ControlRow;
