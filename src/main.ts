// Onsen UI Styling and Icons
require('onsenui/stylus/blue-basic-theme.styl');
require('onsenui/css/onsenui.css');

// Application code starts here
import {enableProdMode, NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';
import {OnsenModule} from 'angular2-onsenui';

import {MyApp} from './app/app';
import {First} from './app/first';
import {Second} from './app/second';

// Enable production mode when in production mode.
if (process.env.NODE_ENV === 'production') {
  enableProdMode();
}

@NgModule({
    imports: [
        OnsenModule,
        HttpModule,
        RouterModule,
    ],
    declarations: [
        MyApp,
        First,
        Second,
    ],
    entryComponents: [
        First,
        Second,
    ],
    providers: [
        {provide: LocationStrategy, useClass: HashLocationStrategy},
    ],
    bootstrap: [
        MyApp,
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
    ],
})
class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule)
.catch(err => console.error(err));
