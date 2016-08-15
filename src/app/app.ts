import {Component} from '@angular/core';
import {ONS_DIRECTIVES, onsPlatform} from 'angular2-onsenui';
import {First} from './first';
import {Second} from './second';

@Component({
  selector: 'app',
  directives: [ONS_DIRECTIVES],
  template: require('./app.html'),
  styles: [require('./app.css')]
})
export class MyApp {
  first = First;
  second = Second;

  animation = onsPlatform.isAndroid() ? 'slide' : 'none';

  constructor() {}
}
