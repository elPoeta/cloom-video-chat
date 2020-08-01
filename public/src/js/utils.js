const WS_URL = location.origin.replace(/^http/, 'ws');
const parseJsonObject = str => {
  try {
    const strParsed = JSON.parse(str);
    return strParsed;
  } catch (error) {
    console.log("Error :: ", error.message);
    return {};
  }
}

export {
  WS_URL,
  parseJsonObject
}