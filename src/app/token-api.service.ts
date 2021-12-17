import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../environments/environment';

export interface Token {
    address: string;
    decimals: number;
    logoURI: string;
    name: string;
    symbol: string;
}

export type TokenMap = Record<string, Token>;
export type TokenPrices = Record<string, string>;

type GeckoTokenString = 'ethereum' | 'binancecoin';

type InUsd = { usd: number };

type CoinGeckoApiResponse = Partial<Record<GeckoTokenString, InUsd>>

const CHAIN_TOKEN: Readonly<Record<string, GeckoTokenString>> = {
    '1': 'ethereum',
    '56': 'binancecoin',
};

@Injectable({
    providedIn: 'root',
})
export class TokenApiService {
    constructor(private readonly http: HttpClient) { }

    public getAllTokens(chainId: string): Observable<TokenMap> {
        return this.http.get<TokenMap>(`${environment.tokenListApiUrl}/${chainId}`);
    }

    public getTokenPricesInETH(chainId: string): Observable<TokenPrices> {
        return this.http.get<TokenPrices>(`${environment.tokenPriceApiUrl}/${chainId}`);
    }

    public getEtherPrice(chainId: string) : Observable<number> {
        const token = CHAIN_TOKEN[chainId];
        const url = `${environment.coingeckoUsdPrice}?ids=${token}&vs_currencies=usd`
        return this.http.get<CoinGeckoApiResponse>(url).pipe(
            map(resp => resp[token]?.usd as number),
        )
    }
}
