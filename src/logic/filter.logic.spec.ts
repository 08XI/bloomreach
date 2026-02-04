import { EventProperty, FunnelStep } from '../models/filter.model';
import {
    createInitialStep,
    duplicateStep,
    updateAttributeOperator,
    updateAttributeProperty,
    updateStepEvent
} from './filter.logic';

describe('Filter Logic Combinations', () => {
  const mockProperties: EventProperty[] = [
    { property: 'string_prop', type: 'string' },
    { property: 'number_prop', type: 'number' }
  ];

  describe('Step Management', () => {
    it('should create initial step with first event', () => {
      const events = ['event1', 'event2'];
      const step = createInitialStep(events, 1);
      expect(step.id).toBe(1);
      expect(step.selectedEvent).toBe('event1');
    });

    it('should clear attributes when event changes', () => {
      const step: FunnelStep = {
        id: 1,
        stepName: 'Test',
        isNameEditing: false,
        selectedEvent: 'event1',
        attributes: [{ id: 101, attribute: 'prop', operator: 'eq', value: 'val', type: 'string' }]
      };
      const updated = updateStepEvent(step, 'event2');
      expect(updated.selectedEvent).toBe('event2');
      expect(updated.attributes.length).toBe(0);
    });

    it('should correctly duplicate step with new ID', () => {
      const step: FunnelStep = {
        id: 1,
        stepName: 'Test',
        isNameEditing: false,
        selectedEvent: 'event1',
        attributes: [{ id: 101, attribute: 'prop', operator: 'eq', value: 'val', type: 'string' }]
      };
      const duplicated = duplicateStep(step, 2);
      expect(duplicated.id).toBe(2);
      expect(duplicated.attributes[0].id).toBe(101); // Internal objects are copied
      expect(duplicated).not.toBe(step);
    });
  });

  describe('Attribute Property Combinations', () => {
    it('should set default string operator and value when string property selected', () => {
      const attr = { id: 1, attribute: null, operator: null, value: '', type: null };
      const updated = updateAttributeProperty(attr, 'string_prop', mockProperties);
      
      expect(updated.type).toBe('string');
      expect(updated.operator).toBe('equals');
      expect(updated.value).toBe('');
    });

    it('should set default number operator and numeric zero when number property selected', () => {
      const attr = { id: 1, attribute: null, operator: null, value: '', type: null };
      const updated = updateAttributeProperty(attr, 'number_prop', mockProperties);
      
      expect(updated.type).toBe('number');
      expect(updated.operator).toBe('equal to');
      expect(updated.value).toBe(0);
    });
  });

  describe('Operator and Type Combinations', () => {
    it('should handle "in between" operator for numbers (requires two values)', () => {
      const attr = { id: 1, attribute: 'number_prop', operator: 'equal to', value: 0, type: 'number' as const };
      const updated = updateAttributeOperator(attr, 'in between');
      
      expect(updated.operator).toBe('in between');
      expect(updated.value).toBe(0);
      expect(updated.value2).toBe(0);
    });

    it('should reset value2 when switching away from "in between"', () => {
      const attr = { id: 1, attribute: 'number_prop', operator: 'in between', value: 10, value2: 20, type: 'number' as const };
      const updated = updateAttributeOperator(attr, 'less than');
      
      expect(updated.operator).toBe('less than');
      expect(updated.value2).toBeUndefined();
    });

    it('should maintain numeric 0 for number types when changing normal operators', () => {
      const attr = { id: 1, attribute: 'number_prop', operator: 'equal to', value: 5, type: 'number' as const };
      const updated = updateAttributeOperator(attr, 'greater than');
      
      expect(updated.value).toBe(0); // Currently resets to 0 in logic, but verifies it's numeric 0
    });
  });

  describe('Data Integrity Combinations', () => {
    it('should allow empty value for string but not for number', () => {
      const stringAttr = updateAttributeProperty({ id: 1, attribute: null, operator: null, value: 'old', type: null }, 'string_prop', mockProperties);
      const numberAttr = updateAttributeProperty({ id: 2, attribute: null, operator: null, value: 'old', type: null }, 'number_prop', mockProperties);
      
      expect(stringAttr.value).toBe('');
      expect(numberAttr.value).toBe(0);
    });
  });
});
