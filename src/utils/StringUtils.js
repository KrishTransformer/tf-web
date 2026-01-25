export const titleCase = (text) => {
  const result = text.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};


export const extractFromHostname = (hostname) => {
  hostname = hostname.replace(".riverworld.io", "");
  hostname = hostname.replace("-timesheet", "");
  return hostname.toUpperCase();
};

export const splitJsonObject = (obj, parts = 3) => {
  const keys = Object.keys(obj);
  const chunkSize = Math.ceil(keys.length / parts);
  
  let result = [];
  
  for (let i = 0; i < parts; i++) {
    const chunkKeys = keys.slice(i * chunkSize, (i + 1) * chunkSize);
    const chunk = {};
    chunkKeys.forEach(key => {
      chunk[key] = obj[key];
    });
    result.push(chunk);
  }
  
  return result;
}

export const generateUniqueFiveDigitNumber = () => {
  const min = 10000;
  const max = 99999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
