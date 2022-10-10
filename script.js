window.onload = function() {
    var mySound = new Audio('explosion effect.wav');
    var crash = new Audio('crash effect.wav');
    let score = 0;
    const hero = {
        x: 300,
        y: 500
    }

    const enemies = [{x:50,y:50}, {x:250, y:50}, {x:50,y:250}, {x:520,y:220}];
    const enemies2 = [{x:300,y:100}, {x:380, y:20}, {x:100,y:50}];
    let bullets  = [];

    function displayHero() {
        document.getElementById('hero').style['top'] = hero.y + "px";
        document.getElementById('hero').style['left'] = hero.x + "px";
    }

    function displayEnemies(){
        let output = '';
        for (let i = 0; i < enemies.length; i++) {
            output += "<div class='enemy1' style='top:"+enemies[i].y+"px; left:"+enemies[i].x+"px;'></div>";
        }
        document.getElementById('enemies').innerHTML = output; 
    }

    function displayEnemies2(){
        let output = '';
        for (let i = 0; i < enemies2.length; i++) {
            output += "<div class='enemy2' style='top:"+enemies2[i].y+"px; left:"+enemies2[i].x+"px;'></div>";
        }
        document.getElementById('enemies2').innerHTML = output; 
    }

    //make enemy moves
    function moveBullets(){
        for (let i = 0; i < bullets.length; i++) {
            bullets[i].y -= 5;
            //remove enemy when out of bounce.
            if(bullets[i].y < 0){
                bullets[i]  = bullets[bullets.length-1];
                bullets.pop();
            }
            
        }
        
    }

    function moveEnemies(){
        for (let i = 0; i < enemies.length; i++) {
            enemies[i].y += 5;
            //remove enemy when out of bounce.
            if(enemies[i].y > 540){
                enemies[i].y = 0;
                enemies[i].x = Math.random()*500;
            }
        }
    }

    function moveEnemies2(){
        for (let i = 0; i < enemies2.length; i++) {
            enemies2[i].y += 5;
            //remove enemy when out of bounce.
            if(enemies2[i].y > 540){
                enemies2[i].y = 0;
                enemies2[i].x = Math.random()*500;
            }
        }
    }

    function displayBullets(){
        let output = '';
        for (let i = 0; i < bullets.length; i++) {
            output += "<div class='bullet' style='top:"+bullets[i].y+"px; left:"+bullets[i].x+"px;'></div>";
        }
        document.getElementById('bullets').innerHTML = output;
    }

    function displayScore() {
        if(score < 0){
            clearInterval(game);
            document.getElementById('hero').style['display'] = "none";
            document.getElementById('enemies').innerHTML = "";
            document.getElementById('enemies2').innerHTML = "";
            document.getElementById('bullets').innerHTML = "";
            document.getElementById('gameover').style['display'] = "block";
            document.getElementById('score').innerHTML = 0;
        }else{
            document.getElementById('score').innerHTML = score;	
        }
        
    }

    function detectCollision(){
        for (let i = 0; i < bullets.length; i++) {
            for (let j = 0; j < enemies.length; j++) {
                if(Math.abs(bullets[i].x-5 - enemies[j].x-5) < 10 && Math.abs(bullets[i].y - enemies[j].y) < 10){
                    mySound.play(); 
                    score += 10;
                    document.getElementById('enemies').innerHTML = "<div class='explode' style='top:"+enemies[j].y+"px; left:"+enemies[j].x+"px;'></div>";
                    enemies[j].y = 0;
                    bullets[i]  = bullets[bullets.length-1];
                    bullets.pop();	 
                }
            }
            
        }
    }

    function detectCollision2(){
        
        for (let i = 0; i < bullets.length; i++) {
            for (let j = 0; j < enemies2.length; j++) {
                if(Math.abs(bullets[i].x-5 - enemies2[j].x-5) < 10 && Math.abs(bullets[i].y - enemies2[j].y) < 10){
                    mySound.play(); 
                    score += 10;
                    document.getElementById('enemies').innerHTML = "<div class='explode' style='top:"+enemies2[j].y+"px; left:"+enemies2[j].x+"px;'></div>";
                    enemies2[j].y = 0;
                    bullets[i]  = bullets[bullets.length-1];
                    bullets.pop();	 
                }
            }
            
        }
    }

    function detectCollisionEnemy(){
        for (let i = 0; i < enemies.length; i++) {
            if(Math.abs(hero.x - enemies[i].x-5) < 10 && Math.abs(hero.y - enemies[i].y) < 10){
                enemies[i].y = 0;
                document.getElementById('hero').style['display'] = "none";
                setTimeout(function() {
                    document.getElementById('hero').style['display'] = "block";
                }, 50);
                crash.play();
                score -= 500; 
            }
        }	
    }

    function detectCollisionEnemy2(){
        for (let i = 0; i < enemies2.length; i++) {
            if(Math.abs(hero.x - enemies2[i].x-5) < 10 && Math.abs(hero.y - enemies2[i].y) < 10){
                enemies2[i].y = 0;
                document.getElementById('hero').style['display'] = "none";
                setTimeout(function() {
                    document.getElementById('hero').style['display'] = "block";
                }, 50);
                crash.play();
                score -= 500; 
            }
        }	
    }

    function gameLoop(){
        displayHero();
        displayEnemies();
        displayEnemies2();
        moveEnemies();
        moveEnemies2();
        moveBullets();
        displayBullets(); 
        detectCollision();
        detectCollision2();
        displayScore();
        detectCollisionEnemy();
        detectCollisionEnemy2();
    }

    const game = setInterval(gameLoop, 50); 

    document.onkeydown = function(key){
        if(key.keyCode == 37){
            hero.x -= 10;
        }else if(key.keyCode == 39){
            hero.x += 10;
        }else if(key.keyCode == 40){ // down
            hero.y += 10;
        }else if(key.keyCode == 38){ //up
            hero.y -= 10;
        }else if(key.keyCode == 32){ //up
            bullets.push({x: hero.x+8, y: hero.y-15});
            displayBullets();
        }
        displayHero();
    }
}