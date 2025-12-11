import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchableSelectComponent, SelectOption } from '../../components/searchable-select/searchable-select.component';

@Component({
  selector: 'app-searchable-select-example',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchableSelectComponent],
  template: `
    <div class="example-container">
      <h2>Searchable Select Example</h2>

      <app-searchable-select
        [label]="'Single select with search'"
        [options]="options"
        [placeholder]="'Type...'"
        [(ngModel)]="selectedValue">
      </app-searchable-select>

      <div class="selected-value" *ngIf="selectedValue">
        <strong>Selected value:</strong> {{ selectedValue }}
      </div>
    </div>
  `,
  styles: [`
    .example-container {
      padding: 24px;
      max-width: 600px;
    }

    h2 {
      margin-bottom: 24px;
      color: rgba(0, 0, 0, 0.87);
    }

    .selected-value {
      margin-top: 16px;
      padding: 12px;
      background: #f5f5f5;
      border-radius: 4px;
    }
  `]
})
export class SearchableSelectExampleComponent {
  selectedValue: string = 'two';

  options: SelectOption[] = [
    { value: 'one', label: 'One' },
    { value: 'two', label: 'Two' },
    { value: 'five', label: 'Five' },
    { value: 'six', label: 'Six' },
    { value: 'eight', label: 'Eight' },
    { value: 'name', label: 'Name Surname' }
  ];
}
