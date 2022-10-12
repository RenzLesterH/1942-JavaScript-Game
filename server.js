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
var player1 = "";
var player2 = "";

app.get("/", function (request, response){
    player1 = "";
    player2 = "";
    response.render('index');
})

io.on('connection', function (socket) {
    socket.on('user_joined', function (data) {
        if(data.player_type == "p1"){
            player1 = data.player_name;
        }else if(data.player_type == "p2"){
            player2 = data.player_name;
        }
        io.emit('player_details',{name: data.player_name, player: data.player_type});
        
        if(player1 !== "" && player2 !== ""){
            io.emit('players_ready');
            console.log("Player1: "+player1+" "+"Player2: "+player2);
        }else{
            socket.emit('close_card');
        }
    });
});

