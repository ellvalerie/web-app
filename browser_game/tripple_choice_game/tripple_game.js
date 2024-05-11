import {
    getRandomInt,
    getTypeTripple,
    john, 
    sam,
    lenny
  } 
  from "../double_choice_game/utils.js";
import { graph } from "../double_choice_game/graph.js"
  
  export class game {
    constructor() {
      this.player_money = 0;
      this.number_of_strategies = 3;
      this.ai = getTypeTripple(getRandomInt(1, this.number_of_strategies));
      console.log(this.ai.type);
      this.gr = new graph();
    }
  
    step(player_move) {
      // обновление ситуации в игре после шагов пользователя и бота
      console.log(`Current step: ${this.ai.get_game_cnt() + 1}`);
      this.ai.strategy();
      const ai_move = this.ai.step();
      this.ai.update(player_move);
      this.ai.change_game_cnt();
      let situation = ""; // запоминается для подсвечивания нужного поля в таблице во время игры

      if (player_move === "up") 
      {
        if (ai_move === "up") 
        {
            this.player_money += 4;
            this.ai.amount_of_money += 4;
            situation = "four-four";
        } 
        else  if (ai_move === "skip")
        {
            this.player_money -= 1;
            this.ai.amount_of_money += 3;
            situation = "m-one-three";
        }
        else if (ai_move === "down")
        {
            this.player_money -= 2;
            this.ai.amount_of_money += 5;
            situation = "m-two-five"
        }
      } 
      else if (player_move === "skip") 
      {
        if (ai_move === "up") 
        {
            this.player_money += 3;
            this.ai.amount_of_money -= 1;
            situation = "three-m-one";
        }
        else if (ai_move === "skip")
        {
            situation = "zero-zero";
        }
        else if (ai_move === "down") 
        {
            this.player_money -= 1.5;
            this.ai.amount_of_money += 1.5;
            situation = "m-one-and-half";
        }
      }
      else if (player_move === "down")
      {
        if (ai_move === "up")
        {
            this.player_money += 5;
            this.ai.amount_of_money -= 2;
            situation = "five-m-two"
        } 
        else if (ai_move === "skip")
        {
            this.player_money += 1.5;
            this.ai.amount_of_money -= 1.5;
            situation = "one-and-half";
        }
        else if (ai_move === "down")
        {
            this.player_money -= 1;
            this.ai.amount_of_money -= 1;
            situation = "m-one-m-one"
        }
      }
      // обновление графика
      this.gr.add(
        this.ai.amount_of_money,
        this.player_money,
        this.ai.get_game_cnt()
      );
      return situation;
    }
  
    // get_info() {
    //   // возвращает счет игры
    //   if (this.player_money > this.ai.amount_of_money) {
    //     console.log(
    //       `player is winnig: pl = ${this.player_money}, ai = ${this.ai.amount_of_money}`
    //     );
    //   } else if (this.player_money === this.ai.amount_of_money) {
    //     console.log(
    //       `There is a draw with: pl = ${this.player_money}, ai = ${this.ai.amount_of_money}`
    //     );
    //   } else {
    //     console.log(
    //       `ai is winning: pl = ${this.player_money}, ai = ${this.ai.amount_of_money}`
    //     );
    //   }
    // }
  
    process_answer(ans) 
    /* 
    Функция, обрабатывающая ответ пользователя.
    Возвращает true, если пользователь угадал стратегию, false иначе.
    */
    {
      if (ans === this.ai.type) {
        return true;
      }
      return false;
    }
  
    end_game() 
    {
    /*
    Функция, завершающая игру.
    */
      this.player_money = 0;
      this.ai = NaN;
    }
  
    play() 
    {
    /*
    Функция, отвечающая за продолжение игры.
    */
      while (true) {
        this.step();
        this.get_info();
        if (ans === this.ai.type) {
          return;
        } else {
          console.log("You got it wrong!");
        }
      }
    }
  }