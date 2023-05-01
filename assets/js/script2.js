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

const randomPage = Math.floor(Math.random() * 100) + 1;
const pexelsURL = `https://api.pexels.com/v1/search?query=landscape&orientation=landscape&per_page=1&page=${randomPage}`;


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