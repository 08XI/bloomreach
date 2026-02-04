import { Component, ChangeDetectionStrategy, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FunnelStepComponent } from './components/funnel-step/funnel-step.component';
import { DataService } from './services/data.service';
import { FunnelStep } from './models/filter.model';
import { createInitialStep, createNextStep, duplicateStep } from './logic/filter.logic';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FunnelStepComponent],
})
export class AppComponent {
  private dataService = inject(DataService);
  private nextId = 1;

  funnelSteps = signal<FunnelStep[]>([]);
  allEvents = this.dataService.getEvents();
  
  constructor() {
    this.initializeFirstStep();
  }

  private initializeFirstStep(): void {
    this.funnelSteps.set([createInitialStep(this.allEvents, this.nextId++)]);
  }

  addFunnelStep(): void {
    this.funnelSteps.update(steps => [...steps, createNextStep(this.nextId++)]);
  }

  updateFunnelStep(updatedStep: FunnelStep, index: number): void {
    this.funnelSteps.update(steps => {
      const newSteps = [...steps];
      newSteps[index] = updatedStep;
      return newSteps;
    });
  }

  removeFunnelStep(id: number): void {
    this.funnelSteps.update(steps => steps.filter(step => step.id !== id));
    if (this.funnelSteps().length === 0) {
      this.initializeFirstStep();
    }
  }

  duplicateFunnelStep(stepToDuplicate: FunnelStep): void {
     this.funnelSteps.update(steps => {
        return [...steps, duplicateStep(stepToDuplicate, this.nextId++)];
     });
  }
  
  discardFilters(): void {
    this.initializeFirstStep();
  }

  applyFilters(): void {
    console.log("Applying filters:", JSON.parse(JSON.stringify(this.funnelSteps())));
    alert("Filter configuration has been logged to the console.");
  }
}
