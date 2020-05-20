// client side, what the client is getting from the server
$(document).ready(() => {
  const socket = io()
  const userName = $('#chatUserName').val()

  $('#chatForm').submit(() => {
    const text = $('#chatInput').val()
    const userId = $('#chatUserId').val()
    const userName = $('#chatUserName').val()
    socket.emit('message', {
      content: text,
      userId: userId,
      userName: userName
    })
    $('#chatInput').val('')
    return false
  })

  socket.on('load all messages', (data) => {
    data.forEach(message => {
      displayMessage(message)
    })
  })
  socket.on('message', (message) => {
    displayMessage(message)
    for (let i = 0; i < 2; i++) {
      $('.chat-icon').fadeOut(200).fadeIn(200)
    }
  })
  if (!userName.includes([null, undefined])) {
    socket.emit('user connected', {
      user: userName
    })
    socket.on('user connected', (user) => {
      displayMessage({
        userName: 'Notice',
        content: `${user} has joined the chat`
      })
    })
  }

  // client side event handler for the 'user disconnected' event when it's broadcast
  // socket.on("user disconnected", () => {
  //     displayMessage({
  //         userName: "Notice",
  //         content: `user left the chat`
  //     });
  // });

  socket.on('user disconnected', () => {
    displayMessage({
      userName: 'Notice',
      content: 'user has left the chat'
    })
  })

  const displayMessage = (message) => {
    $('#chat').prepend(
      $('<li>').html(`
            <strong style="font-weight:999;" class="message ${getCurrentUserClass(message.user)}">
            ${message.userName}</strong>: ${message.content}`)
    )
  }
  const getCurrentUserClass = (id) => {
    const userId = $('#chatUserId').val()
    return userId == id ? 'current-user' : ''
  }

  // let apiToken = $("#apiToken").data("token")
  $('#modal-button').click(() => {
    $('.modal-body').html('')
    $.get('/api/courses', (results = {}) => {
      const data = results.data
      if (!data || !data.courses) return
      data.courses.forEach((course) => {
        $('.modal-body').append(
          `<div>
          <span class="course-title">
          <img src="/images/fork.png" alt="" style="height:50px;width:50px;">
          ${course.title}
          </span>
          <button class='${course.joined ? 'joined-button' : 'join-button'}' data-id="${course._id}"> 
          ${course.joined ? 'Joined' : 'Join'}
          </button>
          <div class="course-description">
          ${course.description}
          </div>
          </div>`
        )
      })
    }).then(() => {
      addJoinButtonListener()
    })
  })
})

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

const addJoinButtonListener = () => {
  // let apiToken = $("#apiToken").data("token")
  $('.join-button').click((event) => {
    const $button = $(event.target)
    const courseId = $button.data('id')
    $.get(`/api/courses/${courseId}/join`, (results = {}) => {
      const data = results.data
      if (data && !data.subscribed) {
        $button
          .text('Joined')
          .addClass('joined-button')
          .removeClass('join-button')
      } else if (data && data.subscribed) {
        $button
          .text('Already joined')
          .addClass('joined-button')
          .removeClass('join-button')
      } else {
        $button.text('Try again')
      }
    })
  })
}

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
