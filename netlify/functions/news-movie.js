const axios = require("axios");
const cheerio = require("cheerio");

exports.handler = async (event, context) => {
  const URL_DOMAIN = "https://movieplayer.it";
  let pagination = true;

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  function convertData(strData) {
    const now = new Date();

    if (strData === "ieri") {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      if (isNaN(yesterday.getTime())) {
        return null;
      } else {
        return new Date(yesterday).toISOString().toLocaleString("it-IT");
      }
    } else if (strData.includes("ora") || strData.includes("ore")) {
      const hoursAgo = parseInt(strData.split(" ")[0]);
      const hoursAgoDate = new Date(now);
      hoursAgoDate.setHours(now.getHours() - hoursAgo);
      if (isNaN(hoursAgoDate.getTime())) {
        return null;
      } else {
        return new Date(hoursAgoDate).toISOString().toLocaleString("it-IT");
      }
    } else if (strData.includes("minuto") || strData.includes("minuti")) {
      const minutesAgo = parseInt(strData.split(" ")[0]);
      const minutesAgoDate = new Date(now);
      minutesAgoDate.setMinutes(now.getMinutes() - minutesAgo);
      if (isNaN(minutesAgoDate.getTime())) {
        return null;
      } else {
        return new Date(minutesAgoDate).toISOString().toLocaleString("it-IT");
      }
    } else if (strData.includes("giorno") || strData.includes("giorni")) {
      const daysAgo = parseInt(strData.split(" ")[0]);
      const daysAgoDate = new Date(now);
      daysAgoDate.setDate(now.getDate() - daysAgo);
      if (isNaN(daysAgoDate.getTime())) {
        return null;
      } else {
        return new Date(daysAgoDate).toISOString().toLocaleString("it-IT");
      }
    } else if (strData.includes("settimana") || strData.includes("settimane")) {
      const weeksAgo = parseInt(strData.split(" ")[0]);
      const weeksAgoDate = new Date(now);
      weeksAgoDate.setDate(now.getDate() - weeksAgo * 7);
      if (isNaN(weeksAgoDate.getTime())) {
        return null;
      } else {
        return new Date(weeksAgoDate).toISOString().toLocaleString("it-IT");
      }
    } else if (strData.includes("mese") || strData.includes("mesi")) {
      const monthsAgo = parseInt(strData.split(" ")[0]);
      const monthsAgoDate = new Date(now);
      monthsAgoDate.setMonth(now.getMonth() - monthsAgo);
      if (isNaN(monthsAgoDate.getTime())) {
        return null;
      } else {
        return new Date(monthsAgoDate).toISOString().toLocaleString("it-IT");
      }
    } else if (strData.includes("anno") || strData.includes("anni")) {
      const yearsAgo = parseInt(strData.split(" ")[0]);
      const yearsAgoDate = new Date(now);
      yearsAgoDate.setFullYear(now.getFullYear() - yearsAgo);
      if (isNaN(yearsAgoDate.getTime())) {
        return null;
      } else {
        return new Date(yearsAgoDate).toISOString().toLocaleString("it-IT");
      }
    } else {
      var parts = strData.split(" ");
      var day = parseInt(parts[0]);
      var month = monthNames[parts[1]];
      var year = parseInt(parts[2]);

      // Crea un oggetto data con i valori ottenuti
      var date = new Date(year, month, day);

      // Verifica se la data è valida
      if (isNaN(date.getTime())) {
        return null;
      } else {
        return new Date(date).toISOString().toLocaleString("it-IT");
      }
    }
  }

  async function getReviewByLink(url) {
    const uri = URL_DOMAIN + url;
    const response = await axios.get(uri);
    const $ = cheerio.load(response.data);

    const review = [];

    let currentSubtitle = null;
    let textBlocks = [];
    let blockImage = null;

    const firstDiv = $(".article__content");
    const secondDiv = $(".box--movie .media-body");

    const titleMovie = $(secondDiv)?.find("a.h5")?.text()?.trim() || null;

    firstDiv.children().each((index, element) => {
      if (element.tagName === "h2") {
        if (textBlocks.length > 0 && currentSubtitle === null) {
          const item = { subtitle: null, textBlocks, blockImage };
          review.push(item);
        }

        // Se è presente un titolo, salviamo l'oggetto precedente (se esiste) e iniziamo uno nuovo
        if (currentSubtitle !== null) {
          const item = { subtitle: currentSubtitle, textBlocks, blockImage };
          review.push(item);
        }

        // Prendiamo il nuovo titolo
        currentSubtitle = $(element).text();
        textBlocks = [];
      } else if (element.tagName === "p") {
        // Se è un paragrafo, aggiungiamo il testo all'array
        const htmlP = $(element).html();
        const modifiedHTML = htmlP.replace(
          /<a\b[^>]*>(.*?)<\/a>/gi,
          "<strong>$1</strong>"
        );

        textBlocks.push(modifiedHTML);
      } else if (element.tagName === "figure") {
        const image = $(element).find("img");
        const imageSrc = image.attr("data-src");
        if (image.length > 0) {
          blockImage = imageSrc;
        }
      }
    });

    if (currentSubtitle !== null) {
      const item = { subtitle: currentSubtitle, textBlocks };
      review.push(item);
    }

    return { review, titleMovie };
  }

  async function fetchNewsPage(page = 1) {
    let result = [];

    const currentPage =
      page !== 1 ? `/film/recensioni/?pagina=${page}` : "/film/recensioni/";

    const url = `${URL_DOMAIN}${currentPage}`;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // const nextLinkExists = $('head link[rel="next"]').length > 0;

    // if (!nextLinkExists) {
    //   pagination = null;
    //   return null;
    // }

    const articles = $("ul.list-news");

    const promises = [];

    articles.children().each((index, element) => {
      const $element = $(element);

      const img = $element.find("img.media--news__img").attr("data-src");
      const link = $element.find("h2 a").attr("href");
      const title = $element.find("h2 a").text().trim();
      const dateString = $element.find("time").text().trim();
      const dateArticle = dateString;
      const articleDataFromatting = convertData(dateString);

      // if (articleDataFromatting) {
      //   const timestampTest = new Date(`${articleDataFromatting}`).getTime();

      //   const differenceInDays = Math.floor(
      //     (timestampTest - parseInt(executionat)) / (24 * 60 * 60 * 1000)
      //   );

      //   if (differenceInDays < -1) {
      //     pagination = null;
      //     return null;
      //   }
      // }

      const description = $element.find("p").text().trim();

      if (title) {
        const newArticle = {
          articleID: link,
          bgImage: img,
          articleTitle: title,
          articleDescription: description,
          articleDate: dateArticle,
          articleDataFromatting: articleDataFromatting,
          articleType: "review",
        };

        if (link) {
          const promiseReview = getReviewByLink(link).then(
            ({ review, titleMovie }) => {
              result.push({ ...newArticle, articleReview: review, titleMovie });
            }
          );
          promises.push(promiseReview);
        }
      }
    });

    await Promise.all(promises);

    return result;
  }

  let responseAll = [];

  try {
    index = 1;
    while (pagination) {
      if (index > 3) {
        pagination = false;
      }
      const contentForPage = await fetchNewsPage(index);
      if (contentForPage) {
        console.log("page " + index + " complete!");

        if (Array.isArray(contentForPage)) {
          const createObjectInsert = contentForPage
            .map((article) => {
              if (!article?.articleID) return null;
              if (!article?.titleMovie) return null;

              return {
                articleID: article?.articleID,
                bgImage: article?.bgImage,
                articleTitle: article?.articleTitle,
                articleDescription: article.articleDescription,
                articleReview: article?.articleReview,
                articleDataFromatting: article?.articleDataFromatting,
                articleDate: article?.articleDate,
                articleType: article?.articleType,
                titleMovie: article?.titleMovie,
              };
            })
            .filter(Boolean);

          responseAll = responseAll.concat(createObjectInsert);
        }
        await sleep(500);
        index++;
      }
    }

    const reorderResponse = responseAll.sort(
      (a, b) =>
        new Date(a?.articleDataFromatting) - new Date(b?.articleDataFromatting)
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ result: reorderResponse }),
    };
  } catch (err) {
    if (responseAll && Array.isArray(responseAll) && responseAll.length > 0) {
      const reorderResponse = responseAll.sort(
        (a, b) =>
          new Date(a?.articleDataFromatting) -
          new Date(b?.articleDataFromatting)
      );

      return {
        statusCode: 200,
        body: JSON.stringify({ result: reorderResponse }),
      };
    }

    console.log("err", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ err }),
    };
  }
};
