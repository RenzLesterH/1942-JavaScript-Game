window.onload = function() {
    const mySound = new Audio('explosion effect.wav');
    const crash = new Audio('crash effect.wav');
    let score = 0;
    const hero = {
        x: 300,
        y: 500
    }

    const enemies = [{x:50,y:50}, {x:250, y:50}, {x:50,y:250}, {x:520,y:220}];
    const enemies2 = [{x:300,y:100}, {x:380, y:20}, {x:100,y:50}];
    let bullets  = [];
    
    class Character{
        constructor(character) {
            this.character = character;
        }

        displayHero() {
            document.getElementById('hero').style['top'] = this.character.y + "px";
            document.getElementById('hero').style['left'] = this.character.x + "px";
        }

        displayEnemies(){
            let output = '';
            for (let i = 0; i < this.character.length; i++) {
                output += "<div class='enemy2' style='top:"+this.character[i].y+"px; left:"+this.character[i].x+"px;'></div>";
            }
            document.getElementById(this.character).innerHTML = output;
        }
    }

    let my_hero = new Character(hero);
    my_hero.displayEnemies();
}