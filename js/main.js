//import {Figure} from './Figure.js';

$(document).ready(() => {
    for (let index = 1; index <= 12; index++) {
        $("#game").append(`<div class="col-1 order-`+index+`" id="tetris-column-`+index+`">    
            <div class="col bg-white cell" id="tetris-col-`+index+`-1">1</div>
            <div class="col bg-white cell" id="tetris-col-`+index+`-2">2</div>
            <div class="col bg-white cell" id="tetris-col-`+index+`-3">3</div>
            <div class="col bg-white cell" id="tetris-col-`+index+`-4">4</div>
            <div class="col bg-white cell" id="tetris-col-`+index+`-5">5</div>
            <div class="col bg-white cell" id="tetris-col-`+index+`-6">6</div>
            <div class="col bg-white cell" id="tetris-col-`+index+`-7">7</div>
            <div class="col bg-white cell" id="tetris-col-`+index+`-8">8</div>
            <div class="col bg-white cell" id="tetris-col-`+index+`-9">9</div>
            <div class="col bg-white cell" id="tetris-col-`+index+`-10">10</div>
            <div class="col bg-white cell" id="tetris-col-`+index+`-11">11</div>
            <div class="col bg-white cell" id="tetris-col-`+index+`-12">12</div>
            </div>`);   
    }

    $("#start-button").on("click", () => {
        start();
    });

    /*
        keyboard controls
            rotations
        check full rows
            clear full rows
            game score
    */
});

