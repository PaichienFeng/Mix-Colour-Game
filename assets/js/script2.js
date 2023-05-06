const apiKeyGoogle = 'AIzaSyCJQFU6dWV2tmO-TLWfMaMllqWrovdakNI';
const apiKeyPexels = 'eQmcoa0bs5xZRI97pNTcEXQPqckk3bqAMcYkgIHiULTWD7GeBJz1O15f';
const imgContainer = document.querySelector('.imgContainer');
const creditLineEl = document.querySelector('.creditLine');
const homeEL = document.querySelector('.home');
const highScoreEL = document.querySelector('.highScore')
const yourMixEl = document.querySelector('.yourMix');
const targetColourEl = document.querySelector('.target');
const userChoiceEl = document.querySelectorAll('.userChoice');
const userChoiceContainer = document.querySelector('.userChoiceContainer')
const startContainer = document.querySelector('.startContainer');
const section1El = document.querySelector('.section1');
const section2El = document.querySelector('.section2');
const colorContainer = document.querySelector('.colorContainer');
const greatMix =document.querySelector('.greatMix');
const photoImg = document.querySelector('.photoImg');
const yesno = document.querySelector('.yesno');

const startBtn = document.querySelector('.startBtn');
const highScoreBtn = document.querySelector('.highScore')
const playAgainBtn = document.querySelector('#play-again-button');
const clearScoresBtn = document.querySelector('#clear-scores');

const scoreSpan = document.querySelector('.current-score');
const roundSpan = document.querySelector('.current-round');
const finalScoreSpan = document.querySelector('#final-score');

const gameOverDiv = document.getElementById('game-over');
const highScoresDiv = document.getElementById('high-scores');
const highScoresList = document.getElementById("high-scores-list");
const highScoreForm = document.getElementById("high-score-form");

const randomPage = Math.floor(Math.random() * 100) + 1;

let score = 0;
let roundCounter = 1;



function generatePhoto(){
    setScore(score);
    const randomPage = Math.floor(Math.random() * 100) + 1;
    const pexelsURL = `https://api.pexels.com/v1/search?query=landscape&orientation=landscape&per_page=1&page=${randomPage}`;
    setScore(score);
    showRound(roundCounter);
    startBtn.style.display='none';
    startContainer.style.display='none';
    section1El.style.display='block';
    section2El.style.display='block';
    homeEL.style.display='inline-block';
    highScoreEL.style.display='inline-block';

    fetch(pexelsURL, {
      headers: {
        Authorization: apiKeyPexels
      }
    })
    .then(response => response.json())
    .then(data => {
      const photo = data.photos[0];
      const photoUrl = photo.src.large;
    
    const imageEL = document.createElement('img');
    imageEL.setAttribute('src', photoUrl);
    imageEL.classList.add('photoImg');
    imgContainer.append(imageEL);
  
    const pexelsLink = document.createElement('a');
    pexelsLink.href ="https://www.pexels.com";
    pexelsLink.textContent= 'Photo by '+ photo.photographer + ' on Pexels';
    pexelsLink.style.position= 'absolute';
    pexelsLink.style.bottom= '10px';
    pexelsLink.style.right='10px'
    imgContainer.append(pexelsLink);
  
    createDominantColor(photoUrl);})
  .catch(error => console.error(error));

  
}

let targetR;
let targetG;
let targetB;
let correctColor1;
let correctColor2;


