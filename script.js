$(document).ready(function () {
    var socket = io();

    let name = prompt("What's your sign?");
    if (name) {
        socket.emit('new_user_added', { name: name });
    } else {
        alert("You need to enter you name firts to join!");
        location.reload();
    }
})