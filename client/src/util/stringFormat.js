export const toAmPm = (time) => {
  var parseTime;
  if (typeof time === 'string') {
    parseTime = parseInt(time, 10);
  } else {
    parseTime = time;
  }
  var suffix = parseTime < 1200 ? "am":"pm";
  var formattedtime;
  if (parseTime < 1300) {
    formattedtime = parseTime%100 === 0 ? parseTime/100 : `${parseTime/100}:${parseTime%100}`;
  } else {
    formattedtime = parseTime%100 === 0 ? parseTime/100-12 : `${parseTime/100-12}:${parseTime%100}`;
  }
  return formattedtime === 0? "Midnight" : `${formattedtime}${suffix}`;
}
export const toDayStr = (day) => {
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const dayString = days[day];
  return dayString;
};

export const getStreetAddress = (fulladdress) => {
  return fulladdress.split(",").slice(0,3).join(", ");
}
export const capitalize = (text) => {
  return text.charAt(0).toUpperCase()+text.substr(1).toLowerCase();
}
export const makeTitle = (text) => {
  return text.split(' ').map(word => capitalize(word)).join(' ');
}