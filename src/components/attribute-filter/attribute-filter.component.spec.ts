import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { AttributeFilterComponent } from './attribute-filter.component';
import { AttributeFilter, EventProperty } from '../../models/filter.model';

@Component({
  template: `
    <app-attribute-filter
      [attribute]="attribute"
      [properties]="properties"
      (attributeChange)="onAttributeChange($event)">
    </app-attribute-filter>
  `,
  imports: [AttributeFilterComponent]
})
class TestHostComponent {
  attribute!: AttributeFilter;
  properties: EventProperty[] = [];
  emittedAttribute: AttributeFilter | undefined;

  onAttributeChange(val: AttributeFilter) {
    this.emittedAttribute = val;
  }
}

describe('AttributeFilterComponent', () => {
  let hostComponent: TestHostComponent;
  let component: AttributeFilterComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  const mockProperties: EventProperty[] = [
    { property: 'os', type: 'string' },
    { property: 'duration', type: 'number' }
  ];

  const mockAttribute: AttributeFilter = {
    id: 1,
    attribute: 'os',
    operator: 'equals',
    value: 'Windows',
    type: 'string'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, AttributeFilterComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    
    // Set initial inputs
    hostComponent.attribute = { ...mockAttribute };
    hostComponent.properties = [...mockProperties];
    
    fixture.detectChanges(); // Trigger binding
    
    // Get child component
    component = fixture.debugElement.query(By.directive(AttributeFilterComponent)).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should provide string operators for string type', () => {
    const operators = component.availableOperators();
    expect(operators).toContain('equals');
    expect(operators).not.toContain('greater than');
  });

  it('should switch operators when type changes via onTypeChange', () => {
    component.onTypeChange('number');
    
    expect(hostComponent.emittedAttribute).toBeDefined();
    expect(hostComponent.emittedAttribute?.type).toBe('number');
    expect(hostComponent.emittedAttribute?.operator).toBe('equal to'); 
    expect(hostComponent.emittedAttribute?.value).toBe(0); 
  });

  it('should emit correct value when onValueChange is called for numbers', () => {
    // Update input via host
    hostComponent.attribute = { ...mockAttribute, type: 'number' };
    fixture.detectChanges();
    
    component.onValueChange('42'); 
    expect(hostComponent.emittedAttribute?.value).toBe(42); 
  });

  it('should handle "in between" operator by showing second input', () => {
     hostComponent.attribute = { ...mockAttribute, operator: 'in between', type: 'number' };
     fixture.detectChanges();
     
     const compiled = fixture.debugElement.query(By.directive(AttributeFilterComponent)).nativeElement as HTMLElement;
     const inputs = compiled.querySelectorAll('input');
     expect(inputs.length).toBe(2);
  });
});
