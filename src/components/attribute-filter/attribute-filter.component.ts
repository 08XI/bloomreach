import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AttributeFilter, EventProperty, NUMBER_OPERATORS, STRING_OPERATORS } from '../../models/filter.model';
import { CustomSelectComponent } from '../custom-select/custom-select.component';
import { updateAttributeProperty, updateAttributeOperator } from '../../logic/filter.logic';

@Component({
  selector: 'app-attribute-filter',
  templateUrl: './attribute-filter.component.html',
  styleUrl: './attribute-filter.component.css',
  imports: [CommonModule, CustomSelectComponent, FormsModule],
})
export class AttributeFilterComponent {
  attribute = input.required<AttributeFilter>();
  properties = input.required<EventProperty[]>();

  attributeChange = output<AttributeFilter>();
  remove = output<number>();

  propertyNames = computed(() => {
    console.log('Computing propertyNames', this.properties());
    return this.properties().map(p => p.property);
  });

  stringOperators: string[] = STRING_OPERATORS;
  numberOperators: string[] = NUMBER_OPERATORS;

  availableOperators = computed(() => {
    return this.attribute().type === 'number' ? this.numberOperators : this.stringOperators;
  });
  
  onAttributeSelected(propertyName: string): void {
    const newAttribute = updateAttributeProperty(this.attribute(), propertyName, this.properties());
    this.attributeChange.emit(newAttribute);
  }

  onOperatorSelected(operator: string): void {
    const newAttribute = updateAttributeOperator(this.attribute(), operator);
    this.attributeChange.emit(newAttribute);
  }

  onTypeChange(type: 'string' | 'number'): void {
    const currentAttr = this.attribute();
    if (currentAttr.type === type) return;

    const newOperators = type === 'number' ? this.numberOperators : this.stringOperators;
    this.attributeChange.emit({
      ...currentAttr,
      type: type,
      operator: newOperators[0],
      value: type === 'number' ? 0 : '',
      value2: type === 'number' ? 0 : ''
    });
  }

  onValueChange(value: any): void {
    const finalValue = this.attribute().type === 'number' && value !== null && value !== '' ? Number(value) : value;
    this.attributeChange.emit({ ...this.attribute(), value: finalValue });
  }

  onValue2Change(value: any): void {
    const finalValue = this.attribute().type === 'number' && value !== null && value !== '' ? Number(value) : value;
    this.attributeChange.emit({ ...this.attribute(), value2: finalValue });
  }

  emitRemove(): void {
    this.remove.emit(this.attribute().id);
  }
}
