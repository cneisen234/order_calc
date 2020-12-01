const GoogleSpreadsheet = require('google-spreadsheet')
const { promisify } = require('util')
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
require("dotenv").config();

// set up our middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("server/public"));

let forcestop = false

app.get("/forcestop", (req, res) => {
  forcestop = true
  setTimeout(() => {
    forcestop = false
  }, 20000);
})

const creds = {
  type: "service_account",
  project_id: "order-calc",
  private_key_id: process.env.PRIVATEKEYID,
  private_key: process.env.PRIVATEKEY,
  client_email: process.env.CLIENTEMAIL,
  client_id: process.env.CLIENTID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/sheets%40order-calc.iam.gserviceaccount.com",
};

app.get("/progress", (req, res) => {
  function printReport(report) {
    let sku = report.sku;
    let items = report.items;
    let lastsku = sku.slice(sku.length - 1);
    let lastsku2 = sku.slice(sku.length - 2);
    let lastsku3 = sku.slice(sku.length - 5);
    items = Number(items);
    lastsku = Number(lastsku);
    lastsku2 = Number(lastsku2);
    console.log(`product ID: ${report.productid}`);
    console.log(`sku: ${sku}`);
    console.log(`lastsku: ${lastsku}`);
    console.log(`lastsku2: ${lastsku2}`);
    console.log(`lastsku3: ${lastsku3}`);
    console.log(`items: ${items}`);
    console.log(`total 50 ${report.yardrolls}`);
    if (lastsku3 === "Sheet" || lastsku3 === "SHEET") {
      let calc = items / 150;
      console.log("this is calc for Sheet", calc);
    } else if (lastsku2 === 10) {
      let calc = items / 5;
      console.log("this is calc for 10", calc);
    } else if (lastsku2 === 25) {
      let calc = items / 2;
      console.log("this is calc for 25", calc);
    } else if (lastsku2 === 50) {
      let calc = items / 1;
      console.log("this is calc for 50", calc);
    } else if (lastsku === 1) {
      let calc = items / 50;
      console.log("this is calc for 1", calc);
    } else if (lastsku === 5) {
      let calc = items / 10;
      console.log("this is calc for 5", calc);
    }
    console.log("offset is", offset);
    // console.log("limit is", limit);
    console.log(`---------------------------`);
  }

  let offset = -9;
  let stopVar = false;

  function getReport() {
    async function accessSpreadsheet() {
      try {
      const doc = new GoogleSpreadsheet(process.env.SPREADSHEET);
      await promisify(doc.useServiceAccountAuth)(creds);
 
      const info = await promisify(doc.getInfo)();
      const sheet = info.worksheets[0];
      console.log("im running");
      let rowCount = sheet.rowCount;
      rowCountGlobal = rowCount;
      console.log(rowCount);
      if (offset <= rowCount && forcestop === false) {
        console.log("and I'm running to");
        const rows = await promisify(sheet.getRows)({
          offset: offset,
          limit: 10,
        });
        rows.forEach((row) => {
          let sku = row.sku;
          let items = row.items;
          let lastsku = sku.slice(sku.length - 1);
          let lastsku2 = sku.slice(sku.length - 2);
          let lastsku3 = sku.slice(sku.length - 5);
          items = Number(items);
          lastsku = Number(lastsku);
          lastsku2 = Number(lastsku2);
          if (
            lastsku3 === "Sheet" ||
            lastsku3 === "SHEET" ||
            lastsku3 === "sheet"
          ) {
            let calc = items / 150;
            row.yardrolls = calc;
            row.save();
          } else if (lastsku2 === 10) {
            let calc = items / 5;
            row.yardrolls = calc;
            row.save();
          } else if (lastsku2 === 25) {
            let calc = items / 2;
            row.yardrolls = calc;
            row.save();
          } else if (lastsku2 === 50) {
            row.yardrolls = items;
            row.save();
          } else if (lastsku === 1) {
            let calc = items / 50;
            row.yardrolls = calc;
            row.save();
          } else if (lastsku === 5) {
            let calc = items / 10;
            row.yardrolls = calc;
            row.save();
          }
          printReport(row);
        });
      } else {
        stopVar = true;
        return;
      }
          console.log("rowCountGlobal", rowCountGlobal)
        rowCountGlobal = String(rowCountGlobal)
        res.status(201).send(rowCountGlobal);
      } catch (err) {
       console.log("this is the error", err);
      }
    }
    setTimeout(() => {
      if (stopVar === true) {
        return;
      }
      offset += 10;
      accessSpreadsheet();
      console.log("offset is", offset);
      getReport();
    }, 10000);
    accessSpreadsheet()
  }
  getReport()
});

