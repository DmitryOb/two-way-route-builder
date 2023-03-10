import React, {FC} from 'react';
import moment from "moment/moment";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {appStore, EnumPoints, PointsDictionary} from "../App";
import "./ControlRow.css";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import IconButton from '@mui/material/IconButton';

interface ControlRowProps {
}

const ControlRow: FC<ControlRowProps> = () => {
  const date = appStore((state) => state.date); // 'YYYY-MM-DD'
  const setDate = appStore((state) => state.setDate);

  const goesFrom = appStore((state) => state.goesFrom);
  const setGoesFrom = appStore((state) => state.setGoesFrom);

  const goesTo = appStore((state) => state.goesTo);
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

  const revertHandler = () => {
    const goesFromOriginal = goesFrom;
    const goesToOriginal = goesTo;

    setGoesFrom(goesToOriginal);
    setGoesTo(goesFromOriginal)
  }

  return (
    <div className={'control-row'}>
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
      <div className={'goes'}>
        <FormControl fullWidth>
          <InputLabel id="goes-from-select-label" style={{background: 'white'}}>Откуда</InputLabel>
          <Select
            labelId="goes-from-select-label"
            id="goes-from-select"
            value={goesFrom}
            label="Age"
            onChange={(event: SelectChangeEvent) => setGoesFrom(event.target.value as EnumPoints)}
            autoWidth
          >
            {Object.values(EnumPoints)
              .filter((enumPoint: EnumPoints) => enumPoint !== goesTo)
              .map((enumPoint: EnumPoints) =>
                <MenuItem value={enumPoint} key={enumPoint}>{PointsDictionary.get(enumPoint)}</MenuItem>
              )
            }
          </Select>
        </FormControl>
        <IconButton size={'small'} onClick={revertHandler}>
          <AutorenewIcon fontSize={'small'}/>
        </IconButton>
        <FormControl fullWidth>
          <InputLabel id="goes-to-select-label" style={{background: 'white'}}>Куда</InputLabel>
          <Select
            labelId="goes-to-select-label"
            id="goes-to-select"
            value={goesTo}
            label="Age"
            onChange={(event: SelectChangeEvent) => setGoesTo(event.target.value as EnumPoints)}
            autoWidth
          >
            {Object.values(EnumPoints)
              .filter((enumPoint: EnumPoints) => enumPoint !== goesFrom)
              .map((enumPoint: EnumPoints) =>
                <MenuItem value={enumPoint} key={enumPoint}>{PointsDictionary.get(enumPoint)}</MenuItem>
              )
            }
          </Select>
        </FormControl>
      </div>
      <FormControlLabel
        label="Куда успеваю?"
        control={
          <Switch checked={filterByPossible}
                  onChange={handleChange}
                  inputProps={{'aria-label': 'controlled'}}
          />
        }
        labelPlacement="bottom"
      />
    </div>
  )
};

export default ControlRow;
