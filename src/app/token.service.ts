import { Injectable } from '@angular/core';
import BigNumber from 'bignumber.js';
import {
    combineLatest, distinctUntilChanged,
    forkJoin,
    map,
    mapTo,
    Observable,
    of,
    shareReplay,
    switchMap, switchMapTo,
    timer,
} from 'rxjs';

import { ChainIdStoreService } from './chain-id-store.service';
import {
    AllowanceAndBalance,
    Token,
    TokenAllowanceAndBalance,
    TokenApiService,
    TokenMap,
    TokenPrices,
} from './token-api.service';
import { WalletStoreService } from './wallet-store.service';

export interface ExtendedToken extends Token, AllowanceAndBalance {
    price: string;
}

export type ExtendedTokenMap = Record<string, ExtendedToken>;

@Injectable({
    providedIn: 'root',
})
export class TokenService {
    private readonly chainId$ = this.chainIdStore.getChainId().pipe(
        distinctUntilChanged(),
    );

    private readonly wallet$ = this.walletStore.getAddress();

    private readonly tokens$ = this.chainId$.pipe(
        switchMap(chainId => this.tokenApiService.getAllTokens(chainId)),
    );

    private readonly balancesAndAllowance$ = combineLatest([
        this.chainId$,
        this.wallet$,
    ]).pipe(
        switchMap(([chainId, wallet]) => {
            if (wallet) {
                return timer(0, 30000).pipe(
                    switchMapTo(this.tokenApiService.getBalances(chainId, wallet)),
                );
            }

            return of({});
        })
    );

    private readonly prices$ = this.chainId$.pipe(
        switchMap(chainId => timer(0, 5000).pipe(
            mapTo(chainId),
        )),
        switchMap(chainId => forkJoin([
            this.tokenApiService.getTokenPricesInETH(chainId),
            this.tokenApiService.getEtherPrice(chainId),
        ])),
    );

    private readonly tokensWithPrices$ = combineLatest([
        this.tokens$,
        this.balancesAndAllowance$,
        this.prices$,
    ]).pipe(
        map(([tokenMap, balancesAndAllowance, [priceMap, ethPrice]]) => {
            return this.combineTokensData(tokenMap, balancesAndAllowance, priceMap, ethPrice);
        }),
        map(tokenMap => Object.values(tokenMap)),
        shareReplay({
            bufferSize: 1,
            refCount: true,
        }),
    );

    constructor(private readonly tokenApiService: TokenApiService, private readonly walletStore: WalletStoreService,
                private readonly chainIdStore: ChainIdStoreService) { }

    getTokens(): Observable<ExtendedToken[]> {
        return this.tokensWithPrices$;
    }

    private calculatePriceInUSD(wei: string, ethPriceInUSD: number): string {
        return this.fromWei(wei, 18).multipliedBy(ethPriceInUSD).decimalPlaces(2).toString();
    }

    private convertTokenWeiToUSD(wei: string, decimals: number, usdPrice: string): string {
        return this.fromWei(wei, decimals).multipliedBy(usdPrice).decimalPlaces(2).toString();
    }

    private fromWei(wei: string, decimals: number): BigNumber {
        return new BigNumber(wei).div(10 ** decimals);
    }

    private combineTokensData(
        tokenMap: TokenMap,
        balances: TokenAllowanceAndBalance,
        priceMap: TokenPrices,
        mainTokenPrice: number
    ): ExtendedTokenMap {
        return Object.keys(tokenMap).reduce((extendedTokenMap, address) => {
            const token = tokenMap[address];
            const tokenPrice = this.calculatePriceInUSD(priceMap[address], mainTokenPrice);

            const balanceAndAllowance = balances[address] ?? {};
            let { balance, allowance } = balanceAndAllowance;

            balance = balance ? this.convertTokenWeiToUSD(balance, token.decimals, tokenPrice) : '0';
            allowance = allowance ? this.fromWei(allowance, token.decimals).toString(): '0';

            extendedTokenMap[address] = {
                ...token,
                ...balanceAndAllowance,
                balance,
                allowance,
                price: this.calculatePriceInUSD(priceMap[address], mainTokenPrice),
            };

            return extendedTokenMap;
        }, {} as ExtendedTokenMap);
    }
}
