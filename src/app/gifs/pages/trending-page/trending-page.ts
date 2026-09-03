import { AfterViewInit, Component, ElementRef, inject, viewChild } from '@angular/core';
import { GifsService } from '../../services/gifs.service';
import { ScrollStateService } from '../../../shared/services/scroll-state.service';


@Component({
  selector: 'app-trending-page',
  templateUrl: './trending-page.html',
})
export default class TrendingPage implements AfterViewInit {

  gitsService = inject(GifsService);
  scrollStateService = inject(ScrollStateService);

  //viewChild is a decorator that allows you to get a reference to a DOM element or a child component in your Angular component class. In this case, it is used to get a reference to the div element with the id 'groupDiv', which is the container for the trending GIFs. The static: true option means that the reference will be available in the ngOnInit lifecycle hook, allowing you to interact with the DOM element as soon as the component is initialized.
  scrollDivRef = viewChild<ElementRef>('groupDiv');

  onScroll(event: Event) {
    const scrollDiv = this.scrollDivRef()?.nativeElement;
    if(!scrollDiv) return;
    const scrollTop = scrollDiv.scrollTop;
    //scrollHeight is a property that returns the total height of an element's content, including content not visible on the screen due to overflow. In this case, it is used to determine the total height of the div containing the trending GIFs. This information can be useful for implementing features like infinite scrolling or lazy loading of GIFs as the user scrolls through the list.
    const scrollHeight = scrollDiv.scrollHeight;
    //clientHeight is a property that returns the inner height of an element in pixels, including padding but not the horizontal scrollbar height, border, or margin. In this case, it is used to determine the visible height of the div containing the trending GIFs. This information can be useful for implementing features like infinite scrolling or lazy loading of GIFs as the user scrolls through the list.
    const clientHeight = scrollDiv.clientHeight;
    const isAtBottom = scrollTop + clientHeight + 300 >= scrollHeight;
    this.scrollStateService.trendingScrollPosition.set(scrollTop);
    console.log('Is at bottom:', isAtBottom);
    if(isAtBottom) {
      // Handle the case when the user reaches the bottom of the scrollable area
      this.gitsService.loadTrendingGifs();
    }
  }

   ngAfterViewInit(): void {
    const scrollDiv = this.scrollDivRef()?.nativeElement;
    if(!scrollDiv) return;
    scrollDiv.scrollTop = this.scrollStateService.trendingScrollPosition();
  }

}
