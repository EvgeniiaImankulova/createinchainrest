import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

export interface SelectOption {
  value: any;
  label: string;
}

@Component({
  selector: 'app-searchable-select',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './searchable-select.component.html',
  styleUrls: ['./searchable-select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchableSelectComponent),
      multi: true
    }
  ]
})
export class SearchableSelectComponent implements ControlValueAccessor {
  @Input() label: string = 'Single select with search';
  @Input() options: SelectOption[] = [];
  @Input() placeholder: string = 'Type...';

  selectedValue: any = null;
  searchText: string = '';
  filteredOptions: SelectOption[] = [];

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit() {
    this.filteredOptions = [...this.options];
  }

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchText = input.value.toLowerCase();

    if (this.searchText) {
      this.filteredOptions = this.options.filter(option =>
        option.label.toLowerCase().includes(this.searchText)
      );
    } else {
      this.filteredOptions = [...this.options];
    }
  }

  onSelectionChange(value: any) {
    this.selectedValue = value;
    this.onChange(value);
    this.onTouched();
  }

  onClear(event: Event) {
    event.stopPropagation();
    this.selectedValue = null;
    this.onChange(null);
    this.onTouched();
  }

  onPanelOpened() {
    this.searchText = '';
    this.filteredOptions = [...this.options];
  }

  writeValue(value: any): void {
    this.selectedValue = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  getDisplayLabel(): string {
    if (this.selectedValue !== null && this.selectedValue !== undefined) {
      const option = this.options.find(opt => opt.value === this.selectedValue);
      return option ? option.label : '';
    }
    return '';
  }
}
