// вспомогательный класс для построения графика на web-странице

export class graph{
    constructor() {
        this.ai_score = [];
        this.player_score = [];
        this.steps = []
    }

        // сначала на вход подается счет бота, затем счет игрока
    add(ai_num, player_num, step){
        this.ai_score.push(ai_num)
        this.player_score.push(player_num)
        this.steps.push(step)
    }

    // методы получения игровой информации, нужной для построения графика
    get_ai_score(){
        // вернуть счет бота
        return this.ai_score
    }
    get_player_score(){
        // вернуть счет игрока
        return this.player_score
    }
    get_steps(){
        // вернуть количество прошедших шагов
        return this.steps
    }
}