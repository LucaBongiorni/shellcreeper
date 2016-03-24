var shells = require('../routes/shells');

var ifListSessions = function(input){
	if (input.match(/(sessions)/ig)){
		shells.listSessions();
		return true

	}
	else {
		return false
	}
}

var ifSetSession = function(input){
	if (input.match(/(set session\s[0-9]*)/ig)){
    try{
      thisInput = input.split(" ");
		  shells.setCurrentSession(thisInput[2]);
    } catch(err){
      console.log("Error, your input was invalid..try 'set session <id>'")
    }
		return true

	}
	else {
		return false
	}
}

var ifGetSession = function(input){
	if (input.match(/(session$)/ig)){
		shells.getCurrentSession(true);
		return true
	}
	else {
		return false
	}
}

exports.ifGetSession = ifGetSession;
exports.ifListSessions = ifListSessions;
exports.ifSetSession = ifSetSession;

exports.check = function(input){

	var inputMatchedCheck = false

	var inputChecks = [ifListSessions, ifSetSession, ifGetSession]
	for (i=0;i<inputChecks.length;i++){
		if(inputChecks[i](input)){
			inputMatchedCheck = true
		}
	}
	return inputMatchedCheck
}
