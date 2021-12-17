import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, forkJoin, map, mapTo, Observable, shareReplay, switchMap, timer } from 'rxjs';

import { Token, TokenApiService } from './token-api.service';
import BigNumber from "bignumber.js";

export interface ExtendedToken extends Token {
    price: string;
}

@Injectable({
    providedIn: 'root',
})
export class TokenService {
    private readonly chainId$ = new BehaviorSubject('1');

    private readonly tokens$ = this.chainId$.pipe(
        switchMap(chainId => this.tokenApiService.getAllTokens(chainId)),
    )

    private readonly prices$ = this.chainId$.pipe(
        switchMap(chainId => timer(0, 5000).pipe(
            mapTo(chainId),
        )),
        switchMap(chainId => forkJoin([
            this.tokenApiService.getTokenPricesInETH(chainId),
            this.tokenApiService.getEtherPrice(chainId)
        ])),
    );

    private readonly tokensWithPrices$ = combineLatest([
        this.tokens$,
        this.prices$
    ]).pipe(
        map(([tokenMap, [priceMap, ethPrice]]) => {
            return Object.keys(tokenMap).reduce((extendedTokenMap, address) => {
                extendedTokenMap[address] = {
                    ...tokenMap[address],
                    price: this.calculatePriceInUSD(priceMap[address], ethPrice),
                };

                return extendedTokenMap;
            }, {} as Record<string, ExtendedToken>)
        }),
        map(tokenMap => Object.values(tokenMap)),
        shareReplay({
            bufferSize: 1,
            refCount: true,
        }),
    );

    constructor(private readonly tokenApiService: TokenApiService) { }

    getTokens(): Observable<ExtendedToken[]> {
        return this.tokensWithPrices$;
    }

    private calculatePriceInUSD(wei: string, EthPriceInUsd: number): string {
        return new BigNumber(wei).div(1e18).multipliedBy(EthPriceInUsd).decimalPlaces(2).toString()
    }
}
