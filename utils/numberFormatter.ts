export const numberFormatter = (digit: number) => {
  return new Intl.NumberFormat("en-US").format(digit);
};
