import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import {appStore, IAppState} from "./App";
import {RANGE_MINUTE} from "./ResultRoutes/ResultRoutes";

const marks = [
  {
    value: 60,
    label: '60 мин',
  },
  {
    value: 120,
    label: '2 часа',
  },
  {
    value: 180,
    label: '3 часа',
  },
  {
    value: 240,
    label: '4 часа',
  },
  {
    value: 300,
    label: '∞',
  },
];

export default function DiscreteSliderLabel() {
  const setStaying = appStore((state: IAppState) => state.setStaying);
  const setSpendTime = appStore((state: IAppState) => state.setSpendTime);

  const handleSliderChange = (event: any) => {
    setStaying(event.target.value);
    setSpendTime(event.target.value !== 300)
  }

  return (
    <div style={{boxShadow: '0 1px 4px #2f9b9b', borderRadius: '10px'}}>
      <br/>
      <Box paddingLeft={'25px'} paddingRight={'25px'}>
        <Slider
          aria-label="Always visible"
          defaultValue={300}
          step={10}
          min={10}
          marks={marks}
          valueLabelDisplay="on"
          max={300}
          onChange={handleSliderChange}
        />
      </Box>
      <span>&#8593;</span>
      <span>Сколько времени займут дела? (+/- {RANGE_MINUTE}мин)</span>
    </div>
  );
}
