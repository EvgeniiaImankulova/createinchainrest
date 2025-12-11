import { Component, Output, EventEmitter, Input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'resto-custom-autocomplete-footer',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './resto-custom-autocomplete-footer.component.html',
  styleUrl: './resto-custom-autocomplete-footer.component.css'
})
export class RestoCustomAutocompleteFooterComponent {
  @Input() closeOnClick: boolean = false;
  @Output() footerClick = new EventEmitter<void>();

  @HostListener('click', ['$event'])
  onClick(event: Event): void {
    event.stopPropagation();
    this.footerClick.emit();
  }
}
