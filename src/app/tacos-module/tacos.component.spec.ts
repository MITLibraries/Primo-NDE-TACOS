import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TacosComponent, selectSearchTerm } from './tacos.component';
import { TacosService } from './tacos.service';
import {
  TacosConfigService,
  TacosModuleParameters,
} from './tacos-config/tacos-config.service';

describe('TacosComponent', () => {
  let fixture: ComponentFixture<TacosComponent>;
  let component: TacosComponent;
  let tacosServiceMock: jasmine.SpyObj<TacosService>;
  let tacosConfigServiceMock: TacosModuleParameters;

  const MOCK_TACOS_RESPONSE = {
    data: {
      logSearchEvent: {
        detectors: {
          suggestedResources: [
            { url: 'https://taco1.com', title: 'Taco One' },
            { url: 'https://taco2.com', title: 'Taco Two' },
          ],
        },
      },
    },
  };

  beforeEach(async () => {
    tacosServiceMock = jasmine.createSpyObj('TacosService', [
      'getTacosResponse',
    ]);
    tacosServiceMock.getTacosResponse.and.returnValue(of(MOCK_TACOS_RESPONSE));

    tacosConfigServiceMock = {
      tacosUrl: 'https://fake-tacos.test/graphql',
      displayRecs: true,
      sourceSystem: 'foo-system',
    };

    await TestBed.configureTestingModule({
      imports: [TacosComponent],
      providers: [
        provideMockStore({
          selectors: [{ selector: selectSearchTerm, value: 'foo' }],
        }),
        { provide: TacosService, useValue: tacosServiceMock },
        { provide: TacosConfigService, useValue: tacosConfigServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TacosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.inject(MockStore).resetSelectors();
  });

  it('calls the service when search term exists', () => {
    expect(tacosServiceMock.getTacosResponse).toHaveBeenCalledWith('foo');
  });

  it('does not request recommendations when Search state is missing', () => {
    const store = TestBed.inject(MockStore);
    tacosServiceMock.getTacosResponse.calls.reset();
    store.resetSelectors();
    store.setState({});

    expect(tacosServiceMock.getTacosResponse).not.toHaveBeenCalled();
  });

  it('ignores empty search terms and handles a later non-empty term', () => {
    const store = TestBed.inject(MockStore);
    const selector = store.overrideSelector(selectSearchTerm, '');
    tacosServiceMock.getTacosResponse.calls.reset();

    store.refreshState();
    selector.setResult('   ');
    store.refreshState();
    expect(tacosServiceMock.getTacosResponse).not.toHaveBeenCalled();

    selector.setResult('bar');
    store.refreshState();
    expect(tacosServiceMock.getTacosResponse).toHaveBeenCalledOnceWith('bar');
    store.resetSelectors();
  });

  it('sets displayRecs from config service', () => {
    expect(component.displayRecs).toBe(true);
  });

  it('calls the service exactly once', () => {
    expect(tacosServiceMock.getTacosResponse).toHaveBeenCalledTimes(1);
    expect(tacosServiceMock.getTacosResponse).toHaveBeenCalledWith('foo');
  });

  describe('when displayRecs is true', () => {
    it('displays recommendations in template', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Taco One');
      expect(compiled.textContent).toContain('Taco Two');
    });
  });

  describe('when displayRecs is false', () => {
    beforeEach(() => {
      tacosConfigServiceMock.displayRecs = false;
      fixture.detectChanges();
    });

    it('sets displayRecs from config service', () => {
      expect(component.displayRecs).toBe(false);
    });

    it('calls the service for logging', () => {
      expect(tacosServiceMock.getTacosResponse).toHaveBeenCalledWith('foo');
    });

    it('does not display recommendations in template', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.textContent.trim()).toBe('');
      expect(compiled.textContent).not.toContain('Taco One');
      expect(compiled.textContent).not.toContain('Taco Two');
    });
  });
});
