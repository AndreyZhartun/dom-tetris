//import {Figure} from './Figure.js';

$(document).ready(() => {
    //Building the grid dynamically
    for (let index = 1; index <= 12; index++) {
        $("#game").append(`<div class="col-1 order-`+index+`" id="tetris-column-`+index+`">    
            <div class="col bg-white cell">1</div>
            <div class="col bg-white cell">2</div>
            <div class="col bg-white cell">3</div>
            <div class="col bg-white cell">4</div>
            <div class="col bg-white cell">5</div>
            <div class="col bg-white cell">6</div>
            <div class="col bg-white cell">7</div>
            <div class="col bg-white cell">8</div>
            <div class="col bg-white cell">9</div>
            <div class="col bg-white cell">10</div>
            <div class="col bg-white cell">11</div>
            <div class="col bg-white cell">12</div>
            </div>`);   
    }

    $("#start-button").on("click", (e) => {
        $("#gameover-alert").hide();
        $('#start-button').addClass('disabled').attr('tabindex', '-1');
        $('#score').text('Game score: 0');
        reset();
        start();
    });

    /*$('input[type="text"]').keyup(function() {
        if($(this).val() != '') {
           $(':input[type="submit"]').prop('disabled', false);
        }
     });*/

    $("#debug-button").on("click", () => {
        $(".cell").toggleClass('debug-mode');
    });

    /*
        left text
        reset and button
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
    'bg-secondary',
    'bg-dark',
    'bg-success',
    'bg-danger',
    'bg-warning',
    'bg-info'
];
var allColors = '';
colors.forEach((value, index, array) => {
    allColors += ' ' + value;
});
const backgroundColor = 'bg-white';
var gameSpeed = 1000;
var gameScore = 0;
var isGameover = false;

function figure(){
    //A Jquery collection of DOM divs - parts of the figure
    let list;
    //Figure color
    let color;
    //Fall speed in ms (delay between steps, the less the faster the fall is)
    let delay = gameSpeed;
    //Closures   
    return {
        create: () => {
            //The position is chosen randomly
            let startColumn = 2 + Math.floor(Math.random() * 8);
            //The template (a jquery collection) is chosen randomly
            let chosenTemplate = Math.floor(Math.random() * templates.length);
            //color
            color = Math.floor(Math.random() * colors.length);
            //The figure is created by applying a bg class to all the divs in the collection
            list = templates[chosenTemplate](startColumn);
            list.removeClass(backgroundColor).addClass(colors[color]);
            list.addClass('moving');
            return list;
        },
        //Move the figure 1 cell down
        autoMove: () => {
            let stopMoving = false;
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
                setTimeout(step, delay);
            }
            setTimeout(step, delay);
            //Promise to only continue after the figure stopped moving
            return new Promise(resolve => {
                function checkMoving(){
                    if (stopMoving){
                        clearInterval(interval);
                        resolve();
                    }
                }
                //Check stopMoving every 200 secs and resolve when stopMoving is true
                let interval = setInterval(checkMoving, 200);
            });
        },
        decreaseDelay: () => {
            delay = 200;
        },
        //Move the figure 1 step left
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
        //Rotate the figure 90 degrees c clockwise
        rotate: () => {
            let cols = {};
            let rows = {};
            //Finding indexes (the coordinates with respect to grid) of each element
            list.each((index, domEle) => {
                cols[index] = $(domEle).parent().index();
                rows[index] = $(domEle).parent().children().index($(domEle));
            });
            //Finding the coordinates of the top left corner
            let leftCorner = [Math.min(...Object.values(rows)), Math.min(...Object.values(cols))];
            //Finding the coordinates of the center div with respect to the left corner
            let rotationPointOffset = [Math.floor((new Set(Object.values(rows)).size)/2), 
                                    Math.floor((new Set(Object.values(cols)).size)/2)];
            //Finding the coordinates of the central div - it will be the pivot point
            let centerCoordinates = [leftCorner[0] + rotationPointOffset[0], 
                                        leftCorner[1] + rotationPointOffset[1]];
            //New collection of rotated elements
            let rotatedFigure = $([]);
            //баг: 1х4 фигура на 2 строке повернется с одним дивом на 12-й строке и прекратит игру
            /* 
                Using the rotation matrix for 90 degrees counter clockwise
                we need to assign х = -у and у = х
            */
            //Not each because we already have dicts
            for (let i=0; i < 4; i++){
                //Find the rotated div
                let rotatedDiv = 
                    $('#tetris-column-'+(centerCoordinates[1] + rows[i] - centerCoordinates[0] + 1))
                        .children().eq(centerCoordinates[0] - (cols[i] - centerCoordinates[1]));
                //Check if the grid wall does not block rotation (if the div exists)
                if (rotatedDiv.length == 0){
                    return;
                }
                //Check if board state does not block rotation (no divs of other figures in the way)
                if ((!rotatedDiv.hasClass(backgroundColor)) && (!rotatedDiv.hasClass('moving'))){
                    return;
                }
                rotatedFigure = rotatedFigure.add(rotatedDiv);
            }
            //Replacing the old list with the new one
            list.removeClass(colors[color] + ' moving').addClass(backgroundColor);
            rotatedFigure.removeClass(backgroundColor).addClass(colors[color] + ' moving');
            list = rotatedFigure;
        }
    };
}

