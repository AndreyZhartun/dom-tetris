$(document).ready(() => {
    //Динамическое создание игрового поля, цифры внутри элементов для отладки, их не видно в игре
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

    //Кнопка для запуска игры после очистки поля и переменных 
    $("#start-button").on("click", (e) => {
        $("#gameover-alert").hide();
        $('#start-button').text('Игра началась').addClass('disabled').attr('tabindex', '-1');
        $('#score').text('Счет: 0');
        reset();
        start();
    });

    //Вкл/выкл режим отладки
    $("#debug-button").on("click", () => {
        $(".cell").toggleClass('debug-mode');
    });
});

// 7 шаблонов фигур в виде JQuery коллекций элементов
const templates = [
    //O - квадрат
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

//Классы цветов и константы игры
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
const columnsCount = 12;
var gameSpeed = 1000;
var gameScore = 0;
var isGameover = false;

//Все, что связано с манипуляцией фигур, здевь в виде замыканий
//По сути класс, но классы в js это те же функции, так что особого смысла делать классом не видел
function figure(){
    //JQuery коллекция DOM элементов, входящих в фигуру  
    let list;
    //Цвет фигуры - нужен для движений в стороны и поворотов, так как там используется перекрашивание
    let color;
    //Скорость падения в мс (задержка для setTimeout, чем меньше, тем быстрее)
    let delay = gameSpeed;
    //Замыкания   
    return {
        create: () => {
            //Случайный выбор позиции
            let startColumn = 2 + Math.floor(Math.random() * (columnsCount - 4));
            //Случайный выбор шаблона
            let chosenTemplate = Math.floor(Math.random() * templates.length);
            //Случайный выбор цвета
            color = Math.floor(Math.random() * colors.length);
            //Создание фигуры
            list = templates[chosenTemplate](startColumn);
            //Затем красим все элементы в цвет и запоминаем, что они движутся
            list.removeClass(backgroundColor).addClass(colors[color]);
            list.addClass('moving');
            return list;
        },
        //Авто движение вниз
        autoMove: () => {
            let stopMoving = false;
            function step(){
                //Проверка, необходимо ли остановиться
                list.each((index, domEle) => {
                    //ЕСЛИ столкнулись с другой фигурой (Следующий div не белый && не в движении)
                    if ((!$(domEle).next().hasClass(backgroundColor)
                        && !$(domEle).next().hasClass('moving'))
                        //ИЛИ ЕСЛИ достигнули дна поля 
                        || ($(domEle).next().length == 0)){
                            stopMoving = true;
                    }
                });
                if (stopMoving){
                    list.removeClass('moving');
                    return;
                }
                //Меняя местами соседние элементы в одной колонне, мы симулируем падение фигуры
                list.each((index, domEle) => {
                    while ($(domEle).next().hasClass('moving')){
                        //Если в колонне несколько элементов, то каждый сначала сдвигается вниз по фигуре
                        $(domEle).before($(domEle).next());
                    }
                    $(domEle).before($(domEle).next());
                });
                //Не setInterval потому что условие прекращения внутри функции step()
                setTimeout(step, delay);
            }
            //Начало самого первого шага падения
            setTimeout(step, delay);
            //Промис - только после успешного полного падения фигуры можно продолжать
            return new Promise(resolve => {
                function checkMoving(){
                    if (stopMoving){
                        clearInterval(interval);
                        resolve();
                    }
                }
                //Регулярная проверка состояния падения и resolve
                let interval = setInterval(checkMoving, 100);
            });
        },
        //Уменьшение задержки падения для текущей фигуры
        decreaseDelay: () => {
            delay = 200;
        },
        //Сдвинуть фигуру влево или вправо на 1 шаг
        moveSide: (side) => {
            let newFigure = $([]);
            //Определение направления сдвига
            if (side == 'left'){
                /*  Сдвиг влево: найти индекс в колонне всех элементов, сдвинуться влево на колонну 
                 *  и найти элементы с таким же индексом, запомнить их */
                list.each((index, domEle) => {
                    newFigure = newFigure.add(
                        $(domEle).parent().prev().children().eq(
                            $(domEle).parent().children().index($(domEle))
                        )
                    );
                });
            }
            else if (side == 'right'){
                /*  Сдвиг вправо: найти индекс в колонне всех элементов, сдвинуться вправо на колонну 
                 *  и найти элементы с таким же индексом, запомнить их */
                list.each((index, domEle) => {
                    newFigure = newFigure.add(
                        $(domEle).parent().next().children().eq(
                            $(domEle).parent().children().index($(domEle))
                        )
                    );
                });
            }
            else {
                return;
            }
            //Проверка, можно ли сдвинуть фигуру
            let cannotMove = false;
            //ЕСЛИ мы у самого края, то нельзя
            if (newFigure.length != 4){
                cannotMove = true;
            }
            //ЕСЛИ есть хотя бы один элемент, блокирующий сдвиг
            newFigure.each((index, domEle) => {
                //т.е. он не белый и не в движении
                if (!$(domEle).hasClass(backgroundColor) && !$(domEle).hasClass('moving')){
                    //ТО нельзя
                    cannotMove = true;
                }
            });
            if (cannotMove){
                return;
            }
            //Перекрашивание цветов и замена коллекции новой
            list.removeClass(colors[color] + ' moving').addClass(backgroundColor);
            newFigure.removeClass(backgroundColor).addClass(colors[color] + ' moving');
            list = newFigure;
        },
        //Поворот фигуры на 90 градусов против ч.с.
        rotate: () => {
            let cols = {};
            let rows = {};
            //Запоминаем индексы (координаты в поле) элементов
            list.each((index, domEle) => {
                cols[index] = $(domEle).parent().index();
                rows[index] = $(domEle).parent().children().index($(domEle));
            });
            //Находим координаты левого верхнего угла
            let leftCorner = [Math.min(...Object.values(rows)), Math.min(...Object.values(cols))];
            //Чтобы попасть на центр фигуры с левого верхнего угла надо сдвинуться на половину длины
            let rotationPointOffset = [Math.floor((new Set(Object.values(rows)).size)/2), 
                                    Math.floor((new Set(Object.values(cols)).size)/2)];
            //Находим координаты div-а в самом центре фигуры - он будет точкой поворота
            let centerCoordinates = [leftCorner[0] + rotationPointOffset[0], 
                                        leftCorner[1] + rotationPointOffset[1]];
            //Новая коллекция, в которой будем собирать найденные элементы
            let rotatedFigure = $([]);
            /* 
                Используем матрицу поворота для 90 градусов: надо присвоить х = -у и у = х
            */
            //Для каждого div-а фигуры, так как мы знаем их индексы, то не нужен each
            for (let i=0; i < 4; i++){
                let newColumn = '#tetris-column-' + 
                        (centerCoordinates[1] + rows[i] - centerCoordinates[0] + 1); 
                let newRow = centerCoordinates[0] - (cols[i] - centerCoordinates[1]);
                /*  Тут был интересный баг: иногда новый индекс ряда был меньше нуля и 
                *   считался со дна колонны, так что один из повернутых элементов 
                *   оказывался 12 ряду, а остальные в 1-3 рядах, и игра прекращалась*/
                if (newRow < 0){
                    return;
                }
                //Найти повернутый div 
                let rotatedDiv = $(newColumn).children().eq(newRow);
                //Проверить, что стена не блокирует поворот (т.е div существует)
                if (rotatedDiv.length == 0){
                    return;
                }
                //Проверить, что другие фигуры не блокируют поворот
                if ((!rotatedDiv.hasClass(backgroundColor)) && (!rotatedDiv.hasClass('moving'))){
                    return;
                }
                rotatedFigure = rotatedFigure.add(rotatedDiv);
            }
            //Перекрашивание и замена
            list.removeClass(colors[color] + ' moving').addClass(backgroundColor);
            rotatedFigure.removeClass(backgroundColor).addClass(colors[color] + ' moving');
            list = rotatedFigure;
        }
    };
}

function cycle(){
    //Создание фигуры
    let movingFigure = figure();
    movingFigure.create();
    //Подключение управления с клавиатуры   
    $(document).keydown(function(e) {
        switch(e.key) {
            case 'ArrowLeft': 
            movingFigure.moveSide('left');
            break;
    
            case 'ArrowUp': // поворот
            movingFigure.rotate();
            break;
    
            case 'ArrowRight': 
            movingFigure.moveSide('right');
            break;
    
            case 'ArrowDown': // увеличить скорость падения
            movingFigure.decreaseDelay();
            break;
    
            default: return;
        }
        e.preventDefault();
    });
    //Промис - программа продолжит только после окончания цикла
    return new Promise(resolve => {
        movingFigure.autoMove().then(
            //После того, как фигура успешно упала
            () => {
                //Убрать управление с клавиатуры
                $(document).off("keydown");
                //Проверить заполненные ряды и очистить их: покрасить белым и сдвинуть в самый верх
                let columns = $('.col-1');
                //Для этого найти div-ы с одинаковым индексом во всех колоннах
                for (let rowIndex = columnsCount - 1; rowIndex > 0; rowIndex--){
                    let checkedRow= $([]);
                    columns.each((index, domEle) => {
                        //Посчитать количество НЕ белых div-ов
                        if (!$(domEle).children().eq(rowIndex).hasClass(backgroundColor)){
                            checkedRow = checkedRow.add($(domEle).children().eq(rowIndex));
                        }
                    });
                    //ЕСЛИ найдено 12 не белых div-ов, то такой ряд полный
                    if (checkedRow.length == columnsCount){
                        checkedRow.each((index, domEle) => {
                            //Убираем все цвета
                            $(domEle).removeClass(allColors).addClass(backgroundColor);
                            //Сдвигаем вверх в колоннах
                            $(domEle).parent().prepend($(domEle));
                            //Компенсируем изменения в индексах из-за сдвига вверх
                            rowIndex++;
                        });
                        gameScore += 1200;
                    }
                }
                //Изменение счета
                $('#score').text('Счет: ' + gameScore);
                //Если после очистки полных рядов в самом верхнем остался хотя бы 1 элемент, то игра окончена
                let topRow = $([]);
                columns.each((index, domEle) => {
                    if (!$(domEle).children().eq(0).hasClass(backgroundColor)){
                        topRow = topRow.add($(domEle).children().eq(0));
                    }
                });
                if (topRow.length > 0){
                    isGameover = true;
                }
                //После каждого цикла немного ускоряем
                if (gameSpeed > 250){
                    gameSpeed -= Math.floor(gameSpeed * 0.03);
                }
                //Resolve промиса - цикл окончен            
                resolve();
            }
        );
    });
}

//Начинает бесконечный цикл игровых циклов
async function start(){
    //асинхронно вызываем игровые циклы, чтобы несколько фигур не появлялись одновременно
    while (true){
        await cycle();
        if (isGameover){
            break;
        }
    }
    //После завершения игры включаем кнопку старта
    $("#gameover-alert").text("Игра окончена! Ваш счет: " + gameScore);
    $("#gameover-alert").show();
    $('#start-button').text('Играть еще раз?').removeClass('disabled').attr('tabindex', '0');
}

function reset(){
    gameScore = 0;    
    gameSpeed = 1000;
    isGameover = false;
    $('.cell').removeClass(allColors).addClass(backgroundColor);
}