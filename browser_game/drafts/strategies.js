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