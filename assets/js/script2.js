const apiKeyGoogle = 'AIzaSyCJQFU6dWV2tmO-TLWfMaMllqWrovdakNI';
const apiKeyPexels = 'eQmcoa0bs5xZRI97pNTcEXQPqckk3bqAMcYkgIHiULTWD7GeBJz1O15f';
const imgContainer = document.querySelector('.imgContainer');
const creditLineEl = document.querySelector('.creditLine');
const yourMixEl = document.querySelector('.yourMix');
const targetColourEl = document.querySelector('.target');
const userChoiceEl = document.querySelectorAll('.userChoice');
const userChoiceContainer = document.querySelector('.userChoiceContainer')
const startBtn = document.querySelector('.startBtn');
const section1El = document.querySelector('.section1');
const section2El = document.querySelector('.section2');

const randomPage = Math.floor(Math.random() * 100) + 1;
const pexelsURL = `https://api.pexels.com/v1/search?query=landscape&orientation=landscape&per_page=1&page=${randomPage}`;


function generatePhoto(){
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

   const randomColorsR1 = r2-getRandomInt(r2);
   const randomColorsG1 = g2-getRandomInt(g2);
   const randomColorsB1 = b2-getRandomInt(b2);

   const randomColorsR2 = r2-randomColorsR1;
   const randomColorsG2 = g2-randomColorsG1;
   const randomColorsB2 = b2-randomColorsB1;

   randomColors[index1] = `rgb(${randomColorsR1},${randomColorsG1},${randomColorsB1})`;
   randomColors[index2] = `rgb(${randomColorsR2},${randomColorsG2},${randomColorsB2})`;

   for (let i = 0; i < 4; i++) {
    userChoiceEl[i].style.backgroundColor = randomColors[i];
   }

   userChoiceContainer.addEventListener('click', renderUserChoice(e, ))

   console.log(randomColors[index1], randomColors[index2], r,g,b);

}

function renderUserChoice(e){
    if (e.target!==userChoiceEl){
        return
    }else if (e.target===)

}

function getRandomColor(){

    const color = `rgb(${getRandomInt(256)}, ${getRandomInt(256)}, ${getRandomInt(256)})`;
    return color;
}


function getRandomInt(max) {
    return Math.floor(Math.random() * (max + 1));
}





startBtn.addEventListener('click', generatePhoto)
