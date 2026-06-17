import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-input',
  standalone: true,
  template: `
    <div class="flex flex-col gap-1">
      <label *ngIf="label" class="text-sm font-medium text-gray-700">{{ label }}</label>
      <input 
        [type]="type" 
        [placeholder]="placeholder" 
        class="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>
  `
})
export class InputComponent {
  @Input() label = '';
  @Input() type = 'text';
  @Input() placeholder = '';
}
