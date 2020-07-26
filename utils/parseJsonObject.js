module.exports = str => {
  try {
    const strParsed = JSON.parse(str);
    return strParsed;
  } catch (error) {
    console.log("Error :: ", error.message);
    return {};
  }
} 