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
let totalNextSku = ""
let artTotalNextSku = ""
let thermaTotalNextSku = "";
let total = 0
let artTotal = 0
let thermaTotalThirty = 0
let thermaTotalFifty = 0
let switchTotal = false
let artSwitchTotal = false
let thermaSwitchTotal = false
let singleNumber = 0
let artSingleNumber = 0
let thermaSingleNumberThirty = 0
let thermaSingleNumberFifty = 0;
let totalString = ""
let artTotalString = ""
let thermaTotalStringThirty = ""
let thermaTotalStringFifty = "";

app.get("/forcestop", (req, res) => {
  forcestop = true
  total = 0
  setTimeout(() => {
    forcestop = false
  }, 20000);
})

const creds = {
  type: "service_account",
  project_id: "order-calc",
  private_key_id: "4a01c5ce2d66060b1c2c85dea6a404921cbb57eb",
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

  let offset = 0;
  let stopVar = false;

  function getReport() {
    async function accessSpreadsheet() {
      try {
      const doc = new GoogleSpreadsheet(
        "1LSxm-aJNqi1tOGBkvG_Qmh1IkQGgKSCbdOu08TrltfI"
      );
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
          limit: 1,
        });
        rows.forEach((row) => {
          let sku = row.sku;
          let items = row.items;
          let lastsku = sku.slice(sku.length - 1);
          let lastsku2 = sku.slice(sku.length - 2);
          let lastsku3 = sku.slice(sku.length - 5);
          let totalSku = sku.slice(0, 8);
          console.log("totalSku", totalSku);
          console.log("totalNextSku", totalNextSku);
          items = Number(items);
          lastsku = Number(lastsku);
          lastsku2 = Number(lastsku2);
          if (
            lastsku3 === "Sheet" ||
            lastsku3 === "SHEET" ||
            lastsku3 === "sheet"
          ) {
                let calc = items / 150;
                calc = calc.toFixed(3)
                row.yardrolls = calc;
                let yardrolls = Number(row.yardrolls)
                   if (totalNextSku === "") {
                     total = Number(total)
                     total = 0;
                     console.log(
                       "totalNextSku is",
                       totalNextSku,
                       "total is",
                       total
                     );
                     switchTotal = false
                    console.log("switchTotal", switchTotal);
                   } else if (totalNextSku === totalSku) {
                      total = Number(total);
                      console.log("total is before", total)
                      yardrolls = Number(yardrolls)
                      console.log("yardrolls is", yardrolls)
                          if (switchTotal === true) {
                        singleNumber = Number(singleNumber);
                        total = Number(total);
                        total = total + singleNumber;
                        total = Number(total);
                      }
                     total = total + yardrolls;
                     switchTotal = false
                     console.log("switchTotal", switchTotal)
                     console.log("total is", total);
                   } else {
                         if (switchTotal === true) {
                           singleNumber = Number(singleNumber);
                           total = Number(total);
                           total = total + singleNumber;
                           total = Number(total);
                         }
                     total = total.toFixed(3);
                     total = Number(total);
                     totalString = "Total for " + totalNextSku + " is " + total;
                     totalNextSku = totalSku;
                     row.total = totalString;
                     console.log("row.total is", row.total);
                         total = 0;
                     switchTotal = true
                     singleNumber = row.yardrolls
                     singleNumber = Number(singleNumber)
                    console.log("switchTotal", switchTotal);
                   
                   }
                   totalNextSku = totalSku;
            row.save();
          } else if (lastsku2 === 10) {
                  let calc = items / 5;
                  calc = calc.toFixed(3)
                  row.yardrolls = calc;
                  let yardrolls = Number(row.yardrolls);
                    if (totalNextSku === "") {
                      total = 0;
                      console.log(
                        "totalNextSku is",
                        totalNextSku,
                        "total is",
                        total
                      );
                      switchTotal = false
                       console.log("switchTotal", switchTotal);
                    } else if (totalNextSku === totalSku) {
                          total = Number(total);
                          console.log("total is before", total);
                          yardrolls = Number(yardrolls);
                        console.log("yardrolls is", yardrolls);
                            if (switchTotal === true) {
                              singleNumber = Number(singleNumber);
                              total = Number(total);
                              total = total + singleNumber;
                              total = Number(total);
                            }
                      total = total + yardrolls;
                      console.log("total is", total);
                      switchTotal = false
                    } else {
                          if (switchTotal === true) {
                            singleNumber = Number(singleNumber);
                            total = Number(total);
                            total = total + singleNumber;
                            total = Number(total);
                          }
                      total = Number(total);
                      total = total.toFixed(3);
                      totalString = "Total for " + totalNextSku + " is " + total;
                      totalNextSku = totalSku;
                      row.total = totalString;
                      console.log("row.total is", row.total);
                          total = 0;
                      switchTotal = true
                        singleNumber = row.yardrolls;
                        singleNumber = Number(singleNumber);
                       console.log("switchTotal", switchTotal)
                    }
                    totalNextSku = totalSku;
            row.save();
          } else if (lastsku2 === 25) {
              let calc = items / 2;
              calc = calc.toFixed(3)
              row.yardrolls = calc;
              let yardrolls = Number(row.yardrolls);
                    if (totalNextSku === "") {
                      total = 0;
                      console.log(
                        "totalNextSku is",
                        totalNextSku,
                        "total is",
                        total
                      );
                      switchTotal = false
                       console.log("switchTotal", switchTotal)
                    } else if (totalNextSku === totalSku) {
                          total = Number(total);
                          console.log("total is before", total);
                          yardrolls = Number(yardrolls);
                        console.log("yardrolls is", yardrolls);
                            if (switchTotal === true) {
                              singleNumber = Number(singleNumber);
                              total = Number(total);
                              total = total + singleNumber;
                              total = Number(total);
                            }
                      total = total + yardrolls;
                      console.log("total is", total);
                      switchTotal = false
                       console.log("switchTotal", switchTotal)
                    } else {
                          if (switchTotal === true) {
                            singleNumber = Number(singleNumber);
                            total = Number(total);
                            total = total + singleNumber;
                            total = Number(total);
                          }
                      total = total.toFixed(3);
                      totalString = "Total for " + totalNextSku + " is " + total;
                      totalNextSku = totalSku;
                      row.total = totalString;
                      console.log("row.total is", row.total);
                          total = 0;
                      switchTotal = true
                        singleNumber = row.yardrolls;
                        singleNumber = Number(singleNumber);
                       console.log("switchTotal", switchTotal)
                    }
                    totalNextSku = totalSku;
            row.save();
          } else if (lastsku2 === 50) {
            row.yardrolls = items;
            let yardrolls = Number(row.yardrolls);
                    if (totalNextSku === "") {
                      total = 0;
                      console.log(
                        "totalNextSku is",
                        totalNextSku,
                        "total is",
                        total
                      );
                      switchTotal = false
                    } else if (totalNextSku === totalSku) {
                          total = Number(total);
                          console.log("total is before", total);
                          yardrolls = Number(yardrolls);
                        console.log("yardrolls is", yardrolls);
                            if (switchTotal === true) {
                              singleNumber = Number(singleNumber);
                              total = Number(total);
                              total = total + singleNumber;
                              total = Number(total);
                            }
                      total = total + yardrolls;
                      console.log("total is", total);
                      switchTotal = false
                    } else {
                          if (switchTotal === true) {
                            singleNumber = Number(singleNumber);
                            total = Number(total);
                            total = total + singleNumber;
                            total = Number(total);
                          }
                      total = Number(total);
                      total = total.toFixed(3);
                      totalString = "Total for " + totalNextSku + " is " + total;
                      totalNextSku = totalSku;
                      row.total = totalString;
                      console.log("row.total is", row.total);
                        total = 0
                      switchTotal = true
                        singleNumber = row.yardrolls;
                        singleNumber = Number(singleNumber);
                    }
                    totalNextSku = totalSku;
            row.save();
          } else if (lastsku === 1) {
              let calc = items / 50;
              calc = calc.toFixed(3);
              row.yardrolls = calc;
              let yardrolls = Number(row.yardrolls);
                    if (totalNextSku === "") {
                      total = 0;
                      console.log(
                        "totalNextSku is",
                        totalNextSku,
                        "total is",
                        total
                      );
                      switchTotal = false
                    } else if (totalNextSku === totalSku) {
                          total = Number(total);
                          console.log("total is before", total);
                          yardrolls = Number(yardrolls);
                        console.log("yardrolls is", yardrolls);
                            if (switchTotal === true) {
                              singleNumber = Number(singleNumber);
                              total = Number(total);
                              total = total + singleNumber;
                              total = Number(total);
                            }
                      total = total + yardrolls;
                      console.log("total is", total);
                      switchTotal = false
                    } else {
                          if (switchTotal === true) {
                            singleNumber = Number(singleNumber);
                            total = Number(total);
                            total = total + singleNumber;
                            total = Number(total);
                          }
                      total = Number(total);
                      total = total.toFixed(3);
                      totalString = "Total for " + totalNextSku + " is " + total;
                      totalNextSku = totalSku;
                      row.total = totalString;
                      console.log("row.total is", row.total);
                          total = 0;
                      switchTotal = true
                        singleNumber = row.yardrolls;
                        singleNumber = Number(singleNumber);
                    }
                    totalNextSku = totalSku;
            row.save();
          } else if (lastsku === 5) {
               let calc = items / 10;
               calc = calc.toFixed(3);
               row.yardrolls = calc;
               let yardrolls = Number(row.yardrolls)
               if (totalNextSku === "") {
                total = 0
                switchTotal = false
               } else if (totalNextSku === totalSku) {
                          total = Number(total);
                          console.log("total is before", total);
                          yardrolls = Number(yardrolls);
                        console.log("yardrolls is", yardrolls);
                            if (switchTotal === true) {
                              singleNumber = Number(singleNumber);
                              total = Number(total);
                              total = total + singleNumber;
                              total = Number(total);
                            }
                      total = total + yardrolls;
                      console.log("total is", total);
                      switchTotal = false
                    } else {
                          if (switchTotal === true) {
                            singleNumber = Number(singleNumber);
                            total = Number(total);
                            total = total + singleNumber;
                            total = Number(total);
                          }
                      total = Number(total);
                      total = total.toFixed(3);
                      totalString = "Total for " + totalNextSku + " is " + total;
                      totalNextSku = totalSku;
                      row.total = totalString;
                      console.log("row.total is", row.total);
                          total = 0;
                      switchTotal = true
                      singleNumber = row.yardrolls;
                      singleNumber = Number(singleNumber);
                    }
                    totalNextSku = totalSku;
                    row.save();
          } else if (sku === "done") {
              if (switchTotal === true) {
                singleNumber = Number(singleNumber);
                total = Number(total);
                total = total + singleNumber;
                total = Number(total);
              }
                    total = Number(total);
                    total = total.toFixed(3);
                    totalString = "Total for " + totalNextSku + " is " + total;
                    row.total = totalString;
                    console.log("row.total is", row.total);
                        total = 0;
                    singleNumber = row.yardrolls;
                    singleNumber = Number(singleNumber);
                    row.save();
                    stopVar = true;
                    return null
          }
          offset += 1;
        });
      } else {
        stopVar = true;
        return;
      }
          console.log("rowCountGlobal", rowCountGlobal)
        rowCountGlobal = String(rowCountGlobal)
        if (offset === 0 || offset === 2 || offset === 4) {
        res.send(rowCountGlobal);
        }
      } catch (err) {
       console.log("this is the error", err);
      }
    }
    setTimeout(() => {
       if (stopVar === true) {
         return;
       }
      console.log("offset is", offset);
      getReport();
    }, 5000);
    accessSpreadsheet()
  }
  getReport()
});

