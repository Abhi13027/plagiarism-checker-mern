const util = require("util");
const request = require("request-promise-native");
const cheerio = require("cheerio");

const delay = util.promisify(setTimeout);

const DEFAULT_USER_AGENT =
  "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1";
const DEFAULT_OPTIONS = {
  num: 10,
  retry: 3,
  delay: 0,
  resolveWithFullResponse: true,
  jar: true,
};

const search = async (params) => {
  const options = check(params);
  const result = await doRequest(options, 0);

  if (Array.isArray(result)) {
    return result.slice(0, options.num);
  }

  return result;
};

const check = (params) => {
  if (!params.qs) {
    throw new Error("No qs attribute in the options");
  }

  if (!params.qs.q) {
    throw new Error("the option object doesn't contain the keyword");
  }

  const options = Object.assign({}, DEFAULT_OPTIONS, params);

  options.url = getGoogleUrl(options, "/search");

  const hasUserAgent = (options.headers || {})["User-Agent"];

  if (!hasUserAgent) {
    options.headers = options.headers || {};
    options.headers["User-Agent"] = DEFAULT_USER_AGENT;
  }

  if (options.proxyList) {
    options.proxy = options.proxyList.pick().getUrl();
  }

  return options;
};

const doRequest = async (options, nbrOfLinks) => {
  let response = -1;

  for (let i = 0; i < options.retry; i += 1) {
    try {
      /* eslint-disable no-await-in-loop */
      await delay(options.delay);
      response = await execRequest(options, nbrOfLinks);
      break;
    } catch (error) {
      logError(`Error during the request, retry : ${i}`, options, error);

      if (options.proxyList) {
        /* eslint-disable no-param-reassign */
        options.proxy = options.proxyList.pick().getUrl();
      }

      if (i === options.retry - 1) {
        throw error;
      }
    }
  }

  return response;
};

const execRequest = async (options, nbrOfLinks) => {
  if (options.numberOfResults) {
    options.qs.hl = "EN";
  }

  const response = await request(options);

  if (response && response.statusCode !== 200) {
    throw new Error(`Invalid HTTP status code on ${options.url}`);
  }
  if (options.numberOfResults) {
    return getNumberOfResults(options, response);
  }

  return await getLinks(options, response, nbrOfLinks);
};

const getNumberOfResults = (options, response) => {
  const $ = cheerio.load(response.body);

  const hasNumberofResult = $("body").find("#result-stats").length > 0;

  if (!hasNumberofResult) {
    return 0;
  }

  const result = $("#result-stats").text().split(" ");

  if (result.length > 1) {
    return Number(result[1].replace(/\D/g, ""));
  }

  return 0;
};

const getLinks = async (options, response, nbrOfLinks) => {
  const result = extractLinks(options, response.body);
  let allLinks = result.links;

  if (allLinks.length === 0) {
    return allLinks;
  }

  const nbr = nbrOfLinks + allLinks.length;

  if (nbr >= options.num) {
    return allLinks;
  }

  if (result.nextPage) {
    const nextPageOptions = Object.assign({}, options);

    nextPageOptions.url = getGoogleUrl(options, result.nextPage);

    allLinks = [...allLinks, ...(await doRequest(nextPageOptions, nbr))];
  }

  return allLinks;
};

const extractLinks = (options, body) => {
  const links = [];

  const $ = cheerio.load(body);

  $("body")
    .find("h3")
    .each((i, h3) => {
      if ($(h3).parent()) {
        const href = $(h3).parent().attr("href");

        if (href) {
          const ignore = options.ignore || [];
          const l = ignore.length;

          if (l > 0) {
            let flag = 0;
            for (let i = 0; i < l && flag === 0; i++) {
              if (href.includes(ignore[i])) flag = 1;
            }

            if (flag === 0) links.push({ url: href, title: $(h3).text() });
          } else {
            links.push({ url: href, title: $(h3).text() });
          }
        }
      }
    });

  const nextPage = $("#pnnext").attr("href");

  return { links, nextPage };
};

const getGoogleUrl = (options, path) => {
  return `https://www.${options.host || "google.com/"}${path}`;
};

const logError = (message, options, error) => {
  console.error({
    module: "serp",
    message,
    url: options.url,
    proxy: options.proxy,
    error,
    options,
  });
};

module.exports.search = search;
