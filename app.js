var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser =  require('body-parser');

var Team = require('./models/team');

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

app.get('/teams',function(req,res){
    var res1 = {
        index: "#3",
        name: "Test Team",
        room: "Seminar Room"
    }
    var res2 = {
        index: "#4",
        name: "Test Team 1",
        room: "Seminar Room 111"
    }
    Team.find({},function(err,team){
        if(err){
            console.log(err)
        }
        else{
            // console.log("Hello: "+team);
            res.send(team);
        }
    });
});

app.post('/scores',function(req,res){
    console.log(req.body.score);
    res.redirect('/teams');
});

app.listen(8080,function(){
    console.log("Server has Started!");
});