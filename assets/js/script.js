 const apiKeyGoogle = 'AIzaSyCJQFU6dWV2tmO-TLWfMaMllqWrovdakNI';
 const apiKeyPexels = 'eQmcoa0bs5xZRI97pNTcEXQPqckk3bqAMcYkgIHiULTWD7GeBJz1O15f';
 const imageEL = document.querySelector('.image');
 const creditLineEl = document.querySelector('.creditLine');
 const yourMixEl = document.querySelector('.yourMix');
 const targetColourEl = document.querySelector('.target');
 const userChoiceEl = document.querySelector('.userChoice');
 const startBtn = document.querySelector('.startBtn');
 const section1El = document.querySelector('.section1');
 const section2El = document.querySelector('.section2');

 import { createClient } from 'pexels';

 const client = createClient(apiKeyPexels);
 
 function playGame(){
   startBtn.style.display='none';
   section1El.style.display='block';
   section2El.style.display='block';
 
   client.photos.curated({ per_page: 1, orientation: 'landscape' })
     .then(function(data){
       console.log(data);
     })
     .catch(function (error) {
       alert('Unable to connect to Pexels');
     });
 }



startBtn.addEventListener('click', playGame)