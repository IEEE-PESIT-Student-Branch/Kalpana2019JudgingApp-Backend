var mongoose = require('mongoose');

var teamSchema = new mongoose.Schema({
    team_id : String,
    name: String,
    room: String,
    scores: [
        [
            {
                judge_id: String,
                score: Number
            }
        ]
    ]
});

module.exports = mongoose.model("Team",teamSchema);