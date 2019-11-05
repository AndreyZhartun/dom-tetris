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
            let startColumn = 1 + Math.floor(Math.random() * 9);
            let template = Math.floor(Math.random() * 7);
            list = templates[template](startColumn);
            list.removeClass('bg-white').addClass('bg-primary');
        },
        moveDown: () => {
            //delay(1000);
            list.each((index, domEle) => {
                //$(element).removeClass('bg-primary').addClass('bg-white');
                //$(element).next().removeClass('bg-white').addClass('bg-primary');
                $(domEle).before($(domEle).next());
                //$(this).removeClass('order-1').addClass('order-2');
                /*for (let index = 1; index < 12; index++) {
                    if ($(this).hasClass('order-' + index)){
                        let divBelow = $(this).parent.find('.order-' + (index + 1));
                        $(this).removeClass('order-' + index).addClass('order-' + (index + 1));
                        divBelow.removeClass('order-' + (index + 1)).addClass('order-' + index);
                        break;
                    }
                }*/
            });            
        }
    };
    /*
        [1, 1, 0],  [0, 1, 1],  [1, 1, 0],  [1, 1, 1],  [1, 1, 1],  [1, 0, 0],  [1, 1, 1, 1],   
        [0, 1, 1]   [1, 1, 0]   [1, 1, 0]   [1, 0, 0]   [0, 1, 0]   [1, 1, 1]   [0, 0, 0, 0]
    */
}

function start(){
    /*var state = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];*/
    var fig1 = figure();
    fig1.create();
    //for (let i = 0; i < 1; i++){
        fig1.moveDown();
    //}
}