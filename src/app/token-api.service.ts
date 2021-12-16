import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../environments/environment';

export interface Token {
    address: string;
    decimals: number;
    logoURI: string;
    name: string;
    symbol: string;
}

export type TokenMap = Record<string, Token>;

@Injectable({
    providedIn: 'root',
})
export class TokenApiService {
    constructor(private readonly http: HttpClient) { }

    public getAllTokensByChainId(chainId: string): Observable<TokenMap> {
        return this.http.get<TokenMap>(`${environment.tokenListApiUrl}/${chainId}`);
    }
}
