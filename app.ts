import axios from "axios";

axios.defaults.headers.common["charset"] = "iso-8859-1";
axios.defaults.headers.common["User-Agent"] = "demokarte.live parser v1.0";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

axios
  .get(
    "https://www.berlin.de/polizei/service/versammlungsbehoerde/versammlungen-aufzuege/index.php/index/all.json?q="
  )
  .then(async (res) => {
    for (let i = 0; i < res.data.index.length; i++) {
      await delay(1000);
      const el = res.data.index[i];
      console.log(el);
      if (el.plz != "" && el.strasse_nr != "") {
        await axios
          .get(
            `https://nominatim.openstreetmap.org/search/?street=${encodeURIComponent(
              el.strasse_nr
            )}&postalcode=${encodeURIComponent(
              el.plz
            )}&city=Berlin&country=DE&format=json&email=${encodeURIComponent(
              "demokarte@karl-beecken.de"
            )}`
          )
          .then((res) => {
            console.log(res.data);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  });
