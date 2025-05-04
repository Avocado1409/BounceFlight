let move_speed = 20, gravity = 0.50;
let lastTimestamp = 0;
let lastMoveTimestamp = 0;
let lastGravityTimestamp = 0;
let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');
let sound_point = new Audio('sound effect/point.mp3');
let sound_die = new Audio('sound effect/feil.mp3');
let sound_countdown321go = new Audio('sound effect/countdown.mp3');

let background = document.querySelector('.background').getBoundingClientRect();

let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');
let score = parseInt(score_val.innerHTML);
let playBtn = document.getElementById('play-btn');
let leaderboardBtn = document.getElementById('leaderboard-btn');
let logoutBtn = document.getElementById('logout-btn');
let homeBtn = document.getElementById('home-btn');
let highscore_title = document.querySelector('.highscore_title');
let highscore_val = document.querySelector('.highscore_val');

let highscore = localStorage.getItem('highscore') || 0;
highscore_title.innerHTML = 'Highscore : ';
highscore_val.innerHTML = highscore;


let game_state = 'Start';
img.style.display = 'none';
message.classList.add('messageStyle');

// variabel untuk loop
let bird_dy = 0;
let pipe_seperation = 0;
let animationFrameIds = [];

function resetGame() {
    document.querySelectorAll('.pipe_sprite').forEach((e) => e.remove());
    img.style.display = 'block';
    bird.style.top = '40vh';
    bird_dy = 0;
    pipe_seperation = 0;
    game_state = 'Start'; // Awal masih "Start", belum "Play"
    message.innerHTML = '';
    score_title.innerHTML = 'Score : ';
    score_val.innerHTML = '0';
    highscore_title.innerHTML = 'Highscore : ';
    highscore_val.innerHTML = highscore;
    message.classList.remove('messageStyle');
    playBtn.style.display = 'none';
    bird_props = bird.getBoundingClientRect();
    leaderboardBtn.style.display = 'none';
    logoutBtn.style.display = 'none';
    homeBtn.style.display = 'none';

    cancelAllFrames();

    startCountdown();
}

playBtn.addEventListener('click', () => {
    sound_countdown321go.currentTime = 0;
    sound_countdown321go.play().catch(e => {
        console.log("Audio gagal diputar:", e);
    });
    resetGame();
});

function cancelAllFrames() {
    animationFrameIds.forEach(id => cancelAnimationFrame(id));
    animationFrameIds = [];
}

