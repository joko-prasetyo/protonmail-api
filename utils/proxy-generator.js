const request = require("request");
const cheerio = require("cheerio");

module.exports = async function () {
  return new Promise((resolve, reject) => {
    request("https://free-proxy-list.net/", function (error, response, html) {
      let proxies = [];
      let ip_addresses = [];
      let port_numbers = [];
      let protocol_lists = [];
      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
        $("tr > td:nth-child(1)").each(function (index, value) {
          ip_addresses.push($(this).text());
        });

        $("tr > td:nth-child(2)").each(function (index, value) {
          port_numbers.push($(this).text());
        });

        $("tr > td:nth-child(7)").each(function (index, value) {
          protocol_lists.push(
            $(this).text().toLowerCase() == "yes" ? "https" : "http"
          );
        });
      } else {
        console.log("Error loading proxy, please try again");
      }

      ip_addresses.forEach((ip, index) => {
        proxies.push(
          `${protocol_lists[index]}://${ip_addresses[index]}:${port_numbers[index]}`
        );
      });
      resolve(proxies);
    });
  });
};
