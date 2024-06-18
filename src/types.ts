export interface SudokuBase {
  newboard: {
    grids: Array<{
      value: number[][];
    }>;
  };
}
