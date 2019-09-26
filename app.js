var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser =  require('body-parser');

var Team = require('./models/team');
var Judge = require('./models/judge');

app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost/judging");

// Team.create(
//     {
//         team_id : "#4",
//         name: "C Sick",
//         room: "Room 004",
//         scores: [
//             [
//                 {
//                     judge_id: "judge002",
//                     score: -1
//                 }
//             ]
//         ]
//     }
// );

// Judge.create(
//     {
//         judge_id: "judge001",
//         round: 1,
//         teams: [
//             "#3","#4"
//         ]
//     }
// );

app.get('/teams/:judgeid',function(req,res){
    // var res1 = {
    //     index: "#3",
    //     name: "Test Team",
    //     room: "Seminar Room"
    // }
    // var res2 = {
    //     index: "#4",
    //     name: "Test Team 1",
    //     room: "Seminar Room 111"
    // }
    // Team.find({},function(err,team){
    //     if(err){
    //         console.log(err)
    //     }
    //     else{
    //         // console.log("Hello: "+team);
    //         res.send(team);
    //     }
    // });
    Judge.find({judge_id:""+req.params.judgeid},function(err,dbjudge){
        if(err){
            console.log(err);
        }
        else{
            var jteams = dbjudge[0].teams;
            Team.find({'team_id': {$in : jteams}},function(err,dbteams){
                if(err){
                    console.log(err);
                }
                else{
                    res.send(dbteams);
                }
            });
            // lteams=[];
            // jteams.forEach(async function(team_id){
            //     console.log(team_id);
            //     await Team.find({team_id: team_id},function(err,dbteams){
            //         if(err){
            //             console.log(err);
            //         }
            //         else{
            //             console.log("IN");
            //             lteams.push(dbteams[0]);
                        
            //         }
            //     });
            //     // console.log(lteams);
            //     console.log("OUT");
            // });
            // console.log("ForEach done");
            // console.log(lteams);
            // res.send(lteams);
        }
    });
});

app.post('/scores',function(req,res){
    var score = req.body.score;
    var uid = req.body.jid;
    console.log(uid);
    Judge.findOne({judge_id: uid},function(err,dbjudge){
        if(err){
            console.log(err);
        }
        else{
            var teamstobejudged = dbjudge.teams;
            var idx = teamstobejudged.indexOf("#3");
            console.log(dbjudge);
            teamstobejudged.splice(idx,1);
            console.log(teamstobejudged);
            Judge.findByIdAndUpdate(dbjudge._id,{'teams': teamstobejudged},function(err,updatedJudge){
                if(err){
                    console.log(err);
                }
                else{
                    console.log(updatedJudge);
                }
            });
        }
    });
    res.redirect('/teams');
});

app.listen(8080,function(){
    console.log("Server has Started!");
});