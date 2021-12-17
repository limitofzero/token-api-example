import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class WalletStoreService {
    private readonly wallet$ = new BehaviorSubject<string | null>(null);

    public setAddress(address: string): void {
        this.wallet$.next(address);
    }

    public getAddress(): Observable<string | null> {
        return this.wallet$.asObservable();
    }
}