app.get("/art", (req, res) => {
  function printArtReport(report) {
    let sku = report.sku;
    let items = report.items;
    let lastsku = sku.slice(sku.length - 1);
    items = Number(items);
    lastsku = Number(lastsku);
    console.log(`sku: ${sku}`);
    console.log(`lastsku: ${lastsku}`);
    console.log(`items: ${items}`);
    console.log(`total ${report.calc}`);
    if (lastsku === 1) {
      let calc = items / 50;
      console.log("this is calc for 1", calc);
    } else if (lastsku === 5) {
      let calc = items / 10;
      console.log("this is calc for 5", calc);
    }
    console.log("offset is", offset);
    // console.log("limit is", limit);
    console.log(`---------------------------`);
  }

  let offset = -9;
  let stopVar = false;

  function getArtReport() {
    async function accessSpreadsheet() {
      try {
      const doc = new GoogleSpreadsheet(
        "1LSxm-aJNqi1tOGBkvG_Qmh1IkQGgKSCbdOu08TrltfI"
      );
        await promisify(doc.useServiceAccountAuth)(creds);
      const info = await promisify(doc.getInfo)();
      const sheet = info.worksheets[1];
      console.log("im running");
      let rowCount = sheet.rowCount;
      rowCountGlobal = rowCount;
      console.log(rowCount);
      if (offset <= rowCount && forcestop === false) {
        console.log("and I'm running to");
        const rows = await promisify(sheet.getRows)({
          offset: offset,
          limit: 10,
        });
        rows.forEach((row) => {
          let sku = row.sku;
          let items = row.items;
          let lastsku = sku.slice(sku.length - 1);
          items = Number(items);
          lastsku = Number(lastsku);
          if (lastsku === 1) {
            let calc = items / 150;
            row.calc = calc;
            row.save();
          } else if (lastsku === 5) {
            let calc = items / 30;
            row.calc = calc;
            row.save();
          }
          printArtReport(row);
        });
      } else {
        stopVar = true;
        return;
      }
          console.log("rowCountGlobal", rowCountGlobal)
        rowCountGlobal = String(rowCountGlobal)
        res.status(201).send(rowCountGlobal);
      } catch (err) {
       console.log("this is the error", err);
      }
    }
    setTimeout(() => {
      if (stopVar === true) {
        return;
      }
      offset += 10;
      accessSpreadsheet();
      console.log("offset is", offset);
      getArtReport();
    }, 10000);
    accessSpreadsheet()
  }
  getArtReport()
});

