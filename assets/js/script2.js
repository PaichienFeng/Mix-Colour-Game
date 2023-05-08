const apiKeyGoogle = 'AIzaSyCJQFU6dWV2tmO-TLWfMaMllqWrovdakNI';
const apiKeyPexels = 'eQmcoa0bs5xZRI97pNTcEXQPqckk3bqAMcYkgIHiULTWD7GeBJz1O15f';
const imgContainer = document.querySelector('.imgContainer');
const creditLineEl = document.querySelector('.creditLine');
const homeEL = document.querySelector('.home');
const highScoreEL = document.querySelector('.highScore')
const header = document.querySelector('.header');
const navBarEl = document.querySelector('.navbar');
const titleEl = document.querySelector('.title');
const subtitleEl = document.querySelector('.subtitle');
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
const loadingEl = document.querySelector('.loading');
const scoreSpan = document.querySelector('.current-score');
const roundSpan = document.querySelector('.current-round');
const finalScoreSpan = document.querySelector('#final-score');
const searchForm= document.querySelector('.searchForm')
const gameOver = document.getElementById('game-over');
const highScores = document.getElementById('high-scores');
const startBtn = document.querySelector('.startBtn');
const highScoreBtn = document.querySelector('.highScore')
const playAgainBtn = document.querySelector('#play-again-button');
const clearScoresBtn = document.querySelector('#clear-scores');
const gameOverDiv = document.getElementById('game-over');
const highScoresDiv = document.getElementById('high-scores');
const highScoresList = document.getElementById("high-scores-list");
const highScoreForm = document.getElementById("high-score-form");
const searchlabelEl = document.getElementById('label');

const randomPage = Math.floor(Math.random() * 100) + 1;

let searchInput= 'nature';
let score = 0;
let roundCounter = 1;
let pexelsLink;


function generatePhoto(){
    console.log(searchInput);
    input.value="";
    
    setScore(score);
    const randomPage = Math.floor(Math.random() * 200) + 1;
    const pexelsURL = `https://api.pexels.com/v1/search?query=${searchInput}&orientation=landscape&per_page=1&page=${randomPage}`;
    setScore(score);
    showRound(roundCounter);
    startBtn.style.display='none';
    startContainer.style.display='none';
    header.style.display='flex';
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
  
  
    createDominantColor(photoUrl, photo);})
  .catch(error => console.error(error));
    };

let targetR;
let targetG;
let targetB;
let correctColor1;
let correctColor2;
let dominantRGB;
let luminance;


