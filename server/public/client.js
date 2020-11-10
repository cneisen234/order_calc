$(document).ready(function () {
  $("#start").on("click", getProgress);
  $("#art").on("click", getArtProgress);
  $("#therm").on("click", getThermProgress);
  // $("#start").on("click", test);
  // load existing list items on page load
}); // end doc ready

function getProgress() {
  console.log("I am clicked")
  $("#progress").empty();
   $("#thisclears").empty();
  $.ajax({
    type: "GET",
    url: "/progress",
  })
    .then(function (response) {
  $("#progress").append(
    `<p>The import for Siser reporting has started, please refer to the spreadsheet <a href="https://docs.google.com/spreadsheets/d/1LSxm-aJNqi1tOGBkvG_Qmh1IkQGgKSCbdOu08TrltfI/edit?ts=5fa2ff6e#gid=0" target="_blank">here</a></p>`
  );
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
  $("#progress").append(
    `<p>The import for the art room has started, please refer to the spreadsheet <a href="https://docs.google.com/spreadsheets/d/1LSxm-aJNqi1tOGBkvG_Qmh1IkQGgKSCbdOu08TrltfI/edit?ts=5fa2ff6e#gid=0" target="_blank">here</a></p>`
  );
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
  $("#progress").append(
    `<p>The import for the thermoflex plus has started, please refer to the spreadsheet <a href="https://docs.google.com/spreadsheets/d/1LSxm-aJNqi1tOGBkvG_Qmh1IkQGgKSCbdOu08TrltfI/edit?ts=5fa2ff6e#gid=0" target="_blank">here</a></p>`
  );
    }).catch(function (error) {
      //runs if post request fails
      console.log("this is the error", error)
    });
} // end getList
