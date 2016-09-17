import {Component} from '@angular/core';
import {onsPlatform} from 'angular2-onsenui';
import {First} from './first';
import {Second} from './second';

@Component({
  selector: 'app',
  template: require('./app.html'),
  styles: [require('./app.css')]
})
export class MyApp {
  first = First;
  second = Second;

  animation = onsPlatform.isAndroid() ? 'slide' : 'none';
  modifier = onsPlatform.isAndroid() ? 'material noshadow' : '';

  constructor() {}
}
