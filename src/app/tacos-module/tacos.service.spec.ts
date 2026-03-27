import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TacosService } from './tacos.service';
import { TacosConfigService } from './tacos-config/tacos-config.service';
import { buildLogSearchEventQuery } from './tacos-query/tacos-query.builder';

describe('TacosService', () => {
  let service: TacosService;
  let httpTesting: HttpTestingController;
  let tacosConfigServiceMock: jasmine.SpyObj<TacosConfigService>;
  let fakeTacosUrl: string;
  let fakeSourceSystem: string;

  beforeEach(() => {
    fakeTacosUrl = 'https://fake-tacos.test/graphql';
    fakeSourceSystem = 'nde-sandbox';
    tacosConfigServiceMock = jasmine.createSpyObj(
      'TacosConfigService',
      {},
      {
        tacosUrl: fakeTacosUrl,
        sourceSystem: fakeSourceSystem,
      },
    );
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        TacosService,
        { provide: TacosConfigService, useValue: tacosConfigServiceMock },
      ],
    });

    service = TestBed.inject(TacosService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  describe('getTacosResponse', () => {
    it('makes POST request to URL from TacosConfigService', () => {
      const searchTerm = 'foo';

      service.getTacosResponse(searchTerm).subscribe();

      const req = httpTesting.expectOne(fakeTacosUrl);
      expect(req.request.method).toBe('POST');
      req.flush({});
    });

    it('sends correct GraphQL query and variables in request body', () => {
      const searchTerm = 'foo';
      const { query, variables } = buildLogSearchEventQuery(
        searchTerm,
        fakeSourceSystem,
      );

      service.getTacosResponse(searchTerm).subscribe();

      const req = httpTesting.expectOne(fakeTacosUrl);
      expect(req.request.body.query).toBe(query);
      expect(req.request.body.variables).toEqual(variables);
      req.flush({});
    });

    it('sets correct headers', () => {
      const searchTerm = 'foo';

      service.getTacosResponse(searchTerm).subscribe();

      const req = httpTesting.expectOne(fakeTacosUrl);
      expect(req.request.headers.get('Accept')).toBe('application/json');
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush({});
    });

    it('handles special characters in searchTerm safely', () => {
      const searchTerm = 'foo"bar\\baz';

      service.getTacosResponse(searchTerm).subscribe();

      const req = httpTesting.expectOne(fakeTacosUrl);
      expect(req.request.body.variables.searchTerm).toBe(searchTerm);
      req.flush({});
    });
  });
});
