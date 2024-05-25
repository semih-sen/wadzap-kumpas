const { Client, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const axios = require("axios");
const imp = require("./jj.json");
const { floor, random } = require("mathjs")

function generateRandom(min = 0, max = 100) {
	return floor(random() * (max - min)) + min
}

const client = new Client({
  webVersionCache: {
    type: "remote",
    remotePath:
      "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
  },
});

client.on("ready", async () => {
  console.log("Client is ready!");
  var res = await axios.get(
    "https://api.nasa.gov/planetary/apod?api_key=u5RZN49pOppd9JmVoi4GW1ranY6m4kwRThWslcxK&count=100"
  );
  for (var i = 0; i < res.data.length; i++) {
    if(res.data[i].url.startsWith("//")){
        continue;//Bazen "//youtube.com linkleri geliyor. Onu engellemek için"
    }
    let domain = new URL(res.data[i].url);
    if (domain.hostname == "apod.nasa.gov") {
      let random = generateRandom(0, imp.imps.length);
      let cumle = imp.imps[random];
      random = generateRandom(0, cumle.sentences.length);
      let soz = cumle.sentences[random];
      var media = await MessageMedia.fromUrl(res.data[i].url, {
        unsafeMime: true,
      });
      if (res.data[i].url.slice(-3) == "jpg") {
        media.mimetype = "image/jpeg";
      } else if (res.data[i].url.slice(-3) == "gif") {
        media.mimetype = "image/gif";
      }
//Kumpas kurduğunuz kişinin numarasını 905*********@c.us şeklinde yazın
      client.sendMessage("@c.us", media, {
        caption: `${soz}\n\t${cumle.author || "Anonim"}`,
      });
    } else {
      continue;
    }
  }
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.initialize();
