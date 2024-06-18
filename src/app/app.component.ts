import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SudokuService } from './sudoku.service';
import { SudokuBase } from '../types';
import { FormsModule } from '@angular/forms';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  constructor(private sudokuService: SudokuService) {}

  title = 'sudoku';

  grid: number[][] = [];

  ngOnInit() {
    // this.grid = this.create2DArray(width, height);
    this.grid = [
      [0, 0, 0, 0, 0, 0, 0, 3, 0],
      [9, 0, 0, 0, 0, 0, 0, 0, 1],
      [5, 0, 0, 0, 8, 4, 0, 0, 0],
      [0, 8, 0, 0, 0, 0, 9, 0, 4],
      [2, 4, 0, 0, 0, 0, 6, 0, 0],
      [0, 0, 6, 0, 0, 0, 0, 1, 0],
      [0, 0, 5, 0, 2, 0, 0, 0, 0],
      [8, 2, 0, 0, 6, 9, 3, 0, 0],
      [6, 3, 4, 0, 0, 0, 0, 0, 0],
    ];
    // this.sudokuService.getBase(`${url}`).subscribe((sudokuBase: SudokuBase) => {
    //   this.grid = sudokuBase.newboard.grids[0].value;
    //   console.log(this.grid);
    // });
  }

  create2DArray(rows: number, cols: number): number[][] {
    let array = new Array(rows);

    for (let i = 0; i < rows; i++) {
      array[i] = new Array(cols).fill(0);
    }

    return array;
  }

  validateInput(event: Event, rowIndex: number, colIndex: number) {
    const input = event.target as HTMLInputElement;

    if (input.value.length > 1) {
      input.value = input.value.slice(1, 2);
    }
    const value = +input.value;

    this.grid[rowIndex][colIndex] = isNaN(value) ? 0 : value;

    const isValidInput = !isNaN(value) && value >= 1 && value <= 9;

    if (isValidInput) {
      input.classList.remove('error');

      const duplicateInCol = this.checkCol(rowIndex, colIndex, value);
      const duplicateInRow = this.checkRow(rowIndex, colIndex, value);
      const duplicateInSub = this.checkSub(rowIndex, colIndex, value);

      if (duplicateInCol || duplicateInRow || duplicateInSub) {
        input.classList.add('error');
      }
    } else {
      input.value = '';
      input.classList.remove('error');
    }

    console.log(this.grid);
  }

  checkCol(rowIndex: number, colIndex: number, value: number): boolean {
    for (let i = 0; i < this.grid.length; i++) {
      if (i !== rowIndex && this.grid[i][colIndex] === value) {
        return true;
      }
    }

    return false;
  }

  checkRow(rowIndex: number, colIndex: number, value: number): boolean {
    for (let i = 0; i < this.grid.length; i++) {
      if (i !== colIndex && this.grid[rowIndex][i] === value) {
        return true;
      }
    }

    return false;
  }

  checkSub(rowIndex: number, colIndex: number, value: number): boolean {
    const subgridStartRow = Math.floor(rowIndex / 3) * 3;
    const subgridStartCol = Math.floor(colIndex / 3) * 3;

    for (let i = subgridStartRow; i < subgridStartRow + 3; i++) {
      for (let j = subgridStartCol; j < subgridStartCol + 3; j++) {
        if (i === rowIndex && j === colIndex) {
          continue;
        }

        if (this.grid[i][j] === value) {
          return true;
        }
      }
    }

    return false;
  }

  trackByFn(index: number, obj: any) {
    return index;
  }

  focusedRow: number = -1;
  focusedCol: number = -1;

  onInputFocus(row: number, col: number) {
    this.focusedRow = row;

    this.focusedCol = col;
    this.highlightSameValueCells();
  }

  onInputBlur() {
    this.focusedRow = -1;
    this.focusedCol = -1;
    this.resetFontWeight();
  }

  isInSubgrid(row: number, col: number): boolean {
    const subgridStartRow = Math.floor(this.focusedRow / 3) * 3;
    const subgridStartCol = Math.floor(this.focusedCol / 3) * 3;
    return (
      row >= subgridStartRow &&
      row < subgridStartRow + 3 &&
      col >= subgridStartCol &&
      col < subgridStartCol + 3
    );
  }

  highlightSameValueCells() {
    if (this.grid[this.focusedRow][this.focusedCol] !== 0) {
      const focusedValue = this.grid[this.focusedRow][this.focusedCol];

      for (let i = 0; i < this.grid.length; i++) {
        for (let j = 0; j < this.grid[i].length; j++) {
          if (this.grid[i][j] === focusedValue) {
            const cell = document.getElementById(`cell_${i}_${j}`);
            if (cell) {
              cell.style.fontWeight = 'bold';
            }
          }
        }
      }
    }
  }

  resetFontWeight() {
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        const cell = document.getElementById(`cell_${i}_${j}`);
        if (cell) {
          cell.style.fontWeight = 'normal'; // Reset font weight to normal
        }
      }
    }
  }
}

const height: number = 9;
const width: number = 9;
const url: string = `https:sudoku-api.vercel.app/api/dosuku?query={newboard(limit:1){grids{value}}}`;
