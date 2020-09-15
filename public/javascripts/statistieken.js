function Stats () {
  this.nofRemaining=0
  this.questionsAsked=0;
  this.nofCorrect=0;
  this.nofFalse=0;
  this.update()
}

Stats.prototype = {
  update: function(){
    $("#stats").html(
    '<b>Statistieken:</b><br/>'+
    'Onbeantwoord:'+this.nofRemaining+'<br/>'+
    'Gesteld:'+this.questionsAsked+'<br/>'+
    'Goed:'+this.nofCorrect+'<br/>'+
    'Fout:'+this.nofFalse
    );
  },
  reset: function(remaining){
    this.nofRemaining=remaining
    this.questionsAsked=0;
    this.nofCorrect=0;
    this.nofFalse=0;
    this.update()
  },
  remaining: function(remaining){
    this.nofRemaining=remaining
    this.update()
  },
  asked: function(){
    this.questionsAsked++
    this.update()
  },
  correct: function(){
    this.nofCorrect++
    this.update()
  },
  wrong: function(){
    this.nofFalse++
    this.update()
  }
}