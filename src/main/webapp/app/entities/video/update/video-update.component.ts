import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IVideo, Video } from '../video.model';
import { VideoService } from '../service/video.service';
import { IConcerto } from 'app/entities/concerto/concerto.model';
import { ConcertoService } from 'app/entities/concerto/service/concerto.service';

@Component({
  selector: 'jhi-video-update',
  templateUrl: './video-update.component.html',
})
export class VideoUpdateComponent implements OnInit {
  isSaving = false;

  concertosSharedCollection: IConcerto[] = [];

  editForm = this.fb.group({
    id: [],
    concerto: [],
  });

  constructor(
    protected videoService: VideoService,
    protected concertoService: ConcertoService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ video }) => {
      this.updateForm(video);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const video = this.createFromForm();
    if (video.id !== undefined) {
      this.subscribeToSaveResponse(this.videoService.update(video));
    } else {
      this.subscribeToSaveResponse(this.videoService.create(video));
    }
  }

  trackConcertoById(index: number, item: IConcerto): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVideo>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(video: IVideo): void {
    this.editForm.patchValue({
      id: video.id,
      concerto: video.concerto,
    });

    this.concertosSharedCollection = this.concertoService.addConcertoToCollectionIfMissing(this.concertosSharedCollection, video.concerto);
  }

  protected loadRelationshipsOptions(): void {
    this.concertoService
      .query()
      .pipe(map((res: HttpResponse<IConcerto[]>) => res.body ?? []))
      .pipe(
        map((concertos: IConcerto[]) =>
          this.concertoService.addConcertoToCollectionIfMissing(concertos, this.editForm.get('concerto')!.value)
        )
      )
      .subscribe((concertos: IConcerto[]) => (this.concertosSharedCollection = concertos));
  }

  protected createFromForm(): IVideo {
    return {
      ...new Video(),
      id: this.editForm.get(['id'])!.value,
      concerto: this.editForm.get(['concerto'])!.value,
    };
  }
}
