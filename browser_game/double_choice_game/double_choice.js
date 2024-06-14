import { game } from "../game_class.js";
import { Chart } from "chart.js/auto";

const start_button = document.querySelector("#new_game");
const step_cnt = document.getElementById("step_num");
const head_text = document.getElementById("head_text");
const response_text = document.getElementById("response_text");
const graph_button = document.querySelector("#graph_button");
const model_button = document.querySelector("#model_button");
const logger_button = document.querySelector("#logger_button");
const logs = document.querySelector("#history")
const trust_button = document.querySelector("#trust");
const lie_button = document.querySelector("#lie");
const ai_score = document.getElementById("score_ai_text");
const user_score = document.getElementById("score_player_text")
const ai_score_size_element = document.getElementById("score_ai");
const user_score_size_element = document.getElementById("score_player");
const form = document.getElementById("form");
const strategies_button = document.querySelector("#str_button");
const red_buttn = document.getElementById("red")
const green_buttn = document.getElementById("green")
const gray_buttn = document.getElementById("gray")
const det_block = document.getElementById("detective-block")
var gm;
var MyChart = null;

function checkTextSize(score, score_size_element){
  // Функция, которая уменьшает размер шрифта, если текст вышел за границу блока
  // Принимает текст и блок
  if (score.offsetWidth > score_size_element.offsetWidth){
    let before = getComputedStyle(score_size_element).getPropertyValue('font-size')
    let after = Number(before.slice(0, -2)) - 6
    score_size_element.style.cssText = `font-size:${after}px;`; // изменение размера шрифта
  }
}

function updateGraph(gr) {
  // функция, обновляющая график на каждом новом шаге
  let ctx = document.querySelector("#MyChart").getContext("2d"); // из документа берется объект
  const labels = gr.get_steps();
  const data = {
    // формирование данных для графика
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
        label: "Количество очков у бота",
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
    // удаление старого графика
    MyChart.clear();
    MyChart.destroy();
  }
  // создание графика с новыми данными
  MyChart = new Chart(ctx, config);
}

// Обработка отклика на кнопку "Начать игру"
function handleStartClick() {
  start_button.style.display = "none"; // кнопка пропадает 
  response_text.style.display = "none";
  head_text.style.display = "inline"; // появление текста "Угадай стратегию"
  step_cnt.textContent = "Шаг №1";
  logs.textContent = "Игра началась!" // создание записи в логгер
  gm = new game("double_choice"); // создание нового объекта класса игра
  updateGraph(gm.gr); // создание графика
}

start_button.addEventListener("click", handleStartClick);


function handleChoiceClick(event) {
  // Обработка отклика на кнопки "Обмануть", "Довериться"
  let situation = gm.step(event.target.id); // получение ответа пользователя, вызов функции хода у объекта игры
  // обновление счета
  user_score.textContent = `${gm.player_money}`; 
  checkTextSize(user_score, user_score_size_element);
  ai_score.textContent = `${gm.ai.amount_of_money}`;
  checkTextSize(ai_score, ai_score_size_element);
  // обновление номера шага
  step_cnt.textContent = `Шаг №${gm.ai.get_game_cnt() + 1}`;
  // подсвечивание сработанной альтернативы в выдвигаемой модели
  let elements = document.getElementsByClassName("step");
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.background = "#d9d9d9";
  }
  document.getElementById(situation).style.background = "#bbe7bb";
  // обновление графика
  updateGraph(gm.gr);
  // обновление логгера
  logs.textContent +=  
  `\n Шаг №${gm.ai.get_game_cnt()}: Ваш ход - ${event.target.id}, ход противника - ${gm.ai.action}.`
}

trust_button.addEventListener("click", handleChoiceClick);
lie_button.addEventListener("click", handleChoiceClick);

function handleForm(event) {
  // обработка события отправки формы
  event.preventDefault(); // предотвращает обновление страницы после отправки формы
  // получаем поле формы
  let answer = form.querySelector('[id = "strategy"]').value;
  // вызов функции обработчика ответа пользователя, stat - bool переменная, true, если пользователь угадал, false иначе
  let stat = gm.process_answer(answer);
  if (stat) {
    // если пользователь угадал
    // появление завершающей игру страницы
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
    // если пользователь не угадал
    // появление надписи об ошибке и запись в логгер
    response_text.textContent = `Вы ошиблись, это не ${answer}`;
    logs.textContent += `\n Вы ошиблись, это не ${answer}`
    let block = document.getElementById(`${answer}-block`);
    var select = document.getElementById("strategy");
    select.removeChild(select.querySelector(`[id="${answer}"]`));
    block.style.background = "#e0b9b9";
  }
  response_text.style.display = "block";
}

// при отправке формы срабатывает событие submit
form.addEventListener("submit", handleForm);

function handleStrButton() {
  // выдвижение поля с описаниями всех стратегий при нажатии на кнопку
  let str_container = document.getElementById("help_str_field");
  if (
    str_container.style.transform == "translateX(99.1%)" || // изменение позиции блока со стратегиямим относительно страницы
    str_container.style.transform == ""
  ) {
    str_container.style.transform = "translateX(73.2%)";
  } else {
    str_container.style.transform = "translateX(99.1%)";
  }
}
strategies_button.addEventListener("click", handleStrButton);

function handleMGLButton(event) {
  // выдвижение полей с моделью, графиком и логгером происходит одинаково 
  let container = document.getElementById("graph")
  // определение, какое событие сработало
  if (event.target.id == "model_button"){
      container = document.getElementById("model_field");
  } else if (event.target.id == "logger_button"){
    container = document.getElementById("logger")
  }
  if (
    // сдвиг соотвествующего поля
    container.style.left == "-30%" ||
    container.style.left == ""
  ) {
    container.style.left = "0";
  } else {
    container.style.left = "-30%";
  }
}

model_button.addEventListener("click", handleMGLButton);
graph_button.addEventListener("click", handleMGLButton);
logger_button.addEventListener("click", handleMGLButton);


function HandleColor(event){
  // экспериментально 
  // при наведении на стратегию detective и нажатии на одну из трех кнопок можно покрасить поле в выбранный цвет
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