import { Component, Input, Output, EventEmitter, forwardRef, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption {
  value: any;
  label: string;
}

@Component({
  selector: 'app-searchable-select',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
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
  isOpen: boolean = false;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  ngOnInit() {
    this.filteredOptions = [...this.options];
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.onPanelOpened();
    }
  }

  selectOption(value: any) {
    this.onSelectionChange(value);
    this.isOpen = false;
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
    event.preventDefault();
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
