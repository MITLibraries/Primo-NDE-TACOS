import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TacosConfigService } from './tacos-config/tacos-config.service';
import { buildLogSearchEventQuery } from './tacos-query/tacos-query.builder';

/**
 * Service for interacting with the TACOS API.
 *
 * TACOS logs search events and returns content recommendations based on search terms.
 * The service handles GraphQL query construction and HTTP communication with the TACOS endpoint.
 */
@Injectable({
  providedIn: 'root',
})
export class TacosService {
  private config = inject(TacosConfigService);
  private http = inject(HttpClient);

  // Standard headers for GraphQL requests
  private tacosHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  /**
   * Sends a search term to TACOS for logging and retrieves content recommendations.
   *
   * This method:
   * 1. Builds a GraphQL query with variables for the search event
   * 2. Posts the query and variables to the TACOS API
   * 3. Logs the response for debugging
   * 4. Handles errors gracefully without breaking the host page
   *
   * @param searchTerm - The user's search query to log and get recommendations for
   * @returns Observable that emits the TACOS API response containing suggested resources,
   *          or completes empty if the request fails
   */
  getTacosResponse(searchTerm: string): Observable<any> {
    const { query, variables } = buildLogSearchEventQuery(
      searchTerm,
      this.config.sourceSystem,
    );
    return this.http
      .post(
        this.config.tacosUrl,
        { query, variables },
        { headers: this.tacosHeaders },
      )
      .pipe(
        // Log successful responses for debugging
        tap((res) =>
          console.log('TacosService.getTacosResponse response:', res),
        ),
        // Catch and log errors gracefully without breaking the host page.
        // Returns EMPTY to complete the observable silently
        catchError((err) => {
          console.error('TacosService.getTacosResponse error:', err);
          return EMPTY;
        }),
      );
  }
}
