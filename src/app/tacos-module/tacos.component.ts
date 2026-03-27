import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import { TacosService } from './tacos.service';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { filter, map, switchMap, shareReplay } from 'rxjs/operators';
import { createFeatureSelector, createSelector, Store } from '@ngrx/store';
import { TacosConfigService } from './tacos-config/tacos-config.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// State shape for the Search feature in the store
type SearchState = { searchParams: { q: string } };

// Selector to get the Search feature state from the store
export const selectSearchState = createFeatureSelector<SearchState>('Search');

// Selector to extract just the search term (q parameter) from the Search state
export const selectSearchTerm = createSelector(
  selectSearchState,
  (state) => state?.searchParams?.q ?? '',
);

/**
 * Component that displays TACOS recommendations based on the current search term.
 *
 * The component always calls the TACOS service for logging purposes, but only displays
 * recommendations in the UI if displayRecs config is enabled.
 */
@Component({
  selector: 'custom-tacos',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './tacos.component.html',
  styleUrls: ['./tacos.component.scss'],
})
export class TacosComponent implements OnInit {
  private tacosService = inject(TacosService);
  private tacosConfigService = inject(TacosConfigService);
  private store = inject(Store);
  private destroyRef = inject(DestroyRef);

  // Observable that emits TACOS recommendation responses
  tacosResponse$!: Observable<any>;

  /**
   * Getter for displayRecs flag from config service.
   * Using a getter ensures the template gets the current value even if config changes.
   */
  get displayRecs() {
    return this.tacosConfigService.displayRecs;
  }

  ngOnInit(): void {
    // Create observable pipeline that:
    // 1. Listens to search term changes from the store
    // 2. Trims whitespace from the search term
    // 3. Filters out empty search terms
    // 4. Calls TACOS service with the search term
    this.tacosResponse$ = this.store.select(selectSearchTerm).pipe(
      map((q) => (q ?? '').trim()),
      filter((q) => q.length > 0),
      switchMap((q) => this.tacosService.getTacosResponse(q)),
      shareReplay({ bufferSize: 1, refCount: true }),
      takeUntilDestroyed(this.destroyRef),
    );

    // Subscribe immediately to ensure the TACOS service is called for logging,
    // even if the template doesn't subscribe (when displayRecs is false)
    this.tacosResponse$.subscribe();
  }
}