function createDominantColor(photoUrl){
    const googleVisionAPIUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKeyGoogle}`;
    const requestData = {
      "requests": [
        {
          "image": {
            "source": {
              "imageUri": photoUrl
            }
          },
          "features": [
            {
              "type": "IMAGE_PROPERTIES"
            }
          ]
        }
      ]
    };
    fetch(googleVisionAPIUrl, {
      method: 'POST',
      body: JSON.stringify(requestData),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      const colors = data.responses[0].imagePropertiesAnnotation.dominantColors.colors;
      const rgb = colors[0].color;
      targetR = rgb.red;
      targetG = rgb.green;
      targetB = rgb.blue;
      const dominantRGB= `rgb(${targetR},${targetG},${targetB})`
    
      targetColourEl.style.backgroundColor = dominantRGB;

      generateRandomChoice(targetR, targetG, targetB);
}).catch(error => console.error(error));
};



function generateRandomChoice(){
  let randomColors = [
    getRandomColor(),
    getRandomColor(),
    getRandomColor(),
    getRandomColor(),
  ];

 const index1= Math.floor(Math.random()*4);
 let index2 = Math.floor(Math.random()*4);

 while (index1===index2) {
    index2 = Math.floor(Math.random()*4);    
 }
 
 const r2 = targetR*2;
 const g2 = targetG*2;
 const b2 = targetB*2;


 let randomColorsR1 = r2-getRandomInt(r2);
 let randomColorsG1 = g2-getRandomInt(g2);
 let randomColorsB1 = b2-getRandomInt(b2);


 let randomColorsR2 = r2-randomColorsR1;
 let randomColorsG2 = g2-randomColorsG1;
 let randomColorsB2 = b2-randomColorsB1;

 //make sure randomColors rgb values are less then 255 
 while (randomColorsR1>255 || randomColorsR2>255){
  randomColorsR1 = r2-getRandomInt(r2);
  randomColorsR2 = r2-randomColorsR1;
 }

 while (randomColorsG1>255 || randomColorsG2>255){
  randomColorsG1 = g2-getRandomInt(g2);
  randomColorsG2 = g2-randomColorsG1;
 }

 while (randomColorsB1>255 || randomColorsB2>255){
  randomColorsB1 = b2-getRandomInt(b2);
  randomColorsB2 = b2-randomColorsB1;
 }

 randomColors[index1] = `rgb(${randomColorsR1}, ${randomColorsG1}, ${randomColorsB1})`;
 randomColors[index2] = `rgb(${randomColorsR2}, ${randomColorsG2}, ${randomColorsB2})`;
 correctColor1 = randomColors[index1];
 correctColor2 = randomColors[index2];

 for (let i = 0; i < 4; i++) {
  userChoiceEl[i].style.backgroundColor = randomColors[i];
 }

 console.log(correctColor1, correctColor2, targetR,targetG,targetB);

 return;
};



let correctCount= 0;


function renderUserChoice(e){
  const gifnoUrl='https://yesno.wtf/api?force=no';
  const eTargetColor=getComputedStyle(e.target).backgroundColor;
 
  
  if(!e.target.classList.contains('userChoice')){
      return;
    }else if(eTargetColor===correctColor1||eTargetColor===correctColor2){
      e.target.textContent='\u2713';
      yourMixEl.style.backgroundColor=eTargetColor;
      correctCount++
    
      console.log(correctCount)
    }else if(eTargetColor!==correctColor1||eTargetColor!==correctColor2){
      e.target.textContent='X';
      
      showRound(roundCounter);
      yourMixEl.style.backgroundColor=eTargetColor;
      imgContainer.children[0].style.display='none';
      imgContainer.children[1].style.display='none';
      userChoiceContainer.removeEventListener('click', renderUserChoice);
      fetch(gifnoUrl)
      .then(function(response){return response.json()})
      .then(function(data) {
          const img = document.createElement('img');
          img.setAttribute('class', 'yesno');
          img.src = data.image;
          imgContainer.append(img);
        })
      .catch(error => console.error(error));
  
      return createNextBtn();
    };
    
   
 const gifyesUrl='https://yesno.wtf/api?force=yes';
    if(correctCount===2){

      score = score + 10;
      showRound(roundCounter);
      console.log(roundCounter);
      setScore(score);
      console.log ("this is your score ", score);
      yourMixEl.style.display='none';
      targetColourEl.style.display='none';
      imgContainer.children[0].style.display='none';
      imgContainer.children[1].style.display='none';
      greatMix.style.display='flex';
      greatMix.style.justifyContent = 'center';
      greatMix.style.alignItems = 'center';
      greatMix.style.backgroundColor = `rgb(${targetR}, ${targetG}, ${targetB})`
      userChoiceContainer.removeEventListener('click', renderUserChoice);
  
      fetch(gifyesUrl)
      .then(function(response){return response.json()})
      .then(function(data) {
          const img = document.createElement('img');
          img.setAttribute('class', 'yesno');
          img.src = data.image;
          imgContainer.append(img);
        })
      .catch(error => console.error(error));

      return createNextBtn();
     };

  

}


function createNextBtn(){
  const nextBtn= document.createElement('button');
  nextBtn.textContent='Next';
  colorContainer.append(nextBtn);
  nextBtn.style.position = "absolute";

  nextBtn.addEventListener('click', resetGame);
}


function resetGame(e) {
  while (imgContainer.firstChild) {
    imgContainer.removeChild(imgContainer.firstChild);
  };

  e.target.remove();
  targetR = '';
  targetG = '';
  targetB = '';
  correctColor1 = '';
  correctColor2 = '';
  correctCount = 0;
  roundCounter++;


  if (roundCounter===11){
    showGameOver();
    setFinalScore(score);
    return
    }
  
  console.log(roundCounter);
  targetColourEl.style.display= 'flex';
  targetColourEl.style.backgroundColor = '';
  greatMix.style.display='none';
  yourMixEl.style.display='flex';
  yourMixEl.style.backgroundColor = 'rgb(255, 123, 123)';

  for (let i = 0; i < userChoiceEl.length; i++) {
    userChoiceEl[i].style.backgroundColor = '';
    userChoiceEl[i].textContent = '';
  }

  userChoiceContainer.addEventListener('click', renderUserChoice);
  
  generatePhoto();
}


function getRandomColor(){

    const color = `rgb(${getRandomInt(256)}, ${getRandomInt(256)}, ${getRandomInt(256)})`;
    return color;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * (max + 1));
}


function setScore(score) {
  scoreSpan.textContent = 'Your score is: ' + score;
}

function setFinalScore() {
  finalScoreSpan.textContent = 'Your final score is ' + score + ' Youre so good!';
}

function showHighScore() {
  highScoresDiv.style.display = "inline-block";
}

// highscore
highScoreForm.addEventListener("submit", function(event) {
  event.preventDefault();

  gameOverDiv.style.display = "none";

  showHighScore();
  
  

  const initialsInput = document.getElementById("initials");
  
  const initials = initialsInput.value.toUpperCase();
  if (initials.length < 2 || initials.length > 3) {
  alert("Please enter 2 or 3 characters for your initials.");
  return;
  }
  const highScore = { initials: initials, score: score };
  addHighScore(highScore);
  initialsInput.value = "";
  });


function addHighScore(highScore) {
  let highScores = getHighScores();
  highScores.push(highScore);
  highScores.sort(function(a, b) {
  console.log(highScores);
  return b.score - a.score;
  });
  highScores = highScores.slice(0, 3);
  localStorage.setItem("highScores", JSON.stringify(highScores));
  printHighScores(highScores);
  }
  
function getHighScores() {
  let highScores = localStorage.getItem("highScores");
  if (highScores) {
  return JSON.parse(highScores);
  } else {
  return [];
  }
  }



function printHighScores(highScores) {
  highScoresList.innerHTML = "";
  for (let i = 0; i < highScores.length; i++) {
    const li = document.createElement("li");
    const initialsSpan = document.createElement("span");
    initialsSpan.classList.add("initials");
    initialsSpan.textContent = highScores[i].initials + " - ";
    const scoreSpan = document.createElement("span");
    scoreSpan.classList.add("score");
    scoreSpan.textContent = highScores[i].score;
    li.appendChild(initialsSpan); 
    li.appendChild(scoreSpan);
    highScoresList.appendChild(li);
  }
}

function showRound(roundCounter) {
  roundSpan.textContent = 'Round: ' + roundCounter;
}

function showHighScores() {

  highScoresDiv.style.display = 'inline-block';
  highScoresList.style.display = 'inline-block';
  section1El.style.display = 'none';
  section2El.style.display = 'none';
}

function showGameOver(){
  
  gameOverDiv.style.display = 'inline-block';
  section1El.style.display = 'none';
  section2El.style.display = 'none';
}

homeEL.addEventListener('click', function(){
    location.reload();
})

playAgainBtn.addEventListener('click', function(){
  location.reload();
})


userChoiceContainer.addEventListener('click', renderUserChoice);
startBtn.addEventListener('click', generatePhoto);
clearScoresBtn.addEventListener("click", clearHighScores);

highScoreBtn.addEventListener('click', function() {

  showHighScores();

  playAgainBtn.style.display = 'none';
  const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  
  highScoresList.innerHTML = '';

  highScores.forEach(function(highScore) {
    const li = document.createElement('li');
    li.textContent = highScore.initials + " - " + highScore.score;
    highScoresList.appendChild(li);
  });

  highScoresDiv.style.display = 'block';
  gameOverDiv.style.display = 'none';
});



function clearHighScores() {
	localStorage.removeItem("highScores");
	highScoresList.innerHTML = "";
}