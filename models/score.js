const mongoose = require('mongoose');

// Define the schema
const scoreSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    sudokuTime:{
        easy:{
            type: Number,
            default: 3600000
        },
        medium:{
            type: Number,
            default: 3600000
        },
        hard:{
            type: Number,
            default: 3600000
        }
    },
    BlockScore:{
        type: Number,
        default: 0
    },
    TicTacToe:{
        played:{
            type: Number,
            default: 0
        },
        win:{
            type: Number,
            default: 0
        },
        draw:{
            type: Number,
            default: 0
        },
        lose:{
            type:Number,
            default: 0
        },
    },
    Snake: {
        type: Number,
        default: 0
    },
    Chess:{
        played:{
            type: Number,
            default: 0
        },
        win:{
            type: Number,
            default: 0
        },
        lose:{
            type: Number,
            default: 0
        },
    },
    TotalScore:{
        type: Number,
        default: 0
    },
})



scoreSchema.statics.update = async function(email,sudokuTime,level){
    const user = await this.findOne({email});
    if(user){
        if(user['sudokuTime'][level] > sudokuTime){
            user['sudokuTime'][level] = sudokuTime;
            user.save();
        }
    }
}

scoreSchema.statics.updateBlock = async function(email,score){
    const user = await this.findOne({email});
    if(user){
        if(user['BlockScore'] < score){
            user['TotalScore'] -= user['BlockScore'];
            user['TotalScore'] += score;
            user['BlockScore'] = score;
            user.save();
        }
    }
}

scoreSchema.statics.updateTicTacToe = async function(email,win){
    const user = await this.findOne({email});
    if(user){
        user['TicTacToe']['played'] += 1;
        if(win == 1){
            user['TicTacToe']['win'] += 1;
            user['TotalScore'] += 3000;
        }
        else if(win == 2){
            user['TicTacToe']['draw'] += 1;
            user['TotalScore'] += 1500;
        }
        else{
            user['TicTacToe']['lose'] += 1;
            user['TotalScore'] += 500;
        }
        user.save();
    }
}


scoreSchema.statics.updateChess = async function(email,win){
    const user = await this.findOne({email});
    if(user){
        user['Chess']['played'] += 1;
        if(win == 1){
            user['Chess']['win'] += 1;
            user['TotalScore'] += 3000;
        }
        else{
            user['Chess']['lose'] += 1;
            user['TotalScore'] += 500;
        }
        user.save();
    }
}

scoreSchema.statics.updateSnake = async function(email,score){
    const user = await this.findOne({email});
    if(user){
        if(user['Snake'] < score){
            user['TotalScore'] -= user['Snake']*100;
            user['TotalScore'] += score*100;
            user['Snake'] = score;
        }
        user.save();
    }
}

const score = mongoose.model('score',scoreSchema);

module.exports = score;


