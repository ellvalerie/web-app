


export function getRandomInt(min, max) {
    /*
    * Возвращает случайное целое число от min до max (включительно с обоих сторон)
    * Значение не ниже минимума (или следующего целого числа, если min не целое)
    * Значение не выше max (или предыдущего целого числа, если max не целое)
    */
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



export function getTypeDouble(num) {
    /*
    * Создает объект противника игры с двойным выбором в зависимости от номера полученного типа
    */
    if (num === 1) {
        return new truster();
    } else if (num === 2) {
        return new liar();
    } else if (num === 3) {
        return new random();
    } else if (num === 4) {
        return new copy();
    } else if (num === 5) {
        return new vindictive();
    } else if (num === 6) {
        return new detective();
    } else if (num === 7) {
        return new alternation();
    } else if (num === 8) {
        return new not_forgiving();
    }
}

export function getTypeTripple(num) {
    /*
    * Создает объект противника игры с тройным выбором в зависимости от номера полученного типа
    */
   if (num === 1){
    return new john();
   } else if (num === 2){
    return new sam();
   } else if (num === 3){
    return new lenny();
   }
}

class opponent_base {
    /*
    * Базовый класс родитель для любого соперника игры с двойным и тройным выбором 
    */
    constructor() {
        this.amount_of_money = 0;
        this.action = "await"; // действие обозначает начало игры и режим ожидания
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

/*
* Стратегии игры с двойным выбором.
* Возможные действия: trust - довериться и lie - соврать
*/

export class truster extends opponent_base {
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

export class liar extends opponent_base {
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

export class random extends opponent_base {
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

export class copy extends opponent_base {
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

export class vindictive extends opponent_base {
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

export class detective extends opponent_base {
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
export class alternation extends opponent_base {
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

export class not_forgiving extends opponent_base{
    // противник, который начинает игру с обмана. если пользователь два раза подряд ему доверяет, то он начинает доверять пользователю
    // если пользователь два раза подряд его обманывает, то он снова начинает обманывать 
    constructor() {
        super(opponent_base);
        this.type = "not_forgiving";
        this.double_trust_flag = false;
        this.last_action = "lie";
    }
    strategy(){
        if (this.double_trust_flag) {
            // если текущий ход является четным, то противник обманывает
            this.action = "trust"
        } else {
            // если текущий ход является нечетным, то противник доверяет
            this.action = "lie"
        }
    }
    update(player_step){
        if (player_step === "trust" && this.last_action === "trust"){
            this.double_trust_flag = true;
        }
        else if (player_step === "lie" && this.last_action === "lie"){
            this.double_trust_flag = false;
        }
        this.last_action = player_step
    }
}

/*
* Стратегии для игры с тройным выбором.
* Возможные действия: up - повысить цену, skip - воздержаться, down - понизить цену
*/

export class john extends opponent_base {
    // стратегия, при которой противник всегда понижает цену, независимо от действий игрока
    constructor() {
        super(opponent_base);
        this.type = "John";
    }
    strategy() {
        this.action = "down";
    }
    update(player_step){}
}

export class sam extends opponent_base {
    // стратегия, при которой противник всегда воздерживается, независимо от действий игрока
    constructor() {
        super(opponent_base);
        this.type = "Sam";
    }
    strategy() {
        this.action = "skip";
    }
    update(player_step){}
}

export class lenny extends opponent_base {
    // стратегия, при которой противник всегда повыщает цену, независимо от действий игрока
    constructor() {
        super(opponent_base);
        this.type = "Lenny";
    }
    strategy() {
        this.action = "up";
    }
    update(player_step){}
}