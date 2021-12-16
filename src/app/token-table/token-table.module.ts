import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';

import { TokenTableComponent } from './token-table.component';



@NgModule({
    declarations: [TokenTableComponent],
    exports: [TokenTableComponent],
    imports: [
        CommonModule,
        TuiTableModule,
        TuiTablePaginationModule,
        TuiLetModule,
    ],
})
export class TokenTableModule { }
