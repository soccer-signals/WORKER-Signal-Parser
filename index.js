import mongoose  from 'mongoose'
import dataUpdates from './Database Models/Data-History'
import User from './Database Models/User'
var $port = 7002
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb+srv://robertkingsleyiv:Mompex35@@@cluster0-arlog.mongodb.net/test?retryWrites=true&w=majority', {
  useNewUrlParser: true
}).then(() => {
  console.log()
});
import express from "express"
import axios from "axios"
var app = express()
axios.get("http://localhost:7100/client-data", (req, res)=>{  
}).then(resp =>{
    var games = resp.data.games
        function userSort() {
        setTimeout(userSort, 3000);
      
      
        User.find((err, dbUsers) => {
      
      
      
      
          dbUsers.forEach(dbUser => {
      
       
            dbUser.signalAlerts.forEach(activeSignal => {
          
              var alertParsed
              var alertToDeleteIndex
      
            
             console.log(activeSignal)
      
      
      
      
      
            })
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
            signalFinder(dbUser, games).then(resp => {
      
      
      
      
              User.findOneAndUpdate({
                _id: resp.account
              }, {
                currentlyTrueSignals: resp.alerts
              }, (err, resp) => {
                if (err) {
                  throw err
                } else {
      
      

      
      
                }
      
              })
      
      
      
      
      
      
      
      
      
      
            })
          })
        })
         }
      userSort()
      var users = []
      function setUserList() {
        setTimeout(setUserList, 5000);
        User.find((err, dbUsers) => {
      
      
          dbUsers.forEach(user => {
            if (users.some(userInSet => {
                return JSON.stringify(userInSet._id) == JSON.stringify(user._id)
              })) {
      
            } else {
      
      
              users.push(user)
            }
      
      
          })
        }).then(() => {
      
        })
      }
      setUserList()
      function handleAlertFound(account, alertFromHandler) {
      
        if (account.signalAlerts.some(alert => {
      
      
            return JSON.stringify({
              Alert: {
                matchId: alert.Alert.matchId,
                signalName: alert.Alert.signalName
              }
            }) == JSON.stringify({
              Alert: {
                matchId: alertFromHandler.Alert.matchId,
                signalName: alertFromHandler.Alert.signalName
              }
            })
          })) {
      
      
      
        } else {
          axios.post('http://localhost:3200/api', {
            type: "userHasSignal",
            account: account._id,
          })
      
          var today = new Date();
          var time = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + " " + today.getHours() + ":" + today.getMinutes();;
      
          User.findOneAndUpdate({
            _id: account._id
          }, {
            $addToSet: {
              signalAlerts: {
                Alert: {
                  matchId: alertFromHandler.Alert.matchId,
                  signalName: alertFromHandler.Alert.signalName,
                  filter: alertFromHandler.Alert.filter,
                  time,
      
                  alertedOnApp: false
                },
                ID: '_' + Math.random().toString(36).substr(2, 9)
              }
            }
          }, (err, res) => {
            if (err) {
              throw err
            } else {
              
         

            }
          })
      
      
      
        }
      }
      function signalFinder(account, games) {
 
        return new Promise((resolve, reject) => {
          var signalAlerts = []
          if (account.userData.signals != null || undefined) {
            account.userData.signals.forEach(signal => {
      
              signal.filters.forEach(filter => {
                if (filter.logicName === 'Score Is') {
      
                  signal.matchesToWatch.forEach(matchIdToWatch => {
                    var watchedMatches = games.filter(game => game.id === matchIdToWatch)
      
                    if (watchedMatches.length > 0) {
                      watchedMatches.forEach(match => {
                        if (match.scores.localteam_score === Number(filter.value.home) && match.scores.visitorteam_score === Number(filter.value.away)) {
                          signalAlerts.push({
                            Alert: {
                              matchId: match.id,
                              signalName: signal.name
                            }
                          })
                        }
                      })
                    }
      
                  })
                }
             
                if (filter.logicName === 'Time Is') {
                  signal.matchesToWatch.forEach(matchIdToWatch => {
                    var watchedMatches = games.filter(game => game.id === matchIdToWatch)
      
      
      
                    if (watchedMatches.length > 0) {
                      watchedMatches.forEach(match => {
                        switch (filter.operator) {
                          case 'exact':
      
                            if (match.time === Number(filter.value.singular)) {
      
                              signalAlerts.push({
                                Alert: {
                                  matchId: match.id,
                                  signalName: signal.name
                                }
                              })
                            }
                            break;
                          case 'more':
      
                            if (match.time >= Number(filter.value.singular)) {
                              signalAlerts.push({
                                Alert: {
                                  matchId: match.id,
                                  signalName: signal.name
                                }
                              })
      
                            }
                            break;
                          case 'less':
      
                            if (match.time <= Number(filter.value.singular)) {
      
      
                              handleAlertFound(account, {
                                Alert: {
                                  matchId: match.id,
                                  signalName: signal.name,
                                  filter,
                                  matchIdToWatch
                                }
                              })
                              signalAlerts.push({
                                Alert: {
                                  matchId: match.id,
                                  signalName: signal.name
                                }
                              })
                            }
                            break;
      
                        }
      
                      })
                    }
      
                  })
                }
                if (filter.logicName === 'Possession Is') {
      
                  signal.matchesToWatch.forEach(matchIdToWatch => {
                    var watchedMatches = games.filter(game => game.id === matchIdToWatch)
      
                    if (watchedMatches.length > 0) {
                      watchedMatches.forEach(match => {
                        if (match.localTeam_stats.possessiontime === Number(filter.value.home) && match.visitorTeam_stats.possessiontime === Number(filter.value.away)) {
                          signalAlerts.push({
                            Alert: {
                              matchId: match.id,
                              signalName: signal.name
                            }
                          })
                        }
                      })
                    }
      
                  })
                }
                if (filter.logicName === 'Supremacy Is') {
      
                  signal.matchesToWatch.forEach(matchIdToWatch => {
                    var watchedMatches = games.filter(game => game.id === matchIdToWatch)
      
                    if (watchedMatches.length > 0) {
                      watchedMatches.forEach(match => {
      
      
                        var localTeamSupremacy = Math.round((match.localTeam_stats.attacks.dangerous_attacks + (match.localTeam_stats.shots.ongoal * 10)) / (match.localTeam_stats.attacks.dangerous_attacks + (match.localTeam_stats.shots.ongoal * 10) + match.visitorTeam_stats.attacks.dangerous_attacks + (match.visitorTeam_stats.shots.ongoal * 10)) * 100)
      
                        var awayTeamSupremacy = Math.round((match.visitorTeam_stats.attacks.dangerous_attacks + (match.visitorTeam_stats.shots.ongoal * 10)) / (match.localTeam_stats.attacks.dangerous_attacks + (match.localTeam_stats.shots.ongoal * 10) + match.visitorTeam_stats.attacks.dangerous_attacks + (match.visitorTeam_stats.shots.ongoal * 10)) * 100)
                        if (localTeamSupremacy === Number(filter.value.home) && awayTeamSupremacy === Number(filter.value.away)) {
                          signalAlerts.push({
                            Alert: {
                              matchId: match.id,
                              signalName: signal.name
                            }
                          })
                        }
                      })
                    }
      
                  })
                }
                if (filter.logicName === 'Yellow Cards Are') {
      
                  signal.matchesToWatch.forEach(matchIdToWatch => {
                    var watchedMatches = games.filter(game => game.id === matchIdToWatch)
      
                    if (watchedMatches.length > 0) {
                      watchedMatches.forEach(match => {
      
      
                        var localTeamStat = match.localTeam_stats.yellowcards
      
                        var awayTeamStat = match.visitorTeam_stats.yellowcards
      
                        if (localTeamStat === Number(filter.value.home) && awayTeamStat === Number(filter.value.away)) {
                          signalAlerts.push({
                            Alert: {
                              matchId: match.id,
                              signalName: signal.name
                            }
                          })
                        }
                      })
                    }
      
                  })
                }
                if (filter.logicName === 'Red Cards Are') {
      
                  signal.matchesToWatch.forEach(matchIdToWatch => {
                    var watchedMatches = games.filter(game => game.id === matchIdToWatch)
      
                    if (watchedMatches.length > 0) {
                      watchedMatches.forEach(match => {
      
      
                        var localTeamStat = match.localTeam_stats.redcards
      
                        var awayTeamStat = match.visitorTeam_stats.redcards
      
                        if (localTeamStat === Number(filter.value.home) && awayTeamStat === Number(filter.value.away)) {
                          signalAlerts.push({
                            Alert: {
                              matchId: match.id,
                              signalName: signal.name,
                              filter
                            }
                          })
                        }
                      })
                    }
      
                  })
                }
      
      
      
      
              })
      
            })
          }
          resolve({
            account: account.id,
            signalCount: signalAlerts.length,
            alerts: signalAlerts
          })
      
        })
      
      }
})

  app.listen($port, ()=>{
    console.log("Server Listening on 7002")
})
