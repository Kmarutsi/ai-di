import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';

import {
  LoadAuth,
  AuthLoaded,
  AuthLoadError,
  AuthActionTypes,
} from './auth.actions';
import { AuthPartialState } from './auth.reducer';

@Injectable()
export class AuthEffects {
  @Effect() loadAuth$ = this.actions$.pipe(
    ofType(AuthActionTypes.LoadAuth),
    fetch({
      run: (action: LoadAuth, state: AuthPartialState) => {
        // Your custom REST 'load' logic goes here. For now just return an empty list...
        return new AuthLoaded([]);
      },

      onError: (action: LoadAuth, error) => {
        console.error('Error', error);
        return new AuthLoadError(error);
      },
    })
  );

  constructor(private readonly actions$: Actions) {}
}
