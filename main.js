$(function() {
var cathegoriesLink = "https://opentdb.com/api_category.php";
var quizLink = "https://opentdb.com/api.php?amount=10&category=";
var $triviaCategories = $('#triviaCategories');
function randomizeArrayComponentsIndex(array){  //functia amesteca variantele de raspuns pentru ca raspunsul corect sa nu fie mereu in aceiasi pozitie
    let newArray = [];
    while (array.length > 0) {
        i = Math.floor(Math.random()*array.length);
        newArray.push(array[i]);
        array.splice(i, 1);
        }
    return newArray;
}
$.ajax ({  
    url: cathegoriesLink
})
.done(function(categories){
    // console.log(categories)
    for (let i = 0; i < categories.trivia_categories.length; i++) {
        $("<option value='" + categories.trivia_categories[i].id + "'>" + categories.trivia_categories[i].name + "</option>").appendTo($triviaCategories);
    }   //categoriile sunt afisate in dropdown
});
$("#startQuiz").on("click", function(data){
    $.ajax ({
        url: quizLink + $triviaCategories.val()
    })
    .then(function(data){
        $('#result').text(''); //daca exista raspunsuri corecte anterior afisate acestea sunt sterse
        let $questionList = $('#questionList');
        $questionList.empty(); //daca exista deja o lista de intrebari afisata aceasta este stearsa inainte de afisarea uneia noi
        $('#submitAnswers').remove();
        for (let i = 0; i < data.results.length; i++) {
            let questionIndex = i+1;
            $("<li id='questionNo" + questionIndex + "'>" + data.results[i].question + "</li>").appendTo($questionList);
            if (data.results[i].type == 'boolean'){
                $("<input type='radio' name='question" + questionIndex + "' value='True' id='question" + questionIndex + "option" + i + "'>").appendTo('#questionNo' + questionIndex);
                $("<label for='question" + questionIndex + "option" + i + "'>True</label>").appendTo('#questionNo' + questionIndex);
                $("<input type='radio' name='question" + questionIndex + "' value='False' id='question" + questionIndex + "option" + i + "'>").appendTo('#questionNo' + questionIndex);
                $("<label for='question" + questionIndex + "option" + i + "'>False</label>").appendTo('#questionNo' + questionIndex);
            }else{
                let answerOptions = data.results[i].incorrect_answers;
                answerOptions.push(data.results[i].correct_answer);
                answerOptions = randomizeArrayComponentsIndex(answerOptions);
                for (let i = 0; i < answerOptions.length; i++) {
                    $("<input type='radio' name='question" + questionIndex + "' value='" + answerOptions[i] +"' id='question" + questionIndex + "option" + i + "'>").appendTo('#questionNo' + questionIndex);
                    $("<label for='question" + questionIndex + "option" + i + "'>" + answerOptions[i] + "</label>").appendTo('#questionNo' + questionIndex);
                }
            }
        }  // sunt afisate 10 intrebari intr-o lista cu variante de raspuns in radio buttons
        let questionData = data.results;
        // console.dir(data.results);
        $("<input type='button' value='Submit your answers' id='submitAnswers'>").appendTo('#quizContainer'); //este creat un buton pentru submit
        $('#submitAnswers').on('click', function(data){
            let score = 0;
            let $questionList = $('#questionList li');
            for (let i = 0; i < $questionList.length; i++) {
                let questionIndex = i+1;
                let correctAnswer = questionData[i].correct_answer;
                let $options = $('#questionNo' + questionIndex + ' input');
                for (let i = 0; i < $options.length; i++) {
                    // console.log($options[i].value);
                    // console.log(correctAnswer);
                    if (($options[i].value == correctAnswer) && ($options[i].checked)){
                        score = score + 1;
                    }
                    if ($options[i].value == correctAnswer){
                        $options[i].checked = true;
                    }
                } //optiunile alese sunt comparate cu raspunsul corect si contorizatel; sunt bifate toate raspunsurile corecte
                // console.dir($options[1]);
                // console.dir(questionData);
            }
            $('#submitAnswers').off('click'); //butonul de submit este dezactivat
            $('#result').text('Correct answers: ' + score); //este afisat numarul raspunsurilor corecte
            // console.log(score);
            // console.log($list.length);
        })
    })
    // console.dir($triviaCategories.val());
});
});