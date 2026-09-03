import { Component, inject, signal } from '@angular/core';
import { GifList } from "../../components/gif-list/gif-list";
import { GifsService } from '../../services/gifs.service';
import { GiphyR } from '../../../interfaces/giphy.interfaces';

@Component({
  selector: 'app-search-page',
  imports: [GifList],
  templateUrl: './search-page.html',
})
export default class SearchPage {

  gifService = inject(GifsService);
  searchDataGifs = signal<GiphyR[]>([]);

  OnSearch(query: string) {
    // Implement the logic to handle the search query and update the GIF list accordingly
    this.gifService.searchGifs(query).subscribe(
      (response) => {
        this.searchDataGifs.set(response);
      }
    );
    console.log('Search query:', this.searchDataGifs());
  }

}
