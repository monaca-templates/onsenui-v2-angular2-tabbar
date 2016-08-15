import {Component} from '@angular/core';
import {ONS_DIRECTIVES} from 'angular2-onsenui';

@Component({
  selector: 'ons-page',
  directives: [ONS_DIRECTIVES],
  template: `
    <div class="content">
      <p>I am the second tab.</p>
    </div>
  `
})
export class Second {
  constructor() {}
}


