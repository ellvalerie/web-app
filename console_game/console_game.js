// технический вызов, чтобы можно было считывать данные из консоли
const prompt = require("readline-sync");

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
* Создает объект противника в зависимости от ном ера полученного типа
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

class opponent_base {
    constructor() {
        this.amount_of_money = 0;
        this.action = "await";
        this.step_num = 0
    }
    // возвращает шаг ии
    step() {
        return this.action;
    }

    strategy(){}

    update(player_step){}

    change_game_cnt(){
        this.step_num += 1
    }

    get_game_cnt(){
        return this.step_num
    }
}

class truster extends opponent_base {
    // стратегия, при которой противник всегда доверяет
    constructor() {
        super(opponent_base);
        this.type = "truster";
    }
    strategy() {
        this.action = "trust";
    }
    update(player_step){}
}

class liar extends opponent_base {
    // стратегия, при которой противник всегда обманывает
    constructor() {
        super(opponent_base);
        this.type = "liar";
    }
    strategy() {
        this.action = "lie";
    }
    update(player_step){}
}

class random extends opponent_base {
    // стратегия, при которой противник выбирает рандомный ход
    constructor() {
        super(opponent_base);
        this.type = "random";
    }
    strategy() {
        const option = getRandomInt(0, 1);
        if (option === 0) {
            this.action = "lie";
        } else {
            this.action = "trust";
        }
    }
    update(player_step){}
}

class copy extends opponent_base {
    // стратегия при которой противник доверяет на первом ходе, а затем начинает копировать предыдущий ход пользователя
    constructor(){
        super(opponent_base);
        this.type = "copy";
        this.last_action = "await"
    }
    strategy() {       
        if (this.step_num === 0){
            this.action = "trust"
        } else {
            this.action = this.last_action
        } 
    }
    update(player_step){
        this.last_action = player_step;
    }
}

class vindictive extends opponent_base {
    /* 
    * стратегия, при которой противник доверяет пользователю до первого обмана
    */
    constructor(){
        super(opponent_base);
        this.type = "vindictive"
        this.lie_flag = false        
    }
    strategy(){
        if (this.lie_flag === false){
            this.action = "trust";
        } else {
            this.action = "lie";
        }
    }
    update(player_step){
        if (player_step === "lie" && !this.lie_flag){
            this.lie_flag = true;
        }
    }
}

class detective extends opponent_base {
    /*
    * стратегия, при которой противник первые три раунда доверяет пользователю, если пользователь его хоть раз обманывает то
    * противник начинает копировать его предыдущий ход, если же пользователь  ни разу его не обманывает, то противник начинает всегда обманывать
    */
    constructor(){
        super(opponent_base);
        this.type = "detective";
        this.last_action = "await"
        this.three_step_flag = false
    }
    strategy(){
        if (this.step_num < 3){
            this.action = "trust"
        } else if (this.three_step_flag) { // пользователь обманул в один из первых трех шагов
            this.action = this.last_action;
        } else {
            this.action = "lie";
        }
    }
    update(player_step){
        if (player_step === "lie" && this.step_num < 3 && !this.three_step_flag){
            this.three_step_flag = true;
        }
        this.last_action = player_step
    }

}
class alternation extends opponent_base {
    // противник, который чередует доверие с обманом, начиная с обмана
    constructor(){
        super(opponent_base);
        this.type = "alternation"
    }
    strategy(){
        if (this.step_num % 2 === 0) {
            // если текущий ход является четным, то противник обманывает
            this.action = "lie"
        } else {
            // если текущий ход является нечетным, то противник доверяет
            this.action = "trust"
        }
    }
    update(type){}
}

class game {
    constructor() {
        this.player_money = 0;
        this.number_of_strategies = 7;
        this.ai = getType(getRandomInt(1, this.number_of_strategies));
        console.log(this.ai.type)
    }

    step() {
        console.log(`Current step: ${this.ai.get_game_cnt() + 1}`);
        const player_move = prompt.question("Your turn: "); // получаем ход пользователя trust or lie
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

