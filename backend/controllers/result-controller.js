const search = require("../utils/search");

const postResult = async (req, res) => {
  const query = req.body.query;
  if (!query) {
    return res.status(400).json("The query that needs to be checked is empty");
  }

  const pretty_query = query
    .replace(/(\r\n|\n|\r)/gm, ".")
    .replace(/\s+/g, " ")
    .replace(/\.+/g, ".")
    .replace(/([.?!])\s*(?=[A-Z])/g, "$1|")
    .split("|");

  const length = pretty_query.length;
  if (length > 100) {
    return res.status(400).json("Maximum of 100 sentences can be queried");
  }

  let result = [];
  let count = {
    total: length,
    plagiarised: 0,
  };

  for (let i = 0; i < length; i++) {
    const current_query = pretty_query[i];
    const temp = await search(current_query);
    if (temp.length > 0) {
      const pretty_url = temp[0].url.match(
        new RegExp("url=" + "(.*)" + "&ved")
      );
      result.push({ text: current_query, url: pretty_url[1] });
      count.plagiarised++;
    } else {
      result.push({ text: current_query, url: null });
    }
  }

  res.json({ result: result, count: count });
};

module.exports = { postResult };
