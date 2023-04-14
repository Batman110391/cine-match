async function processArrayInBatches(arr, batchSize, processFn) {
  let dividedPromises = [];

  for (let i = 0; batchSize * i < arr.length; i++) {
    const currPromises = await Promise.all(
      arr
        .slice(batchSize * i, batchSize * (i + 1))
        .map(async (hit) => processFn(hit))
    );
    dividedPromises = dividedPromises.concat(currPromises);
  }

  return dividedPromises;
}
