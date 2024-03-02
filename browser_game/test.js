import {game} from "./game.js"

const start_button = document.querySelector("#new_game")
const step_cnt = document.getElementById("step_num")
const head_text = document.getElementById("head_text")
const response_text = document.getElementById('response_text')
var gm

// Обработка отклика на кнопку "Начать игру"
function handleStartClick(){
    console.log('click');
    start_button.style.display = 'none';
    response_text.style.display = 'none'
    head_text.style.display = 'inline';
    step_cnt.textContent = "Шаг №1";
    gm = new game();
}

start_button.addEventListener('click', handleStartClick)


const trust_button = document.querySelector('#trust')
const lie_button = document.querySelector('#lie')
const user_score = document.getElementById("score_player")
const ai_score = document.getElementById('score_ai')

function handleTrustClick(){ 
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

const form = document.getElementById('form')

function handleForm(event){
    event.preventDefault() // предотвращает обновление страницы после отправки формы
    // получаем поле формы
    let answer = form.querySelector('[name = "strategy"]').value
    console.log(`ввели ${answer}`)
    console.log(answer)
    let stat = gm.process_answer(answer)
    console.log(stat)
    if (stat) {
        response_text.textContent = `Вы угадали, это ${answer}!!!`
        gm.end_game()
        start_button.style.display = 'inline';
        head_text.style.display = 'none';
        step_cnt.textContent = 'Шаг №0'
        user_score.textContent = '0'
        ai_score.textContent = '0'
    } else {
        response_text.textContent = `Вы ошиблись, это не ${answer}`
    }
    response_text.style.display = 'inline';
}

// при отправке формы срабатывает событие submit
form.addEventListener('submit', handleForm)