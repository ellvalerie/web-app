import { game } from "../game_class.js";
import { Chart } from "chart.js/auto";

const start_button = document.querySelector("#new_game");
const step_cnt = document.getElementById("step_num");
const head_text = document.getElementById("head_text");
const response_text = document.getElementById("response_text");
var gm;
var MyChart = null;

function checkTextSize(score, score_size_element){
  // Функция, которая уменьшает размер шрифта, если текст вышел за границу блока
  // Принимает текст и блок
  if (score.offsetWidth > score_size_element.offsetWidth){
    let before = getComputedStyle(score_size_element).getPropertyValue('font-size')
    let after = Number(before.slice(0, -2)) - 6
    score_size_element.style.cssText = `font-size:${after}px;`;
  }
}

function updateGraph(gr) {
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
  gm = new game("double_choice");
  updateGraph(gm.gr);
}

start_button.addEventListener("click", handleStartClick);

const trust_button = document.querySelector("#trust");
const lie_button = document.querySelector("#lie");
// const user_score = document.getElementById("score_player");
const ai_score = document.getElementById("score_ai_text");
const user_score = document.getElementById("score_player_text")
const ai_score_size_element = document.getElementById("score_ai");
const user_score_size_element = document.getElementById("score_player")

function handleTrustClick() {
  let situation = gm.step("trust");
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
}

trust_button.addEventListener("click", handleTrustClick);

function handleLieClick() {
  let situation = gm.step("lie");
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
}

lie_button.addEventListener("click", handleLieClick);

const form = document.getElementById("form");

function handleForm(event) {
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
    block.style.background = "#e0b9b9";
  }
  response_text.style.display = "block";
}

// при отправке формы срабатывает событие submit
form.addEventListener("submit", handleForm);

const strategies_button = document.querySelector("#str_button");

function handleStrButton() {
  let str_container = document.getElementById("help_str_field");
  if (
    str_container.style.transform == "translateX(99.1%)" ||
    str_container.style.transform == ""
  ) {
    str_container.style.transform = "translateX(73.2%)";
  } else {
    str_container.style.transform = "translateX(99.1%)";
  }
}
strategies_button.addEventListener("click", handleStrButton);

function handleModelButton() {
  let model_container = document.getElementById("model_field");
  if (
    model_container.style.left == "-400px" ||
    model_container.style.left == ""
  ) {
    model_container.style.left = "0px";
  } else {
    model_container.style.left = "-400px";
  }
  console.log("clicked");
}
model_button.addEventListener("click", handleModelButton);

const graph_button = document.querySelector("#graph_button");

function handleGraphButton() {
  let graph_container = document.getElementById("graph");
  if (
    graph_container.style.left == "-400px" ||
    graph_container.style.left == ""
  ) {
    graph_container.style.left = "0px";
  } else {
    graph_container.style.left = "-400px";
  }
  console.log("clicked");
}
graph_button.addEventListener("click", handleGraphButton);

const red_buttn = document.getElementById("red")
const green_buttn = document.getElementById("green")
const gray_buttn = document.getElementById("gray")
const det_block = document.getElementById("detective-block")

function HandleColor(event){
  let col = event.target.id;
  if (col === "red"){
    det_block.style.background = "#e0b9b9";
  } else if (col === "green"){
    det_block.style.background = "#bbe7bb"
  } else {
    det_block.style.background = "#d9d9d9"
  }
}

red_buttn.addEventListener("click", HandleColor)
green_buttn.addEventListener("click", HandleColor)
gray_buttn.addEventListener("click", HandleColor)