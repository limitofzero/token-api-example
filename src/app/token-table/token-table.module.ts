import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiScrollbarModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiInputModule } from '@taiga-ui/kit';

import { TokenTableComponent } from './token-table.component';
import { ScrollingModule } from "@angular/cdk/scrolling";



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
        ScrollingModule,
        TuiScrollbarModule,
    ],
})
export class TokenTableModule { }
