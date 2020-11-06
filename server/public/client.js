$(document).ready(function () {
  $("#start").on("click", getProgress);
  // load existing list items on page load
}); // end doc ready

function getProgress() {
  console.log("I am clicked")
  $("#progress").empty();
  $("#thisclears").empty();
   $("#progress").append(`<p>The import has started, please wait</p>`);
  //grabs info from server and populates on DOM
  $.ajax({
    type: "GET",
    url: "/progress",
  }).then(function (response) {
     $("#progress").empty();
    $("#progress").append(`<p>The import has been completed</p>`);
  });
} // end getList