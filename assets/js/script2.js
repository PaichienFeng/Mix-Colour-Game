const apiKeyGoogle = 'AIzaSyCJQFU6dWV2tmO-TLWfMaMllqWrovdakNI';
const apiKeyPexels = 'eQmcoa0bs5xZRI97pNTcEXQPqckk3bqAMcYkgIHiULTWD7GeBJz1O15f';
const imgContainer = document.querySelector('.imgContainer');
const creditLineEl = document.querySelector('.creditLine');
const yourMixEl = document.querySelector('.yourMix');
const targetColourEl = document.querySelector('.target');
const userChoiceEl = document.querySelector('.userChoice');
const startBtn = document.querySelector('.startBtn');
const section1El = document.querySelector('.section1');
const section2El = document.querySelector('.section2');

//my global
const highScoresListEl = document.getElementById('high-score-list');

const randomPage = Math.floor(Math.random() * 100) + 1;
const pexelsURL = `https://api.pexels.com/v1/search?query=landscape&orientation=landscape&per_page=1&page=${randomPage}`;

let score = 0;



function playGame(){
    
    startBtn.style.display='none';
    section1El.style.display='block';
    section2El.style.display='block';

    

    
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
      imgContainer.append(imageEL);

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
        const r = rgb.red;
        const g = rgb.green;
        const b = rgb.blue;
        const dominantRGB= `rgb(${r},${g},${b})`

        targetColourEl.style.backgroundColor = dominantRGB;

    })
    .catch(error => console.error(error));
})
.catch(error => console.error(error));

// me

//need a target event to make the score++ and a for loop
//creating score related functions which will apply later on in the code

let scoreEl = document.getElementById('current-score')

function setScore(score) {
  scoreEl.textContent = `Score: ${score}`;
}

highScoreForm.addEventListener("submit", function(event) {
  event.preventDefault();


  showHighScores();
  

  const initialsInput = document.getElementById("initials");
  
  //sets initials to uppercase
  const initials = initialsInput.value.toUpperCase();
  //will only proceed if the rule is followed
  if (initials.length < 2 || initials.length > 3) {
  //alerts the user how to advance
  alert("Please enter 2 or 3 characters for your initials.");
  //checks if criteria is correct
  return;
  }
  const highScore = { initials: initials, score: score };
  addHighScore(highScore);
  //sets value to blank
  initialsInput.value = "";
});

function addHighScore(highScore) {
let highScores = getHighScores();
//allow highest highScores to display
highScores.push(highScore);
highScores.sort(function(a, b) {
return b.score - a.score;
});
//allows only 3 highScores to display
highScores = highScores.slice(0, 3);
localStorage.setItem("highScores", JSON.stringify(highScores));
showHighScores(highScores);
}
//getting high scores value from local storage
function getHighScores() {
let highScores = localStorage.getItem("highScores");
if (highScores) {
return JSON.parse(highScores);
} else {
return [];
}
}

function showHighScores(highScores) {
  highScoresListEl.innerHTML = "";
  for (let i = 0; i < highScores.length; i++) {
    const li = document.createElement("li");
  //creating span element to textContent both initials and highScore
    const initialsSpan = document.createElement("span");
    initialsSpan.classList.add("initials");
    initialsSpan.textContent = highScores[i].initials;
    const scoreSpan = document.createElement("span");
    scoreSpan.classList.add("score");
    scoreSpan.textContent = highScores[i].score;
    li.appendChild(initialsSpan); 
    li.appendChild(scoreSpan);
    highScoresList.appendChild(li);
  }
}

//

let colors = [
    getRandomColor(),
    getRandomColor(),
    getRandomColor(),
    getRandomColor(),
  ];

  
  for (let i = 0; i < userChoiceEl.length; i++) {
  userChoiceEl[i].style.backgroundColor = colors[i];
 }

 
 const index1= Math.floor(Math.random()*4);
 let index2 = math.floor(Math.random()*4);

 while (index1===index2) {
    index2 = math.floor(Math.random()*4);    
 }

 colors[index1] = `rgb(${r}*2-${getRandomInt(256)})`
 console.log(colors[index1]);



}

function getRandomInt(max) {
    return Math.floor(Math.random() * (max + 1));
}





startBtn.addEventListener('click', playGame)

