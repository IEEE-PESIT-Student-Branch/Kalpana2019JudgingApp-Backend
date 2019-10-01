var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser =  require('body-parser');

var Team = require('./models/team');
var Judge = require('./models/judge');

app.use(bodyParser.urlencoded({extended: true}));
// mongoose.connect("mongodb://localhost/judging");
mongoose.connect("mongodb://uf0shymlfpq2ktltywlh:MI1f3I8ck6tctCNHQo1s@byvyroz6ewveb0q-mongodb.services.clever-cloud.com:27017/byvyroz6ewveb0q");

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
//         judge_id: "5SIPAfPBzddMvC8axae8VWO68LF2",
//         teams: [
//             "65","32","26","66","85","28","21","9","53","35","1"
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
                            console.log(dbteam.scores[round-1]);
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

// app.listen(8080,function(){
//     console.log("Server has Started!");
// });

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server has Started!");
});