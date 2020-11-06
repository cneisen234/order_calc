const GoogleSpreadsheet = require('google-spreadsheet')
const { promisify } = require('util')
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// set up our middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("server/public"));

const creds = require('../client_secret.json')
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
      const doc = new GoogleSpreadsheet(
        process.env.SPREADSHEET
      );
      await promisify(doc.useServiceAccountAuth)(creds);
      const info = await promisify(doc.getInfo)();
      const sheet = info.worksheets[0];
      console.log("im running");
      let rowCount = sheet.rowCount;
      rowCountGlobal = rowCount;
      console.log(rowCount);
      if (offset <= rowCount) {
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
    }
    setTimeout(() => {
      if (stopVar === true) {
        return;
      }
      offset += 10;
      accessSpreadsheet();
      console.log("offset is", offset);
      res.send(offset)
      getReport();
    }, 10000);
  }
  getReport();
});
   //loading on port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("server running on: ", PORT);
});
   