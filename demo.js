// 存放着原来位置的数组
var arrList = [];
// 打乱数字后的数组
var arrRan = [];

// 散片图片的父级
var imgBox = document.getElementsByClassName('imgBox')[0];
// 最外层的父级
var imgWrap = document.getElementsByClassName('wrapper')[0];
// 取出按钮
var btnStart = document.getElementsByClassName('start')[0];
// 图片碎片
var imgCell;
// 散装图片父级的宽高（border+padding+width）
var allW = imgBox.offsetWidth;
var allH = imgBox.offsetHeight;
// 行和列数
var row = col = 3;
// 根据行和列计算出每一个碎片的宽高
var cellW = allW / col;
var cellH = allH / row;

var allW = imgBox.offsetWidth;
var allH = imgBox.offsetHeight;

function init() {
    imgSplit();
    bindEvent();
};
init();

function imgSplit() {
  var cell
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      //每创建一个图片碎片存一个数字
      arrList.push(i * row + j);
      arrRan.push(i * row + j);

      cell = document.createElement('div')
      cell.classList.add('imgCell')
      cell.style.width = cellW + 'px'
      cell.style.height = cellH + 'px'
      cell.style.top = i * cellH + 'px'
      cell.style.left = j * cellW + 'px'
      cell.style.backgroundPosition = (-j) * cellW + 'px ' + (-i) * cellH + 'px';
      imgBox.appendChild(cell)
    }
  }
  imgCell = document.getElementsByClassName('imgCell');
}

// 用来判断当前状态、
var flag = true;
function bindEvent(){
  btnStart.onclick = function(){
    if(flag){
      btnStart.innerHTML = 'Restore';
      randomArr()
      // 根据乱序数组排列碎片 
      orderCell(arrRan,row);
      // 点击碎片进行移动
      // 绑定事件  注意闭包
      for(let i = 0;i<imgCell.length;i++){
        imgCell[i].ontouchstart=function(e1){
          var index1 = i;
          var left = this.offsetLeft;
          var top = this.offsetTop;
          document.ontouchmove=(e2)=>{
            // 实现拖拽
            console.log(e2.targetTouches)
            var x = e2.targetTouches[0].clientX - e1.targetTouches[0].clientX + left;
            var y = e2.targetTouches[0].clientY - e1.targetTouches[0].clientY + top;
            console.log(x,y)
            this.style.left = x + 'px';
            this.style.top = y + 'px';
            this.style.zIndex = '99';
            // 取消拖拽时的动画
            this.style.transition = 'none';
          }
          document.ontouchend=(e3)=>{
            // 鼠标抬起  移除移动事件
            document.ontouchmove = null;
            // 根据鼠标停留位置决定方块动作
            var left = e3.changedTouches[0].clientX - imgBox.offsetLeft - imgWrap.offsetLeft;
            var top = e3.changedTouches[0].clientY - imgBox.offsetTop - imgWrap.offsetTop;
            var index2 = changeIndex(left, top, index1);
            if (index1 == index2) {
                // 回到原来位置
                cellReturn(index1);
            } else {
                // 交换索引
                cellChange(index1, index2);
            }
          }
        }
      }
    }else{
      btnStart.innerHTML = 'Start';
      // 根据正序数组排列碎片 
      orderCell(arrList,row);
    }
    flag = !flag;
  }
}

// 打乱数组顺序 并且给存放打乱顺序的数组赋值
function randomArr() {
  // 利用math.random与sort将数组顺序打乱
  arrRan.sort(function (a, b) {
      return Math.random() - 0.5;
  });
}
//排列碎片
function orderCell(arr,rowold) {
  console.log(arrRan)
    var len = arr.length;
    for (var i = 0; i < len; i++) {
        // 计算left,top的值
        var row = Math.floor(arr[i] / rowold);
        var col = arr[i] % rowold;
        console.log(row,col)
        getPosition(row,col,i);
    }
};
//设置位置
function getPosition(row,col,i){
  imgCell[i].style.top = row * cellH + 'px';
  imgCell[i].style.left = col * cellW + 'px';
  imgCell[i].style.transition = 'all 0.3s ease-in-out';
  imgCell[i].style.zIndex = '10';
}
function changeIndex(x, y, index) {
  if (x < 0 || x > allW || y < 0 || y > allH) return index;
  var row = Math.floor(y / cellH);
  var col = Math.floor(x / cellW);
  // l是拖拽后图片所在九宫格相应索引
  var l = row * 3 + col;
  var index2;
  arrRan.filter(function (item, i) {
      if (l == item) {
          index2 = i;
      }
  });
  console.log(arrRan,l,index2)
  return index2;
};
// 回到原来位置
function cellReturn(i) {
  var row = Math.floor(arrRan[i] / 3);
  var col = arrRan[i] % 3;

  getPosition(row,col,i);

};
// 判断游戏是否结束  判断两个数组是否完全一致
function check() {
  if (arrList.toString() == arrRan.toString()) {
      alert('You are right');
      flag = true;
      btnStart.innerHTML = 'Start';
      reset();
  }
}
// 取消事件
function reset() {
  for (let i = 0; i < imgCell.length; i++) {
      imgCell[i].onmousedown = function () {
          document.onmousemove = function () {
              return false;
          };
          return false;
      }
  }
  document.onmouseup = function () {
      return false;
  };
}
// 交换两个碎片的位置显示
function cellChange(from, to) {
  var rowF = Math.floor(arrRan[from] / 3),
      colF = arrRan[from] % 3,
      rowTo = Math.floor(arrRan[to] / 3),
      colTo = arrRan[to] % 3,
      temp = arrRan[from];

  // 根据行和列切换位置
  getPosition(rowTo,colTo,from);

  getPosition(rowF,colF,to);

  arrRan[from] = arrRan[to];
  arrRan[to] = temp;

  setTimeout(function () {
      check()
  }, 300);
}