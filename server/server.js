const GoogleSpreadsheet = require('google-spreadsheet')
const { promisify } = require('util')
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
require("dotenv").config();

// set up our middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("server/public"));

const creds = {
  type: "service_account",
  project_id: "order-calc",
  private_key_id: process.env.PRIVATEKEYID,
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDoQZADD3iSPmTW\nHhZTjIm4mFnodnOxQBhytLSzIUu56GtI05HYGrFAy0vhi2Aks0G5KahhOQ4R8zaR\njcoUXh+lpkSVFsLVdGJPw4SSWmrlwEg8EKpjyVbLk2xnMaCssEuCI9MBkxTnFgpg\ndc6TfNIl8E64gQvPdlpemOx/oRxQFA2R9nprsZt4Nwwrc1ZNS1vnEUSDX2zrqgSy\ndR72vssUJpWhLb/KhzZD0nDv2zHCaVOAz/34gIahKDhP1hzmcxrc81LVqc1Mqfhm\nxG7WFyn60CxRRLhjZniGS7yuyiJfnq+LyWGdP3D2QlkjY3oxyTrH+pkzJXMT4d4g\nNiJfIqcjAgMBAAECggEAOLWZdkXWyM6XTHi4Nto/3mTEvy/8+7CMx6U74eklVlVb\nrMKL/9o0oX+CHaYsaYmjaJS1WlfWCaf7EPsv9l0tGQNKB6UxGXF7d8JjomCVbVfP\ny2q+T/MfUEHE3EWP19qL9VDN+rpxBiOpkPfy4qw9m6nbbs2DlrptQl/QjzFFen+T\n4vvu1HMj+VudqD2u73xVDni3KiUv1emUwEwE1qQVQxqXRWRmdKoTymOIcRTQDebr\n0q1w0RD0qncsu0GDXcZpbPjA4tHMTBwOBmwkJgiR4+HpqOFnp2jfgHuPW7Rzkh5p\nafVT3dK0jdcrlVOeiFBca0FZ2vR1ngCNZM6PtYTmAQKBgQD2oCr4HXEQ9u6GjgDi\nwm7wzSuZKggpW/l+g2oDSp6EXwmZME5AnQ/BCCDF195+UX685Fu09adtapQtSeUK\nycC2+hJi0zoy3ZcgG/MFG8JwICBDvyamMC9Lj87cpp3Vww5lRH+I7oXIELqXX8rN\nixCh+jtrBOrgokHqwVSSWXShgQKBgQDxFZHCWwTcmUlu/wNwOmccwxh8G+9XWWbT\npeVuPlVDXGQC31QXt65Ks/pRZipPH0dpwllqqa3HuohICF6VRmxU7AbStUAq1VPD\nOzOJHPaQH805YUZIEXu6fdBa8LkX33/iOLfqW59aXqO7CXTXVcHEnMO88RyExjAB\nnn1oJ2TSowKBgQDhA41wxtvsEH/cAB/KxH8X8PnAStsbcTEXPqswyZoLR/Kn86zR\nwvsmsVXFbIkxUwWBLhCF8EOLztvW3j69MwpDZ7HyvKmy0v4Za6a0mHk0d/s4FGUc\n54WfOVwRcWs8JzUxK+f4dTdWK/0yM1IDasgIIRipMdlijmf52d5hkICbAQKBgQDS\n0+oD7VTzFZoCV0DKhEhn/rUK0+MaoDQsIofhQOGPZtyPJn6Dvz3MVlgxlwao6tGo\nyy0m+fvfDmDfnXIZWNyj50SQP7E9xBDcSolm/s0gfK8b3tV3cNKi5COxY5J6LhnH\n25H6gOV6QgktJ7fmGDi7l9wU/0XRVv/kapWA3/JrwQKBgAh6OZknsEMgkjDTZ1e5\n60gDsrcsVaYo3a/BlMSqH2AquDAAazvWp5TUagHazf0MtLXPF1Gdk0Cw8bs0S99u\nt1N0qx4khu21Euc7PK3O2VIyRODkBcBdzpRxChdLY7WIGm1pKEnvu1R9W0uCBYtp\n+QUU68jxH+fekq2QWzS1PcHg\n-----END PRIVATE KEY-----\n",
  client_email: "sheets@order-calc.iam.gserviceaccount.com",
  client_id: "106869341541653929788",
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
      const doc = new GoogleSpreadsheet(
        "1LSxm-aJNqi1tOGBkvG_Qmh1IkQGgKSCbdOu08TrltfI"
      );
      try {
      await promisify(doc.useServiceAccountAuth)(creds);
      } catch (error) {
        console.log("first promise failed", error)
      }
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
      getReport();
    }, 10000);
    accessSpreadsheet()
      .then(() => res.send("This worked!"))
      .catch((error) => res.send(`Error: ${error}`));
  }
  getReport();
});
   //loading on port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("server running on: ", PORT);
});
   