function createDominantColor(photoUrl, photo){
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
            },
            {
              "type": "LABEL_DETECTION"
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
      dominantRGB= `rgb(${targetR},${targetG},${targetB})`
    
      targetColourEl.style.backgroundColor = dominantRGB;
      titleEl.style.color = dominantRGB;
      subtitleEl.style.color = dominantRGB;
      scoreSpan.style.color=dominantRGB;
      roundSpan.style.color=dominantRGB;
      searchlabelEl.style.color=dominantRGB;
      homeEL.style.color=dominantRGB;
      highScoreEL.style.color=dominantRGB;

      luminance = 0.2126 *(targetR/255) + 0.7152*(targetG/255) + 0.0722*(targetB/255);
      console.log(luminance);
      if (luminance>=0.65){
        header.style.background = 'linear-gradient(to right, rgb(61, 28, 81), rgb(70, 54, 189), rgb(164, 31, 198), rgb(118, 23, 88))';
      }else{
        header.style.background = 'linear-gradient(to right, rgb(213, 195, 224), rgb(238, 238, 199), rgb(239, 255, 186), rgb(248, 215, 252))';
      }

      const labels = data.responses[0].labelAnnotations;
      labels.sort((a, b) => b.score - a.score);
      const bestLabel = labels[0].description;


      pexelsLink = document.createElement('a');
      pexelsLink.href =photo.photographer_url;
      pexelsLink.innerHTML= bestLabel+ '<br>Photo by '+ photo.photographer + ' on Pexels';
      pexelsLink.style.position= 'absolute';
      pexelsLink.style.bottom= '30px';
      pexelsLink.style.right='10px'
      imgContainer.append(pexelsLink);

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
let prevTarget = null;
let clickCount =0;


function renderUserChoice(e){
  const gifnoUrl='https://yesno.wtf/api?force=no';
  const eTargetColor=getComputedStyle(e.target).backgroundColor;
  

  if(!e.target.classList.contains('userChoice')){
   return;
  }else if(e.target.classList.contains('userChoice')){
    e.target.style.pointerEvents='none';
    clickCount++;
  }
  
  if (prevTarget !== null){
    
    const prevTargetColor=getComputedStyle(prevTarget).backgroundColor;
    mixdColor(eTargetColor, prevTargetColor);

    // console.log(e.target.classList)
  };  
   
  
  prevTarget = e.target;
  
  if(!e.target.classList.contains('userChoice')){
    return;
  }else if(eTargetColor===correctColor1||eTargetColor===correctColor2){
    e.target.textContent='\u2713';
    yourMixEl.style.backgroundColor=eTargetColor;
    correctCount++
  
    console.log(correctCount)
  }else if(clickCount===2 && correctCount===1){
    e.target.textContent='X';
    yourMixEl.style.backgroundColor=mixdColorRGB;
    imgContainer.children[0].style.display='none';
    imgContainer.children[1].style.display='none';
    if (imgContainer.children[2]) {
      imgContainer.children[2].style.display='none';
    }
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
    
  } else if(eTargetColor!==correctColor1&&eTargetColor!==correctColor2&&clickCount===1){
    e.target.textContent='X';

    // showRound(roundCounter);
    yourMixEl.style.backgroundColor=eTargetColor;
    imgContainer.children[0].style.display='none';
    imgContainer.children[1].style.display='none';
    if (imgContainer.children[2]) {
      imgContainer.children[2].style.display='none';
    }
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

      console.log(roundCounter);
      setScore(score);
      console.log ("this is your score ", score);
      yourMixEl.style.display='none';
      targetColourEl.style.display='none';
      imgContainer.children[0].style.display='none';
      imgContainer.children[1].style.display='none';
      if (imgContainer.children[2]) {
        imgContainer.children[2].style.display='none';
      }
      
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
  nextBtn.setAttribute('class','nextBtn')
  nextBtn.textContent='Next';
  colorContainer.append(nextBtn);
  nextBtn.style.position = "absolute";


  nextBtn.addEventListener('mouseover',mouseoverColor);
  nextBtn.addEventListener('mouseout',mouseoutColor)
  nextBtn.addEventListener('click', resetGame);
}

function mouseoverColor(e){
  e.target.style.backgroundColor=dominantRGB;
}

function mouseoutColor(e){
  e.target.style.backgroundColor='rgba(226, 226, 226, 0.6)';
}


function resetGame(e) {
  while (imgContainer.firstChild) {
    imgContainer.removeChild(imgContainer.firstChild);
  };

  e.target.remove();
  targetR = '';
  targetG = '';
  targetB = '';
  luminance='';
  correctColor1 = '';
  correctColor2 = '';
  correctCount = 0;
  clickCount=0;
  roundCounter++

  for (let i = 0; i < userChoiceEl.length; i++) {
    
    userChoiceEl[i].style.pointerEvents='auto';
  }

// change number of rounds
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


let mixdColorRGB;

function mixdColor(eTargetColor, prevTargetColor){
  const numberStrings1 = prevTargetColor.slice(4, -1).split(", ");
  const numberStrings2 = eTargetColor.slice(4, -1).split(", ");
  
  const numbers1 = numberStrings1.map(Number);
  const numbers2 = numberStrings2.map(Number);
  
  const r1 = numbers1[0];
  const g1 = numbers1[1];
  const b1 = numbers1[2];

  const r2 = numbers2[0];
  const g2 = numbers2[1];
  const b2 = numbers2[2];

  const mixedR = (r1+r2)/2;
  const mixedG = (g1+g2)/2;
  const mixedB = (b1+b2)/2;

  mixdColorRGB = `rgb(${mixedR}, ${mixedG}, ${mixedB})`;
  
  console.log(mixdColorRGB, r1,g1,b1, r2,g2,b2);
}


function getRandomColor(){

    const color = `rgb(${getRandomInt(256)}, ${getRandomInt(256)}, ${getRandomInt(256)})`;
    return color;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * (max + 1));
}


function setScore(score) {
  scoreSpan.textContent = 'Score:  ' + score;
}

function setFinalScore() {

  if (score == 0) {
  finalScoreSpan.textContent = 'Your final score is ' + score + ' Aww better luck next time champ!';
  highScoreForm.style.display = 'none';
} else if (score >= 10 && score <= 30) {
  console.log('the score is between 0 and 4');
  finalScoreSpan.textContent = 'Your final score is ' + score + ' Keep practising!';
} else if (score >= 40 && score <= 60) {
  finalScoreSpan.textContent = "Your final score is " + score + " Youre good at this!";
} else if (score >= 70 && score <= 90) {
  finalScoreSpan.textContent = "Your final score is " + score + " Wow! You are talented!"
} else {
  finalScoreSpan.textContent = "Your final score is " + score + " You must feel so proud!"
}



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
  highScores = highScores.slice(0, 5);
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
  roundSpan.textContent = 'Round:  ' + roundCounter;
}

function showHighScores() {
  header.style.display='none';
  highScoresDiv.style.display = 'inline-block';
  highScoresList.style.display = 'inline-block';
  section1El.style.display = 'none';
  section2El.style.display = 'none';
}

function showGameOver(){
  
  gameOverDiv.style.display = 'inline-block';
  header.style.display='none';
  section1El.style.display = 'none';
  section2El.style.display = 'none';
}

homeEL.addEventListener('click', function(){
    location.reload();
    input.value="";
})

const input = document.getElementById('autocomplete-input');

document.addEventListener('DOMContentLoaded', function() {
  
  const options = {
    data: {
      "astronaut": null,
      "beach": null,
      "beautiful Girl": null,
      "city": null,
      "design": null,
      "elephant": null,
      "forest": null,
      "girl": null,
      "happy": null,
      "interior design": null,
      "japan": null,
      "kids": null,
      "landscape": null,
      "mountain": null,
      "nature": null,
      "northern lights": null,
      "ocean": null,
      "paris": null,
      "queen": null,
      "river": null,
      "sunset": null,
      "temple": null,
      "universe": null,
      "vegetables": null,
      "winter": null,
      "xmas": null,
      "yoga": null,
      "zoo": null
    }
  };
  M.Autocomplete.init(input, options);
});

function formsubmitHandler(e){
  e.preventDefault();
  searchInput=input.value;
  imgContainer.children[0].style.display='none';
  imgContainer.children[1].style.display='none';
  if (imgContainer.children[2]){
    imgContainer.children[2].style.display='none';
  }
  pexelsLink.remove();
  generatePhoto();
}

playAgainBtn.addEventListener('click', function(){
  location.reload();
})



searchForm.addEventListener('submit', formsubmitHandler)
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


function clearHighScores(){
	localStorage.removeItem("highScores");
	highScoresList.innerHTML = "";
}