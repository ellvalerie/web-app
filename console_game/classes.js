// технический вызов, чтобы можно было считывать данные из консоли
const prompt = require("readline-sync");

class str1 { // стратегия, при которой противник всегда доверяет
    constructor(){
        this.amount_of_money = 0
        this.action = 'await'
        this.type = 'truster'
    }

    step(){
        this.action = 'trust'
        return this.action
    }
}

class game {
    constructor(){
        this.player_money = 0;
        this.ai = new str1();
    }

    step() {
        const player_move = prompt.question('Your turn: '); // получаем ход пользователя trust or lie
        const ai_move = this.ai.step()
        if (ai_move == player_move && player_move == 'trust'){
            this.player_money += 2
            this.ai.amount_of_money += 2
        } else if (player_move == 'trust' && ai_move == 'lie'){
            this.player_money -= 1
            this.ai.amount_of_money += 3
        } else if (ai_move == 'trust' && player_move =='lie'){
            this.player_money += 3
            this.ai.amount_of_money -= 1
        }
    }

    // возвращает счет игры
    get_info() {
        if (this.player_money > this.ai.amount_of_money){
            console.log(`player is winnig: pl = ${this.player_money}, ai = ${this.ai.amount_of_money}`)
        } else if (this.player_money === this.ai.amount_of_money) {
            console.log(`There is a draw with: pl = ${this.player_money}, ai = ${this.ai.amount_of_money}`)
        } else {
            console.log(`ai is winning: pl = ${this.player_money}, ai = ${this.ai.amount_of_money}`)
        }
    }

    play(){
        while (true) {
            this.step()
            this.get_info()
            const ans = prompt.question('Choose type:') // завершение игры
            if (ans == this.ai.type){
                return
            }
        }
    }
}

let ga = new game()
ga.play()