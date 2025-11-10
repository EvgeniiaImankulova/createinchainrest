import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-image-uploader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-uploader.component.html',
  styleUrl: './image-uploader.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageUploaderComponent),
      multi: true
    }
  ]
})
export class ImageUploaderComponent implements ControlValueAccessor {
  @Input() accept = 'image/*';
  @Input() maxSize = 5 * 1024 * 1024;
  @Output() fileChange = new EventEmitter<File | null>();

  imagePreview: string | null = null;
  fileName: string | null = null;
  isDragging = false;

  private onChange: (value: File | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: File | null): void {
    if (value) {
      this.loadImagePreview(value);
    } else {
      this.clearImage();
    }
  }

  registerOnChange(fn: (value: File | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  private handleFile(file: File): void {
    if (!file.type.match(this.accept.replace('*', '.*'))) {
      console.error('Invalid file type');
      return;
    }

    if (file.size > this.maxSize) {
      console.error('File size exceeds maximum');
      return;
    }

    this.loadImagePreview(file);
    this.onChange(file);
    this.onTouched();
    this.fileChange.emit(file);
  }

  private loadImagePreview(file: File): void {
    this.fileName = file.name;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  clearImage(): void {
    this.imagePreview = null;
    this.fileName = null;
    this.onChange(null);
    this.fileChange.emit(null);
  }

  triggerFileInput(fileInput: HTMLInputElement): void {
    fileInput.click();
  }
}
