import axios from "axios";

exports.handler = async (event, context) => {
  var url = event.path;
  url = url.split(".netlify/functions/cors/")[1];
  url = decodeURIComponent(url);
  url = new URL(url);

  for (let i in event.queryStringParameters) {
    url.searchParams.append(i, event.queryStringParameters[i]);
  }
  var cookie_string = event.headers.cookie || "";
  var useragent = event.headers["user-agent"] || "";

  var header_to_send = {
    Cookie: cookie_string,
    "User-Agent": useragent,
    "content-type": "application/json",
    accept: "*/*",
    host: url.host,
  };

  var options = {
    method: event.httpMethod.toUpperCase(),
    headers: header_to_send,
    body: event.body,
  };

  if (
    event.httpMethod.toUpperCase() == "GET" ||
    event.httpMethod.toUpperCase() == "HEAD"
  )
    delete options.body;

  var response = await axios.get(url, options);
  var response_text = await response.data;
  var headers = response.headers;

  var cookie_header = null;
  if (headers["set-cookie"]) cookie_header = headers["set-cookie"];

  return {
    statusCode: 200,
    body: response_text,
    headers: {
      "content-type": String(headers["content-type"]) || "text/plain",
    },
    multiValueHeaders: {
      "set-cookie": cookie_header || [],
    },
  };
};
