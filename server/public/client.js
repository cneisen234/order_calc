$(document).ready(function () {
  $("#start").on("click", getProgress);
  // load existing list items on page load
}); // end doc ready

function getProgress() {
  console.log("I am clicked")
  //grabs info from server and populates on DOM
    $("#progress").append(
      `<p>Updating Columns:  -  of </p>`
    );
  $.ajax({
    type: "GET",
    url: "/progress",
  }).then(function (response) {
  
  });
} // end getList