app.get("/art", (req, res) => {

  let offset = 0;
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
          limit: 1,
        });
        rows.forEach((row) => {
          let sku = row.sku;
          let items = row.items;
          let lastsku = sku.slice(sku.length - 1);
          let artTotalSku = sku.slice(0, 7);
          items = Number(items);
          lastsku = Number(lastsku);
          if (lastsku === 1) {
            let calc = items / 150;
            calc = Number(calc);
            calc = calc.toFixed(3);
            row.calc = calc;
            let artCalc = row.calc;
            artCalc = Number(artCalc);
            if (artTotalNextSku === "") {
              artTotal = 0;
              artCalc = Number(artCalc);
              console.log(
                "artTotalNextSku is",
                artTotalNextSku,
                "total is",
                artTotal
              );
              artSwitchTotal = false;
            } else if (artTotalNextSku === artTotalSku) {
              artTotal = Number(artTotal);
              console.log("artTotal is before", artTotal);
              artCalc = Number(artCalc);
              console.log("artCalc is", artCalc);
              if (artSwitchTotal === true) {
                artSingleNumber = Number(artSingleNumber);
                artTotal = Number(artTotal);
                console.log(
                  "artSingleNumber before",
                  artSingleNumber,
                  "type of",
                  typeof artSingleNumber
                );
                console.log(
                  "artTotal before",
                  artTotal,
                  "type of",
                  typeof artTotal
                );
                artTotal = artTotal + artSingleNumber;
                console.log("artTotal", artTotal);
                artTotal = Number(artTotal);
              }
              artTotal = artTotal + artCalc;
              console.log("artTotal is", artTotal);
              artSwitchTotal = false;
            } else {
              if (artSwitchTotal === true) {
                artSingleNumber = Number(artSingleNumber);
                artTotal = Number(artTotal);
                console.log(
                  "artSingleNumber before",
                  artSingleNumber,
                  "type of",
                  typeof artSingleNumber
                );
                console.log(
                  "artTotal before",
                  artTotal,
                  "type of",
                  typeof artTotal
                );
                artTotal = artTotal + artSingleNumber;
                console.log("artTotal", artTotal);
                artTotal = Number(artTotal);
              }
              artTotal = Number(artTotal);
              artTotal = artTotal.toFixed(3);
              artTotalString =
                "Total for " + artTotalNextSku + " is " + artTotal;
              artTotalNextSku = artTotalSku;
              row.total = artTotalString;
              console.log("row.total is", row.total);
              artTotal = 0;
              artSwitchTotal = true;
              artSingleNumber = row.calc;
              console.log("artSingleNumber", artSingleNumber);
              artSingleNumber = Number(artSingleNumber);
            }
            artTotalNextSku = artTotalSku;
            row.save();
          } else if (lastsku === 5) {
            let calc = items / 30;
            calc = Number(calc);
            calc = calc.toFixed(3);
            row.calc = calc;
            let artCalc = row.calc;
            artCalc = Number(artCalc);
            if (artTotalNextSku === "") {
              artTotal = 0;
              artCalc = Number(artCalc);
              console.log(
                "artTotalNextSku is",
                artTotalNextSku,
                "total is",
                artTotal
              );
              artSwitchTotal = false;
            } else if (artTotalNextSku === artTotalSku) {
              artTotal = Number(artTotal);
              console.log(
                "artSingleNumber before",
                artSingleNumber,
                "type of",
                typeof artSingleNumber
              );
              console.log(
                "artTotal before",
                artTotal,
                "type of",
                typeof artTotal
              );
              artCalc = Number(artCalc);
              console.log("artCalc is", artCalc);
              if (artSwitchTotal === true) {
                artSingleNumber = Number(artSingleNumber);
                artTotal = Number(artTotal);
                console.log("artTotal before", artTotal);
                artTotal = artTotal + artSingleNumber;
                console.log("artTotal", artTotal);
                artTotal = Number(artTotal);
              }
              artTotal = artTotal + artCalc;
              console.log("artTotal is", artTotal);
              artSwitchTotal = false;
            } else {
              if (artSwitchTotal === true) {
                artSingleNumber = Number(artSingleNumber);
                artTotal = Number(artTotal);
                console.log(
                  "artSingleNumber before",
                  artSingleNumber,
                  "type of",
                  typeof artSingleNumber
                );
                console.log(
                  "artTotal before",
                  artTotal,
                  "type of",
                  typeof artTotal
                );
                artTotal = artTotal + artSingleNumber;
                console.log("artTotal", artTotal);
                artTotal = Number(artTotal);
              }
              artTotal = Number(artTotal);
              artTotal = artTotal.toFixed(3);
              artTotalString =
                "Total for " + artTotalNextSku + " is " + artTotal;
              artTotalNextSku = artTotalSku;
              row.total = artTotalString;
              console.log("row.total is", row.total);
              artTotal = 0;
              artSwitchTotal = true;
              artSingleNumber = row.calc;
              console.log("artSingleNumber", artSingleNumber);
              artSingleNumber = Number(artSingleNumber);
            }
            artTotalNextSku = artTotalSku;
            row.save();
          } else if (sku === "done") {
                 if (artSwitchTotal === true) {
                   artSingleNumber = Number(artSingleNumber);
                   artTotal = Number(artTotal);
                   console.log(
                     "artSingleNumber before",
                     artSingleNumber,
                     "type of",
                     typeof artSingleNumber
                   );
                   console.log(
                     "artTotal before",
                     artTotal,
                     "type of",
                     typeof artTotal
                   );
                   artTotal = artTotal + artSingleNumber;
                   console.log("artTotal", artTotal);
                   artTotal = Number(artTotal);
                 }
            artTotal = Number(artTotal);
            artTotal = artTotal.toFixed(3);
            artTotalString = "artTotal for " + artTotalNextSku + " is " + artTotal;
            row.total = artTotalString;
            console.log("row.total is", row.total);
            artTotal = 0;
            artSingleNumber = row.calc;
            artSingleNumber = Number(artSingleNumber);
            row.save();
            stopVar = true;
            return null;
          }
        });
      } else {
        stopVar = true;
        return;
      }
          console.log("rowCountGlobal", rowCountGlobal)
        rowCountGlobal = String(rowCountGlobal)
        if (offset === 0 || offset === 2 || offset === 4) {
        res.status(201).send(rowCountGlobal);
        }
      } catch (err) {
       console.log("this is the error", err);
      }
    }
    setTimeout(() => {
        if (stopVar === true) {
          return;
        }
      offset += 1;
      console.log("offset is", offset);
      getArtReport();
    }, 5000);
    accessSpreadsheet()
  }
  getArtReport()
});

