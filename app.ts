import axios from "axios";
import fs from "fs";
import { DateTime } from "luxon";

axios.defaults.headers.common["charset"] = "iso-8859-1";
axios.defaults.headers.common["User-Agent"] = "demokarte.live parser v1.0";

var mapFile = fs.createWriteStream("mapdata.js", {
  flags: "a", // 'a' means appending (old data will be preserved)
});

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

axios
  .get(
    "https://www.berlin.de/polizei/service/versammlungsbehoerde/versammlungen-aufzuege/index.php/index/all.json?q="
  )
  .then((res) => {
    for (let i = 0; i < res.data.index.length; i++) {
      const el = res.data.index[i];
      //if (el.datum != "01.06.2021") continue;
      if (el.plz != "" && el.strasse_nr != "") {
        axios
          .get(
            `https://geo.fff.gay/search.php?street=${encodeURIComponent(
              el.strasse_nr
            )}&postalcode=${encodeURIComponent(
              el.plz
            )}&city=Berlin&country=DE&format=json&email=${encodeURIComponent(
              "demokarte@karl-beecken.de"
            )}`
          )
          .then((res) => {
            console.log(el.thema);
            console.log(res.data[0].lat, res.data[0].lon);
            let entry = `L.marker([${res.data[0].lat},${res.data[0].lon}]).addTo(map).bindPopup('<b>${el.thema}</b><br>${el.datum}, ${el.von} - ${el.bis}<br>${el.strasse_nr}, ${el.plz} Berlin');
`;
            mapFile.write(entry);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  });
