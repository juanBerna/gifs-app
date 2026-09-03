import { Component, input } from '@angular/core';
import { GifListItem } from "./gif-list-item/gif-list-item";
import { GiphyR } from '../../../interfaces/giphy.interfaces';

@Component({
  selector: 'app-gif-list',
  imports: [GifListItem],
  templateUrl: './gif-list.html',
})
export class GifList {
  imageUrls = input.required<GiphyR[]>();
}
