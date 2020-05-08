$(document).ready(() => {
  // let apiToken = $("#apiToken").data("token")
  $("#modal-button").click(() => {
    $(".modal-body").html("");
    $.get(`/api/courses`, (results = {}) => {
      let data = results.data;
      if (!data || !data.courses) return;
      data.courses.forEach((course)  =>{
        $(".modal-body").append(
          `<div>
          <span class="course-title">
          <img src="/images/fork.png" alt="" style="height:50px;width:50px;">
          ${course.title}
          </span>
          <button class='${course.joined ? "joined-button" : "join-button"}' data-id="${course._id}"> 
          ${course.joined ? "Joined" : "Join"}
          </button>
          <div class="course-description">
          ${course.description}
          </div>
          </div>`
        );
      });
    }).then(() => {
        addJoinButtonListener();
    });
  });
});

// let addJoinButtonListener = () => {
//     $(".join-button").click((event) => {
//         let $button = $(event.target),
//             courseId = $button.data("id");
//         $.get(`/api/courses/${courseId}/join`, (results = {}) => {
//             let data = results.data;
//             if (data && data.success) {
//                 $button
//                     .text("Joined")
//                     .addClass("joined-button")
//                     .removeClass("join-button");
//             } else {
//                 $button.text("Try again");
//             }
//         });
//     });
// }


let addJoinButtonListener = () => {
  // let apiToken = $("#apiToken").data("token")
  $(".join-button").click((event) => {
    let $button = $(event.target),
      courseId = $button.data("id");
  $.get(`/api/courses/${courseId}/join`, (results = {}) => {
    let data = results.data;
    if (data && !data.subscribed) {
      $button
        .text("Joined")
        .addClass("joined-button")
        .removeClass("join-button");
    } else if (data && data.subscribed) {  
      $button
        .text("Already joined")
        .addClass("joined-button")
        .removeClass("join-button");
    } else {
      $button.text("Try again");
    }
    });
  });
}

t
// $(document).ready(() => {
//   $("#modal-button").click(() => {
//     $(".modal-body").html("");
//     $.get("/api/courses", data => {
//       data.forEach(course => {
//         $(".modal-body").append(
//           `<div>
// 						<span class="course-title">
// 							${course.title}
// 						</span>
// 						<div class="course-description">
// 							${course.description}
// 						</div>
// 					</div>`
//         );
//       });
//     });
//   });
// });
