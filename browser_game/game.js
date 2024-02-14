import {getRandomInt, getType, truster, liar, random, copy, vindictive, detective, alternation} from "./utils.js";

export class game {
    constructor() {
        this.player_money = 0;
        this.number_of_strategies = 7;
        this.ai = getType(getRandomInt(1, this.number_of_strategies));
        console.log(this.ai.type)
    }

    step(player_move) {
        console.log(`Current step: ${this.ai.get_game_cnt() + 1}`)        
        this.ai.strategy();
        const ai_move = this.ai.step();
        this.ai.change_game_cnt()
        if (player_move === "trust"){
            if (ai_move === "trust"){
                this.player_money += 2;
                this.ai.amount_of_money += 2;
            } else {
                this.player_money -= 1;
                this.ai.amount_of_money += 3;
            }
        } else if (player_move === "lie"){
            if (ai_move === "trust"){
                this.player_money += 3;
                this.ai.amount_of_money -= 1;
            } 
        }
        this.ai.update(player_move)
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
            if (ans === this.ai.type) {
                return;
            } else {
                console.log("You got it wrong!")
            }
        }
    }
}


