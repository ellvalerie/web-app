


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
   if (num == 1){
    return new john();
   } else if (num == 2){
    return new sam();
   } else if (num == 3){
    return new lenny();
   } else if (num == 4){
    return new bob();
   } else if (num == 5){
    return new matthew();
   } else if (num == 6){
    return new molly();
   } else if (num == 7){
    return new brandon();
   } else if (num == 8){
    return new kate();
   } else if (num == 9){
    return new lesly();
   } else if (num == 10){
    return new jackson();
   } else if (num == 11){
    return new tomas();
   } else if (num == 12){
    return new emily();
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

    update(player_step, player_money){}

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

class truster extends opponent_base {
    // стратегия, при которой противник всегда доверяет
    constructor() {
        super(opponent_base);
        this.type = "truster";
    }
    strategy() {
        this.action = "trust";
    }
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
    update(player_step, player_money){
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
    update(player_step, player_money){
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
    update(player_step, player_money){
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
}

class not_forgiving extends opponent_base{
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
    update(player_step, player_money){
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

class john extends opponent_base {
    // стратегия, при которой противник всегда понижает цену, независимо от действий игрока
    constructor() {
        super(opponent_base);
        this.type = "John";
    }
    strategy() {
        this.action = "down";
    }
}

class sam extends opponent_base {
    // стратегия, при которой противник всегда воздерживается, независимо от действий игрока
    constructor() {
        super(opponent_base);
        this.type = "Sam";
    }
    strategy() {
        this.action = "skip";
    }
}

class lenny extends opponent_base {
    // стратегия, при которой противник всегда повыщает цену, независимо от действий игрока
    constructor() {
        super(opponent_base);
        this.type = "Lenny";
    }
    strategy() {
        this.action = "up";
    }
}

class molly extends opponent_base {
    // стратегия, при которой противник сначала воздерживается, а затем копирует предыдущий ход игрока
    constructor() {
        super(opponent_base);
        this.type = "Molly";
        this.last_action = "await";
    }
    strategy() {       
        if (this.step_num === 0){
            this.action = "skip"
        } else {
            this.action = this.last_action
        } 
    }
    update(player_step, player_money){
        this.last_action = player_step;
    }
}

class bob extends opponent_base {
    // стратегия, при которой противник повышает до первого понижения, после которого начинает всегда понижать
    constructor() {
        super(opponent_base);
        this.type = "Bob";
        this.down_flag = false;
    }
    strategy() {       
        if (this.down_flag){
            this.action = "down"
        } else {
            this.action = "up"
        } 
    }
    update(player_step, player_money){
        if (player_step === "down"){
            this.down_flag = true;
        }
    }
}

class matthew extends opponent_base {
    // стратегия, при которой противник чередует понижение, воздерживание и повышение
    constructor() {
        super(opponent_base);
        this.type = "Matthew";
    }
    strategy(){
        if (this.step_num % 3 === 0){
            this.action = "down";
        } else if (this.step_num % 3 === 1){
            this.action = "skip";
        } else {
            this.action = "up"
        }
    }
}

class brandon extends opponent_base {
    // стратегия, при которой противник рандомно выбирает свой ход
    constructor() {
        super(opponent_base);
        this.type = "Brandon";
    }
    strategy(){
        let rand = getRandomInt(1, 3);
        if (rand === 1){
            this.action = "up";
        } else if (rand === 2){
            this.action = "down";
        } else {
            this.action = "skip";
        }
    }
}

class kate extends opponent_base {
    // стратегия, при которой противник, когда его счет больше или равен счету игрока
    // воздерживается, иначе понижает до того момента, пока его счет снова не будет больше или равен
    constructor() {
        super(opponent_base);
        this.type = "Kate";
        this.player_money = 0;
    }
    strategy(){
        if (this.amount_of_money >= this.player_money){
            this.action = "skip";
        } else {
            this.action = "down";
        }
    }
    update(player_step, player_money){
        this.player_money = player_money;
    }
}

class lesly extends opponent_base {
    // стратегия, при которой противник 3 раунда воздерживается, затем в последующих 3 раундах выбирает то, чего было больше
    // в предыдущих 3 раундах, выбрать по большинству невозможно, стратегия выбирается рандомно, затем противник снова выбирает то
    // чего было больше в предыдущих трех раундах
    constructor() {
        super(opponent_base);
        this.type = "Lesly";
        this.actions_cnt = [0, 0, 0] // [up_cnt, skip_cnt, down_cnt] - используется массив, чтобы избежать повторяющегося кода
        this.action = "skip" // в самом начале цикла стратегии этого противника он 3 раза воздерживается
    }

    strategy() {
        // обновление действия происходит только после трех раундов
        if (this.step_num % 3 == 0)
        {
            // нахождение индекса максимального элемента
            let max = 1; 
            let max_ind = -1;
            let rounds_to_choose = 3;

            for (let i = 0; i < rounds_to_choose; ++i)
            {
                if (this.actions_cnt[i] > max){
                    max_ind = i;
                    max = this.actions_cnt[i]
                }
            }
            // если невозможно выбрать максимум, индекс устанавливается рандомно
            if (max_ind == -1){
                max_ind = getRandomInt(0, rounds_to_choose - 1);
            }
            // выбор действия в зависимости от полученного индекса
            if (max_ind == 0) {
                this.action = "up";   
            } else if (max_ind == 1){
                this.action = "skip";
            } else {
                this.action = "down"
            }
                
            this.actions_cnt = [0, 0, 0];
        } 
    }

    update(player_step, player_money){
        if (player_step === "up"){
            ++this.actions_cnt[0];
        } else if (player_step === "skip"){
            ++this.actions_cnt[1];
        } else {
            ++this.actions_cnt[2];
        }
    }
}

class jackson extends opponent_base { 
    // Противник, который первые два раунда повышает, если пользователь хоть раз понизил, то следующие два раунда он воздерживается, 
    // если пользователь снова хоть раз понизил, то противник следущие два раунда понижает. Если цикл сбивается, то он начинается заново.
    constructor(){
        super(opponent_base);
        this.type = "Jackson";
        this.down_flag = false; 
        this.action = "up"; // противник начиинает игру с повышения
    }
    strategy() {
    // каждые два хода поведение противника меняется
        if (this.step_num % 2 == 0){
            if (this.down_flag){
                if (this.action === "up"){
                    this.action = "skip"
                } else if (this.action === "skip" || this.action === "down") {
                    this.action = "down";
                }
                this.down_flag = false;
            } else {
                this.action = "up";
            }    
        }
        console.log(this.down_flag)
    }

    update(player_step, player_money){
        if (player_step === "down" && !this.down_flag){
            this.down_flag = true;
        }
    }
}

class tomas extends opponent_base {
    // Противник, чередует понижение, воздерживание и повышение каждые 2 раунда
    constructor(){
        super(opponent_base);
        this.type = "Tomas";
    }
    strategy(){
        // определение текущего хода происходит в зависимости от остатка при делении номера шага на 6
        let remainder = this.step_num % 6;
        if (remainder == 0 || remainder == 1){
            this.action = "down";
        } else if (remainder == 2 || remainder == 3) {
            this.action = "skip";
        } else {
            this.action = "up";
        }
    }
}

class emily extends opponent_base {
    // противник, который воздерживается, если счет равный, понижает, если количество прибыли у игрока больше
    // и повышает, если количество пробыли у игрока меньше
    constructor(){
        super(opponent_base);
        this.type = "Emily";
        this.player_money = 0;
    }
    strategy(){
        let diff = this.player_money - this.amount_of_money; // разница между счетом игрока и счетом противника
        console.log(this.player_money, this.amount_of_money)
        // в зависимости от разницы противник выбирает ход, который ближе всего подходит
        // чтобы сравнять текущий известный счет на новом шаге
        if (diff == 0){ // счет равный, нужно воздерживаться
            this.action = "skip";
        } else if (diff > 0){
            this.action = "down";
        } else {
            this.action = "up";
        }
    }

    update(player_step, player_money){
        this.player_money = player_money;
    }
}