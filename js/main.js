$(document).ready(() => {
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

function cycle() {
    //Создание фигуры - figure.js
    let movingFigure = figure();
    movingFigure.create();
    //Подключение управления с клавиатуры   
    $(document).keydown(function (e) {
        switch (e.key) {
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
                for (let rowIndex = GLOBAL_VARS.COLUMNS_COUNT - 1; rowIndex > 0; rowIndex--) {
                    let checkedRow = $([]);
                    columns.each((_, domEle) => {
                        //Посчитать количество НЕ белых div-ов
                        if (!$(domEle).children().eq(rowIndex).hasClass(GLOBAL_VARS.BACKGROUND_COLOR)) {
                            checkedRow = checkedRow.add($(domEle).children().eq(rowIndex));
                        }
                    });
                    //ЕСЛИ найдено 12 не белых div-ов, то такой ряд полный
                    if (checkedRow.length === GLOBAL_VARS.COLUMNS_COUNT) {
                        checkedRow.each((_, domEle) => {
                            //Убираем все цвета
                            $(domEle).removeClass(GLOBAL_VARS.COLORS.join(' ')).addClass(GLOBAL_VARS.BACKGROUND_COLOR);
                            //Сдвигаем вверх в колоннах
                            $(domEle).parent().prepend($(domEle));
                            //Компенсируем изменения в индексах из-за сдвига вверх
                            rowIndex++;
                        });
                        GLOBAL_VARS.gameScore += 1200;
                    }
                }
                //Изменение счета
                $('#score').text(`Счет: ${GLOBAL_VARS.gameScore}`);
                //Если после очистки полных рядов в самом верхнем остался хотя бы 1 элемент, то игра окончена
                let topRow = $([]);
                columns.each((_, domEle) => {
                    if (!$(domEle).children().eq(0).hasClass(GLOBAL_VARS.BACKGROUND_COLOR)) {
                        topRow = topRow.add($(domEle).children().eq(0));
                    }
                });
                if (topRow.length > 0) {
                    GLOBAL_VARS.isGameover = true;
                }
                //После каждого цикла немного ускоряем
                if (GLOBAL_VARS.gameSpeed > 250) {
                    GLOBAL_VARS.gameSpeed -= Math.floor(GLOBAL_VARS.gameSpeed * 0.03);
                }
                //Resolve промиса - цикл окончен            
                resolve();
            }
        );
    });
}

//Начинает бесконечный цикл игровых циклов
async function start() {
    //асинхронно вызываем игровые циклы, чтобы несколько фигур не появлялись одновременно
    while (true) {
        await cycle();
        if (GLOBAL_VARS.isGameover) {
            break;
        }
    }
    //После завершения игры включаем кнопку старта
    $("#gameover-alert").text(`Игра окончена! Ваш счет: ${GLOBAL_VARS.gameScore}`);
    $("#gameover-alert").show();
    $('#start-button').text('Играть еще раз?').removeClass('disabled').attr('tabindex', '0');
}

function reset() {
    GLOBAL_VARS.gameScore = 0;
    GLOBAL_VARS.gameSpeed = 1000;
    GLOBAL_VARS.isGameover = false;
    $('.cell').removeClass(GLOBAL_VARS.COLORS.join(' ')).addClass(GLOBAL_VARS.BACKGROUND_COLOR);
}