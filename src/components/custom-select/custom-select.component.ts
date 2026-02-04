
import { Component, ChangeDetectionStrategy, input, output, signal, computed, ElementRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrl: './custom-select.component.css',
  imports: [CommonModule, FormsModule],
  host: {
    '(document:click)': 'onClickOutside($event)',
  }
})
export class CustomSelectComponent {
  options = input.required<string[]>();
  placeholder = input<string>('Select an option');
  selectedValue = input<string | null>(null);
  hasTypeSelector = input<boolean>(false);
  selectedType = input<'string' | 'number'>('string');

  selectionChange = output<string>();
  typeChange = output<'string' | 'number'>();

  rootEl = viewChild<ElementRef>('rootEl');

  isOpen = signal(false);
  searchTerm = signal('');

  filteredOptions = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) {
      return this.options();
    }
    return this.options().filter(opt => opt.toLowerCase().includes(term));
  });

  toggleDropdown(): void {
    this.isOpen.update(open => !open);
    if (!this.isOpen()) {
        this.searchTerm.set('');
    }
  }

  selectOption(option: string): void {
    this.selectionChange.emit(option);
    this.isOpen.set(false);
    this.searchTerm.set('');
  }
  
  onClickOutside(event: MouseEvent) {
    if (this.isOpen() && !this.rootEl()?.nativeElement.contains(event.target)) {
        this.isOpen.set(false);
        this.searchTerm.set('');
    }
  }
}
