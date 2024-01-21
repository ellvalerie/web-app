// технический вызов, чтобы можно было считывать данные из консоли
const prompt = require("readline-sync");
import {truster, liar, random, copy, vindictive, detective, alternation} from "./strategies.js";

/*
 * Возвращает случайное целое число от min до max (включительно с обоих сторон)
 * Значение не ниже минимума (или следующего целого числа, если min не целое)
 * Значение не выше max (или предыдущего целого числа, если max не целое)
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


/*
* Создает объект противника в зависимости от номера полученного типа
*/
function getType(num) {
    if (num === 1) {
        return new truster();
    } else if (num === 2) {
        return new liar();
    } else if (num === 3) {
        return new random();
    } else if (num === 4) {
        return new copy()
    } else if (num === 5) {
        return new vindictive()
    } else if (num === 6) {
        return new detective()
    } else if (num === 7) {
        return new alternation()
    }
}


class game {
    constructor() {
        this.player_money = 0;
        this.number_of_strategies = 7;
        this.ai = getType(getRandomInt(1, this.number_of_strategies));
        console.log(this.ai.type)
        this.step_num = 0
    }

    step() {
        console.log(`Current step: ${this.ai.step_num + 1}`);
        const player_move = prompt.question("Your turn: "); // получаем ход пользователя trust or lie
        this.ai.strategy();
        const ai_move = this.ai.step();
        this.ai.step_num += 1
        if (player_move === "trust"){
            this.ai.last_action = player_move;
            if (ai_move === "trust"){
                this.player_money += 2;
                this.ai.amount_of_money += 2;
            } else {
                this.player_money -= 1;
                this.ai.amount_of_money += 3;
            }
        } else if (player_move === "lie"){
            this.ai.last_action = player_move;
            this.ai.lie_flag = true
            if (ai_move === "trust"){
                this.player_money += 3;
                this.ai.amount_of_money -= 1;
            } 
            if (this.ai.step_num < 3){
                this.ai.three_step_flag = true
            }
        }
    }

    // возвращает счет игры
    get_info() {
        if (this.player_money > this.ai.amount_of_money) {
            console.log(
                `player is winnig: pl = ${this.player_money}, ai = ${this.ai.amount_of_money}`
            );
        } else if (this.player_money === this.ai.amount_of_money) {
            console.log(
                `There is a draw with: pl = ${this.player_money}, ai = ${this.ai.amount_of_money}`
            );
        } else {
            console.log(
                `ai is winning: pl = ${this.player_money}, ai = ${this.ai.amount_of_money}`
            );
        }
    }

    play() {
        while (true) {
            this.step();
            this.get_info();
            const ans = prompt.question("Choose type:"); // завершение игры
            if (ans === this.ai.type) {
                return;
            } else {
                console.log("You got it wrong!")
            }
        }
    }
}

let ga = new game();
ga.play();

