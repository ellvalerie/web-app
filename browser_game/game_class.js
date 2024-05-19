import {
    getRandomInt,
    getTypeTripple,
    getTypeDouble
  } 
  from "./double_choice_game/utils.js";
import { graph } from "./double_choice_game/graph.js"
  
  export class game {
    constructor(game_type) {

        this.player_money = 0; // инициализация счета игрока
        this.gr = new graph(); // создание графика
        this.game_type = game_type 

        // инициализация противника рандомно, в зависимости от типа игры
        if (game_type === "double_choice"){
            this.number_of_strategies = 8;
            this.ai = getTypeDouble(getRandomInt(1, this.number_of_strategies));
        } else if (game_type === "tripple_choice"){
            this.number_of_strategies = 12;
            this.ai = getTypeTripple(getRandomInt(1, this.number_of_strategies));
        }
    }
    
    
    step(player_move) {
        // обновление ситуации в игре после шагов пользователя и бота, завивсит от типа игры
        let situation = "";
        console.log(this.ai.type)
        this.ai.strategy();  // запоминается для подсвечивания нужного поля в таблице во время игры
        let ai_move = this.ai.step();
        this.ai.change_game_cnt();

        // обновление счета в игре двойным выбором
        if (this.game_type === "double_choice") {
            if (player_move === "trust") {
                if (ai_move === "trust") {
                    this.player_money += 2;
                    this.ai.amount_of_money += 2;
                    situation = "two-two";
                } else {
                    this.player_money -= 1;
                    this.ai.amount_of_money += 3;
                    situation = "m-one-three";
                }
            } else if (player_move === "lie") {
                if (ai_move === "trust") {
                    this.player_money += 3;
                    this.ai.amount_of_money -= 1;
                    situation = "three-m-one";
                } else {
                    situation = "zero-zero";
                }
            }
        } else if (this.game_type === "tripple_choice") {
            if (player_move === "up") {
                if (ai_move === "up") {
                    this.player_money += 4;
                    this.ai.amount_of_money += 4;
                    situation = "four-four";
                } else  if (ai_move === "skip") {
                    this.player_money -= 1;
                    this.ai.amount_of_money += 3;
                    situation = "m-one-three";
                } else if (ai_move === "down") {
                    this.player_money -= 2;
                    this.ai.amount_of_money += 5;
                    situation = "m-two-five"
                }
            } else if (player_move === "skip") {
                if (ai_move === "up") {
                    this.player_money += 3;
                    this.ai.amount_of_money -= 1;
                    situation = "three-m-one";
                } else if (ai_move === "skip") {
                    situation = "zero-zero";
                } else if (ai_move === "down") {
                    this.player_money -= 1.5;
                    this.ai.amount_of_money += 1.5;
                    situation = "m-one-and-half";
                }
            } else if (player_move === "down") {
                if (ai_move === "up") {
                    this.player_money += 5;
                    this.ai.amount_of_money -= 2;
                    situation = "five-m-two"
                } else if (ai_move === "skip") {
                    this.player_money += 1.5;
                    this.ai.amount_of_money -= 1.5;
                    situation = "one-and-half";
                } else if (ai_move === "down") {
                    this.player_money -= 1;
                    this.ai.amount_of_money -= 1;
                    situation = "m-one-m-one"
                }
            }
        }
        // обновление информации бота о ходе игрока
        this.ai.update(player_move, this.player_money);
        // обновление графика
        this.gr.add(
            this.ai.amount_of_money,
            this.player_money,
            this.ai.get_game_cnt()
        );
        return situation;
    }

    process_answer(ans) { 
    /* 
    Функция, обрабатывающая ответ пользователя, не завивсит от типа игры.
    Возвращает true, если пользователь угадал стратегию, false иначе.
    */
    if (ans === this.ai.type) {
        return true;
      }
      return false;
    }

    end_game() {
    /*
    Функция, завершающая игру, не зависит от типа игры.
    */
      this.player_money = 0;
      this.ai = NaN;
    }
  }