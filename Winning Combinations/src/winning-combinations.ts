
type WinningCombinationsResult = [number, number[]][];


function call(lines: number[]): WinningCombinationsResult {
  let currentValue:number = -1;
  let previousValue:number = -1;
  let nextValue:number = -1;
  let finalArray = [];
  let count = 0;

  for (let index = 1; index < lines.length; index++) {
    let positionsArray = [];
    let tempArray = [];
    currentValue = lines[index];
    previousValue = lines[index-1];
    debugger;
    if (previousValue !== currentValue && previousValue !== 0) { //Verifies if it's a sequence already or a wild based sequence
      if (currentValue !== 0 || currentValue > 9 || previousValue > 9) { //Certifies that a sequence with a non-paying symbol never starts even with a wild number
        continue;
      }
    }
    nextValue = lines[index+1]
    if (nextValue === currentValue || nextValue === 0 || (currentValue === 0 && previousValue === 0)){ //Verifies if it's a sequence considering wild and normal numbers
      inserValuesInArray(previousValue, currentValue, nextValue, tempArray, positionsArray, index)
      if (index+1 < lines.length) {
        let remainingLoops = verifiesAndCompletesRestOfArray(lines, currentValue, index, count, positionsArray);
        index = remainingLoops; //Skips loop to the first value different from the previous pay line
      }
      finalArray.push(tempArray)//Inserts the temp array to the final result array
    }
  }
  return finalArray;
}

function inserValuesInArray(previousValue: number, currentValue: number, nextValue: number, tempArray, positionsArray, index){ //Appends the values to a temp array
  if (currentValue !== 0) {//Certifies that does not consider the wild number as the paying symbol
        tempArray.push(currentValue);
      }else{
        if(nextValue === previousValue || nextValue == 0){//Considers the previous symbol as responsible for the sequence, 200
          tempArray.push(previousValue);
        }else if(nextValue !== currentValue && nextValue !== previousValue){//Considers the next symbol as responsible for the sequence, 022
          tempArray.push(nextValue);
        }
      }
      positionsArray.push(index-1, index, index+1);
      tempArray.push(positionsArray); //Creates the result based on the pay line [*,[*,*,*]]
}

function verifiesAndCompletesRestOfArray(lines, currentValue, index, count, positionsArray){ //Checks if the already existing sequence keeps on going for more than 3 values
  for(count = index+2; count < lines.length; count++){//Iterates through the rest of the array verifying if the values add to the sequence
    if (lines[count] === currentValue || lines[count] === 0) {
      positionsArray.push(count);//Adds value to the temp array if is equal to currentValue or wild
    }else{
      break;
    }
  }
  return count-1;//returns the number of iterations left for the main loop
}
export const WinningCombinations = { call };

// console.log(call([11, 0, 0, 7, 4]));