export const everyOneMinute = (callback, param) => {
  var result = null;
  return setInterval(() => {
    result = callback(param);
    console.log(result);
    return result;
  }, 3000);
};