app.get("/therm", (req, res) => {
  let stopVar = false;
  let offset = 0;

  function getThermReport() {
    async function accessSpreadsheet() {
      try {
        const doc = new GoogleSpreadsheet(
          "1LSxm-aJNqi1tOGBkvG_Qmh1IkQGgKSCbdOu08TrltfI"
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
            limit: 1,
          });
          rows.forEach((row) => {
            let sku = row.sku;
            let items = row.items;
            let lastsku = sku.slice(sku.length - 1);
            let lastsku2 = sku.slice(sku.length - 2);
            let lastsku3 = sku.slice(sku.length - 5);
            let thermaTotalSku = sku.slice(0, 6);
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
              thirty = thirty.toFixed(3);
              fifty = fifty.toFixed(3);
              row.thirtyyards = thirty;
              row.fiftyyards = fifty;
              thirty = Number(thirty);
              fifty = Number(fifty);
              if (thermaTotalNextSku === "") {
                thermaTotalThirty = Number(thermaTotalThirty);
                thermaTotalThirty = 0;
                thermaTotalFifty = Number(thermaTotalFifty);
                thermaTotalFifty = 0;
                //  console.log(
                //    "thermaTotalNextSku is",
                //    thermaTotalNextSku,
                //    "total is",
                //    total
                //  );
                ThermaSwitchTotal = false;
                console.log("thermaSwitchTotal", thermaSwitchTotal);
              } else if (thermaTotalNextSku === thermaTotalSku) {
                thermaTotalThirty = Number(thermaTotalThirty);
                thermaTotalFifty = Number(thermaTotalFifty);
                //  console.log("total is before", total);
                thirty = Number(thirty);
                fifty = Number(fifty);
                //  console.log("yardrolls is", yardrolls);
                if (thermaSwitchTotal === true) {
                  thermaSingleNumberThirty = Number(thermaSingleNumberThirty);
                  thermaSingleNumberFifty = Number(thermaSingleNumberFifty);
                  thermaTotalThirty = Number(thermaTotalThirty);
                  thermaTotalFifty = Number(thermaTotalFifty);
                  thermaTotalThirty =
                    thermaTotalThirty + thermaSingleNumberThirty;
                  thermaTotalFifty = thermaTotalFifty + thermaSingleNumberFifty;
                  thermaTotalThirty = Number(thermaTotalThirty);
                  thermaTotalFifty = Number(thermaTotalFifty);
                }
                thermaTotalThirty = thermaTotalThirty + thirty;
                thermaTotalFifty = thermaTotalFifty + fifty;
                thermaSwitchTotal = false;
                //  console.log("switchTotal", switchTotal);
                //  console.log("total is", total);
              } else {
                if (thermaSwitchTotal === true) {
                  thermaSingleNumberThirty = Number(thermaSingleNumberThirty);
                  thermaSingleNumberFifty = Number(thermaSingleNumberFifty);
                  thermaTotalThirty = Number(thermaTotalThirty);
                  thermaTotalFifty = Number(thermaTotalFifty);
                  thermaTotalThirty =
                    thermaTotalThirty + thermaSingleNumberThirty;
                  thermaTotalFifty = thermaTotalFifty + thermaSingleNumberFifty;
                  thermaTotalThirty = Number(thermaTotalThirty);
                  thermaTotalFifty = Number(thermaTotalFifty);
                }
                thermaTotalThirty = thermaTotalThirty.toFixed(3);
                thermaTotalFifty = thermaTotalFifty.toFixed(3);
                thermaTotalThirty = Number(thermaTotalThirty);
                thermaTotalFifty = Number(thermaTotalFifty);
                thermaTotalStringThirty =
                  "Total 30 yards for " +
                  thermaTotalNextSku +
                  " is " +
                  thermaTotalThirty;
                thermaTotalStringFifty =
                  "Total 50 yards for " +
                  thermaTotalNextSku +
                  " is " +
                  thermaTotalFifty;
                thermaTotalNextSku = thermaTotalSku;
                 row.totalthirty = thermaTotalStringThirty;
                 row.totalfifty = thermaTotalStringFifty;
                //  console.log("row.total is", row.total);
                thermaTotalThirty = 0;
                thermaTotalFifty = 0;
                thermaSwitchTotal = true;
                thermaSingleNumberThirty = row.thirtyyards;
                thermaSingleNumberFifty = row.fiftyyards;
                thermaSingleNumberThirty = Number(thermaSingleNumberThirty);
                thermaSingleNumberFifty = Number(thermaSingleNumberFifty);
                   console.log(
                     "thermaSingleNumberFifty",
                     thermaSingleNumberFifty
                   );
              }
              thermaTotalNextSku = thermaTotalSku;
              row.save();
            } else if (lastsku2 === 10) {
              let thirty = items / 3;
              let fifty = items / 5;
              thirty = thirty.toFixed(3);
              fifty = fifty.toFixed(3);
              row.thirtyyards = thirty;
              row.fiftyyards = fifty;
              thirty = Number(thirty);
              fifty = Number(fifty);
              if (thermaTotalNextSku === "") {
                thermaTotalThirty = Number(thermaTotalThirty);
                thermaTotalThirty = 0;
                thermaTotalFifty = Number(thermaTotalFifty);
                thermaTotalFifty = 0;
                //  console.log(
                //    "thermaTotalNextSku is",
                //    thermaTotalNextSku,
                //    "total is",
                //    total
                //  );
                ThermaSwitchTotal = false;
                console.log("thermaSwitchTotal", thermaSwitchTotal);
              } else if (thermaTotalNextSku === thermaTotalSku) {
                thermaTotalThirty = Number(thermaTotalThirty);
                thermaTotalFifty = Number(thermaTotalFifty);
                //  console.log("total is before", total);
                thirty = Number(thirty);
                fifty = Number(fifty);
                //  console.log("yardrolls is", yardrolls);
                if (thermaSwitchTotal === true) {
                  thermaSingleNumberThirty = Number(thermaSingleNumberThirty);
                  thermaSingleNumberFifty = Number(thermaSingleNumberFifty);
                  thermaTotalThirty = Number(thermaTotalThirty);
                  thermaTotalFifty = Number(thermaTotalFifty);
                  thermaTotalThirty =
                    thermaTotalThirty + thermaSingleNumberThirty;
                  thermaTotalFifty = thermaTotalFifty + thermaSingleNumberFifty;
                  thermaTotalThirty = Number(thermaTotalThirty);
                  thermaTotalFifty = Number(thermaTotalFifty);
                }
                thermaTotalThirty = thermaTotalThirty + thirty;
                thermaTotalFifty = thermaTotalFifty + fifty;
                thermaSwitchTotal = false;
                //  console.log("switchTotal", switchTotal);
                //  console.log("total is", total);
              } else {
                if (thermaSwitchTotal === true) {
                  thermaSingleNumberThirty = Number(thermaSingleNumberThirty);
                  thermaSingleNumberFifty = Number(thermaSingleNumberFifty);
                  thermaTotalThirty = Number(thermaTotalThirty);
                  thermaTotalFifty = Number(thermaTotalFifty);
                  thermaTotalThirty =
                    thermaTotalThirty + thermaSingleNumberThirty;
                  thermaTotalFifty = thermaTotalFifty + thermaSingleNumberFifty;
                  thermaTotalThirty = Number(thermaTotalThirty);
                  thermaTotalFifty = Number(thermaTotalFifty);
                }
                thermaTotalThirty = thermaTotalThirty.toFixed(3);
                thermaTotalFifty = thermaTotalFifty.toFixed(3);
                thermaTotalThirty = Number(thermaTotalThirty);
                thermaTotalFifty = Number(thermaTotalFifty);
                 thermaTotalStringThirty =
                   "Total 30 yards for " +
                   thermaTotalNextSku +
                   " is " +
                   thermaTotalThirty;
                 thermaTotalStringFifty =
                   "Total 50 yards for " +
                   thermaTotalNextSku +
                   " is " +
                   thermaTotalFifty;
                thermaTotalNextSku = thermaTotalSku;
                 row.totalthirty = thermaTotalStringThirty;
                 row.totalfifty = thermaTotalStringFifty;
                //  console.log("row.total is", row.total);
                thermaTotalThirty = 0;
                thermaTotalFifty = 0;
                thermaSwitchTotal = true;
                thermaSingleNumberThirty = row.thirtyyards;
                thermaSingleNumberFifty = row.fiftyyards;
                thermaSingleNumberThirty = Number(thermaSingleNumberThirty);
                thermaSingleNumberFifty = Number(thermaSingleNumberFifty);
                 console.log(
                   "thermaSingleNumberFifty",
                   thermaSingleNumberFifty
                 );
              }
              thermaTotalNextSku = thermaTotalSku;
              row.save();
            } else if (lastsku2 === 20) {
              let thirty = items / 1.5;
              let fifty = items / 2.5;
              thirty = thirty.toFixed(3);
              fifty = fifty.toFixed(3);
              row.thirtyyards = thirty;
              row.fiftyyards = fifty;
              thirty = Number(thirty);
              fifty = Number(fifty);
              if (thermaTotalNextSku === "") {
                thermaTotalThirty = Number(thermaTotalThirty);
                thermaTotalThirty = 0;
                thermaTotalFifty = Number(thermaTotalFifty);
                thermaTotalFifty = 0;
                //  console.log(
                //    "thermaTotalNextSku is",
                //    thermaTotalNextSku,
                //    "total is",
                //    total
                //  );
                ThermaSwitchTotal = false;
                console.log("thermaSwitchTotal", thermaSwitchTotal);
              } else if (thermaTotalNextSku === thermaTotalSku) {
                thermaTotalThirty = Number(thermaTotalThirty);
                thermaTotalFifty = Number(thermaTotalFifty);
                //  console.log("total is before", total);
                thirty = Number(thirty);
                fifty = Number(fifty);
                //  console.log("yardrolls is", yardrolls);
                if (thermaSwitchTotal === true) {
                  thermaSingleNumberThirty = Number(thermaSingleNumberThirty);
                  thermaSingleNumberFifty = Number(thermaSingleNumberFifty);
                  thermaTotalThirty = Number(thermaTotalThirty);
                  thermaTotalFifty = Number(thermaTotalFifty);
                  thermaTotalThirty =
                    thermaTotalThirty + thermaSingleNumberThirty;
                  thermaTotalFifty = thermaTotalFifty + thermaSingleNumberFifty;
                  thermaTotalThirty = Number(thermaTotalThirty);
                  thermaTotalFifty = Number(thermaTotalFifty);
                }
                thermaTotalThirty = thermaTotalThirty + thirty;
                thermaTotalFifty = thermaTotalFifty + fifty;
                thermaSwitchTotal = false;
                //  console.log("switchTotal", switchTotal);
                //  console.log("total is", total);
              } else {
                if (thermaSwitchTotal === true) {
                  thermaSingleNumberThirty = Number(thermaSingleNumberThirty);
                  thermaSingleNumberFifty = Number(thermaSingleNumberFifty);
                  thermaTotalThirty = Number(thermaTotalThirty);
                  thermaTotalFifty = Number(thermaTotalFifty);
                  thermaTotalThirty =
                    thermaTotalThirty + thermaSingleNumberThirty;
                  thermaTotalFifty = thermaTotalFifty + thermaSingleNumberFifty;
                  thermaTotalThirty = Number(thermaTotalThirty);
                  thermaTotalFifty = Number(thermaTotalFifty);
                }
                thermaTotalThirty = thermaTotalThirty.toFixed(3);
                thermaTotalFifty = thermaTotalFifty.toFixed(3);
                thermaTotalThirty = Number(thermaTotalThirty);
                thermaTotalFifty = Number(thermaTotalFifty);
              thermaTotalStringThirty =
                "Total 30 yards for " +
                thermaTotalNextSku +
                " is " +
                thermaTotalThirty;
              thermaTotalStringFifty =
                "Total 50 yards for " +
                thermaTotalNextSku +
                " is " +
                thermaTotalFifty;
                thermaTotalNextSku = thermaTotalSku;
                row.totalthirty = thermaTotalStringThirty;
                row.totalfifty = thermaTotalStringFifty;
                //  console.log("row.total is", row.total);
                thermaTotalThirty = 0;
                thermaTotalFifty = 0;
                thermaSwitchTotal = true;
                thermaSingleNumberThirty = row.thirtyyards;
                thermaSingleNumberFifty = row.fiftyyards;
                thermaSingleNumberThirty = Number(thermaSingleNumberThirty);
                thermaSingleNumberFifty = Number(thermaSingleNumberFifty);
                   console.log(
                     "thermaSingleNumberFifty",
                     thermaSingleNumberFifty
                   );
              }
              thermaTotalNextSku = thermaTotalSku;
              row.save();
            } else if (lastsku2 === 30) {
              let thirty = items / 1;
              let fifty = items / 1.6;
              thirty = thirty.toFixed(3);
              fifty = fifty.toFixed(3);
              row.thirtyyards = thirty;
              row.fiftyyards = fifty;
              thirty = Number(thirty);
              fifty = Number(fifty);
              if (thermaTotalNextSku === "") {
                thermaTotalThirty = Number(thermaTotalThirty);
                thermaTotalThirty = 0;
                thermaTotalFifty = Number(thermaTotalFifty);
                thermaTotalFifty = 0;
                //  console.log(
                //    "thermaTotalNextSku is",
                //    thermaTotalNextSku,
                //    "total is",
                //    total
                //  );
                ThermaSwitchTotal = false;
                console.log("thermaSwitchTotal", thermaSwitchTotal);
              } else if (thermaTotalNextSku === thermaTotalSku) {
                thermaTotalThirty = Number(thermaTotalThirty);
                thermaTotalFifty = Number(thermaTotalFifty);
                //  console.log("total is before", total);
                thirty = Number(thirty);
                fifty = Number(fifty);
                //  console.log("yardrolls is", yardrolls);
                if (thermaSwitchTotal === true) {
                  thermaSingleNumberThirty = Number(thermaSingleNumberThirty);
                  thermaSingleNumberFifty = Number(thermaSingleNumberFifty);
                  thermaTotalThirty = Number(thermaTotalThirty);
                  thermaTotalFifty = Number(thermaTotalFifty);
                  thermaTotalThirty =
                    thermaTotalThirty + thermaSingleNumberThirty;
                  thermaTotalFifty = thermaTotalFifty + thermaSingleNumberFifty;
                  thermaTotalThirty = Number(thermaTotalThirty);
                  thermaTotalFifty = Number(thermaTotalFifty);
                }
                thermaTotalThirty = thermaTotalThirty + thirty;
                thermaTotalFifty = thermaTotalFifty + fifty;
                thermaSwitchTotal = false;
                //  console.log("switchTotal", switchTotal);
                //  console.log("total is", total);
              } else {
                if (thermaSwitchTotal === true) {
                  thermaSingleNumberThirty = Number(thermaSingleNumberThirty);
                  thermaSingleNumberFifty = Number(thermaSingleNumberFifty);
                  thermaTotalThirty = Number(thermaTotalThirty);
                  thermaTotalFifty = Number(thermaTotalFifty);
                  thermaTotalThirty =
                    thermaTotalThirty + thermaSingleNumberThirty;
                  thermaTotalFifty = thermaTotalFifty + thermaSingleNumberFifty;
                  thermaTotalThirty = Number(thermaTotalThirty);
                  thermaTotalFifty = Number(thermaTotalFifty);
                }
                thermaTotalThirty = thermaTotalThirty.toFixed(3);
                thermaTotalFifty = thermaTotalFifty.toFixed(3);
                thermaTotalThirty = Number(thermaTotalThirty);
                thermaTotalFifty = Number(thermaTotalFifty);
                thermaTotalStringThirty =
                  "Total 30 yards for " +
                  thermaTotalNextSku +
                  " is " +
                  thermaTotalThirty;
                thermaTotalStringFifty =
                  "Total 50 yards for " +
                  thermaTotalNextSku +
                  " is " +
                  thermaTotalFifty;
                thermaTotalNextSku = thermaTotalSku;
                  row.totalthirty = thermaTotalStringThirty;
                  row.totalfifty = thermaTotalStringFifty;
                //  console.log("row.total is", row.total);
                thermaTotalThirty = 0;
                thermaTotalFifty = 0;
                thermaSwitchTotal = true;
                thermaSingleNumberThirty = row.thirtyyards;
                thermaSingleNumberFifty = row.fiftyyards;
                thermaSingleNumberThirty = Number(thermaSingleNumberThirty);
                thermaSingleNumberFifty = Number(thermaSingleNumberFifty);
                  console.log(
                    "thermaSingleNumberFifty",
                    thermaSingleNumberFifty
                  );
              }
              thermaTotalNextSku = thermaTotalSku;
              row.save();
            } else if (lastsku2 === 50) {
              let thirty = items * 1.67;
              let fifty = items / 1;
              thirty = thirty.toFixed(3);
              fifty = fifty.toFixed(3);
              row.thirtyyards = thirty;
              row.fiftyyards = fifty;
              thirty = Number(thirty);
              fifty = Number(fifty);
              if (thermaTotalNextSku === "") {
                thermaTotalThirty = Number(thermaTotalThirty);
                thermaTotalThirty = 0;
                thermaTotalFifty = Number(thermaTotalFifty);
                thermaTotalFifty = 0;
                //  console.log(
                //    "thermaTotalNextSku is",
                //    thermaTotalNextSku,
                //    "total is",
                //    total
                //  );
                ThermaSwitchTotal = false;
                console.log("thermaSwitchTotal", thermaSwitchTotal);
              } else if (thermaTotalNextSku === thermaTotalSku) {
                thermaTotalThirty = Number(thermaTotalThirty);
                thermaTotalFifty = Number(thermaTotalFifty);
                //  console.log("total is before", total);
                thirty = Number(thirty);
                fifty = Number(fifty);
                //  console.log("yardrolls is", yardrolls);
                if (thermaSwitchTotal === true) {
                  thermaSingleNumberThirty = Number(thermaSingleNumberThirty);
                  thermaSingleNumberFifty = Number(thermaSingleNumberFifty);
                  thermaTotalThirty = Number(thermaTotalThirty);
                  thermaTotalFifty = Number(thermaTotalFifty);
                  thermaTotalThirty =
                    thermaTotalThirty + thermaSingleNumberThirty;
                  thermaTotalFifty = thermaTotalFifty + thermaSingleNumberFifty;
                  thermaTotalThirty = Number(thermaTotalThirty);
                  thermaTotalFifty = Number(thermaTotalFifty);
                }
                thermaTotalThirty = thermaTotalThirty + thirty;
                thermaTotalFifty = thermaTotalFifty + fifty;
                thermaSwitchTotal = false;
                //  console.log("switchTotal", switchTotal);
                //  console.log("total is", total);
              } else {
                if (thermaSwitchTotal === true) {
                  thermaSingleNumberThirty = Number(thermaSingleNumberThirty);
                  thermaSingleNumberFifty = Number(thermaSingleNumberFifty);
                  thermaTotalThirty = Number(thermaTotalThirty);
                  thermaTotalFifty = Number(thermaTotalFifty);
                  thermaTotalThirty =
                    thermaTotalThirty + thermaSingleNumberThirty;
                  thermaTotalFifty = thermaTotalFifty + thermaSingleNumberFifty;
                  thermaTotalThirty = Number(thermaTotalThirty);
                  thermaTotalFifty = Number(thermaTotalFifty);
                }
                thermaTotalThirty = thermaTotalThirty.toFixed(3);
                thermaTotalFifty = thermaTotalFifty.toFixed(3);
                thermaTotalThirty = Number(thermaTotalThirty);
                thermaTotalFifty = Number(thermaTotalFifty);
               thermaTotalStringThirty =
                 "Total 30 yards for " +
                 thermaTotalNextSku +
                 " is " +
                 thermaTotalThirty;
               thermaTotalStringFifty =
                 "Total 50 yards for " +
                 thermaTotalNextSku +
                 " is " +
                 thermaTotalFifty;
                thermaTotalNextSku = thermaTotalSku;
                 row.totalthirty = thermaTotalStringThirty;
                 row.totalfifty = thermaTotalStringFifty;
                //  console.log("row.total is", row.total);
                thermaTotalThirty = 0;
                thermaTotalFifty = 0;
                thermaSwitchTotal = true;
                thermaSingleNumberThirty = row.thirtyyards;
                thermaSingleNumberFifty = row.fiftyyards;
                thermaSingleNumberThirty = Number(thermaSingleNumberThirty);
                thermaSingleNumberFifty = Number(thermaSingleNumberFifty);
                   console.log(
                     "thermaSingleNumberFifty",
                     thermaSingleNumberFifty
                   );
              }
              thermaTotalNextSku = thermaTotalSku;
              row.save();
            } else if (lastsku === 1) {
              let thirty = items / 30;
              let fifty = items / 50;
              thirty = thirty.toFixed(3);
              fifty = fifty.toFixed(3);
              row.thirtyyards = thirty;
              row.fiftyyards = fifty;
              thirty = Number(thirty);
              fifty = Number(fifty);
              if (thermaTotalNextSku === "") {
                thermaTotalThirty = Number(thermaTotalThirty);
                thermaTotalThirty = 0;
                thermaTotalFifty = Number(thermaTotalFifty);
                thermaTotalFifty = 0;
                //  console.log(
                //    "thermaTotalNextSku is",
                //    thermaTotalNextSku,
                //    "total is",
                //    total
                //  );
                ThermaSwitchTotal = false;
                console.log("thermaSwitchTotal", thermaSwitchTotal);
              } else if (thermaTotalNextSku === thermaTotalSku) {
                thermaTotalThirty = Number(thermaTotalThirty);
                thermaTotalFifty = Number(thermaTotalFifty);
                //  console.log("total is before", total);
                thirty = Number(thirty);
                fifty = Number(fifty);
                //  console.log("yardrolls is", yardrolls);
                if (thermaSwitchTotal === true) {
                  thermaSingleNumberThirty = Number(thermaSingleNumberThirty);
                  thermaSingleNumberFifty = Number(thermaSingleNumberFifty);
                  thermaTotalThirty = Number(thermaTotalThirty);
                  thermaTotalFifty = Number(thermaTotalFifty);
                  thermaTotalThirty =
                    thermaTotalThirty + thermaSingleNumberThirty;
                  thermaTotalFifty = thermaTotalFifty + thermaSingleNumberFifty;
                  thermaTotalThirty = Number(thermaTotalThirty);
                  thermaTotalFifty = Number(thermaTotalFifty);
                }
                thermaTotalThirty = thermaTotalThirty + thirty;
                thermaTotalFifty = thermaTotalFifty + fifty;
                thermaSwitchTotal = false;
                //  console.log("switchTotal", switchTotal);
                //  console.log("total is", total);
              } else {
                if (thermaSwitchTotal === true) {
                  thermaSingleNumberThirty = Number(thermaSingleNumberThirty);
                  thermaSingleNumberFifty = Number(thermaSingleNumberFifty);
                  thermaTotalThirty = Number(thermaTotalThirty);
                  thermaTotalFifty = Number(thermaTotalFifty);
                  thermaTotalThirty =
                    thermaTotalThirty + thermaSingleNumberThirty;
                  thermaTotalFifty = thermaTotalFifty + thermaSingleNumberFifty;
                  thermaTotalThirty = Number(thermaTotalThirty);
                  thermaTotalFifty = Number(thermaTotalFifty);
                }
                thermaTotalThirty = thermaTotalThirty.toFixed(3);
                thermaTotalFifty = thermaTotalFifty.toFixed(3);
                thermaTotalThirty = Number(thermaTotalThirty);
                thermaTotalFifty = Number(thermaTotalFifty);
           thermaTotalStringThirty =
             "Total 30 yards for " +
             thermaTotalNextSku +
             " is " +
             thermaTotalThirty;
           thermaTotalStringFifty =
             "Total 50 yards for " +
             thermaTotalNextSku +
             " is " +
             thermaTotalFifty;
                thermaTotalNextSku = thermaTotalSku;
                  row.totalthirty = thermaTotalStringThirty;
                  row.totalfifty = thermaTotalStringFifty;
                //  console.log("row.total is", row.total);
                thermaTotalThirty = 0;
                thermaTotalFifty = 0;
                thermaSwitchTotal = true;
                thermaSingleNumberThirty = row.thirtyyards;
                thermaSingleNumberFifty = row.fiftyyards;
                thermaSingleNumberThirty = Number(thermaSingleNumberThirty);
                thermaSingleNumberFifty = Number(thermaSingleNumberFifty);
                   console.log(
                     "thermaSingleNumberFifty",
                     thermaSingleNumberFifty
                   );
              }
              thermaTotalNextSku = thermaTotalSku;
              row.save();
            } else if (lastsku === 5) {
              let thirty = items / 6;
              let fifty = items / 10;
              thirty = thirty.toFixed(3);
              fifty = fifty.toFixed(3);
              row.thirtyyards = thirty;
              row.fiftyyards = fifty;
              thirty = Number(thirty);
              fifty = Number(fifty);
              if (thermaTotalNextSku === "") {
                thermaTotalThirty = Number(thermaTotalThirty);
                thermaTotalThirty = 0;
                thermaTotalFifty = Number(thermaTotalFifty);
                thermaTotalFifty = 0;
                //  console.log(
                //    "thermaTotalNextSku is",
                //    thermaTotalNextSku,
                //    "total is",
                //    total
                //  );
                ThermaSwitchTotal = false;
                console.log("thermaSwitchTotal", thermaSwitchTotal);
              } else if (thermaTotalNextSku === thermaTotalSku) {
                thermaTotalThirty = Number(thermaTotalThirty);
                thermaTotalFifty = Number(thermaTotalFifty);
                //  console.log("total is before", total);
                thirty = Number(thirty);
                fifty = Number(fifty);
                //  console.log("yardrolls is", yardrolls);
                if (thermaSwitchTotal === true) {
                  thermaSingleNumberThirty = Number(thermaSingleNumberThirty);
                  thermaSingleNumberFifty = Number(thermaSingleNumberFifty);
                  thermaTotalThirty = Number(thermaTotalThirty);
                  thermaTotalFifty = Number(thermaTotalFifty);
                  thermaTotalThirty =
                    thermaTotalThirty + thermaSingleNumberThirty;
                  thermaTotalFifty = thermaTotalFifty + thermaSingleNumberFifty;
                  thermaTotalThirty = Number(thermaTotalThirty);
                  thermaTotalFifty = Number(thermaTotalFifty);
                }
                thermaTotalThirty = thermaTotalThirty + thirty;
                thermaTotalFifty = thermaTotalFifty + fifty;
                thermaSwitchTotal = false;
                //  console.log("switchTotal", switchTotal);
                //  console.log("total is", total);
              } else {
                if (thermaSwitchTotal === true) {
                  thermaSingleNumberThirty = Number(thermaSingleNumberThirty);
                  thermaSingleNumberFifty = Number(thermaSingleNumberFifty);
                  thermaTotalThirty = Number(thermaTotalThirty);
                  thermaTotalFifty = Number(thermaTotalFifty);
                  thermaTotalThirty =
                    thermaTotalThirty + thermaSingleNumberThirty;
                  thermaTotalFifty = thermaTotalFifty + thermaSingleNumberFifty;
                  thermaTotalThirty = Number(thermaTotalThirty);
                  thermaTotalFifty = Number(thermaTotalFifty);
                }
                thermaTotalThirty = thermaTotalThirty.toFixed(3);
                thermaTotalFifty = thermaTotalFifty.toFixed(3);
                thermaTotalThirty = Number(thermaTotalThirty);
                thermaTotalFifty = Number(thermaTotalFifty);
              thermaTotalStringThirty =
                "Total 30 yards for " +
                thermaTotalNextSku +
                " is " +
                thermaTotalThirty;
              thermaTotalStringFifty =
                "Total 50 yards for " +
                thermaTotalNextSku +
                " is " +
                thermaTotalFifty;
                thermaTotalNextSku = thermaTotalSku;
                row.totalthirty = thermaTotalStringThirty;
                row.totalfifty = thermaTotalStringFifty;
                //  console.log("row.total is", row.total);
                thermaTotalThirty = 0;
                thermaTotalFifty = 0;
                thermaSwitchTotal = true;
                thermaSingleNumberThirty = row.thirtyyards;
                thermaSingleNumberFifty = row.fiftyyards;
                thermaSingleNumberThirty = Number(thermaSingleNumberThirty);
                thermaSingleNumberFifty = Number(thermaSingleNumberFifty);
                 console.log(
                   "thermaSingleNumberFifty",
                   thermaSingleNumberFifty
                 );
              }
              thermaTotalNextSku = thermaTotalSku;
              row.save();
            } else if (sku === "done") {
                 if (thermaSwitchTotal === true) {
                   thermaSingleNumberThirty = Number(thermaSingleNumberThirty);
                   thermaSingleNumberFifty = Number(thermaSingleNumberFifty);
                   thermaTotalThirty = Number(thermaTotalThirty);
                   thermaTotalFifty = Number(thermaTotalFifty);
                   thermaTotalThirty =
                     thermaTotalThirty + thermaSingleNumberThirty;
                   thermaTotalFifty =
                     thermaTotalFifty + thermaSingleNumberFifty;
                   thermaTotalThirty = Number(thermaTotalThirty);
                   thermaTotalFifty = Number(thermaTotalFifty);
                 }
              thermaTotalThirty = Number(thermaTotalThirty);
              thermaTotalFifty = Number(thermaTotalFifty);
              thermaTotalThirty = thermaTotalThirty.toFixed(3);
              thermaTotalFifty = thermaTotalFifty.toFixed(3);
   thermaTotalStringThirty =
     "Total 30 yards for " + thermaTotalNextSku + " is " + thermaTotalThirty;
   thermaTotalStringFifty =
     "Total 50 yards for " + thermaTotalNextSku + " is " + thermaTotalFifty;
     console.log("thermaTotalStringFifty", thermaTotalStringFifty)
              row.totalthirty = thermaTotalStringThirty;
              row.totalfifty = thermaTotalStringFifty;
              // console.log("row.total is", row.total);
              thermaTotalThirty = 0;
              thermaTotalFifty = 0;
              thermaSingleNumberThirty = row.thirtyyards;
              thermaSingleNumberFifty = row.fiftyyards;
              thermaSingleNumberThirty = Number(thermaSingleNumberThirty);
              thermaSingleNumberFifty = Number(thermaSingleNumberFifty);
                 console.log(
                   "thermaSingleNumberFifty",
                   thermaSingleNumberFifty
                 );
              row.save();
              forcestop = true;
              return null;
            }
             offset += 1;
          });
        } else {
          stopVar = true;
          return;
        }
        console.log("rowCountGlobal", rowCountGlobal)
        rowCountGlobal = String(rowCountGlobal)
        if (offset === 0 || offset === 2 || offset === 4) {
        res.status(201).send(rowCountGlobal);
        }
      } catch (err) {
       console.log("this is the error", err);
      }
    }
    setTimeout(() => {
       if (stopVar === true) {
         return;
       }
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
   