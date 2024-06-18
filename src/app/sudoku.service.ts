import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { SudokuBase } from '../types';

@Injectable({
  providedIn: 'root',
})
export class SudokuService {
  constructor(private apiService: ApiService) {}

  getBase = (url: string): Observable<SudokuBase> => {
    return this.apiService.get(url);
  };
}
