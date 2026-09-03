import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ScrollStateService {
  trendingScrollPosition = signal(0);
  private scrollStates: Map<string, number> = new Map();

  setScrollPosition(route: string, position: number): void {
    this.scrollStates.set(route, position);
  }

  getScrollPosition(route: string): number | undefined {
    return this.scrollStates.get(route);
  }
}
