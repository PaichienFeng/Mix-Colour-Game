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
const startBtn = document.querySelector('.startBtn');
const startContainer = document.querySelector('.startContainer');
const section1El = document.querySelector('.section1');
const section2El = document.querySelector('.section2');
const colorContainer = document.querySelector('.colorContainer');
const greatMix =document.querySelector('.greatMix');
const photoImg = document.querySelector('.photoImg');
const yesno = document.querySelector('.yesno');


function generatePhoto(){
  const randomPage = Math.floor(Math.random() * 100) + 1;
  const pexelsURL = `https://api.pexels.com/v1/search?query=landscape&orientation=landscape&per_page=1&page=${randomPage}`;
  
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
    pexelsLink.style.right='440px'
    imgContainer.append(pexelsLink);
  
    createDominantColor(photoUrl);})
  .catch(error => console.error(error));
}

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
      const r = rgb.red;
      const g = rgb.green;
      const b = rgb.blue;
      const dominantRGB= `rgb(${r},${g},${b})`
    
      targetColourEl.style.backgroundColor = dominantRGB;

      generateRandomChoice(r,g,b);
}).catch(error => console.error(error));
};


function generateRandomChoice(r,g,b){
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
 
 const r2 = r*2;
 const g2 = g*2;
 const b2 = b*2;


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
 const correctColor1 = randomColors[index1];
 const correctColor2 = randomColors[index2];

 for (let i = 0; i < 4; i++) {
  userChoiceEl[i].style.backgroundColor = randomColors[i];
 }

 renderUserChoice(correctColor1, correctColor2, r, g, b);

 console.log(correctColor1, correctColor2, r,g,b);
};


function renderUserChoice(correctColor1, correctColor2, r, g, b){
  let selectedCount= 0;
  const gifnoUrl='https://yesno.wtf/api?force=no';

  userChoiceContainer.addEventListener('click', function(e){

    const eTargetColor=getComputedStyle(e.target).backgroundColor;

    if(!e.target.classList.contains('userChoice')){
        return;
    }else if(eTargetColor===correctColor1||eTargetColor===correctColor2){
        e.target.textContent='\u2713';
        yourMixEl.style.backgroundColor=eTargetColor;
        selectedCount++
        console.log(selectedCount)
    }else if(eTargetColor!==correctColor1||eTargetColor!==correctColor2){
        e.target.textContent='X';
        yourMixEl.style.backgroundColor=eTargetColor;
        imgContainer.children[0].style.display='none';
        imgContainer.children[1].style.display='none';
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
      if(selectedCount===2){
        yourMixEl.style.display='none';
        targetColourEl.style.display='none';
        imgContainer.children[0].style.display='none';
        imgContainer.children[1].style.display='none';
        greatMix.style.display='flex';
        greatMix.style.justifyContent = 'center';
        greatMix.style.alignItems = 'center';
        greatMix.style.backgroundColor = `rgb(${r}, ${g}, ${b})`
   
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
       }
  
  })
}


function createNextBtn(){
  const nextBtn= document.createElement('button');
  nextBtn.textContent='Next';
  colorContainer.append(nextBtn);
  nextBtn.style.position = "absolute";

  nextBtn.addEventListener('click', function (){resetGame(nextBtn)});
}

function resetGame(nextBtn) {
  while (imgContainer.firstChild) {
    imgContainer.removeChild(imgContainer.firstChild);
  };

  targetColourEl.style.display= 'block';
  targetColourEl.style.backgroundColor = '';
  greatMix.style.display='none';
  yourMixEl.style.display='block';
  yourMixEl.style.backgroundColor = 'rgb(255, 123, 123)';

  for (let i = 0; i < userChoiceEl.length; i++) {
    userChoiceEl[i].style.backgroundColor = '';
    userChoiceEl[i].textContent = '';
  }

  userChoiceContainer.removeEventListener('click', renderUserChoice);
  
  
  nextBtn.remove();
  

  generatePhoto();
}

function getRandomColor(){

    const color = `rgb(${getRandomInt(256)}, ${getRandomInt(256)}, ${getRandomInt(256)})`;
    return color;
}


function getRandomInt(max) {
    return Math.floor(Math.random() * (max + 1));
}




homeEL.addEventListener('click', function(){
    location.reload();
})


startBtn.addEventListener('click', generatePhoto)
