/**
 * Created by dale on 2017/4/12.
 */
/*游戏数据*/
var board = new Array();
var score = 0;
var hasConflicted = new Array();

var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

$(document).ready(function () {
    prepareForMobile();
    newgame();
});

function newgame() {
    //小格子初始化函数
    init();
    //在随机两个格子里生成数字
    generateOneNumber();
    generateOneNumber();

}
function prepareForMobile() {
    if(documentWidth > 500){
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100;
    }
    $('#ap').css('width', gridContainerWidth+'px');
    $('#ap').css('height', 0.1*gridContainerWidth+'px');
    // $('#ap').css('line-height', 0.1*gridContainerWidth+'px');

    $('#grid-containter').css('width', gridContainerWidth - 2*cellSpace);
    $('#grid-containter').css('height', gridContainerWidth - 2*cellSpace);
    $('#grid-containter').css('padding', cellSpace);
    $('#grid-containter').css('border-radius', 0.02*gridContainerWidth);

    $('.grid-cell').css('width', cellSideLength);
    $('.grid-cell').css('height', cellSideLength);
    $('.grid-cell').css('border-radius', 0.02*cellSideLength);

}

function init() {
    for(var i = 0; i < 4; i++){
        for(var j = 0; j < 4; j++){
            var gridCell = $("#grid-cell-"+i+"-"+j);
            gridCell.css('top',getPosTop(i,j));
            gridCell.css('left',getPosLeft(i,j));
        }
    }
    
    for(var i = 0; i < 4; i++){
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for(var j = 0; j < 4; j++){
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }
    
    updateBoardView();

    score = 0;
    // updateScore(score);
}

function updateBoardView() {
    $(".number-cell").remove();
    for(var i = 0; i < 4; i++){
        for(var j = 0; j < 4; j++){
            $("#grid-containter").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
            var theNumberCell = $('#number-cell-'+i+'-'+j);

            if(board[i][j] == 0){
                theNumberCell.css('width', '0px');
                theNumberCell.css('height', '0px');
                theNumberCell.css('top', getPosTop(i, j) + cellSideLength/2);
                theNumberCell.css('left', getPosLeft(i, j) + cellSideLength/2);

            }else{
                theNumberCell.css('width', cellSideLength);
                theNumberCell.css('height', cellSideLength);
                theNumberCell.css('top', getPosTop(i, j));
                theNumberCell.css('left', getPosLeft(i, j));
                theNumberCell.css('background-color', getNumberBackgroundColor( board[i][j]));
                theNumberCell.css('color', getNumberColor( board[i][j]));
                theNumberCell.text( board[i][j]);
            }

            hasConflicted[i][j] = false;
        }
    }

    $('.number-cell').css('line-height', cellSideLength+'px');
    $('.number-cell').css('font-size', 0.3*cellSideLength+'px');
}

function generateOneNumber() {
    if(nospace(board))
        return false;

    //随机一个位置
    var randx = parseInt(Math.floor(Math.random() * 4));  //x 变为整数，向下取整;
    var randy = parseInt(Math.floor(Math.random() * 4));

    var times = 0;
    while (times < 50){
        if (board[randx][randy] ==0 )
            break;
        var randx = parseInt(Math.floor(Math.random() * 4));
        var randy = parseInt(Math.floor(Math.random() * 4));
        times ++ ;
    }
    if (times == 50){
        for(var i = 0; i < 4; i++){
            for(var j = 0; j < 4; j++){
                if(board[i][j] == 0){
                    randx = i ;
                    randy = j;
                }
            }
        }
    }
    //随机一个数字
    var randNumber = Math.random() < 0.5 ? 2 : 4;

    //在随机位置显示数字
    board[randx][randy] = randNumber;

    showNumberWithAnimation(randx, randy, randNumber);

    return true;
}

$(document).keydown(function (event) {
    // 阻止浏览器的默认效果

    switch (event.keyCode){
        case 37: //left
            if(moveLeft()){
                event.preventDefault();
                generateOneNumber();
                isgameover();
            }
            break;
        case 38: //up
            if(moveUp()){
                event.preventDefault();
                generateOneNumber();
                isgameover();
            }
            break;
        case 39: //right
            if(moveRight()){
                event.preventDefault();
                generateOneNumber();
                isgameover();
            }
            break;
        case 40: //down
            if(moveDown()){
                event.preventDefault();
                generateOneNumber();
                isgameover();
            }
            break;
        default: //default
            break;
    }

});
// 触摸事件监听
document.addEventListener('touchstart', function (event) {
    startx=event.touches[0].pageX;
    starty=event.touches[0].pageY;
});

document.addEventListener('touchmove', function (event) {
    event.preventDefault();
})

document.addEventListener('touchend', function (event) {
    endx=event.changedTouches[0].pageX;
    endy=event.changedTouches[0].pageY;

    var deltax = endx - startx;
    var deltay = endy - starty;
    // 去除用户的非滑动操作
    if(Math.abs(deltax) < 0.1*documentWidth && Math.abs(deltay) < 0.1*documentWidth)
        return;
    // x
    if(Math.abs(deltax)> Math.abs(deltay)){
        if(deltax > 0){
            // move right
            if(moveRight()){
                generateOneNumber();
                isgameover();
            }
        }
        else {
            // move left
            if(moveLeft()){
                generateOneNumber();
                isgameover();
            }
        }
    }
    // y
    else{
        if(deltay > 0){
            // move down
            if(moveDown()){
                generateOneNumber();
                isgameover();
            }
        }
        else {
            // move up
            if(moveUp()){
                generateOneNumber();
                isgameover();
            }
        }
    }
});


function isgameover() {
    if(nospace(board) && nomove()){
        gameover();
    }
}

function moveLeft() {
    if(!canMoveLeft( board)){
        return false
    }

    for(var i = 0; i < 4; i++){
        for(var j = 1; j < 4; j++){
            if(board[i][j] != 0 ){
                for(var k = 0; k < j; k++){
                    if (board[i][k] == 0  && noBlockHorizontal(i, k, j, board)){
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        break;
                    }
                    else if(board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]){
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //add
                        score += board[i][k];
                        updateScore(score);

                        hasConflicted[i][k] = true;
                        break;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}

function moveRight() {
    if(!canMoveRight( board)){
        return false
    }

    for(var i = 0; i < 4; i++){
        for(var j = 2; j >= 0; j--){
            if(board[i][j] != 0 ){
                for(var k = 3; k > j; k--){
                    if (board[i][k] == 0  && noBlockHorizontal(i, j, k, board)){
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        break;
                    }
                    else if(board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]){
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //add
                        score += board[i][k];
                        updateScore(score);

                        hasConflicted[i][k] = true;
                        break;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}

function moveUp() {
    if(!canMoveUp( board)){
        return false
    }

    for(var j = 0; j < 4; j++){
        for(var i = 1; i < 4; i++){
            if(board[i][j] != 0 ){
                for(var k = 0; k < i; k++){
                    if (board[k][j] == 0  && noBlockVertical(j, k, i, board)){
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        break;

                    } else
                    if(board[k][j] == board[i][j] && noBlockVertical(j, k, i, board) && !hasConflicted[k][j]){
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] *= 2;
                        board[i][j] = 0;
                        //add
                        score += board[k][j];
                        updateScore(score);
                        hasConflicted[k][j] = true;
                        break;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}

function moveDown() {
    if(!canMoveDown( board)){
        return false
    }

    for(var j = 0; j < 4; j++){
        for(var i = 2; i >= 0; i--){
            if(board[i][j] != 0 ){
                for(var k = 3; k > i; k--){
                    if (board[k][j] == 0  && noBlockVertical(j, i, k, board)){
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        break;

                    } else
                    if(board[k][j] == board[i][j] && noBlockVertical(j, i, k, board) && !hasConflicted[k][j]){
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] *= 2;
                        board[i][j] = 0;
                        //add
                        score += board[k][j];
                        updateScore(score);

                        hasConflicted[k][j] = true;
                        break;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}