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

    get_ai_score(){
        return this.ai_score
    }
    get_player_score(){
        return this.player_score
    }
    get_steps(){
        return this.steps
    }
}