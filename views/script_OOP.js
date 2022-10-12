window.onload = function() { 
    const explode = new Audio('assets/game sounds/explosion effect.wav');
    const crash = new Audio('assets/game sounds/crash effect.wav');
    var socket = io();
    
    class Characters{
        displayHero(hero) {
            document.getElementById('hero').style['top'] = hero.y + "px";
            document.getElementById('hero').style['left'] = hero.x + "px";
        }

        displayEnemiesOrBullets(character_type, character_class, character_id){
            let output = '';
            for (let i = 0; i < character_type.length; i++) {
                output += "<div class='"+character_class+"' style='top:"+character_type[i].y+"px; left:"+character_type[i].x+"px;'></div>";
            }
            document.getElementById(character_id).innerHTML = output;
        }

        moveEnemiesOrBullets(character_type, character_name){
            for (let i = 0; i < character_type.length; i++) {
                if(character_name == "bullet"){
                    character_type[i].y -= 5;
                    //remove enemy when out of bounce.
                    if(character_type[i].y < 0){
                        character_type[i]  = character_type[character_type.length-1];
                        character_type.pop();
                    }
                }else if(character_name == "enemy"){
                    character_type[i].y += 5;
                    if(character_type[i].y > 540){
                        character_type[i].y = 0;
                        character_type[i].x = Math.random()*500;
                    }
                }
            }
        }

    }

    class Game_Detections{

        constructor(score, explode, crash) {
            this.score = score;
            this.explode = explode;
            this.crash = crash;
        }

        detectCollision(bullets, enemy_type, enemy_id){
            for (let i = 0; i < bullets.length; i++) {
                for (let j = 0; j < enemy_type.length; j++) {
                    if(Math.abs(bullets[i].x-3 - enemy_type[j].x-3) < 10 && Math.abs(bullets[i].y - enemy_type[j].y) < 10){
                        this.explode.play(); 
                        this.score += 10;
                        document.getElementById(enemy_id).innerHTML = "<div class='explode' style='top:"+enemy_type[j].y+"px; left:"+enemy_type[j].x+"px;'></div>";
                        enemy_type[j].y = 0;
                        bullets[i]  = bullets[bullets.length-1];
                        bullets.pop();	 
                    }
                }   
            }
        }

        detectCollisionEnemies(enemy_type, hero){
            for (let i = 0; i < enemy_type.length; i++) {
                if(Math.abs(hero.x - enemy_type[i].x-5) < 10 && Math.abs(hero.y - enemy_type[i].y) < 10){
                    enemy_type[i].y = 0;
                    document.getElementById('hero').style['display'] = "none";
                    setTimeout(function() {
                        document.getElementById('hero').style['display'] = "block";
                    }, 50);
                    this.crash.play();
                    this.score -= 500; 
                }
            }	
        }

        displayScore(game, status) {
            var player_score = $( "#hero" ).val();
            var other_player_score = $( "#other_player" ).val();
            if(this.score < 0 || status){
                console.log("here");
                clearInterval(game);
                is_gameOver = false;
                document.getElementById('hero').style['display'] = "none";
                document.getElementById('enemies').innerHTML = "";
                document.getElementById('enemies2').innerHTML = "";
                document.getElementById('bullets').innerHTML = "";
                document.getElementById('gameover').style['display'] = "block";
                document.getElementById(player_score).innerHTML = 0;
                socket.emit('game_over', game);
            }else{
                document.getElementById(player_score).innerHTML = this.score;
                socket.emit('other_player_score',{my_score: this.score, other_player: other_player_score});
            }
        } 

    }
// ==================================================================================================================
    let score = 0;
    let is_gameOver = true;
    const hero = {
        x: 300,
        y: 500
    }

    const enemies = [{x:50,y:50}, {x:250, y:50}, {x:150,y:140}, {x:420,y:120}];
    const enemies2 = [{x:550,y:70}, {x:350, y:20}, {x:100,y:50}];
    let bullets  = [];
    let character = new Characters();
    let game_detection = new Game_Detections(score, explode, crash);
    
    function gameLoop(game){
        character.displayHero(hero); //hero
        character.displayEnemiesOrBullets(enemies,"enemy1","enemies"); //Enemy 1
        character.displayEnemiesOrBullets(enemies2,"enemy2","enemies2"); //Enemy 2
        character.displayEnemiesOrBullets(bullets,"bullet","bullets"); // Bullet
        character.moveEnemiesOrBullets(enemies,"enemy");
        character.moveEnemiesOrBullets(enemies2,"enemy");
        character.moveEnemiesOrBullets(bullets,"bullet");
        game_detection.detectCollision(bullets, enemies, "enemies");
        game_detection.detectCollision(bullets, enemies2, "enemies2");
        game_detection.detectCollisionEnemies(enemies, hero);
        game_detection.detectCollisionEnemies(enemies2, hero);
        game_detection.displayScore(game, false);   
    }

    document.onkeydown = function(key){
        if(key.keyCode == 37 && is_gameOver && hero.x > 0){
            hero.x -= 10;
        }else if(key.keyCode == 39 && is_gameOver){
            hero.x += 10;
        }else if(key.keyCode == 40 && is_gameOver && hero.y < 530){ // down
            hero.y += 10;
        }else if(key.keyCode == 38 && is_gameOver && hero.y > 10){ //up
            hero.y -= 10;
        }else if(key.keyCode == 32 && is_gameOver){ //space
            bullets.push({x: hero.x+8, y: hero.y-15});
            character.displayEnemiesOrBullets(bullets,"bullet","bullets");
        }
        character.displayHero(hero);
    }

// =============================================================================

    $( "#player_form" ).hide();
    $( ".scores" ).hide();
    $( "#hero" ).hide();
    $( "#idle_player" ).hide();

    $( ".player_btn" ).click(function() {
        $( ".choose_player" ).hide();
        $( "#player_form" ).show();
        var id = $(this).attr("id");
        $( "#player_type" ).val(id);  
    });

    $( "#player_form" ).submit(function() {
        let player_type = $( "#player_type" ).val();
        let player_name = $( "#player_name" ).val();
        socket.emit('user_joined',{player_type: player_type, player_name: player_name});
        return false;
    });

    socket.on('player_type', function (data) {
        $( "#hero" ).val(data.player_type);
        $( "#other_player" ).val(data.other_player_type);
    });

    socket.on('player_details', function (data) {
        var result = "";
        result += data.name+" =";
        if (data.player == "p1") {
            $("#player1").html(result);
        }else if (data.player == "p2"){
            $("#player2").html(result);
        }
    });

    socket.on('close_card', function () {
        $( "#player_form" ).hide();
        $( "#idle_player" ).show();        
    });

    socket.on('players_ready', function () {
        $( ".card" ).hide();
        $( ".scores" ).show();
        $( "#hero" ).show();
        console.log($( "#hero" ).val());
        const game = setInterval(function() { gameLoop(game); }, 50);        
    });

    socket.on('update_other_player_score', function (data) {
        document.getElementById(data.player_type).innerHTML = data.score;
    });
    
    socket.on('winner', function (data) {
        document.getElementById('gameover').style['display'] = "block";
        var result = "";
        result += "<h2>Game Over <span>"+data.winner_name+" Win the Game!</span></h2>";
        result += "<p id='win_score'>Winners Score: "+data.winner_score+"</p>";
        result += "<p>Refresh the page to play again!</p>";
        $( ".scores" ).hide();
        $("#gameover").html(result);
        game_detection.displayScore(data.stop_game, true);
        clearInterval(data.stop_game);
    }); 

}