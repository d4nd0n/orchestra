import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFoto } from '../foto.model';

@Component({
  selector: 'jhi-foto-detail',
  templateUrl: './foto-detail.component.html',
})
export class FotoDetailComponent implements OnInit {
  foto: IFoto | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ foto }) => {
      this.foto = foto;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
