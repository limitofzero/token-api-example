import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TuiLetModule } from '@taiga-ui/cdk';
import {
    TUI_SANITIZER, TuiDataListModule,
    TuiDialogModule,
    TuiNotificationsModule,
    TuiRootModule,
    TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { TuiInputModule, TuiSelectModule } from '@taiga-ui/kit';
import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';

import { AppComponent } from './app.component';
import { TokenTableModule } from './token-table/token-table.module';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        TuiRootModule,
        BrowserAnimationsModule,
        TuiDialogModule,
        TuiNotificationsModule,
        TuiInputModule,
        TokenTableModule,
        HttpClientModule,
        ReactiveFormsModule,
        TuiSelectModule,
        TuiLetModule,
        TuiTextfieldControllerModule,
        TuiDataListModule,
    ],
    providers: [{ provide: TUI_SANITIZER, useClass: NgDompurifySanitizer }],
    bootstrap: [AppComponent],
})
export class AppModule { }
