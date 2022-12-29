function padTo2Digits(num: number) {
  return num.toString().padStart(2, '0');
}

export function convertMsToHM(milliseconds: number) {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  seconds = seconds % 60;
  minutes = seconds >= 30 ? minutes + 1 : minutes;
  minutes = minutes % 60;
  hours = hours % 24;

  return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}`;
}

export const dateFormat = (date: string) => {
  const toLoc = new Date(date).toLocaleTimeString();
  return toLoc.substring(0, toLoc.length - 3);
}
