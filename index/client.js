// $(document).ready(function () {
//   $("#start").on("click", getProgress);
//   // load existing list items on page load
// }); // end doc ready

// function getProgress() {
//   console.log("I am clicked")
//   //grabs info from server and populates on DOM
//   $.ajax({
//     type: "GET",
//     url: "/progress",
//   }).then(function (response) {
//     let progress = response.offset + 10;
//     $("#progress").append(
//       `<section class="container-fluid"><div class="row smallBorder"><div class="col-12 smallBorder">Updating Columns: ${response.offset} - ${progress} of ${response.rowCount}</div></div>
//                         </section>`
//     );
//   });
// } // end getList