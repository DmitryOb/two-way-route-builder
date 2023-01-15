import React, {FC} from 'react';
import moment from "moment/moment";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {appStore, EnumPoints} from "../App";
import "./ControlRow.css";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

interface ControlRowProps {
}

const ControlRow: FC<ControlRowProps> = () => {
  const date = appStore((state) => state.date); // 'YYYY-MM-DD'
  const setDate = appStore((state) => state.setDate);
  const setGoesTo = appStore((state) => state.setGoesTo);
  const setPossible = appStore((state) => state.setPossible);
  const filterByPossible = appStore((state) => state.filterByPossible);

  const isShowBackButton = () => {
    const todayYyyMmmDdString = moment().format('YYYY-MM-DD');
    return moment(date).subtract(1, 'd') >= moment(todayYyyMmmDdString);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPossible(event.target.checked)
  };

  return (
    <div className={'control-row'}>
      <div className={'control-column-first'}>
        {isShowBackButton() &&
          <button onClick={() => {
            const dayBefore = moment(date).subtract(1, 'd').format('YYYY-MM-DD');
            setDate(dayBefore);
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
        <button onClick={() => setDate(moment(date).add(1, 'd').format('YYYY-MM-DD'))}>
          <ArrowForwardIosIcon fontSize={"small"}/>
        </button>
      </div>
      <div className={'control-column-second'}>
        <button onClick={() => {
          //TODO:
        }
        }>
          из лоо!
        </button>
        <button onClick={() => setGoesTo(EnumPoints.IMERITIN_RESORT)}>
          на курорт!
        </button>
          <FormControlLabel label="Куда успеваю?"
                            control={
                              <Switch checked={filterByPossible}
                                      onChange={handleChange}
                                      inputProps={{'aria-label': 'controlled'}}
                              />
                            }
                            labelPlacement="bottom"


          />
      </div>
    </div>
  )
};

export default ControlRow;
