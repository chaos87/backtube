export const delay = (ms) => new Promise(resolve =>
  setTimeout(resolve, ms)
);

export const msToTime = (s) => {
    // Pad to 2 or 3 digits, default is 2
    function pad(n, z) {
      z = z || 2;
      return ('00' + n).slice(-z);
    }
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;

    return hrs !== 0 ? hrs + ':' + pad(mins) + ':' + pad(secs) : mins + ':' + pad(secs);
}


export const pad = (n, width, z) => {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

export const padArray = (arr,len,fill) => {
  return arr.concat(Array(len).fill(fill)).slice(0,len);
}
