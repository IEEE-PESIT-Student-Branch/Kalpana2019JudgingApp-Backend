var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser =  require('body-parser');

var Team = require('./models/team');
var Judge = require('./models/judge');

app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost/judging");

var round=1;

// Team.create(
//     {
//         team_id : "#1",
//         name: "cd 8086",
//         room: "CAD Lab",
//         scores: [
//             [
//                 // {
//                 //     judge_id: "bE6AqAXccXgZQIN8NK5i1rrxTJY2",
//                 //     score: -1
//                 // }
//             ]
//         ]
//     }
// );

// Judge.create(
//     {
//         judge_id: "diHiyjVlCBdBdsnB6REcepRESvI3",
//         round: 1,
//         teams: [
//             "#1","#5"
//         ]
//     }
// );

app.get('/teams/:judgeid',function(req,res){
    Judge.find({judge_id: req.params.judgeid},function(err,dbjudge){
        if(err){
            console.log(err);
        }
        else{
            var jteams = dbjudge[0].teams;
            // console.log(jteams);
            Team.find({'team_id': {$in : jteams}},function(err,dbteams){
                if(err){
                    console.log(err);
                }
                else{
                    dbteams.sort(function(a,b){
                        return a.team_id.localeCompare(b.team_id);
                    });
                    // console.log({round: round, teams: dbteams});
                    res.send({round: round, teams: dbteams});
                }
            });
        }
    });
});

app.post('/scores',function(req,res){
    var score = req.body.score;
    var uid = req.body.jid;
    var tid = req.body.tid;
    console.log(score);
    Judge.findOne({judge_id: uid},function(err,dbjudge){
        if(err){
            console.log(err);
        }
        else{
            var teamstobejudged = dbjudge.teams;
            var idx = teamstobejudged.indexOf(tid);
            teamstobejudged.splice(idx,1);
            dbjudge.teams = teamstobejudged;
            dbjudge.save(function(err,updatedJudge){
                if(err){
                    console.log(err);
                }
                else{
                    Team.findOne({team_id: tid},function(err,dbteam){
                        if(err){
                            console.log(err);
                        }
                        else{
                            dbteam.scores[dbjudge.round-1].push({judge_id: dbjudge.judge_id,score: score});
                            dbteam.save(function(err,updatedTeam){
                                res.redirect('/teams/'+uid);
                            });
                        }
                    });
                    // res.redirect('/teams/'+uid);
                }
            });
        }
    });
});

app.listen(8080,function(){
    console.log("Server has Started!");
});