import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TuiContextWithImplicit, TuiDestroyService, tuiPure, TuiStringHandler } from '@taiga-ui/cdk';
import { debounceTime, startWith, takeUntil } from 'rxjs';

import { ChainIdStoreService } from './chain-id-store.service';
import { WalletStoreService } from './wallet-store.service';
import { validateAddress } from "./validators";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [TuiDestroyService],
})
export class AppComponent implements OnInit {
    readonly chains: ReadonlyArray<{ name: string, id: string }> = [
        { name: 'etherium', id: '1' },
        { name: 'binance', id: '56' },
        { name: 'polygon', id: '137' },
    ];

    readonly form = this.fb.group({
        address: ['', [Validators.required, validateAddress]],
        chainId: [this.chains[0].id],
    });

    constructor(
        private readonly onDestroy$: TuiDestroyService,
        private readonly walletStore: WalletStoreService,
        private readonly fb: FormBuilder,
        private readonly chainIdStore: ChainIdStoreService
    ) {
    }

    @tuiPure
    stringify(
        items: ReadonlyArray<{ name: string, id: string }>,
    ): TuiStringHandler<TuiContextWithImplicit<string>> {
        const map = new Map(items.map(({ id, name }) => [id, name] as [string, string]));

        return ({ $implicit }: TuiContextWithImplicit<string>) => map.get($implicit) || '';
    }

    ngOnInit() {
        this.form.valueChanges.pipe(
            debounceTime(500),
            startWith(this.form.value),
            takeUntil(this.onDestroy$),
        ).subscribe({
            next: (formValue) => {
                let address = formValue.address as string;
                address = this.form.valid ? address : '';
                this.walletStore.setAddress(address);
                this.chainIdStore.setChainId(formValue.chainId as string);
            },
        });
    }
}
