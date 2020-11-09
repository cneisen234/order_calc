$(document).ready(function () {
  $("#start").on("click", getProgress);
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
    `<p>The import has started, please refer to the spread <a href="https://docs.google.com/spreadsheets/d/1LSxm-aJNqi1tOGBkvG_Qmh1IkQGgKSCbdOu08TrltfI/edit?ts=5fa2ff6e#gid=0" target="_blank">here</a> </br></br> DO NOT CLOSE THIS WINDOW</p>`
  );
    }).catch(function (error) {
      //runs if post request fails
      console.log("this is the error", error)
    });;
} // end getList

// function test() {
//   console.log("I am testing")
//   $("#progress").empty();
//   $("#thisclears").empty();
//    $("#progress").append(`<p>The import has started, please wait</p>`);
//   //grabs info from server and populates on DOM
//   $.ajax({
//     type: "GET",
//     url: "/test",
//   })
//     .then(function (response) {
//       $("#progress").empty();
//       $("#progress").append(`<p>The import has been completed</p>`);
//     }).catch(function (error) {
//       //runs if post request fails
//       console.log("this is the error", error)
//     });;
// } // end getList