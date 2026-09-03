import { GiphyItem, GiphyR } from '../../interfaces/giphy.interfaces';

export class GifMapper {
  static mapGiphyResponseToGiphyR(item: GiphyItem): GiphyR {
    return {
      id: item.id,
      title: item.title,
      url: item.images.original.url,
    };
  }

  static mapGiphyResponseToGiphyRArray(items: GiphyItem[]): GiphyR[] {
    return items.map(item => this.mapGiphyResponseToGiphyR(item));
  }
}
