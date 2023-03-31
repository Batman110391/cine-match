function mapNumberToNewScale(number) {
  return ((number - 0) / (10 - 0)) * (5 - 0) + 0;
}

export function roundToHalf(number) {
  const mappedNumber = mapNumberToNewScale(number);
  return Math.round(mappedNumber * 2) / 2;
}
