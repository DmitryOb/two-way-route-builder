import axios from 'axios';
import url from 'url';

function apiCallGetData(from, to, date) {
  const apiKey = process.env.YA_API_KEY;
  const baseURL = 'https://api.rasp.yandex.net/v3.0/search/';
  const url = `${baseURL}?apikey=${apiKey}&format=json&from=${from}&to=${to}&lang=ru_RU&date=${date}&transport_types=suburban`;

  let config = {
    method: 'get',
    url: url,
    headers: {},
  };

  return axios(config).then(response => response.data);
}

function getFormattedRoutesFromApi(data) {
  const routes = [];

  for (const segment of data.segments) {
    routes.push({
      from: segment.from.title,
      to: segment.to.title,
      departure: segment.departure,
      arrival: segment.arrival,
    })
  }

  return routes;
}

export default async (req, res) => {
  const queryObject = url.parse(req.url, true).query;
  console.log(queryObject)
  if (!queryObject.date) {
    res.send({message: "date is missed"});
  } else {
    const straightRoutes = await apiCallGetData(queryObject.from, queryObject.to, queryObject.date)
      .then(data => getFormattedRoutesFromApi(data));
    const reversedRoutes = await apiCallGetData(queryObject.to, queryObject.from, queryObject.date)
      .then(data => getFormattedRoutesFromApi(data));
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(JSON.stringify({straightRoutes, reversedRoutes}));
  }
};
