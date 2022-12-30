import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

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
];

// @ts-ignore
export default function DiscreteSliderLabel({onSliderChange}) {

  return (
    <div style={{boxShadow: '0 1px 4px #2f9b9b', borderRadius: '10px'}}>
      <br/>
      <Box paddingLeft={'12px'} paddingRight={'12px'}>
        <Slider
          aria-label="Always visible"
          defaultValue={60}
          step={10}
          min={10}
          marks={marks}
          valueLabelDisplay="on"
          max={300}
          onChange={onSliderChange}
        />
      </Box>
      <span>&#8593;</span>
      <span>Сколько ~ минут в городе?</span>
    </div>
  );
}
