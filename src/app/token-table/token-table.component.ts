import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, combineLatest, map, startWith, switchMap } from 'rxjs';

import { ExtendedToken, TokenService } from '../token.service';
import { WalletStoreService } from '../wallet-store.service';

@Component({
    selector: 'app-token-table',
    templateUrl: './token-table.component.html',
    styleUrls: ['./token-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokenTableComponent {
    readonly page$ = new BehaviorSubject<number>(0);

    readonly pageSize$ = new BehaviorSubject(10);

    readonly total$ = this.tokenService.getTokens().pipe(
        map(({ length }) => length),
        startWith(0),
    );

    readonly tokens$ = this.tokenService.getTokens().pipe(
        switchMap((tokens) => {
            return this.paginator$.pipe(
                map(([page, size]) => {
                    const startPageIndex = size * page;
                    return tokens.slice(startPageIndex, startPageIndex + size);
                })
            );
        })
    );

    readonly paginator$ = combineLatest([
        this.page$.pipe(startWith(0)),
        this.pageSize$,
    ]);

    readonly columns$ = this.walletStore.getAddress().pipe(
        map(wallet => wallet ? ['token', 'price', 'balance', 'allowance'] : ['token', 'price'])
    );

    constructor(
        private readonly tokenService: TokenService,
        private readonly walletStore: WalletStoreService,
    ) {
    }

    pageChanged(page: number) {
        this.page$.next(page);
    }

    pageSizeChanged(pageSize: number) {
        this.pageSize$.next(pageSize);
    }

    trackByFn(_: number, item: ExtendedToken): string {
        return item.name;
    }
}
