
const getDate = ()=>{
    return new Date(new Date().toString().split("GMT")[0] + " UTC")
      .toISOString()
      .split(".")[0]
      .replace("T", " ");
}

module.exports.getDate = getDate;