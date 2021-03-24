import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICorso } from '../corso.model';

@Component({
  selector: 'jhi-corso-detail',
  templateUrl: './corso-detail.component.html',
})
export class CorsoDetailComponent implements OnInit {
  corso: ICorso | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ corso }) => {
      this.corso = corso;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
