# Personal2048
私人定制版2048（移动端 + web）
2048的web+移动端实现

简介：曾经2048是比较火的，玩法比较简单，比较有趣，记得当时小伙伴们都各自比拼，看谁的数字比较大，慢慢的也找到了这个游戏的秘诀，哈哈，如今接触了web开发，就想着能不能用web技术实现这个小游戏，js控制游戏逻辑，css实现游戏效果，游戏虽小，但是实现起来也是不那么容易的，深切感受到了游戏最深层的东西-算法，最终实现了它，试玩地址
[点这里(づ￣3￣)づ╭❤～](http://www.coderw.cn/2048/) 源码：[Github](https://github.com/dalewang1995/Personal2048)

<font size=4>实现效果</font>

<img src="http://coderw.cn/images/2048.gif">




<font size=4>核心知识点</font>


`main2048.js` : 

1. 表格渲染 利用定义的 `init()` 初始化函数对表格结构进行初始化,生成一个4X4的二维数组。

2. `updateBoardView()` 函数进行小方格的渲染。

3. `generateOneNumber（）` 随机一个数字生成在小方格子的随机位置上，之后没挪动方块都会先判断该位置是否被占用，确保生成的数字有效。

```
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

```

这是实现的代码，但是有个很明显的缺陷，不过我还没有想到更好的办法，能快速找到小方格上的空位，所以采用了，先尝试50次的做法，超过了50次，就采用数组的循环找到小方格的空位，这样能提高一点点性能，节省点时间。

4. `showNumberWithAnimation()`  实现了显示小方格内数字的动画效果，所有关于数字的显示效果都会调用这个函数。

5. 建盘按压事件监听 通过 `event.keyCode` 监听上下左右的 键盘码，来操作小方格的移动方向。

6. 移动端优化，添加 触摸事件 通过判断滑动的方向和距离  大体估算出 小方格的移动方向，去除小距离滑动，减小误触，提升操作手感。

```
// 去除用户的非滑动操作
    if(Math.abs(deltax) < 0.1*documentWidth && Math.abs(deltay) < 0.1*documentWidth)
        return;
```

7. `gameover()` 函数

```
    if(nospace(board) && nomove()){
        gameover();
    }
}

```

每次挪动，或者是新生成数字，都会执行此函数，判断方格是否有空位，是否能发生移动，进而判断游戏是否结束。
    
    
    
    
    
