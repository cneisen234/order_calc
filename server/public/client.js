$(document).ready(function () {
  $("#start").on("click", getProgress);
  $("#art").on("click", getArtProgress);
  $("#therm").on("click", getThermProgress);
  // $("#start").on("click", test);
  // load existing list items on page load
}); // end doc ready

function endImport() {
       $("#progress").empty();
       $("#progress").append(`<p>The import has finished</p>`);
         $("#thisclears").append(
           `    <main class="col-lg-10" id="thisclears">
            <button id="start" class="btn btn-light col-lg-3 col-md-12">Siser HTV Reporting</button>
                        <button id="art" class="btn btn-light col-lg-3 col-md-12">Art Room</button>
                        <button id="therm" class="btn btn-light col-lg-3 col-md-12">Thermoflex Plus</button>
            <header id="time" class="col-lg-9 col-md-12"></header>
        </main>`
         );
}

function getProgress() {
  console.log("I am clicked")
  $("#progress").empty();
   $("#thisclears").empty();
     $("#progress").append(
       `<p>The import for Siser reporting has started, please refer to the spreadsheet <a href="https://docs.google.com/spreadsheets/d/1LSxm-aJNqi1tOGBkvG_Qmh1IkQGgKSCbdOu08TrltfI/edit?ts=5fa2ff6e#gid=0" target="_blank">here</a></br></br>
    WARNING: Do not reload this page or start another import until the one currently running finishes</p>`
     );
  $.ajax({
    type: "GET",
    url: "/progress",
  })
    .then(function (response) {
      console.log("the response is", response)
      let timeout = Number(response)
      timeout *= 1000;
      console.log(timeout)
  setTimeout(() => {
    console.log("timeout works", timeout)
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
     $("#progress").append(
       `<p>The import for the art room has started, please refer to the spreadsheet <a href="https://docs.google.com/spreadsheets/d/1LSxm-aJNqi1tOGBkvG_Qmh1IkQGgKSCbdOu08TrltfI/edit?ts=5fa2ff6e#gid=0" target="_blank">here</a></br></br>
    WARNING: Do not reload this page or start another import until the one currently running finishes</p>`
     );
  $.ajax({
    type: "GET",
    url: "/art",
  })
    .then(function (response) {
      console.log("the response is", response)
            let timeout = Number(response);
            timeout *= 1000;
            console.log(timeout);
    setTimeout(() => {
      console.log("timeout works", timeout);
    }, timeout);
    }).catch(function (error) {
      //runs if post request fails
      console.log("this is the error", error)
    });
    // endImport();
} // end getList

function getThermProgress() {
  console.log("I am clicked")
  $("#progress").empty();
   $("#thisclears").empty();
    $("#progress").append(
      `<p>The import for the thermoflex plus has started, please refer to the spreadsheet <a href="https://docs.google.com/spreadsheets/d/1LSxm-aJNqi1tOGBkvG_Qmh1IkQGgKSCbdOu08TrltfI/edit?ts=5fa2ff6e#gid=0" target="_blank">here</a></br></br>
    WARNING: Do not reload this page or start another import until the one currently running finishes</p>`
    );
  $.ajax({
    type: "GET",
    url: "/therm",
  })
    .then(function (response) {
      console.log("the response is", response)
            let timeout = Number(response);
            timeout *= 1000;
            console.log(timeout);
    setTimeout(() => {
      console.log("timeout works", timeout);
    }, timeout);
    }).catch(function (error) {
      //runs if post request fails
      console.log("this is the error", error)
    });
    // endImport();
} // end getList
