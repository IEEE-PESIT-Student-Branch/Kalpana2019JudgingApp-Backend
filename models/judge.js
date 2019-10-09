var mongoose = require('mongoose');

var judgeSchema = new mongoose.Schema({
    judge_id : String,
    round: Number,
    teams: [String]
});

module.exports = mongoose.model("Judge",judgeSchema);