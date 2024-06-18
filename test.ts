import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SudokuService } from './sudoku.service';
import { SudokuBase } from '../types';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  constructor() {}

  title = 'sudoku';

  grid: number[][] = [];

  ngOnInit() {
    this.grid = this.create2DArray(width, height);
  }

  create2DArray(rows: number, cols: number): number[][] {
    let array = new Array(rows);

    for (let i = 0; i < rows; i++) {
      array[i] = new Array(cols).fill(false);
    }

    return array;
  }

  validateInput(event: Event, rowIndex: number, colIndex: number) {
    const input = event.target as HTMLInputElement;
    const value = +input.value;
    this.grid[rowIndex][colIndex] = value;
  }
}

const height: number = 9;
const width: number = 9;
const url: string = `https://sudoku-api.vercel.app/api/dosuku?query={newboard(limit:1){grids{value}}}`;