function cycle(){
    //Initialize to use closure functions and create the figure
    let movingFigure = figure();
    movingFigure.create();
    //Keyboard controls     
    $(document).keydown(function(e) {
        switch(e.key) {
            case 'ArrowLeft': // left
            movingFigure.moveLeft();
            break;
    
            case 'ArrowUp': // rotate 90 degrees clockwise
            movingFigure.rotate();
            break;
    
            case 'ArrowRight': // right
            movingFigure.moveRight();
            break;
    
            case 'ArrowDown': // increase falling speed
            movingFigure.decreaseDelay();
            break;
    
            default: return; // exit this handler for other keys
        }
        e.preventDefault(); // prevent the default action (scroll / move caret)
    });
    //Promise to start a new cycle only after current one finishes
    return new Promise(resolve => {
        movingFigure.autoMove().then(
            () => {
                //Remove keyboard controls
                $(document).off("keydown");
                //Check full rows and clear them by making the divs first children and removing bg-color
                let columns = $('.col-1');
                //Find divs with equal vertical positions in each column
                for (let rowIndex = 11; rowIndex > 0; rowIndex--){
                    let checkedRow= $([]);
                    columns.each((index, domEle) => {
                        //Count the divs with non-white background
                        if (!$(domEle).children().eq(rowIndex).hasClass(backgroundColor)){
                            checkedRow = checkedRow.add($(domEle).children().eq(rowIndex));
                        }
                    });
                    //IF we found 12 divs with non-white backgrounds the row is full
                    if (checkedRow.length == 12){
                        checkedRow.each((index, domEle) => {
                            gameScore += 100;
                            //The divs can be any color so we remove all color classes
                            $(domEle).removeClass(allColors).addClass(backgroundColor);
                            //Move the divs up in their respective columns
                            $(domEle).parent().prepend($(domEle));
                            //Conpensate the shift in rows since all other indexes increased by one 
                            rowIndex++;
                        });
                    }
                }
                //Changing the visible score
                $('#score').text('Game score: ' + gameScore);
                //IF an element with non-white background is in the first row after clearing rows the game is over
                let topRow = $([]);
                columns.each((index, domEle) => {
                    if (!$(domEle).children().eq(0).hasClass(backgroundColor)){
                        topRow = topRow.add($(domEle).children().eq(0));
                    }
                });
                if (topRow.length > 0){
                    isGameover = true;
                }
                //Speeding the game up a little
                if (gameSpeed > 250){
                    gameSpeed -= Math.floor(gameSpeed * 0.04);
                }
                //Resolve that the cycle is finished                
                resolve();
            }
        );
    });
}

//Starts the endless loop of cycles
async function start(){
    //asynchronous calls so multiple figures don't appear at the same time
    while (true){
        await cycle();
        if (isGameover){
            break;
        }
    }
    $("#gameover-alert").text("The game is over! Your score: " + gameScore);
    $("#gameover-alert").show();
    $('#start-button').removeClass('disabled').attr('tabindex', '0');
}

function reset(){
    
    gameScore = 0;    
    gameSpeed = 1000;
    isGameover = false;
    $('.cell').removeClass(allColors).addClass(backgroundColor);
}