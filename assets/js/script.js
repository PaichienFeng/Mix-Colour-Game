function renderUserChoice(e, randomColors, index1, index2){
  if (e.target!==userChoiceEl){
      return
  }else if (e.target===randomColors[index1]||randomColors[index2]){
      
  }

}


while (randomColorsR1>255) {
  randomColorsR1 = r2-getRandomInt(r2);
 }
 while (randomColorsG1>255) {
  randomColorsG1 = g2-getRandomInt(g2);
 }
 while (randomColorsB1>255) {
  randomColorsB1 = b2-getRandomInt(b2); 
 }

// make sure 
 while (r>127 && getRandomInt(r2)<(r-(255-r))) {
  randomColorsR1 = r2-getRandomInt(r2);
  
 }
 while (g>127 && getRandomInt(g2)<(g-(255-g))) {
  randomColorsG1 = g2-getRandomInt(g2);
 }
 while (b>127 && getRandomInt(b2)<(b-(255-b))) {
  randomColorsB1 = b2-getRandomInt(b2); 
 }