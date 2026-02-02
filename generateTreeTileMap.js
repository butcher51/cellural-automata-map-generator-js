import { MAP_SIZE } from "./constants.js";

export function generateTreeTileMap(valueMap) {

  const tileMap = [];

  let value;
  for (let y = 0; y < MAP_SIZE; y++) {
    tileMap[y] = [];
    const start = (y % 2 === 0) ? 0 : 1;
    for (let x = start; x < MAP_SIZE; x+=2) {   

      const sum = sumNeighborValues(valueMap, x, y);
       
     
      if (x < MAP_SIZE) {
        tileMap[y][x] = sum;
      }

    }
  }


  return tileMap;
}




function sumNeighborValues(valueMap, x, y) {
  let sum = 0,value = 0;

  // top-left
  if (y > 0 && x > 0) {
    value = valueMap[y - 1][x - 1].value;
    if (value !== 1) {
      sum++;
    }        
  } else {
    sum++;
  }

  // top-right
  if (y > 0 && x < MAP_SIZE - 1) {
    value = valueMap[y - 1][x].value;
    if (value !== 1) {
      sum++;
    }
  } else {
    sum++;
  }

  // bottom-left
  if (x > 0) {
    value = valueMap[y][x - 1].value;
    if (value !== 1) {
      sum++;
    }
  } else {
    sum++;
  }

  // bottom-right
  if (x < MAP_SIZE - 1) {
    value = valueMap[y][x].value;
    if (value !== 1) {
      sum++;
    }
  } else {
    sum++;
  }

  return sum;

}