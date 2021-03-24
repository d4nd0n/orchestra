import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IConcerto } from '../concerto.model';

@Component({
  selector: 'jhi-concerto-detail',
  templateUrl: './concerto-detail.component.html',
})
export class ConcertoDetailComponent implements OnInit {
  concerto: IConcerto | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ concerto }) => {
      this.concerto = concerto;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
