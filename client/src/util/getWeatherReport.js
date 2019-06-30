import Axios from "axios";
import { WEATHER_REPORT_TOKEN } from "../config/keys";

const DEFAULT_LOCATION_SF = {lat: 37.7749, lng: -122.4194};

export const getWeatherReport = (location) => {
  const coordinate = location || DEFAULT_LOCATION_SF;
  Axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${coordinate.lat}&lon=${coordinate.lng}&units=${'imperial'}&APPID=${WEATHER_REPORT_TOKEN}`)
    .then(res => {
      // console.log(res.data);
      return res.data;
    })
    .catch(err => console.log(err));
}