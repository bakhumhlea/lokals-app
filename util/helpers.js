const capitalize = function(word) {
  return `${word.charAt(0).toUpperCase()}${word.substring(1)}`;
};
const strToOfObj = function(string, separator, objkey) {
  if (typeof string !== 'string') {
    return string;
  }
  return string.split(separator).map(word => { return { [objkey]: word.trim().toLowerCase() } });
};
/**
 * @param {data} string in this following format "daynumber:opentime:closetime"
 */
const getOpeningHours = function(data) {
  if (!(typeof data === 'string' && typeof data.split(':') === 'object')) {
    return false;
  }
  const dayandtime = data.split(':');
  const opentime = dayandtime[1];
  const openday = parseInt(dayandtime[0], 10);
  const closetime = dayandtime[2];
  const closeday = parseInt(closetime, 10) < parseInt(opentime, 10)? openday + 1 : openday;
  const openinghours = {
    open: {
      day: openday,
      time: opentime
    },
    close: {
      day: closeday,
      time: closetime
    }
  };
  return openinghours;
};
const byKeyword = (a, b) => {
  var keyA = a.keyword.toLowerCase();
  var keyB = b.keyword.toLowerCase();
  if (keyA < keyB) {
    return -1;
  }
  if (keyA > keyB) {
    return 1;
  }
  return 0;
};

module.exports = {
  capitalize: capitalize,
  strToOfObj: strToOfObj,
  getOpeningHours: getOpeningHours,
  byKeyword: byKeyword
};