import { Component, ChangeDetectionStrategy, input, output, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FunnelStep, AttributeFilter, EventProperty } from '../../models/filter.model';
import { DataService } from '../../services/data.service';
import { AttributeFilterComponent } from '../attribute-filter/attribute-filter.component';
import { CustomSelectComponent } from '../custom-select/custom-select.component';
import { 
  updateStepEvent, 
  addAttributeToStep, 
  updateAttributeInStep, 
  removeAttributeFromStep 
} from '../../logic/filter.logic';

@Component({
  selector: 'app-funnel-step',
  templateUrl: './funnel-step.component.html',
  styleUrl: './funnel-step.component.css',
  imports: [CommonModule, AttributeFilterComponent, CustomSelectComponent],
})
export class FunnelStepComponent {
  step = input.required<FunnelStep>();
  stepIndex = input.required<number>();
  allEvents = input.required<string[]>();

  stepChange = output<FunnelStep>();
  remove = output<number>();
  duplicate = output<FunnelStep>();

  private dataService = inject(DataService);
  private nextAttrId = signal(0);
  
  availableProperties = computed<EventProperty[]>(() => {
    return this.dataService.getEventProperties(this.step().selectedEvent);
  });

  onEventSelect(eventName: string): void {
    const newStep = updateStepEvent(this.step(), eventName);
    this.stepChange.emit(newStep);
  }

  addAttributeFilter(): void {
    const id = this.nextAttrId();
    this.nextAttrId.update(n => n + 1);
    const newStep = addAttributeToStep(this.step(), id);
    this.stepChange.emit(newStep);
  }

  updateAttribute(updatedAttribute: AttributeFilter, index: number): void {
    const newStep = updateAttributeInStep(this.step(), updatedAttribute, index);
    this.stepChange.emit(newStep);
  }

  removeAttribute(id: number): void {
    const newStep = removeAttributeFromStep(this.step(), id);
    this.stepChange.emit(newStep);
  }
  
  emitRemove() {
    this.remove.emit(this.step().id);
  }
  
  emitDuplicate() {
    this.duplicate.emit(this.step());
  }
}
