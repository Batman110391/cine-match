export function uniqueArray(arr1, arr2) {
  const uniqueIds = [];

  const filterUniqueResult = [...arr1, ...arr2].filter((element) => {
    const isDuplicate = uniqueIds.includes(element.id);

    if (!isDuplicate) {
      uniqueIds.push(element.id);

      return true;
    }

    return false;
  });

  return filterUniqueResult;
}
