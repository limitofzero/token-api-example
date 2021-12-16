import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';

import { Token, TokenApiService } from './token-api.service';

export type ExtendedToken = Token;



@Injectable({
    providedIn: 'root',
})
export class TokenService {
    private readonly tokens$ = this.tokenApiService.getAllTokensByChainId('56').pipe(
        map(tokenMap => Object.values(tokenMap)),
        shareReplay({
            bufferSize: 1,
            refCount: true,
        }),
    );

    constructor(private readonly tokenApiService: TokenApiService) { }

    getTokens(): Observable<ExtendedToken[]> {
        return this.tokens$;
    }
}
