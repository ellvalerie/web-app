import {game} from "./game.js"

const start_button = document.querySelector("#new_game")
const step_cnt = document.getElementById("step_num")
const head_text = document.getElementById("head_text")
var gm

// Обработка отклика на кнопку "Начать игру"
function handleStartClick(){
    console.log('click');
    start_button.style.display = 'none';
    head_text.style.display = 'inline';
    step_cnt.textContent = "Шаг №1";
    gm = new game();
}

start_button.addEventListener('click', handleStartClick)


const trust_button = document.querySelector('#trust')
const lie_button = document.querySelector('#lie')
const user_score = document.getElementById("score_player")
const ai_score = document.getElementById('score_ai')

function handleTrustClick(){ // она вообще отказывается работать
    gm.step("trust")
    user_score.textContent = `${gm.player_money}`
    ai_score.textContent = `${gm.ai.amount_of_money}`
    step_cnt.textContent = `Шаг №${gm.ai.get_game_cnt() + 1}`;
}

trust_button.addEventListener('click', handleTrustClick)

function handleLieClick(){
    gm.step("lie")
    user_score.textContent = `${gm.player_money}`
    ai_score.textContent = `${gm.ai.amount_of_money}`
    step_cnt.textContent = `Шаг №${gm.ai.get_game_cnt() + 1}`;
}

lie_button.addEventListener('click', handleLieClick)