//Манипуляции с фигурой в виде замыканий
function figure() {
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
    //JQuery коллекция DOM элементов (div-ов), входящих в фигуру  
    let list;
    //Цвет фигуры - нужен для движений в стороны и поворотов, так как там используется перекрашивание
    let color;
    //Скорость падения в мс (задержка для setTimeout, чем меньше, тем быстрее)
    let delay = GLOBAL_VARS.gameSpeed;
    //Замыкания   
    return {
        create: () => {
            //Случайный выбор позиции
            let startColumn = 2 + Math.floor(Math.random() * (GLOBAL_VARS.COLUMNS_COUNT - 4));
            //Случайный выбор шаблона
            let chosenTemplate = Math.floor(Math.random() * templates.length);
            //Случайный выбор цвета
            color = Math.floor(Math.random() * GLOBAL_VARS.COLORS.length);
            //Создание фигуры
            list = templates[chosenTemplate](startColumn);
            //Затем красим все элементы в цвет и запоминаем, что они движутся
            list.removeClass(GLOBAL_VARS.BACKGROUND_COLOR).addClass(GLOBAL_VARS.COLORS[color]);
            list.addClass('moving');
            return list;
        },
        //Авто движение вниз
        autoMove: () => {
            let stopMoving = false;
            function step() {
                //Проверка, необходимо ли остановиться
                list.each((_, domEle) => {
                    //ЕСЛИ столкнулись с другой фигурой (Следующий div не белый && не в движении)
                    if ((!$(domEle).next().hasClass(GLOBAL_VARS.BACKGROUND_COLOR) &&
                        !$(domEle).next().hasClass('moving')) ||
                        //ИЛИ ЕСЛИ достигнули дна поля 
                        ($(domEle).next().length === 0)) {
                        stopMoving = true;
                    }
                });
                if (stopMoving) {
                    list.removeClass('moving');
                    return;
                }
                //Меняя местами соседние элементы в одной колонне, мы симулируем падение фигуры
                list.each((_, domEle) => {
                    while ($(domEle).next().hasClass('moving')) {
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
                function checkMoving() {
                    if (stopMoving) {
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
            if (side === 'left') {
                /*  Сдвиг влево: найти индекс в колонне всех элементов, сдвинуться влево на колонну 
                 *  и найти элементы с таким же индексом, запомнить их */
                list.each((_, domEle) => {
                    newFigure = newFigure.add(
                        $(domEle).parent().prev().children().eq(
                            $(domEle).parent().children().index($(domEle))
                        )
                    );
                });
            }
            else if (side === 'right') {
                /*  Сдвиг вправо: найти индекс в колонне всех элементов, сдвинуться вправо на колонну 
                 *  и найти элементы с таким же индексом, запомнить их */
                list.each((_, domEle) => {
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
            if (newFigure.length !== 4) {
                cannotMove = true;
            }
            //ЕСЛИ есть хотя бы один элемент, блокирующий сдвиг
            newFigure.each((_, domEle) => {
                //т.е. он не белый и не в движении
                if (!$(domEle).hasClass(GLOBAL_VARS.BACKGROUND_COLOR) && !$(domEle).hasClass('moving')) {
                    //ТО нельзя
                    cannotMove = true;
                }
            });
            if (cannotMove) {
                return;
            }
            //Перекрашивание цветов и замена коллекции новой
            list.removeClass(GLOBAL_VARS.COLORS[color] + ' moving').addClass(GLOBAL_VARS.BACKGROUND_COLOR);
            newFigure.removeClass(GLOBAL_VARS.BACKGROUND_COLOR).addClass(GLOBAL_VARS.COLORS[color] + ' moving');
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
            let rotationPointOffset = [Math.floor((new Set(Object.values(rows)).size) / 2),
            Math.floor((new Set(Object.values(cols)).size) / 2)];
            //Находим координаты div-а в самом центре фигуры - он будет точкой поворота
            let centerCoordinates = [leftCorner[0] + rotationPointOffset[0],
            leftCorner[1] + rotationPointOffset[1]];
            //Новая коллекция, в которой будем собирать найденные элементы
            let rotatedFigure = $([]);
            /* 
                Используем матрицу поворота для 90 градусов: надо присвоить х = -у и у = х
            */
            //Для каждого div-а фигуры, так как мы знаем их индексы, то не нужен each
            for (let i = 0; i < 4; i++) {
                let newColumn = '#tetris-column-' +
                    (centerCoordinates[1] + rows[i] - centerCoordinates[0] + 1);
                let newRow = centerCoordinates[0] - (cols[i] - centerCoordinates[1]);
                /*  Тут был интересный баг: иногда новый индекс ряда был меньше нуля и 
                *   считался со дна колонны, так что один из повернутых элементов 
                *   оказывался 12 ряду, а остальные в 1-3 рядах, и игра прекращалась*/
                if (newRow < 0) {
                    return;
                }
                //Найти повернутый div 
                let rotatedDiv = $(newColumn).children().eq(newRow);
                //Проверить, что стена не блокирует поворот (т.е div существует)
                if (rotatedDiv.length === 0) {
                    return;
                }
                //Проверить, что другие фигуры не блокируют поворот
                if ((!rotatedDiv.hasClass(GLOBAL_VARS.BACKGROUND_COLOR)) && (!rotatedDiv.hasClass('moving'))) {
                    return;
                }
                rotatedFigure = rotatedFigure.add(rotatedDiv);
            }
            //Перекрашивание и замена
            list.removeClass(GLOBAL_VARS.COLORS[color] + ' moving').addClass(GLOBAL_VARS.BACKGROUND_COLOR);
            rotatedFigure.removeClass(GLOBAL_VARS.BACKGROUND_COLOR).addClass(GLOBAL_VARS.COLORS[color] + ' moving');
            list = rotatedFigure;
        }
    };
}