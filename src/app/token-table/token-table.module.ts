import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiInputModule } from '@taiga-ui/kit';

import { TokenTableComponent } from './token-table.component';



@NgModule({
    declarations: [TokenTableComponent],
    exports: [TokenTableComponent],
    imports: [
        CommonModule,
        TuiTableModule,
        TuiTablePaginationModule,
        TuiLetModule,
        TuiInputModule,
        TuiTextfieldControllerModule,
        ReactiveFormsModule,
    ],
})
export class TokenTableModule { }