// 7 possible tetrominoes represented as jquery collections
const templates = [
    //O
    (startColumn) => {
        let column1 = $('#tetris-column-' + startColumn)
            .children().slice(0, 2);
        let column2 = $('#tetris-column-' + (startColumn + 1))
            .children().slice(0, 2);
        return column1.add(column2);
    },
    //Z
    (startColumn) => {
        let column1 = $('#tetris-column-' + startColumn)
            .children().slice(0, 1);
        let column2 = $('#tetris-column-' + (startColumn + 1))
            .children().slice(0, 2);
        let column3 = $('#tetris-column-' + (startColumn + 2))
            .children().slice(1, 2);
        return column1.add(column2).add(column3);
    },
    //S
    (startColumn) => {
        let column1 = $('#tetris-column-' + startColumn)
            .children().slice(1, 2);
        let column2 = $('#tetris-column-' + (startColumn + 1))
            .children().slice(0, 2);
        let column3 = $('#tetris-column-' + (startColumn + 2))
            .children().slice(0, 1);
        return column1.add(column2).add(column3);
    },
    //L
    (startColumn) => {
        let column1 = $('#tetris-column-' + startColumn)
            .children().slice(0, 2);
        let column2 = $('#tetris-column-' + (startColumn + 1))
            .children().slice(0, 1);
        let column3 = $('#tetris-column-' + (startColumn + 2))
            .children().slice(0, 1);
        return column1.add(column2).add(column3);
    },
    //J
    (startColumn) => {
        let column1 = $('#tetris-column-' + startColumn)
            .children().slice(0, 2);
        let column2 = $('#tetris-column-' + (startColumn + 1))
            .children().slice(1, 2);
        let column3 = $('#tetris-column-' + (startColumn + 2))
            .children().slice(1, 2);  
        return column1.add(column2).add(column3);
    },
    //T
    (startColumn) => {
        let column1 = $('#tetris-column-' + startColumn)
            .children().slice(0, 1);
        let column2 = $('#tetris-column-' + (startColumn + 1))
            .children().slice(0, 2);
        let column3 = $('#tetris-column-' + (startColumn + 2))
            .children().slice(0, 1);
        return column1.add(column2).add(column3);
    },
    //I
    (startColumn) => {
        let column1 = $('#tetris-column-' + startColumn)
            .children().slice(0, 1);
        let column2 = $('#tetris-column-' + (startColumn + 1))
            .children().slice(0, 1);
        let column3 = $('#tetris-column-' + (startColumn + 2))
            .children().slice(0, 1);
        let column4 = $('#tetris-column-' + (startColumn + 3))
            .children().slice(0, 1);
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
var isGameover = false;

function figure(){
    //A Jquery collection of DOM divs - parts of the figure
    let list;
    //Figure color
    let color;
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
            return list;
        },
        //Move the figure 1 cell down
        autoMove: () => {
            var stopMoving = false;
            function step(){
                //Check if need to stop moving figure
                list.each((index, domEle) => {
                    //IF collided with another figure (Next div is not empty && Next div is not moving)
                    if ((!$(domEle).next().hasClass(backgroundColor)
                        && !$(domEle).next().hasClass('moving'))
                        //OR if reached the bottom of the grid 
                        || ($(domEle).next().length == 0)){
                            stopMoving = true;
                    }
                });
                if (stopMoving){
                    list.removeClass('moving');
                    //IF an element is in the first row after finishing moving the game is over
                    list.each((index, domEle) => {
                        if ($(domEle).parent().children().index($(domEle)) == 0){
                            isGameover = true;
                        }
                    });
                    //delete list;
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
            //Promise to only continue after the figure stopped moving
            return new Promise(resolve => {
                function checkMoving(){
                    if (stopMoving){
                        clearInterval(interval);
                        resolve();
                    }
                }
                //Check stopMoving every 200 secs and resolve when stopMoving is true
                var interval = setInterval(checkMoving, 200);
            });
        },
        moveLeft: () => {
            //JQuery collection of elements that is 1 step to the left
            let leftFigure = $([]);
            //Boolean to check if it's not possible to move
            let cannotMove = false;
            //Check if it is not possible to move left
            list.each((index, domEle) => {
                //Reached the edge of the grid
                if ($(domEle).parent().prev().length == 0){
                    cannotMove = true;
                }
                //IF the left neighbour element is not empty then it's not possible to move
                if ((!$(domEle).parent().prev().children().eq(
                        $(domEle).parent().children().index($(domEle)))
                            .hasClass(backgroundColor))
                    //AND the left neighbour is not part of the moving figure
                    && 
                    (!$(domEle).parent().prev().children().eq(
                        $(domEle).parent().children().index($(domEle)))
                            .hasClass('moving'))){
                                //THEN it's not possible to move
                                cannotMove = true;
                    }
            });
            if (cannotMove){
                return;
            }
            /*
                Find the new collection that is 1 step to the left by looking up indexes of each element 
                (their vertical position in the column compared to their sibling divs)
                and using them to find each element's left neighbour div
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
            //JQuery collection of elements that is 1 step to the right
            let rightFigure = $([]);
            //Boolean to check if it's not possible to move
            let cannotMove = false;
            //Check if it is not possible to move right
            list.each((index, domEle) => {
                //Reached the edge of the grid
                if ($(domEle).parent().next().length == 0){
                    cannotMove = true;
                }
                //IF right neighbour element is not empty 
                if ((!$(domEle).parent().next().children().eq(
                        $(domEle).parent().children().index($(domEle)))
                            .hasClass(backgroundColor))
                    //AND the left neighbour is not part of the moving figure
                    && 
                    (!$(domEle).parent().next().children().eq(
                        $(domEle).parent().children().index($(domEle)))
                            .hasClass('moving'))){
                                //THEN it's not possible to move
                                cannotMove = true;
                }
            });
            if (cannotMove){
                return;
            }
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
        },
        rotate: () => {
            //let cols = new Set(), rows = new Set();
            var cols = {};
            var rows = {};
            list.each((index, domEle) => {
                cols[index] = $(domEle).parent().index();
                //cols.add($(domEle).parent().index());
                rows[index] = $(domEle).parent().children().index($(domEle));
                //rows.add($(domEle).parent().children().index($(domEle)));
            });
            var size = [new Set(Object.values(rows)).size, new Set(Object.values(cols)).size];
            var leftCorner = [Math.min(...Object.values(rows)), Math.min(...Object.values(cols))];
            /*if (size[0] > size[1]){
                if (leftCorner[1] > 1){
                    size[1]++;
                    leftCorner[1]--;
                }
                if (size[0] > size[1]){
                    if ((leftCorner[1] > 0) && (leftCorner[1] < 11)){
                        size[1] += 2;
                        leftCorner[1]--;
                    }
                }
            }*/
            var rotationPointOffset = [Math.floor((new Set(Object.values(rows)).size)/2), 
                                    Math.floor((new Set(Object.values(cols)).size)/2)];
            
            var rotPointDiv = $('#tetris-column-'+(leftCorner[1] + rotationPointOffset[1]+1))
                                .children().eq(leftCorner[0] + rotationPointOffset[0]);

            var centerCoordinates = [leftCorner[0] + rotationPointOffset[0], 
                            leftCorner[1] + rotationPointOffset[1]];
            

            var newCollection = $([]);
            //поменять роус и колс? матрица поворота х = -у и у = х (90 гр против час стрелки)
            for (let i=0; i < 4; i++){
                //cols[i] = rows[i] - centerCoordinates[0];
                //rows[i] = -(cols[i] - centerCoordinates[1]);
                //не добавляет в коллекцию?
                newCollection.add($('#tetris-column-'+(centerCoordinates[1] + rows[i] - centerCoordinates[0] +1))
                .children().eq(centerCoordinates[0] - (cols[i] - centerCoordinates[1])));
            }

            //$('#tetris-column-'+leftCorner[1]).children().eq(leftCorner[0]).addClass('bg-black');
            console.log(Object.keys(cols).length + " " + Object.keys(rows).length);
        }
    };
}

function cycle(){
    let movingFigure = figure();
    movingFigure.create();
    //Keyboard controls     
    $(document).keydown(function(e) {
        switch(e.key) {
            case 'ArrowLeft': // left
            movingFigure.moveLeft();
            break;
    
            case 'ArrowUp': // up - rotate TODO
            movingFigure.rotate();
            break;
    
            case 'ArrowRight': // right
            movingFigure.moveRight();
            break;
    
            case 'ArrowDown': // down
            break;
    
            default: return; // exit this handler for other keys
        }
        e.preventDefault(); // prevent the default action (scroll / move caret)
    });
    //Promise to start a new cycle only after current one finishes
    return new Promise(resolve => {
        movingFigure.autoMove().then(
            () => {
                $(document).off("keydown");
                resolve();
            }
        );
    });
}

//Starts the game duh //singleton?
async function start(){
    //asynchronous calls so multiple figures don't appear at the same time
    while (true){
        await cycle();
        if (isGameover){
            $('.card-footer').text('Game over!');
            break;
        }
    }
}