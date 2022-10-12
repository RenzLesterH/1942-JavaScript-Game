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
var player1_score = 0;
var player2_score = 0;

app.get("/", function (request, response){
    player1 = "";
    player2 = "";
    response.render('index');
})

io.on('connection', function (socket) {

    socket.on('user_joined', function (data) {
        if(data.player_type == "p1"){
            player1 = data.player_name;
            socket.emit('player_type',{player_type:"player1_score", other_player_type: "player2"});
        }else if(data.player_type == "p2"){
            player2 = data.player_name;
            socket.emit('player_type',{player_type:"player2_score", other_player_type: "player1"});
        }
        io.emit('player_details',{name: data.player_name, player: data.player_type});
        
        if(player1 !== "" && player2 !== ""){
            io.emit('players_ready');
        }else{
            socket.emit('close_card');
        }
    });

    socket.on('other_player_score', function (data) {
        if(data.other_player == "player1"){
            player2_score = data.my_score;
            socket.broadcast.emit('update_other_player_score', { score: data.my_score, player_type:"player2_score" });
        }else if(data.other_player == "player2"){
            player1_score = data.my_score;
            socket.broadcast.emit('update_other_player_score', { score: data.my_score, player_type:"player1_score" });
        }
    });

    socket.on('game_over', function () {
        if(player1_score > player2_score){
            io.emit('winner', {winner_name: player1, winner_score: player1_score});
            console.log(player1);
        }else if(player1_score < player2_score){
            io.emit('winner', {winner_name: player2, winner_score: player2_score});
            console.log(player2);
        }
    });

});

