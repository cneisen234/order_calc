$(document).ready(function () {
  $("#start").on("click", getProgress);
  $("#art").on("click", getArtProgress);
  $("#therm").on("click", getThermProgress);
  $("#forcestop").on("click", forceStop);
  // $("#start").on("click", test);
  // load existing list items on page load
}); // end doc ready

function endImport() {
       $("#progress").empty();
       $("#progress").append(`<p>The import has finished</p>`);
}

function forceStop() {
  console.log("I am clicked")
    $('#progress').empty();
    $("#progress").append(
      `<p>The import has been forcefully stopped. Please wait apx 20 seconds before starting another import</p></br></br>`
           
    );
  $.ajax({
    type: "GET",
    url: "/forcestop",
  })
    .then(function (response) {
      
          }).catch(function (error) {
      //runs if post request fails
      console.log("this is the error", error)
    });
} // end getList

function getProgress() {
  console.log("I am clicked")
  $("#progress").empty();
   $("#thisclears").empty();
  $.ajax({
    type: "GET",
    url: "/progress",
  })
    .then(function (response) {
      console.log("the response is", response)
      let time = moment().format("MMMM Do YYYY, h:mm:ss a");
      let estTime = Number(response)
      estTime = estTime * 5;
      let timeout = estTime * 1000;
       let hour = Math.floor(estTime / 3600);
       let min = Math.floor(estTime / 60);
       let seconds = estTime - 60 * Math.floor(min);
       if (hour > 0) {
         min = min - 60 * hour;
       }
      console.log(timeout)
      console.log(estTime)
           $("#progress").append(
             `<p>The import for Siser reporting has started, please refer to the spreadsheet <a href="https://docs.google.com/spreadsheets/d/1LSxm-aJNqi1tOGBkvG_Qmh1IkQGgKSCbdOu08TrltfI/edit?ts=5fa2ff6e#gid=0" target="_blank">here</a></br></br>
             <p>The import started on ${time} and will take apx ${hour} hours, ${min} minutes and ${seconds} seconds to complete</br></br>
    WARNING: Do not reload this page or start another import until the one currently running finishes</p>`
           );
  setTimeout(() => {
    console.log("timeout works", timeout)
    endImport();
  }, timeout);
    }).catch(function (error) {
      //runs if post request fails
      console.log("this is the error", error)
    });
} // end getList

function getArtProgress() {
  console.log("I am clicked")
  $("#progress").empty();
   $("#thisclears").empty();
  $.ajax({
    type: "GET",
    url: "/art",
  })
    .then(function (response) {
      console.log("the response is", response)
            let time = moment().format("MMMM Do YYYY, h:mm:ss a");
            let estTime = Number(response);
            estTime = estTime * 5;
            let timeout = estTime * 1000;
             let hour = Math.floor(estTime / 3600);
             let min = Math.floor(estTime / 60);
             let seconds = estTime - 60 * Math.floor(min);
             if (hour > 0) {
               min = min - 60 * hour;
             }
            console.log(timeout);
            console.log(estTime);
                 $("#progress").append(
                   `<p>The import for the art room has started, please refer to the spreadsheet <a href="https://docs.google.com/spreadsheets/d/1LSxm-aJNqi1tOGBkvG_Qmh1IkQGgKSCbdOu08TrltfI/edit?ts=5fa2ff6e#gid=0" target="_blank">here</a></br></br>
                                <p>The import started on ${time} and will take apx ${hour} hours, ${min} minutes and ${seconds} seconds to complete</br></br>
    WARNING: Do not reload this page or start another import until the one currently running finishes</p>`
                 );
    setTimeout(() => {
      console.log("timeout works", timeout);
      endImport();
    }, timeout);
    }).catch(function (error) {
      //runs if post request fails
      console.log("this is the error", error)
    });
} // end getList

function getThermProgress() {
  console.log("I am clicked")
  $("#progress").empty();
   $("#thisclears").empty();
  $.ajax({
    type: "GET",
    url: "/therm",
  })
    .then(function (response) {
      console.log("the response is", response)
            let time = moment().format("MMMM Do YYYY, h:mm:ss a");
            let estTime = Number(response);
            estTime = estTime * 10
            let timeout = estTime * 1000;
           let hour = Math.floor(estTime / 3600);
           let min = Math.floor(estTime / 60);
           let seconds = estTime - 60 * Math.floor(min);
           if (hour > 0) {
             min = min - 60 * hour;
           }
            console.log(timeout);
            console.log(estTime);
               $("#progress").append(
                 `<p>The import for the thermoflex plus has started, please refer to the spreadsheet <a href="https://docs.google.com/spreadsheets/d/1LSxm-aJNqi1tOGBkvG_Qmh1IkQGgKSCbdOu08TrltfI/edit?ts=5fa2ff6e#gid=0" target="_blank">here</a></br></br>
                              <p>The import started on ${time} and will take apx ${hour} hours, ${min} minutes and ${seconds} seconds to complete</br></br>
    WARNING: Do not reload this page or start another import until the one currently running finishes</p>`
               );
    setTimeout(() => {
      console.log("timeout works", timeout);
      endImport();
    }, timeout);
    }).catch(function (error) {
      //runs if post request fails
      console.log("this is the error", error)
    });
    // endImport();
} // end getList
