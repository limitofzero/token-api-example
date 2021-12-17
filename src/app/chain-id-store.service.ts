import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ChainIdStoreService {
    private readonly chainId$ = new BehaviorSubject<string>('');

    public setChainId(address: string): void {
        this.chainId$.next(address);
    }

    public getChainId(): Observable<string> {
        return this.chainId$.pipe(
            filter(Boolean),
        );
    }
}
