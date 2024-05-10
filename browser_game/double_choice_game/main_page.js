const double_table_buttn = document.getElementById("button-double-table")
const table_cont = document.getElementById("table-container")
const double_strat_buttn = document.getElementById("button-double-strategies")
const strat_cont = document.getElementById("table-for-double-strategies")

function handleDTButton(){
    console.log(table_cont.style.display)
    if (table_cont.style.display == "none" || table_cont.style.display == ""){
        double_table_buttn.textContent = "Скрыть таблицу";
        table_cont.style.display = "inline";
    } else {
        double_table_buttn.textContent = "Показать таблицу"
        table_cont.style.display = "none"
    }
}

double_table_buttn.addEventListener("click", handleDTButton)

function handleDStatButton(){
    if (strat_cont.style.display == "none" || strat_cont.style.display == ""){
        double_strat_buttn.textContent = "Скрыть описание всех стратегий";
        strat_cont.style.display = "inline";
    } else {
        double_strat_buttn.textContent = "Показать описание всех стратегий";
        strat_cont.style.display = "none";
    }
}

double_strat_buttn.addEventListener("click", handleDStatButton)
