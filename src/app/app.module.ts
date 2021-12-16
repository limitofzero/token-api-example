import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TUI_SANITIZER, TuiDialogModule, TuiNotificationsModule, TuiRootModule } from '@taiga-ui/core';
import { TuiInputModule } from '@taiga-ui/kit';
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
    ],
    providers: [{ provide: TUI_SANITIZER, useClass: NgDompurifySanitizer }],
    bootstrap: [AppComponent],
})
export class AppModule { }
