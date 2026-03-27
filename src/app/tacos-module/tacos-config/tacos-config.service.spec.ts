import { TestBed } from '@angular/core/testing';
import { TacosConfigService } from './tacos-config.service';
import { TACOS_CONFIG_DEFAULTS } from './tacos-config.constants';
describe('ConfigService', () => {
  let service: TacosConfigService;

  describe('without MODULE_PARAMETERS', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({});
      service = TestBed.inject(TacosConfigService);
    });

    it('uses the defaults', () => {
      expect(service.tacosUrl).toBe(TACOS_CONFIG_DEFAULTS.tacosUrl);
      expect(service.displayRecs).toBe(TACOS_CONFIG_DEFAULTS.displayRecs);
      expect(service.sourceSystem).toBe(TACOS_CONFIG_DEFAULTS.sourceSystem);
    });
  });

  describe('with expected keys in MODULE_PARAMETERS', () => {
    const fakeTacosUrl = 'https://custom-tacos.example.com/graphql';
    const fakeDisplayRecs = false;
    const fakeSourceSystem = 'foo';
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          TacosConfigService,
          {
            provide: 'MODULE_PARAMETERS',
            useValue: {
              tacosUrl: fakeTacosUrl,
              displayRecs: fakeDisplayRecs,
              sourceSystem: fakeSourceSystem,
            },
          },
        ],
      });
      service = TestBed.inject(TacosConfigService);
    });

    it('returns the values from MODULE_PARAMETERS', () => {
      expect(service.tacosUrl).toBe(fakeTacosUrl);
      expect(service.displayRecs).toBe(fakeDisplayRecs);
      expect(service.sourceSystem).toBe(fakeSourceSystem);
    });
  });

  describe('with MODULE_PARAMETERS as string booleans', () => {
    // ← NEW TEST SUITE for Primo NDE JSON config

    it('parses displayRecs="false" (string) to false (boolean)', () => {
      TestBed.configureTestingModule({
        providers: [
          TacosConfigService,
          {
            provide: 'MODULE_PARAMETERS',
            useValue: {
              tacosUrl: 'https://tacos.libraries.mit.edu/graphql',
              displayRecs: 'false',
              sourceSystem: 'nde-sandbox',
            },
          },
        ],
      });
      service = TestBed.inject(TacosConfigService);

      expect(service.displayRecs).toBe(false);
      expect(typeof service.displayRecs).toBe('boolean');
    });

    it('parses displayRecs="true" (string) to true (boolean)', () => {
      TestBed.configureTestingModule({
        providers: [
          TacosConfigService,
          {
            provide: 'MODULE_PARAMETERS',
            useValue: {
              tacosUrl: 'https://tacos.libraries.mit.edu/graphql',
              displayRecs: 'true',
              sourceSystem: 'nde-sandbox',
            },
          },
        ],
      });
      service = TestBed.inject(TacosConfigService);

      expect(service.displayRecs).toBe(true);
      expect(typeof service.displayRecs).toBe('boolean');
    });

    it('handles case-insensitive string booleans', () => {
      TestBed.configureTestingModule({
        providers: [
          TacosConfigService,
          {
            provide: 'MODULE_PARAMETERS',
            useValue: {
              tacosUrl: 'https://tacos.libraries.mit.edu/graphql',
              displayRecs: 'FALSE',
              sourceSystem: 'nde-sandbox',
            },
          },
        ],
      });
      service = TestBed.inject(TacosConfigService);

      expect(service.displayRecs).toBe(false);
    });
  });

  describe('with MODULE_PARAMETERS without the expected keys ', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          TacosConfigService,
          {
            provide: 'MODULE_PARAMETERS',
            useValue: { someOtherConfig: 'value' },
          },
        ],
      });
      service = TestBed.inject(TacosConfigService);
    });

    it('uses the defaults', () => {
      expect(service.tacosUrl).toBe(TACOS_CONFIG_DEFAULTS.tacosUrl);
      expect(service.displayRecs).toBe(TACOS_CONFIG_DEFAULTS.displayRecs);
      expect(service.sourceSystem).toBe(TACOS_CONFIG_DEFAULTS.sourceSystem);
    });
  });

  describe('with empty MODULE_PARAMETERS', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          TacosConfigService,
          { provide: 'MODULE_PARAMETERS', useValue: {} },
        ],
      });
      service = TestBed.inject(TacosConfigService);
    });

    it('uses the defaults', () => {
      expect(service.tacosUrl).toBe(TACOS_CONFIG_DEFAULTS.tacosUrl);
      expect(service.displayRecs).toBe(TACOS_CONFIG_DEFAULTS.displayRecs);
      expect(service.sourceSystem).toBe(TACOS_CONFIG_DEFAULTS.sourceSystem);
    });
  });
});