app.get("/therm", (req, res) => {
  function printThermReport(report) {
    let sku = report.sku;
    let items = report.items;
    let lastsku = sku.slice(sku.length - 1);
    let lastsku2 = sku.slice(sku.length - 2);
    let lastsku3 = sku.slice(sku.length - 5);
    items = Number(items);
    lastsku = Number(lastsku);
    lastsku2 = Number(lastsku2);
    console.log(`sku: ${sku}`);
    console.log(`lastsku: ${lastsku}`);
    console.log(`lastsku2: ${lastsku2}`);
    console.log(`lastsku3: ${lastsku3}`);
    console.log(`items: ${items}`);
    console.log(`total 30 ${report.thirtyyards}`);
    console.log(`total 50 ${report.fiftyyards}`);
    if (lastsku3 === "Sheet" || lastsku3 === "SHEET" || lastsku3 === "sheet") {
      let thirty = items / 90;
      let fifty = items / 150;
        console.log("this is calc for Sheet for 30", thirty);
        console.log("this is calc for Sheet for 50", fifty);
      } else if (lastsku2 === 10) {
        let thirty = items / 3;
        let fifty = items / 5;
        console.log("this is calc for 10 for 30 yard rolls", thirty);
        console.log("this is calc for 10 for 50 yard rolls", fifty);
      } else if (lastsku2 === 20) {
        let thirty = items / 1.5;
        let fifty = items / 2.5;
        console.log("this is calc for 20 for 30 yard rolls", thirty);
        console.log("this is calc for 20 for 50 yard rolls", fifty);
      } else if (lastsku2 === 30) {
        let thirty = items / 1;
        let fifty = items / 1.6;
        console.log("this is calc for 30 for 30 yard rolls", thirty);
        console.log("this is calc for 30 for 50 yard rolls", fifty);
      } else if (lastsku2 === 50) {
        let thirty = items * 1.67;
        let fifty = items / 1;
        console.log("this is calc for 50 for 30 yard rolls", thirty);
        console.log("this is calc for 50 for 50 yard rolls", fifty);
      } else if (lastsku === 1) {
        let thirty = items / 30;
        let fifty = items / 50;
        console.log("this is calc for 1 for 30 yard rolls", thirty);
        console.log("this is calc for 1 for 50 yard rolls", fifty);
      } else if (lastsku === 5) {
        let thirty = items / 6;
        let fifty = items / 10;
        console.log("this is calc for 5 for 30 yard rolls", thirty);
        console.log("this is calc for 5 for 50 yard rolls", fifty);
      }
    console.log("offset is", offset);
    console.log(`---------------------------`);
  }

  let offset = -9;
  let stopVar = false;

  function getThermReport() {
    async function accessSpreadsheet() {
      try {
        const doc = new GoogleSpreadsheet(
          process.env.SPREADSHEET
        );
        await promisify(doc.useServiceAccountAuth)(creds);
        const info = await promisify(doc.getInfo)();
        const sheet = info.worksheets[2];
        console.log("im running");
        let rowCount = sheet.rowCount;
        rowCountGlobal = rowCount;
        console.log(rowCount);
        if (offset <= rowCount && forcestop === false) {
          console.log("and I'm running to");
          const rows = await promisify(sheet.getRows)({
            offset: offset,
            limit: 10,
          });
          rows.forEach((row) => {
            let sku = row.sku;
            let items = row.items;
            let lastsku = sku.slice(sku.length - 1);
            let lastsku2 = sku.slice(sku.length - 2);
            let lastsku3 = sku.slice(sku.length - 5);
            items = Number(items);
            lastsku = Number(lastsku);
            lastsku2 = Number(lastsku2);
            if (
              lastsku3 === "Sheet" ||
              lastsku3 === "SHEET" ||
              lastsku3 === "sheet"
            ) {
              let thirty = items / 90;
              let fifty = items / 150;
              row.thirtyyards = thirty;
              row.fiftyyards = fifty;
              row.save();
            } else if (lastsku2 === 10) {
              let thirty = items / 3;
              let fifty = items / 5;
              row.thirtyyards = thirty;
              row.fiftyyards = fifty;
              row.save();
            } else if (lastsku2 === 20) {
              let thirty = items / 1.5;
              let fifty = items / 2.5;
              row.thirtyyards = thirty;
              row.fiftyyards = fifty;
              row.save();
            } else if (lastsku2 === 30) {
              let thirty = items / 1;
              let fifty = items / 1.6;
              row.thirtyyards = thirty;
              row.fiftyyards = fifty;
              row.save();
            } else if (lastsku2 === 50) {
              let thirty = items * 1.67;
              let fifty = items / 1;
              row.thirtyyards = thirty;
              row.fiftyyards = fifty;
              row.save();
            } else if (lastsku === 1) {
              let thirty = items / 30;
              let fifty = items / 50;
              row.thirtyyards = thirty;
              row.fiftyyards = fifty;
              row.save();
            } else if (lastsku === 5) {
              let thirty = items / 6;
              let fifty = items / 10;
              row.thirtyyards = thirty;
              row.fiftyyards = fifty;
              row.save();
            }
            printThermReport(row);
          });
        } else {
          stopVar = true;
          return;
        }
        console.log("rowCountGlobal", rowCountGlobal)
        rowCountGlobal = String(rowCountGlobal)
        res.status(201).send(rowCountGlobal);
      } catch (err) {
       console.log("this is the error", err);
      }
    }
    setTimeout(() => {
      if (stopVar === true) {
        return;
      }
      offset += 10;
      accessSpreadsheet();
      console.log("offset is", offset);
      getThermReport();
    }, 10000);
    accessSpreadsheet()
  }
  getThermReport()
});
   //loading on port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("server running on: ", PORT);
});
   