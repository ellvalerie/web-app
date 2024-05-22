// import { game } from "./tripple_game.js";
import { game } from "../game_class.js";
import { Chart } from "chart.js/auto";

const start_button = document.querySelector("#new_game");
const step_cnt = document.getElementById("step_num");
const head_text = document.getElementById("head_text");
const response_text = document.getElementById("response_text");
const up_button = document.querySelector("#up");
const skip_button = document.querySelector("#skip");
const down_button = document.querySelector("#down");
const form = document.getElementById("form");
const ai_score = document.getElementById("score_ai_text");
const user_score = document.getElementById("score_player_text")
const ai_score_size_element = document.getElementById("score_ai");
const user_score_size_element = document.getElementById("score_player")
const strategies_button = document.querySelector("#str_button");
const graph_button = document.querySelector("#graph_button");
const model_button = document.querySelector("#model_button");
const logger_button = document.querySelector("#logger_button");
const logs = document.querySelector("#history")
var gm;
var MyChart = null;


function checkTextSize(score, score_size_element){
  // Функция, которая уменьшает размер шрифта, если текст вышел за границу блока
  // Принимает текст и блок
  if (score.offsetWidth > score_size_element.offsetWidth){
    let before = getComputedStyle(score_size_element).getPropertyValue('font-size')
    let after = Number(before.slice(0, -2)) - 12
    score_size_element.style.cssText = `font-size:${after}px;`;
  }
  console.log(getComputedStyle(score_size_element).getPropertyValue('font-size'))
}

function updateGraph(gr) {
    /* 
    Функция, отвечающая за создание графика и его обновление после каждого шага
    */
    let ctx = document.querySelector("#MyChart").getContext("2d");
    const labels = gr.get_steps();
    const data = {
      labels: labels,
      datasets: [
        {
          label: "Количество очков у Вас",
          data: gr.get_player_score(),
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
        {
          label: "Количество очков у противника",
          data: gr.get_ai_score(),
          fill: false,
          borderColor: "rgb(220, 20, 60)",
          tension: 0.1,
        },
      ],
    };
    const config = {
      type: "line",
      data: data,
    };
    if (MyChart) {
      MyChart.clear();
      MyChart.destroy();
    }
    MyChart = new Chart(ctx, config);
  }

  // Обработка отклика на кнопку "Начать игру"
function handleStartClick() {
    console.log("click");
    start_button.style.display = "none";
    response_text.style.display = "none";
    head_text.style.display = "inline";
    step_cnt.textContent = "Шаг №1";
    logs.textContent = "Игра началась!"
    console.log(logs.textContent)
    gm = new game("tripple_choice");
    updateGraph(gm.gr);
  }
  
  start_button.addEventListener("click", handleStartClick);

  // Обработка отклика на кнопки ПОВЫСИТЬ, ВОЗДЕРЖАТЬСЯ, ПОНИЗИТЬ

  function handleChoiceClick(event) {
    let situation = gm.step(event.target.id);
    user_score.textContent = `${gm.player_money}`;
    checkTextSize(user_score, user_score_size_element);
    ai_score.textContent = `${gm.ai.amount_of_money}`;
    checkTextSize(ai_score, ai_score_size_element);
    step_cnt.textContent = `Шаг №${gm.ai.get_game_cnt() + 1}`;
    let elements = document.getElementsByClassName("step");
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.background = "#d9d9d9";
    }
    document.getElementById(situation).style.background = "#bbe7bb";
    updateGraph(gm.gr);
    logs.textContent +=  
    `\n Шаг №${gm.ai.get_game_cnt()}: Ваш ход - ${event.target.id}, ход противника - ${gm.ai.action}.`
  }
  
  up_button.addEventListener("click", handleChoiceClick);
  skip_button.addEventListener("click", handleChoiceClick);
  down_button.addEventListener("click", handleChoiceClick);
  

  function handleForm(event) {
    // Обработка отправки формы с ответом
    event.preventDefault(); // предотвращает обновление страницы после отправки формы
    // получаем поле формы
    let answer = form.querySelector('[id = "strategy"]').value;
    console.log(`ввели ${answer}`);
    console.log(answer);
    let stat = gm.process_answer(answer);
    console.log(stat);
    if (stat) {
      let end_page = document.getElementById("ending");
      response_text.textContent = ``;
      end_page.style.display = "block";
      let end_text = document.getElementById("type");
      end_text.textContent = `Тип противника был ${answer}.`;
      let end_steps = document.getElementById("steps_num");
      if (gm.ai.get_game_cnt() < 5) {
        end_steps.textContent = `Вы угадали за ${gm.ai.get_game_cnt()} шагa.`;
      } else {
        end_steps.textContent = `Вы угадали за ${gm.ai.get_game_cnt()} шагов.`;
      }
      gm.end_game();
    } else {
      response_text.textContent = `Вы ошиблись, это не ${answer}`;
      let block = document.getElementById(`${answer}-block`);
      var select = document.getElementById("strategy");
      select.removeChild(select.querySelector(`[id="${answer}"]`));
      block.style.background = "#d4b0b0b7";
    }
    response_text.style.display = "block";
  }
  
  // при отправке формы срабатывает событие submit
  form.addEventListener("submit", handleForm);
  // Выдвижение таблицы со стратегиями при нажатии кнопки 
  function handleStrButton() {
    let str_container = document.getElementById("help_str_field");
    if (
      str_container.style.transform == "translateX(450px)" ||
      str_container.style.transform == ""
    ) {
      str_container.style.transform = "translateX(0px)";
    } else {
      str_container.style.transform = "translateX(450px)";
    }
  }
  strategies_button.addEventListener("click", handleStrButton);
  
  
  function handleMGLButton(event) {
    let container = document.getElementById("graph")
    if (event.target.id == "model_button"){
        container = document.getElementById("model_field");
    } else if (event.target.id == "logger_button"){
      container = document.getElementById("logger")
    }
    if (
      container.style.left == "-500px" ||
      container.style.left == ""
    ) {
      container.style.left = "0px";
    } else {
      container.style.left = "-500px";
    }
    console.log("clicked");
  }

  model_button.addEventListener("click", handleMGLButton);
  graph_button.addEventListener("click", handleMGLButton);
  logger_button.addEventListener("click", handleMGLButton);
  