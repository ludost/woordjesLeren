function Question () {
  this.list = []
  this.currentQuestion = {}
  this.mode = this.modes.EXAM_RETRY
  this.direction = this.directions.THERE
  this.accents = false
  this.stats = new Stats()
}

Question.prototype = {
  modes: {
    EXAM: 'Toets',
    EXAM_RETRY: 'Toets met herkansing',
    PRACTICE_REMOVE: 'Oefenen met verwijdering',
    PRACTICE: 'Oefenen'
  },
  directions: {
    THERE: 'Woord -> betekenis',
    BACK: 'Betekenis -> Woord',
    BOTH: 'Beide richtingen'
  },
  loadList: function (list) {
    this.list = list
    this.stats.reset(list.length)
  },
  stop: function(){
    this.currentQuestion = {}
    $('#question').html('Klaar!')
    $('#answers').children().show()
  },
  askQuestion: function () {
    //get random question
    if (this.list.length === 0) {
      this.stop()
      return
    }

    let randomIdx = Math.floor(Math.random() * this.list.length)
    //Init retryCount
    this.list[randomIdx].retryCount = typeof this.list[randomIdx].retryCount === 'undefined' ? 0 : this.list[randomIdx].retryCount

    this.currentQuestion = this.list[randomIdx]
    this.currentQuestion.idx = randomIdx
    let direction = this.direction
    if (direction === this.directions.BOTH) {
      direction = Math.random() >= 0.5 ? this.directions.THERE : this.directions.BACK
    }
    this.currentQuestion.direction = direction
    //ask question

    let inputfield = '<textarea style="width:100%" id="answerBox" value=""></textarea>'
    $('#question').html(
      '<div class="col-1">' +
      '</div><div class="col-3">' + (direction === this.directions.THERE ? this.currentQuestion['woord'] : inputfield) +
      '</div><div class="col-8">' + (direction === this.directions.BACK ? this.currentQuestion['betekenis'].join('<br/>') : inputfield) +
      '</div>')
    $('#answerBox').on('keypress', this.answerHandler).focus()

    this.stats.asked()
  },
  answerHandler: function (event) {
    if (event.which === 13 || event.keyCode === 13) {
      question.answerQuestion($('#answerBox').val())
      return false
    }
  },
  answerQuestion: function (answer) {
    function checkAnswer (answer, original) {
      if (typeof answer !== 'string') {
        return false
      }
      let cleanAnswer = (' ' + answer).replace(/ de | het | een |\n/gi, ' ').replace(/[\.,\!\?]/g,'').replace(/ {2}/g, ' ').trim()
      let cleanOrigin = (' ' + original).replace(/ de | het | een |\n/gi, ' ').replace(/[\.,\!\?]/g,'').replace(/ {2}/g, ' ').trim()
      return cleanOrigin.localeCompare(cleanAnswer, undefined, { sensitivity: (this.accent?'accent':'base') }) === 0
    }

    let correct = false
    let direction = this.currentQuestion.direction
    switch (direction) {
      case this.directions.THERE:
        correct = typeof (this.currentQuestion['betekenis'].find((option) => {
          return checkAnswer(answer, option)
        })) !== 'undefined'
        break
      case this.directions.BACK:
        correct = checkAnswer(answer, this.currentQuestion['woord'])
        break
    }
    if (correct && this.mode !== this.modes.PRACTICE) {
      //if correct and not Practice, remove from this.list
      this.list.splice(this.currentQuestion.idx, 1)
    }
    if (!correct) {
      this.list[this.currentQuestion.idx].retryCount++
    }
    let answers = $('#answers')
    //Render previous answer
    answers.prepend(
      '<div class="row" style="color:' + (correct ? 'green' : 'red') + '">' +
      '<div class="flat-col-1">' + (correct ? 'Goed' : 'Fout!') +
      '</div><div class="flat-col-3">' + (direction === this.directions.BACK ? answer : this.currentQuestion['woord']) +
      '</div><div class="flat-col-8">' + (direction === this.directions.THERE ? answer : '') +
      '</div>' +
      '</div>' +
      '<div class="row" style="padding-bottom:5px;font-style:italic">' +
      '<div class="flat-col-1">' +
      '</div><div class="flat-col-3">' + (direction === this.directions.BACK && !correct ? this.currentQuestion['woord'] : '') +
      '</div><div class="flat-col-8">' + this.currentQuestion['betekenis'].join('<br/>') +
      '</div>' +
      '</div>'
    )

    if (this.mode !== this.modes.PRACTICE && this.mode !== this.modes.PRACTICE_REMOVE) {
      answers.children().hide()
      answers.children(':first-child').show()
      if (this.mode === this.modes.EXAM_RETRY){
        answers.children(':nth-child(2)').show()
      }
    }

    if (correct){
      this.stats.correct()
    } else {
      this.stats.wrong()
    }
    this.stats.remaining(this.list.length)

    //Ask next question:
    this.askQuestion()
  }
}
