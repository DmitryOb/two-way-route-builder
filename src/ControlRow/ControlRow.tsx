import React, {FC} from 'react';
import moment from "moment/moment";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {appStore, EnumPoints} from "../App";
import "./ControlRow.css";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";

interface ControlRowProps {
}

const ControlRow: FC<ControlRowProps> = () => {
  const date = appStore((state) => state.date); // 'YYYY-MM-DD'
  const setDate = appStore((state) => state.setDate);
  const setGoesTo = appStore((state) => state.setGoesTo);
  const goesFrom = appStore((state) => state.goesFrom);
  const setGoesFrom = appStore((state) => state.setGoesFrom);
  const setPossible = appStore((state) => state.setPossible);
  const filterByPossible = appStore((state) => state.filterByPossible);

  const isShowBackButton = () => {
    const todayYyyMmmDdString = moment().format('YYYY-MM-DD');
    return moment(date).subtract(1, 'd') >= moment(todayYyyMmmDdString);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPossible(event.target.checked)
  };

  const getDateDescription = (date: string): { visible: boolean, name: string } => {
    switch (date) {
      case moment().format('YYYY-MM-DD'):
        return {name: 'Сегодня', visible: true}
      case moment().add(1, 'd').format('YYYY-MM-DD'):
        return {name: 'Завтра', visible: true}
      default:
        return {name: 'None', visible: false}
    }
  }

  return (
    <div className={'control-row'}>
      <div className={'control-column-first'}>
        <div className={'date'}>
          <button style={{visibility: isShowBackButton() ? 'visible' : 'hidden'}}
                  onClick={() => {
                    const dayBefore = moment(date).subtract(1, 'd').format('YYYY-MM-DD');
                    setDate(dayBefore);
                  }}
          >
            <ArrowBackIosNewIcon fontSize={"small"}/>
          </button>
          <div>
            <span>{date}</span>
            <br/>
            <span style={{visibility: getDateDescription(date).visible ? 'visible' : 'hidden'}}>
              {getDateDescription(date).name}
            </span>
          </div>
          <button onClick={() => setDate(moment(date).add(1, 'd').format('YYYY-MM-DD'))}>
            <ArrowForwardIosIcon fontSize={"small"}/>
          </button>
        </div>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label" style={{background: 'white'}}>Откуда</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={goesFrom}
            label="Age"
            onChange={(event: SelectChangeEvent) => setGoesFrom(event.target.value as EnumPoints)}
            autoWidth
          >
            <MenuItem value={EnumPoints.SOVHOZ}>Совхоз</MenuItem>
            <MenuItem value={EnumPoints.LOO}>Лоо</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div className={'control-column-second'}>
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
