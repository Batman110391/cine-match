export function uniqueArray(arr1 = [], arr2 = [], fieldCompare = "id") {
  const uniqueIds = [];

  const filterUniqueResult = [...arr1, ...arr2].filter((element) => {
    const isDuplicate = uniqueIds.includes(element?.[fieldCompare]);

    if (!isDuplicate) {
      uniqueIds.push(element?.[fieldCompare]);

      return true;
    }

    return false;
  });

  return filterUniqueResult;
}
