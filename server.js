var express = require("express");

var path = require("path");

var app = express();

var session = require('express-session');
app.use(session({
    secret: 'keyboardkitteh',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/views"));

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

const server = app.listen(1337);
const io = require('socket.io')(server);
var counter = 0;
var players = [];
var messages = [];


app.get("/", function (request, response){
    response.render('index');
})

io.on('connection', function (socket) {
    socket.on('user_joined', function (data) {
        players.push(data.name);
        io.emit('player_name', data.name); 
    });
    
    // socket.on('user_guesses_word', function (data) {
    //     if(data[1].value.toLowerCase() == "socket"){
    //         const msg = {
    //             user: data[0].value,
    //             message: data[1].value.toLowerCase(),
    //             correct: true
    //         }
    //         messages.push(msg);
    //     }else{
    //         const msg = {
    //             user: data[0].value,
    //             message: data[1].value,
    //             correct: false
    //         }
    //         messages.push(msg);
    //     }
    //     console.log(messages);
    //     io.emit('update_chat_board_log', messages);
    // });
});

