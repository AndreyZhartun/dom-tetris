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

const colors = [
    'bg-success',
    'bg-danger',
    'bg-warning',
    'bg-info'
];
const backgroundColor = 'bg-white';

function figure(){
    //A Jquery collection of DOM divs - parts of the figure
    var list;
    var color;
    //Closures   
    return {
        create: () => {
            //The position is chosen randomly
            let startColumn = 2 + Math.floor(Math.random() * 8);
            //The template (a jquery collection) is chosen randomly
            let chosenTemplate = Math.floor(Math.random() * 7);
            //color
            color = Math.floor(Math.random() * 4);
            //The figure is created by applying a bg class to all the divs in the collection
            list = templates[chosenTemplate](startColumn);
            list.removeClass(backgroundColor).addClass(colors[color]);
            list.addClass('moving');
        },
        //Move the figure 1 cell down
        autoMove: () => {
            var stopMoving = false;
            function step(){
                //Check if need to stop moving figure
                list.each((index, domEle) => {
                    //If collided with another figure
                    if (!$(domEle).next().hasClass(backgroundColor)
                        && !$(domEle).next().hasClass('moving')){
                        stopMoving = true;
                    }
                    //If reached the bottom of the grid
                    if ($(domEle).next().length == 0){
                        stopMoving = true;
                    }
                });
                if (stopMoving){
                    list.removeClass('moving');
                    return;
                }
                //If there is a column with multiple moving elements ...
                list.each((index, domEle) => {
                    while ($(domEle).next().hasClass('moving')){
                        $(domEle).before($(domEle).next());
                    }
                    $(domEle).before($(domEle).next());
                });
                //Not setInterval because the stop condition is inside the step() function
                setTimeout(step, 1000);
            }
            setTimeout(step, 1000);
        },
        moveLeft: () => {
            var leftFigure = $([]);
            //Check if it is not possible to move left
            list.each((index, domEle) => {
                if ($(domEle).parent().prev().length == 0){
                    return;
                }
            });
            /*
                Find the new collection that is 1 step to the left by looking up indexes of each element 
                (their vertical position in the column compared to their sibling divs)
                and using them to find each element's left neighbor div
            */
            list.each((index, domEle) => {
                leftFigure = leftFigure.add(
                    $(domEle).parent().prev().children().eq(
                        $(domEle).parent().children().index($(domEle))
                    )
                );
            });
            //Replacing the old list with the new one
            list.removeClass(colors[color] + ' moving').addClass(backgroundColor);
            leftFigure.removeClass(backgroundColor).addClass(colors[color] + ' moving');
            list = leftFigure;
        },
        moveRight: () => {
            var rightFigure = $([]);
            //Check if it is not possible to move right
            list.each((index, domEle) => {
                if ($(domEle).parent().next().length == 0){
                    return;
                }
            });
            /*
                Find the new collection that is 1 step to the right by looking up indexes of each element 
                (their vertical position in the column compared to their sibling divs)
                and using them to find each element's right neighbor div
            */
            list.each((index, domEle) => {
                rightFigure = rightFigure.add(
                    $(domEle).parent().next().children().eq(
                        $(domEle).parent().children().index($(domEle))
                    )
                );
            });
            //Replacing the old list with the new one
            list.removeClass(colors[color] + ' moving').addClass(backgroundColor);
            rightFigure.removeClass(backgroundColor).addClass(colors[color] + ' moving');
            list = rightFigure;
        }
    };
}

//Starts the game duh //singleton?
function start(){
    var fig1 = figure();
    fig1.create();
    //for (let i = 0; i < 5; i++){
    fig1.autoMove();
    $(document).keydown(function(e) {
        switch(e.key) {
            case 'ArrowLeft': // left
            fig1.moveLeft();
            break;
    
            case 'ArrowUp': // up
            break;
    
            case 'ArrowRight': // right
            fig1.moveRight();
            break;
    
            case 'ArrowDown': // down
            break;
    
            default: return; // exit this handler for other keys
        }
        e.preventDefault(); // prevent the default action (scroll / move caret)
    });
    //}
}