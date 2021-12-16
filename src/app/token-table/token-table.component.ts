import { Component } from '@angular/core';
import { BehaviorSubject, combineLatest, map, startWith, Subject, switchMap } from 'rxjs';

import { TokenService } from '../token.service';

@Component({
    selector: 'app-token-table',
    templateUrl: './token-table.component.html',
    styleUrls: ['./token-table.component.scss'],
})
export class TokenTableComponent {
    readonly page$ = new Subject<number>();

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
                    return tokens.slice(startPageIndex, size);
                })
            );
        })
    );

    readonly paginator$ = combineLatest([
        this.page$.pipe(startWith(0)),
        this.pageSize$,
    ]);

    readonly columns = ['token', 'balance'];



    constructor(
        private readonly tokenService: TokenService,
    ) {
    }
}
