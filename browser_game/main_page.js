const double_table_buttn = document.getElementById("button-double-table")
const triple_table_buttn = document.getElementById("button-triple-table")
const double_table_cont = document.getElementById("double-table-container")
const triple_table_cont = document.getElementById("triple-table-container")
const double_strat_buttn = document.getElementById("button-double-strategies")
const triple_strat_buttn = document.getElementById("button-triple-strategies")
const double_strat_cont = document.getElementById("table-for-double-strategies")
const triple_stat_cont = document.getElementById("table-for-triple-strategies")
const jackson_img_buttn = document.getElementById("jackson-img-button")
const jackson_img = document.getElementById("jackson-img")

function handleDTTButton(event){
    // Обработка клика на кнопки "Показать таблицу"
    // В зависимости от id кнопки скрывает или показывает нужные таблицы
    let table = event.target.id;
    let table_cont = table == "button-double-table" ? double_table_cont : triple_table_cont
    let buttn = table == "button-double-table" ? double_table_buttn : triple_table_buttn
    if (table_cont.style.display == "none" || table_cont.style.display == ""){
        buttn.textContent = "Скрыть таблицу"; // изменение текста кнопки 
        table_cont.style.display = "inline";
    } else {
        buttn.textContent = "Показать таблицу" // изменение текста кнопки 
        table_cont.style.display = "none"
    }
}

double_table_buttn.addEventListener("click", handleDTTButton)
triple_table_buttn.addEventListener("click", handleDTTButton)

function handleDTStratButton(event){
    // Обработка клика на кнопки "Показать стратегии"
    // В зависимости от id кнопки скрывает или показывает нужные стратегии
    let model = event.target.id;
    let strat_cont = model == "button-double-strategies" ? double_strat_cont : triple_stat_cont;
    let buttn = model == "button-double-strategies" ? double_strat_buttn : triple_strat_buttn;
    if (strat_cont.style.display == "none" || strat_cont.style.display == ""){
        buttn.textContent = "Скрыть описание всех стратегий"; // изменение текста кнопки 
        strat_cont.style.display = "inline";
    } else {
        buttn.textContent = "Показать описание всех стратегий"; // изменение текста кнопки 
        strat_cont.style.display = "none";
    }
}

double_strat_buttn.addEventListener("click", handleDTStratButton)
triple_strat_buttn.addEventListener("click", handleDTStratButton)

function HandleImgButton(){
    // Обработка клика на кнопки "Показать картинку", нужно для понятного описания стратегии с именем Jackson
    if (jackson_img.style.display == "none" || jackson_img.style.display == ""){
        jackson_img_buttn.textContent = "Скрыть картинку"; // изменение текста кнопки 
        jackson_img.style.display = "inline";
    } else {
        jackson_img_buttn.textContent = "Показать картинку"; // изменение текста кнопки 
        jackson_img.style.display = "none";
    }
}

jackson_img_buttn.addEventListener("click", HandleImgButton)


