import { Component, Input, forwardRef, TemplateRef, ContentChild, Output, EventEmitter, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Subject, takeUntil } from 'rxjs';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'resto-custom-autocomplete',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    ScrollingModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RestoCustomAutocompleteComponent),
      multi: true
    }
  ],
  templateUrl: './resto-custom-autocomplete.component.html',
  styleUrl: './resto-custom-autocomplete.component.css'
})
export class RestoCustomAutocompleteComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
  @Input() label: string = '';
  @Input() options: any[] = [];
  @Input() trackFieldName: string = 'value';
  @Input() trackFieldDisplayName: string = 'label';
  @Input() secondaryTextField?: string;
  @Input() imageFieldName?: string;
  @Input() iconFieldName?: string;
  @Input() hasSearch: boolean = true;
  @Input() loading: boolean = false;
  @Input() isTable: boolean = false;
  @Input() errorMessage?: string;
  @Input() required: boolean = false;
  @Input() disabledSorting: boolean = false;
  @Input() hasAvatarIcon: boolean = false;
  @Input() selectTriggerAccessor?: (option: any) => string;
  @Input() iconSuffixTemplate?: TemplateRef<any>;
  @Input() useVirtualScroll: boolean = false;
  @Input() optionItemSizeInPx: number = 48;
  @Input() useGroups: boolean = false;
  @Input() formControl?: FormControl;

  @ContentChild('iconSuffixTemplate') iconSuffixTemplateChild?: TemplateRef<any>;

  searchControl = new FormControl('');
  filteredOptions: any[] = [];
  selectedValue: any = null;
  Math = Math;

  private destroy$ = new Subject<void>();
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};
  disabled = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.searchControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(searchTerm => {
        this.filterOptions(searchTerm || '');
      });

    if (this.formControl) {
      this.formControl.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(value => {
          this.selectedValue = value;
          this.cdr.detectChanges();
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(): void {
    this.filteredOptions = this.getSortedOptions();
  }

  writeValue(value: any): void {
    this.selectedValue = value;
    const option = this.options.find(opt => this.getOptionValue(opt) === value);
    if (option) {
      this.searchControl.setValue(this.getOptionDisplay(option), { emitEvent: false });
    }
    this.filteredOptions = this.getSortedOptions();
    this.cdr.detectChanges();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) {
      this.searchControl.disable();
    } else {
      this.searchControl.enable();
    }
  }

  onOptionSelected(option: any): void {
    const value = this.getOptionValue(option);
    this.selectedValue = value;
    this.searchControl.setValue(this.getOptionDisplay(option));
    this.onChange(value);
    this.onTouched();

    if (this.formControl) {
      this.formControl.setValue(value);
    }
  }

  onBlur(): void {
    this.onTouched();
    if (!this.selectedValue && this.required) {
      this.searchControl.setErrors({ required: true });
    }
  }

  getOptionValue(option: any): any {
    return option[this.trackFieldName];
  }

  getOptionDisplay(option: any): string {
    if (this.selectTriggerAccessor) {
      return this.selectTriggerAccessor(option);
    }
    return option[this.trackFieldDisplayName];
  }

  getSecondaryText(option: any): string {
    return this.secondaryTextField ? option[this.secondaryTextField] : '';
  }

  getImageUrl(option: any): string {
    return this.imageFieldName ? option[this.imageFieldName] : '';
  }

  getIconName(option: any): string {
    return this.iconFieldName ? option[this.iconFieldName] : '';
  }

  getAvatarText(option: any): string {
    const displayName = this.getOptionDisplay(option);
    return displayName ? displayName.charAt(0).toUpperCase() : '';
  }

  private filterOptions(searchTerm: string): void {
    if (!searchTerm) {
      this.filteredOptions = this.getSortedOptions();
      return;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    this.filteredOptions = this.options.filter(option => {
      const displayName = this.getOptionDisplay(option).toLowerCase();
      return displayName.includes(lowerSearchTerm);
    });
  }

  private getSortedOptions(): any[] {
    if (this.disabledSorting) {
      return [...this.options];
    }

    return [...this.options].sort((a, b) => {
      const displayA = this.getOptionDisplay(a).toLowerCase();
      const displayB = this.getOptionDisplay(b).toLowerCase();
      return displayA.localeCompare(displayB);
    });
  }

  displayFn = (value: any): string => {
    if (!value) return '';
    const option = this.options.find(opt => this.getOptionValue(opt) === value);
    return option ? this.getOptionDisplay(option) : '';
  }

  get hasError(): boolean {
    return this.required && !this.selectedValue && this.searchControl.touched;
  }

  get suffixTemplate(): TemplateRef<any> | undefined {
    return this.iconSuffixTemplate || this.iconSuffixTemplateChild;
  }
}
