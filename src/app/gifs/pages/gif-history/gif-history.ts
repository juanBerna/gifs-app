import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/internal/operators/map';
import { toSignal } from '@angular/core/rxjs-interop';
import { GifList } from "../../components/gif-list/gif-list";
import { GifsService } from '../../services/gifs.service';

@Component({
  selector: 'app-gif-history',
  imports: [GifList],
  templateUrl: './gif-history.html',
})
export default class GifHistory {
  gitsService = inject(GifsService);
  query = toSignal(
    inject(ActivatedRoute).paramMap.pipe(map(params => params.get('query') || ''))
  )

  gifsBykey = computed(() => this.gitsService.getHistoryGifs(this.query()!));
}
