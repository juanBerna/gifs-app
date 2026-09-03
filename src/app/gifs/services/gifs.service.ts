import { HttpClient } from "@angular/common/http";
import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { GiphyResponse, GiphyR } from "../../interfaces/giphy.interfaces";
import { environment } from "../../../environments/environment";
import { GifMapper } from "../mapper/gif.mapper";
import { map } from "rxjs/internal/operators/map";
import { tap } from "rxjs/internal/operators/tap";

const loadFromLocalStorage = (): Record<string, GiphyR[]> => {
  const history = localStorage.getItem('searchHistory');
  return history ? JSON.parse(history) : {};
}

@Injectable({
  providedIn: "root",
})
export class GifsService {
  private http = inject(HttpClient);
  //trendingGifs is a signal that holds an array of GiphyR objects, representing the trending GIFs fetched from the Giphy API. It is initialized as an empty array.
  trendingGifs = signal<GiphyR[]>([]);
  //trendingGifsGroup is a computed signal that derives its value from the trendingGifs signal. It groups the trending GIFs into sub-arrays, which can be useful for displaying them in a grid or paginated format. The current implementation initializes an empty array of groups, but you can implement logic to group the GIFs as needed.In this case, the groups will consist of three elements each, which is useful for displaying the GIFs in a grid format with three columns, such as [[gif, gif, gif], [], ..., []].
  trendingGifsGroup = computed<GiphyR[][]>(() => {
    const groups: GiphyR[][] = [];
    const gifs = this.trendingGifs();
    for (let i = 0; i < gifs.length; i += 3) {
      groups.push(gifs.slice(i, i + 3));
    }
    return groups;
  })

  trendingGifsPage = signal<number>(0);
  trendingGifsLoaded = signal<boolean>(false);
  //Record<string,GiphyR[]> is a type that represents an object where the keys are strings and the values are arrays of GiphyR objects. This is useful for storing search history, where each search query (string) maps to an array of GiphyR results.
  searchHistory = signal<Record<string,GiphyR[]>>(loadFromLocalStorage());
  //searchHistoryKeys is a computed signal that derives its value from the searchHistory signal. It computes an array of keys (search queries) from the searchHistory object, allowing you to easily access the list of search queries that have been made.
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));

  // The saveSearchHistory effect is a reactive effect that automatically runs whenever the searchHistory signal changes. It serializes the current state of the searchHistory object to a JSON string and saves it to the browser's localStorage under the key 'searchHistory'. This ensures that the search history is persisted across page reloads or browser sessions.
  saveSearchHistory = effect(()=> {
    const history = JSON.stringify(this.searchHistory());
    localStorage.setItem('searchHistory', history);

  });


  getHistoryGifs(query: string):GiphyR[]{
    return this.searchHistory().hasOwnProperty(query.toLowerCase()) ? this.searchHistory()[query.toLowerCase()] : [];

  }

  constructor() {
    this.loadTrendingGifs();
  }

  loadTrendingGifs() {
    if(this.trendingGifsLoaded()) return;
    this.trendingGifsLoaded.set(true);
    // Implement the logic to load trending GIFs from the Giphy API
    this.http.get<GiphyResponse>(`${environment.giphyURL}/trending`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: '20',
        offset: (this.trendingGifsPage() * 20).toString(),
      }
    }).subscribe(
      (response) => {
        const gifs = GifMapper.mapGiphyResponseToGiphyRArray(response.data);

        this.trendingGifs.update((currentGifs) => [...currentGifs, ...gifs]);
        this.trendingGifsLoaded.set(false);
        this.trendingGifsPage.update((currentPage) => currentPage + 1);
      }
    );
  }

  searchGifs(query: string) {
    // Implement the logic to search for GIFs based on the provided query
    return this.http.get<GiphyResponse>(`${environment.giphyURL}/search`, {
      params: {
        api_key: environment.giphyApiKey,
        q: query,
        limit: '20',
      }
    }).pipe(
      map((response) => GifMapper.mapGiphyResponseToGiphyRArray(response.data)),
      //
      tap((gifs) => {
        // Update the search history with the new search results, putting the query in lowercase to ensure consistency in the keys of the searchHistory object. If the query already exists, it appends the new results to the existing array; otherwise, it creates a new entry for that query.
        this.searchHistory.update((history) => ({
          ...history,// Spread the existing history to maintain previous entries
          //
          [query.toLowerCase()]: gifs,
        }));
      })
    );
  }
}
