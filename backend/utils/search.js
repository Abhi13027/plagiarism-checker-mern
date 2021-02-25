const gserp = require("./gserp");

const getSearch = async (query) => {
  var options = {
    host: "google.com",
    ignore: ["youtube.com", "twitter.com", "facebook.com"],
    qs: {
      q: `"${query}"`,
      nfpr: 1,
      filter: 0,
      pws: 0,
    },
    num: 3,
  };

  try {
    const result = await gserp.search(options);
    return result;
  } catch (err) {
    console.log("Error: " + err);
  }
};

module.exports = getSearch;
