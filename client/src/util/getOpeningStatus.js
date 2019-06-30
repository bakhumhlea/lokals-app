export const getOpeningStatus = (hours) => {
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const now = new Date(Date.now());
  const d = now.getDay();
  const h = now.getHours().toString();
  const m = now.getMinutes() < 10 ? `0${now.getMinutes().toString()}` : now.getMinutes().toString();
  const currenttime = parseInt(h+m, 10);
  var day = '';
  var text = "Closed Now";
  var status = false;
  var opentime = null;
  var closetime = null;
  var opendayIndex = [];
  var openindex = null;
  if (hours) {
    const openday = hours.map(h => h.open.day);
    if (openday.includes(d)) {
      openindex = openday.indexOf(d);
      day = days[d];
      openday.forEach((el, i) => { if (el === d) opendayIndex.push(i) });
      opendayIndex.forEach(el => {
        opentime = parseInt(hours[el].open.time, 10);
        closetime = parseInt(hours[el].close.time, 10) === 0 ? 2400 : parseInt(hours[el].close.time, 10);
        // console.log(currenttime);
        // console.log(opentime);
        // console.log(closetime);
        if (opentime <= currenttime && currenttime <= closetime) {
          text = "Open Now";
          status = true;
        } else if (0 < (closetime - currenttime) && (closetime - currenttime) < 70) {
          text = `Close in ${closetime - currenttime - 40}m`;
          status = true;
        } else {
          if (currenttime < opentime && (opentime - currenttime) < 100 && (opentime - currenttime) > 60) {
            text = `Open in ${opentime - currenttime - 40}m`;
          } else if (currenttime < opentime && (opentime - currenttime) < 60 && (opentime - currenttime) > 60) {
            text = `Open in ${opentime - currenttime}m`;
          }
        }
      });
      return {
        text: text,
        day: day,
        status: status,
        open: opentime,
        close: closetime,
        index: openindex
      };
    } 
  }
  return {
    text: "Close Today",
    day: days[d],
    status: false,
    open: null,
    close: null,
    index: openindex
  };
};

export const getOpeninghoursString = (hour) => {
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  // const daysShort = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const formatTime = (time) => {
    if (time.length === 3) {
      return `${time.charAt(0)}:${time.substr(1)}`;
    } else {
      return `${time.substr(0,2)}:${time.substr(2)}`;
    }
  }
  return `${days[hour.open.day]} ${formatTime(hour.open.time)} - ${formatTime(hour.close.time)}`;
}