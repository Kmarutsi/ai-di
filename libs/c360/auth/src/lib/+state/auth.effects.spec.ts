import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, StoreModule } from '@ngrx/store';
import { NxModule } from '@nrwl/angular';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import { AuthEffects } from './auth.effects';
import { LoadAuth, AuthLoaded } from './auth.actions';

describe('AuthEffects', () => {
  let actions: Observable<Action>;
  let effects: AuthEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NxModule.forRoot(),
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
      ],
      providers: [AuthEffects, provideMockActions(() => actions)],
    });

    effects = TestBed.inject(AuthEffects);
  });

  describe('loadAuth$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: new LoadAuth() });

      expect(effects.loadAuth$).toBeObservable(
        hot('-a-|', { a: new AuthLoaded([]) })
      );
    });
  });
});
