$(document).ready(function(){
    for (let index = 0; index < 10; index++) {
        /*$("#game").append('<div class="row">');
        $("#game").append('<div class="col-1 bg-secondary empty-cell">1</div>');
        $("#game").append('<div class="col-1 bg-secondary empty-cell">2</div>');
        $("#game").append('<div class="col-1 bg-secondary empty-cell">3</div>');
        $("#game").append('<div class="col-1 bg-secondary empty-cell">4</div>');
        $("#game").append('<div class="col-1 bg-secondary empty-cell">5</div>');
        $("#game").append('<div class="col-1 bg-secondary empty-cell">6</div>');
        $("#game").append('<div class="col-1 bg-secondary empty-cell">7</div>');
        $("#game").append('<div class="col-1 bg-secondary empty-cell">8</div>');
        $("#game").append('<div class="col-1 bg-secondary empty-cell">9</div>');
        $("#game").append('<div class="col-1 bg-secondary empty-cell">0</div>');
        $("#game").append('<div class="col-1 bg-secondary empty-cell">11</div>');
        $("#game").append('<div class="col-1 bg-secondary empty-cell">12</div>');
        $("#game").append('</div>');*/
        $("#game").append(`<div class="row" id="tetris-row-`+index+`">    
            <div class="col-1 bg-white empty-cell" id="tetris-col-`+index+`-1"></div>
            <div class="col-1 bg-white empty-cell" id="tetris-col-`+index+`-2"></div>
            <div class="col-1 bg-white empty-cell" id="tetris-col-`+index+`-3"></div>
            <div class="col-1 bg-white empty-cell" id="tetris-col-`+index+`-4"></div>
            <div class="col-1 bg-white empty-cell" id="tetris-col-`+index+`-5"></div>
            <div class="col-1 bg-white empty-cell" id="tetris-col-`+index+`-6"></div>
            <div class="col-1 bg-white empty-cell" id="tetris-col-`+index+`-7"></div>
            <div class="col-1 bg-white empty-cell" id="tetris-col-`+index+`-8"></div>
            <div class="col-1 bg-white empty-cell" id="tetris-col-`+index+`-9"></div>
            <div class="col-1 bg-white empty-cell" id="tetris-col-`+index+`-10"></div>
            <div class="col-1 bg-white empty-cell" id="tetris-col-`+index+`-11"></div>
            <div class="col-1 bg-white empty-cell" id="tetris-col-`+index+`-12"></div>
            </div>`);   
    }

    $("#mix-button").on("click", function(){
        $("#tetris-col-0-3").append('<button type="button" class="btn btn-link">Link</button>')
    });
});