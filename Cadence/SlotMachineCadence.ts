type AnticipatorConfig = {
  columnSize: number;
  minToAnticipate: number;
  maxToAnticipate: number;
  anticipateCadence: number;
  defaultCadence: number;
};

type SlotCoordinate = {
  column: number;
  row: number;
};

type SpecialSymbol = { specialSymbols: Array<SlotCoordinate> };

type RoundsSymbols = {
  roundOne: SpecialSymbol;
  roundTwo: SpecialSymbol;
  roundThree: SpecialSymbol;
};

type SlotCadence = Array<number>;

type RoundsCadences = {
  roundOne: SlotCadence;
  roundTwo: SlotCadence;
  roundThree: SlotCadence;
};

/**
 * Anticipator configuration. Has all information needed to check anticipator.
 * @param columnSize It's the number of columns the slot machine has.
 * @param minToAnticipate It's the minimum number of symbols to start anticipation.
 * @param maxToAnticipate It's the maximum number of symbols to end anticipation.
 * @param anticipateCadence It's the cadence value when has anticipation.
 * @param defaultCadence It's the cadence value when don't has anticipation.
 */
const anticipatorConfig: AnticipatorConfig = {
  columnSize: 5,
  minToAnticipate: 2,
  maxToAnticipate: 3,
  anticipateCadence: 2,
  defaultCadence: 0.25,
};

/**
 * Game rounds with special symbols position that must be used to generate the SlotCadences.
 */
const gameRounds: RoundsSymbols = {
  roundOne: {
    specialSymbols: [
      { column: 0, row: 2 },
      { column: 1, row: 3 },
      { column: 3, row: 4 },
    ],
  },
  roundTwo: {
    specialSymbols: [
      { column: 0, row: 2 },
      { column: 0, row: 3 },
    ],
  },
  roundThree: {
    specialSymbols: [
      { column: 4, row: 2 },
      { column: 4, row: 3 },
    ],
  },
};

/**
 * This must be used to get all game rounds cadences.
 */
const slotMachineCadences: RoundsCadences = { roundOne: [], roundTwo: [], roundThree: [] };

/**
 * This function receives an array of coordinates relative to positions in the slot machine's matrix.
 * This array is the positions of the special symbols.
 * And it has to return a slot machine stop cadence.
 * @param symbols Array<SlotCoordinate> positions of the special symbols. Example: [{ column: 0, row: 2 }, { column: 2, row: 3 }]
 * @returns SlotCadence Array of numbers representing the slot machine stop cadence.
 */
function slotCadence(symbols: Array<SlotCoordinate>): SlotCadence {
  let columnSymbols: number[] = [];
  let symbolOccurrencies = 0;
  let cadences: number[] = [];
  let sumvalue = anticipatorConfig.defaultCadence;

  symbols.forEach(function (value) { //Adds each symbol position to array
    columnSymbols.push(value.column);
  });

  for (let i = 0; i < anticipatorConfig.columnSize; i++) {
    if (symbolOccurrencies >= anticipatorConfig.minToAnticipate && symbolOccurrencies < anticipatorConfig.maxToAnticipate) //Defines wich value will be added to the cadence
      sumvalue = anticipatorConfig.anticipateCadence;
    else
      sumvalue = anticipatorConfig.defaultCadence;

    if (i === 0) cadences.push(0) //Does not sum if it's the first iteration, insted just adds 0 to the array
    else cadences.push(cadences[i - 1] + sumvalue);
    
    if (columnSymbols.includes(i)) {
      let sameValueOccurrencies = verifyOccurrencies(columnSymbols, i);
      symbolOccurrencies += sameValueOccurrencies;
    }
  }
  return cadences;
}

function verifyOccurrencies(columnSymbols: number[], i:number){ //Checks if there's more than one instance of the same value than adds it to the ocurrencies
  let sameValueOccurrencies = 0;
  columnSymbols.forEach(function (value) {
    if (i === value) {
      sameValueOccurrencies++;
    }
  });
  return sameValueOccurrencies;
}

/**
 * Get all game rounds and return the final cadences of each.
 * @param rounds RoundsSymbols with contains all rounds special symbols positions.
 * @return RoundsCadences has all cadences for each game round.
 */
function handleCadences(rounds: RoundsSymbols): RoundsCadences {
  slotMachineCadences.roundOne = slotCadence(rounds.roundOne.specialSymbols);
  slotMachineCadences.roundTwo = slotCadence(rounds.roundTwo.specialSymbols);
  slotMachineCadences.roundThree = slotCadence(rounds.roundThree.specialSymbols);

  return slotMachineCadences;
}

console.log('CADENCES: ', handleCadences(gameRounds));
