import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button [type]="type" class="px-4 py-2 bg-brand-brown-light text-white rounded-lg hover:bg-opacity-95 shadow-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-brown-light focus:ring-offset-2">
      <ng-content></ng-content>
    </button>
  `
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
}
