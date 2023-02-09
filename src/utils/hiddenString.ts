/**
 * @param str
 * @param frontLen
 * @param centerLen
 * @param end
 */

const hiddenString = (
  str: string,
  frontLen: number,
  centerLen: number = 0,
  endLen: number
): string => {
  let replace = "";
  const strLen = str.length;
  const hiddenLen = centerLen || strLen - frontLen - endLen;

  for (let i = 0; i < hiddenLen; i++) {
    replace += "*";
  }
  return str.substring(0, frontLen) + replace + str.substring(strLen - endLen);
};
export default hiddenString;
