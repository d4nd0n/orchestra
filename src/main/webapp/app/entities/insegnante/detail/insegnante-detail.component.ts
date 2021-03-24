import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IInsegnante } from '../insegnante.model';

@Component({
  selector: 'jhi-insegnante-detail',
  templateUrl: './insegnante-detail.component.html',
})
export class InsegnanteDetailComponent implements OnInit {
  insegnante: IInsegnante | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ insegnante }) => {
      this.insegnante = insegnante;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
