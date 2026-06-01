export const squareGridExtent = 7;
export const squareGridStep = 48;

export const squareGridCoordinates = Array.from(
  {length: squareGridExtent * 2 + 1},
  (_, index) => index - squareGridExtent,
);
