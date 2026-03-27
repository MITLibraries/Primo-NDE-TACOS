import { Type } from '@angular/core';
import { TacosComponent } from './tacos.component';

// Define the map
export const selectorComponentMap = new Map<string, Type<any>>([
  ['nde-search-results-container-before', TacosComponent],
]);
