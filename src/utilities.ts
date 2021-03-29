export const getRandom = function(arr: unknown[]): number {
  return Math.floor(Math.random() * arr.length);
};
