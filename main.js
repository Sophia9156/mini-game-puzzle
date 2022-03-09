const container = document.querySelector('.image-container');
const btnFour = document.querySelector('.four');
const btnEight = document.querySelector('.eight');
const startButton = document.querySelector('.start-button');
const gameText = document.querySelector('.game-text');
const playTime = document.querySelector('.play-time');
const cheatBtn = document.querySelector('.cheat-button');

let tileCount = 16;

let tiles = [];
let position = [];
const dragged = {
  el: null,
  class: null,
  index: null,
}
let isPlaying = false;
let timeInterval = null;
let time = 0;


// function

function resetPlay(playing) {
  isPlaying = playing;
  time = 0;
  playTime.innerText = time;
  container.innerHTML = '';
  gameText.style.display = 'none';
  clearInterval(timeInterval);
}

function setGame() {
  resetPlay(true);
  container.classList.remove('cheat');

  tiles.forEach(tile => container.appendChild(tile));
  setTimeout(() => {
    container.innerHTML = '';
    shuffle(tiles).forEach(tile => container.appendChild(tile));
    timeInterval = setInterval(() => {
      playTime.innerText = time;
      time++;
    },1000);
  }, 5000);
}

function checkStatus() {
  const currentList = [...container.children];
  const unMatchedList = currentList.filter((child, index) => Number(child.getAttribute('data-index')) !== index);
  if(unMatchedList.length === 0){
    // game finish
    gameText.style.display = 'block';
    isPlaying = false;
    clearInterval(timeInterval);
  }
}

function makePositionArray(tileNum) {
  for(let y = 0; y < tileNum; y++) {
    for(let x = 0; x < tileNum; x++) {
      position.push({
        x: x * -100,
        y: y * -100
      })
    }
  }
}

function createImageTiles(num) {
  const tempArray = [];
  position = [];
  makePositionArray(num);

  Array(tileCount).fill().forEach((v, i) => {
    const li = document.createElement('li');
    li.setAttribute('data-index', i);
    li.setAttribute('draggable', 'true');
    li.style.background = `url("https://placeimg.com/${num}00/${num}00/any")`;
    li.style.backgroundPositionX = `${position[i].x}px`;
    li.style.backgroundPositionY = `${position[i].y}px`;
    li.classList.add('list');
    li.classList.add(`list${i}`);
    li.textContent = i + 1;
    tempArray.push(li);
  });
  return tempArray;
}

function shuffle(array) {
  let index = array.length - 1;
  while(index > 0) {
    const randomIndex = Math.floor(Math.random()*(index + 1));
    [array[index], array[randomIndex]] = [array[randomIndex], array[index]];
    index--;
  }
  return array;
}


// events
window.onload = () => {
  tiles = createImageTiles(4);
}
btnFour.addEventListener('click', () => {
  tileCount = 16;
  resetPlay(false);
  container.style.width = '400px';
  container.style.height = '400px';
  container.style.gridTemplateColumns = `repeat(${4}, 1fr)`;
  tiles = createImageTiles(4);
});
btnEight.addEventListener('click', () => {
  tileCount = 64;
  resetPlay(false);
  container.style.width = '800px';
  container.style.height = '800px';
  container.style.gridTemplateColumns = `repeat(${8}, 1fr)`;
  tiles = createImageTiles(8);
});

$('..image-container').draggable({
  start: function(e){
    if(!isPlaying) return;
    const obj = e.target;
    dragged.el = obj;
    dragged.class = obj.className;
    dragged.index = [...obj.parentNode.children].indexOf(obj);
  },
  drag: function(e){
    e.preventDefault();
  },
  stop: function(e){
    if(!isPlaying) return;
    const obj = e.target;
  
    if(obj.className !== dragged.class){
      let originPlace;
      let isLast = false;
  
      if(dragged.el.nextSibling){
        originPlace = dragged.el.nextSibling
      } else {
        originPlace = dragged.el.previousSibling
        isLast = true;
      }
  
      const droppedIndex = [...obj.parentNode.children].indexOf(obj);
      dragged.index > droppedIndex ? obj.before(dragged.el) : obj.after(dragged.el);
      isLast ? originPlace.after(obj) : originPlace.before(obj);
    }
    checkStatus();
  } 
})
// container.addEventListener('dragstart', e => {
//   if(!isPlaying) return;
//   const obj = e.target;
//   dragged.el = obj;
//   dragged.class = obj.className;
//   dragged.index = [...obj.parentNode.children].indexOf(obj);
// })
// container.addEventListener('dragover', e => {
//   e.preventDefault();
// })
// container.addEventListener('drop', e => {
//   if(!isPlaying) return;
//   const obj = e.target;

//   if(obj.className !== dragged.class){
//     let originPlace;
//     let isLast = false;

//     if(dragged.el.nextSibling){
//       originPlace = dragged.el.nextSibling
//     } else {
//       originPlace = dragged.el.previousSibling
//       isLast = true;
//     }

//     const droppedIndex = [...obj.parentNode.children].indexOf(obj);
//     dragged.index > droppedIndex ? obj.before(dragged.el) : obj.after(dragged.el);
//     isLast ? originPlace.after(obj) : originPlace.before(obj);
//   }
//   checkStatus();
// });

startButton.addEventListener('click', () => {
  setGame();
});

cheatBtn.addEventListener('click', () => {
  if(container.textContent === '') {
    return;
  } else {
    container.classList.add('cheat');
  }
});