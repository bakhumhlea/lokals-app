export const switchIcon = (value) => {
  switch (value.toLowerCase()) {
    case "restaurant":
      return "utensils";
    case "bar":
      return "glass-martini";
    case "coffee":
      return "coffee";
    case "wine bar":
      return "wine-glass-alt"
    default:
      return "store-alt";
  }
};
export const getWeatherIcon = (condition) => {
  const now = Date.now();
  if (now/1000 > condition.sys.sunrise && now/1000 < condition.sys.sunset) {
    switch (condition.weather[0].main.toLowerCase()) {
      case "rain":
        return "rainy"; //"cloud-rain";
      case "clear sky":
        return "sunny";
      case "few clouds":
        return "partly-sunny"; //"cloud-sun"
      case "scattered clouds":
        return "cloudy"; //"cloud";
      default:
        return "sunny";
    }
  } else {
    switch (condition.weather[0].main.toLowerCase()) {
      case "rain":
        return "rainy"; //"cloud-moon-rain";
      case "clear sky":
        return "moon";
      case "few clouds":
        return "cloudy-night"; //"cloud-moon"
      case "scattered clouds":
        return "cloudy-night"; //"cloud-moon";
      default:
        return "moon";
    }
  }
}