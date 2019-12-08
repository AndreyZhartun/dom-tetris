$(document).ready(() => {
    for (let index = 1; index <= 12; index++) {
        $("#game").append(`<div class="col-1 order-`+index+`" id="tetris-column-`+index+`">    
            <div class="col bg-white empty-cell" id="tetris-col-`+index+`-1">1</div>
            <div class="col bg-white empty-cell" id="tetris-col-`+index+`-2">2</div>
            <div class="col bg-white empty-cell" id="tetris-col-`+index+`-3">3</div>
            <div class="col bg-white empty-cell" id="tetris-col-`+index+`-4">4</div>
            <div class="col bg-white empty-cell" id="tetris-col-`+index+`-5">5</div>
            <div class="col bg-white empty-cell" id="tetris-col-`+index+`-6">6</div>
            <div class="col bg-white empty-cell" id="tetris-col-`+index+`-7">7</div>
            <div class="col bg-white empty-cell" id="tetris-col-`+index+`-8">8</div>
            <div class="col bg-white empty-cell" id="tetris-col-`+index+`-9">9</div>
            <div class="col bg-white empty-cell" id="tetris-col-`+index+`-10">10</div>
            <div class="col bg-white empty-cell" id="tetris-col-`+index+`-11">11</div>
            <div class="col bg-white empty-cell" id="tetris-col-`+index+`-12">12</div>
            </div>`);   
    }

    $("#start-button").on("click", () => {
        start();
    });

    /*
        create new figure
        move it down recursively
            check if theres enough space
            change row order
        check full rows
            clear full rows
    */
});

// 7 possible tetrominoes represented as jquery collections
const templates = [
    //square
    (startColumn) => {
        let column1 = $('#tetris-column-' + startColumn)
            .children().slice(0, 2);
            //.find('.order-1, .order-2');
        let column2 = $('#tetris-column-' + (startColumn + 1))
            //.find('.order-1, .order-2');
            .children().slice(0, 2);
        return column1.add(column2);
    },
    //Z
    (startColumn) => {
        let column1 = $('#tetris-column-' + startColumn)
            .children().slice(0, 1);
            //.find('.order-1');
        let column2 = $('#tetris-column-' + (startColumn + 1))
            .children().slice(0, 2);
            //.find('.order-1, .order-2');
        let column3 = $('#tetris-column-' + (startColumn + 2))
            .children().slice(1, 2);
            //.find('.order-2');
        return column1.add(column2).add(column3);
    },
    //S
    (startColumn) => {
        let column1 = $('#tetris-column-' + startColumn)
            .children().slice(1, 2);
            //.find('.order-2');
        let column2 = $('#tetris-column-' + (startColumn + 1))
            .children().slice(0, 2);
            //.find('.order-1, .order-2');
        let column3 = $('#tetris-column-' + (startColumn + 2))
            .children().slice(0, 1);
            //.find('.order-1');
        return column1.add(column2).add(column3);
    },
    //L
    (startColumn) => {
        let column1 = $('#tetris-column-' + startColumn)
            .children().slice(0, 2);
            //.find('.order-1, .order-2');
        let column2 = $('#tetris-column-' + (startColumn + 1))
            .children().slice(0, 1);
            //.find('.order-1');
        let column3 = $('#tetris-column-' + (startColumn + 2))
            .children().slice(0, 1);
            //.find('.order-1');
        return column1.add(column2).add(column3);
    },
    //J
    (startColumn) => {
        let column1 = $('#tetris-column-' + startColumn)
            .children().slice(0, 2);
            //.find('.order-1, .order-2');
        let column2 = $('#tetris-column-' + (startColumn + 1))
            .children().slice(1, 2);
            //.find('.order-2');
        let column3 = $('#tetris-column-' + (startColumn + 2))
            .children().slice(1, 2);  
            //.find('.order-2');
        return column1.add(column2).add(column3);
    },
    //T
    (startColumn) => {
        let column1 = $('#tetris-column-' + startColumn)
            .children().slice(0, 1);
            //.find('.order-1');
        let column2 = $('#tetris-column-' + (startColumn + 1))
            .children().slice(0, 2);
            //.find('.order-1, .order-2');
        let column3 = $('#tetris-column-' + (startColumn + 2))
            .children().slice(0, 1);
            //.find('.order-1');
        return column1.add(column2).add(column3);
    },
    //I
    (startColumn) => {
        let column1 = $('#tetris-column-' + startColumn)
            .children().slice(0, 1);
            //.find('.order-1');
        let column2 = $('#tetris-column-' + (startColumn + 1))
            .children().slice(0, 1);
            //.find('.order-1');
        let column3 = $('#tetris-column-' + (startColumn + 2))
            .children().slice(0, 1);
            //.find('.order-1');
        let column4 = $('#tetris-column-' + (startColumn + 3))
            .children().slice(0, 1);
            //.find('.order-1');
        return column1.add(column2).add(column3).add(column4);
    }
];

function figure(){
    var list;
    return {
        create: () => {
            //The position is chosen randomly
            let startColumn = 1 + Math.floor(Math.random() * 9);
            //The template (a jquery collection) is chosen randomly
            let template = Math.floor(Math.random() * 7);
            //Elements of the collection are colored
            list = templates[template](startColumn);
            list.removeClass('bg-white').addClass('bg-primary');
            list.addClass('moving');
        },
        moveDown: () => {
            //If there is a column with multiple moving elements we need to move top ones after the bottom
            let topElements = $([]);
            list.each((index, domEle) => {
                if ($(domEle).next().hasClass('moving')){
                    topElements.add($(domEle));
                }
                else {
                    $(domEle).before($(domEle).next());
                }
                topElements.each(() => {
                    $(domEle).before($(domEle).next());
                });
            });            
        }
    };
}

//Starts the game duh //singleton?
function start(){
    var fig1 = figure();
    fig1.create();
    //for (let i = 0; i < 5; i++){
    function move(){
        fig1.moveDown();
        setTimeout(move, 1000);
    }
    move();
    //}
}