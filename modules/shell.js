var prompt = require('prompt'),
    command,
    shells = require('../routes/shells'), input = require('./input');

var check = false;

exports.input = function(){
  if (!check){
    check = true;
    var currentID = shells.getCurrentSession();

    if (!currentID){
      prompt.message = "shellcreeper";
    } else {
      prompt.message = "shellcreeper ("+currentID+")";
    }

    prompt.delimiter = "";

    prompt.get([{
        name: 'input',
        description:' $>'
    }], function(err, result) {

      try {
        command = result.input;
        if(!input.check(command)){
          shells.setPayload(command);
        }
        check = false;
      } catch(err){

      }



    })

  } else {

  }

}
