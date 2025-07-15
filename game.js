$(document).ready(() => {
    let game;
    let cellSize = 50;

    const startGame = () => {
        // Tüm hücreler ve cursor'ı temizle
        $(".game-table").empty();

        game = {
            row: 7,
            column: 8,
            winPinCount: 5,
            playerTurn: true,
            board: { column1: 0, column2: 0, column3: 0, column4: 0, column5: 0, column6: 0, column7: 0, column8: 0 },
            "player-1": { row: [], column: [], cross: [], crossOpposite: [] },
            "player-2": { row: [], column: [], cross: [], crossOpposite: [] }
        };

        for (let r = 1; r <= game.row; r++) {
            for (let c = 1; c <= game.column; c++) {
                $(".game-table").append(`<div class="game-cell" data-row="${r}" data-column="${c}"></div>`);
            }
        }

        $(".game-table").append('<div class="cursor"></div><div class="shadow"></div>');

        // Eventleri tekrar ata, çünkü yeni elemanlar var
        handleEvents();
    };


    const handleEvents = () => {
        $(".game-cell").on("mouseenter", function () {
            let column = $(this).data("column");
            console.log("CellSize: ", cellSize);
            let left = (cellSize / 2 - 9) + (column - 1) * (cellSize + 10);
            let top = game.row - game.board[`column${column}`] - 1;

            $(".cursor").css("left", `${left + 14}px`);

            $(".shadow").css("left", `${left}px`).css("top", `${(top * (cellSize + 10)) + 16}px`);
        });

        $(".game-cell").on("click", function () {
            let row = game.board[`column${$(this).data("column")}`];
            let cellClass = game.playerTurn ? "player-1" : "player-2";

            if (row < game.row) {

                let changedPin = $(`.game-cell[data-column=${$(this).data("column")}][data-row=${game.row - row}]`);

                // Yeni eklenen pinde doğru class'ı alarak gerekli renkte olması sağlanıyor.
                changedPin.addClass(cellClass);

                // Oyun state'ini güncelliyorum.
                game[cellClass]?.row.push(`${game.row - row}${$(this).data("column")}`);
                game[cellClass]?.column.push(`${$(this).data("column")}${game.row - row}`);
                game[cellClass]?.cross.push(($(this).data("column")) + (game.row - row));
                game[cellClass]?.crossOpposite.push(($(this).data("column")) - (game.row - row));

                // Sonraki oyuncuya geçmesini sağlıyorum
                game.playerTurn = !game.playerTurn;

                if (document.documentElement.style.getPropertyValue('--current-player') === "red") {
                    document.documentElement.style.setProperty('--current-player', 'blue');
                }
                else {
                    document.documentElement.style.setProperty('--current-player', 'red');
                }

                // Tahtada son koyulan pin ekleniyor
                game.board[`column${$(this).data("column")}`]++;

                // Oyunu oynayan kişi kazandımı bakıyorum.
                setTimeout(() => isGameFinish(cellClass), 250);

            } else {
                alert("Başka bir hücre seçin!");
            }
        });

        $(window).on("resize", function () {
            console.log($(this).width());

            if ($(this).width() <= 350) {
                document.documentElement.style.setProperty('--game-cell-size', '20px');
                cellSize = 20;
            } else if ($(this).width() <= 530) {
                document.documentElement.style.setProperty('--game-cell-size', '30px');
                cellSize = 30;
            } else {
                document.documentElement.style.setProperty('--game-cell-size', '50px');
                cellSize = 50;
            }
        });

    };

    const isGameFinish = (player) => {
        if (hasConsecutiveFive(game[player].row.map(Number)) || hasConsecutiveFive(game[player].column.map(Number)) || hasFiveOfSameNumber(game[player].cross) || hasFiveOfSameNumber(game[player].crossOpposite)) {
            alert(player + " win the game !");
            startGame();
        }
    };

    const hasConsecutiveFive = (arr) => {
        const uniqueSorted = [...new Set(arr)].sort((a, b) => a - b);

        for (let i = 0; i <= uniqueSorted.length - game.winPinCount; i++) {
            let isConsecutive = true;

            for (let j = 0; j < game.winPinCount - 1; j++) {
                if (uniqueSorted[i + j] + 1 !== uniqueSorted[i + j + 1]) {
                    isConsecutive = false;
                    break;
                }
            }

            if (isConsecutive) return true;
        }

        return false;
    }

    const hasFiveOfSameNumber = (arr) => {
        const counts = {};

        for (let num of arr) {
            counts[num] = (counts[num] || 0) + 1;
            if (counts[num] === game.winPinCount) return true;
        }

        return false;
    }

    const init = () => {
        startGame();
    };

    init();
});