function play(){
    function move(timestamp) {
        if (game_state !== 'Play') return;
    
        let delta = (timestamp - lastMoveTimestamp) / 16.67;
        lastMoveTimestamp = timestamp;
    
        let pipe_sprite = document.querySelectorAll('.pipe_sprite');
        pipe_sprite.forEach((element) => {
            let pipe_sprite_props = element.getBoundingClientRect();
            bird_props = bird.getBoundingClientRect();
    
            if (pipe_sprite_props.right <= 0) {
                element.remove();
            } else {
                if (
                    bird_props.left < pipe_sprite_props.left + pipe_sprite_props.width &&
                    bird_props.left + bird_props.width > pipe_sprite_props.left &&
                    bird_props.top < pipe_sprite_props.top + pipe_sprite_props.height &&
                    bird_props.top + bird_props.height > pipe_sprite_props.top
                ) {
                    gameOver();
                    return;
                } else if (
                    pipe_sprite_props.right < bird_props.left &&
                    pipe_sprite_props.right + move_speed * delta >= bird_props.left &&
                    element.increase_score === '1'
                ) {
                    score_val.innerHTML = parseInt(score_val.innerHTML) + 1;
                    sound_point.play();
                    element.increase_score = '0';
                }
    
                element.style.left = pipe_sprite_props.left - move_speed * delta + 'px';
            }
        });
    
        animationFrameIds.push(requestAnimationFrame(move));
    }
    
    function apply_gravity(timestamp) {
        if (game_state !== 'Play') return;
    
        let delta = (timestamp - lastGravityTimestamp) / 16.67;
        lastGravityTimestamp = timestamp;
    
        bird_dy += gravity * delta;
    
        if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
            gameOver();
            return;
        }
    
        bird.style.top = bird_props.top + bird_dy + 'px';
        bird_props = bird.getBoundingClientRect();
    
        animationFrameIds.push(requestAnimationFrame(apply_gravity));
    }

    function create_pipe(){
        if(game_state !== 'Play') return;

        if(pipe_seperation > 180){
            pipe_seperation = 0;
            let pipe_posi = Math.floor(Math.random() * 43) + 8;
            let current_score = parseInt(score_val.innerHTML) || 0;
            let current_gap = 60;

            if (current_score >= 10 && current_score < 20) current_gap = 50;
            else if (current_score >= 20 && current_score < 30) current_gap = 40;
            else if (current_score >= 30) current_gap = 30;

            let pipe_sprite_inv = document.createElement('div');
            pipe_sprite_inv.className = 'pipe_sprite';
            pipe_sprite_inv.style.top = (pipe_posi - 70) + 'vh';
            pipe_sprite_inv.style.left = '100vw';
            document.body.appendChild(pipe_sprite_inv);

            let pipe_sprite = document.createElement('div');
            pipe_sprite.className = 'pipe_sprite';
            pipe_sprite.style.top = (pipe_posi + current_gap) + 'vh';
            pipe_sprite.style.left = '100vw';
            pipe_sprite.increase_score = '1';
            document.body.appendChild(pipe_sprite);
        }

        pipe_seperation++;
        animationFrameIds.push(requestAnimationFrame(create_pipe));
    }

    // Reset handler satu kali saja
    document.onkeydown = (e) => {
        if(e.key == 'ArrowUp' || e.key == ' '){
            img.src = 'images/naga-2.png';
            bird_dy = -7.6;
        }
    };

    document.onkeyup = (e) => {
        if(e.key == 'ArrowUp' || e.key == ' '){
            img.src = 'images/naga.png';
        }
    };

    lastTimestamp = performance.now();
    animationFrameIds.push(requestAnimationFrame(move));
    animationFrameIds.push(requestAnimationFrame(apply_gravity));
    animationFrameIds.push(requestAnimationFrame(create_pipe));
    lastMoveTimestamp = performance.now();
    lastGravityTimestamp = performance.now();
}

function gameOver() {
    game_state = 'End';
    message.innerHTML = `
        <img src="images/gameover-white.png" alt="Game Over" style="width: 50%; display: block; margin: 0 auto;">
        <p>Press Play To Restart</p>
    `;
    img.style.display = 'none';
    const score = parseInt(score_val.innerHTML);
    
    // Simpan ke Firebase jika login
    saveHighScore(score);
    
    // Simpan ke localStorage jika lebih tinggi
    if (score > highscore) {
        localStorage.setItem('highscore', score);
        highscore = score;
        highscore_val.innerHTML = highscore;
    }

    playBtn.style.display = 'block';
    sound_die.play();
    message.classList.add('messageStyle');
    document.getElementById("leaderboard-btn").style.display = "block";
    document.getElementById("logout-btn").style.display = "block";
    document.getElementById("home-btn").style.display = "block";

    cancelAllFrames();
}


function startCountdown() {
    const countdownTexts = ["3", "2", "1", "Go!"];
    let index = 0;

    message.style.display = 'block';
    message.classList.add('messageStyle');
    
    

    function updateCountdown() {
        if (index < countdownTexts.length) {
            message.innerHTML = countdownTexts[index];
            index++;
            setTimeout(updateCountdown, 1000); // Tampil tiap 700ms
        } else {
            // Setelah "Go!" tampil, baru mulai game
            message.innerHTML = '';
            message.classList.remove('messageStyle');
            game_state = 'Play';
            play();
        }
    }

    updateCountdown();
}
