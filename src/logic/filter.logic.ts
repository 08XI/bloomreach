import { FunnelStep, AttributeFilter, EventProperty } from '../models/filter.model';

// --- Funnel Step Logic ---

export function createInitialStep(events: string[], nextId: number): FunnelStep {
  const newStep = createNextStep(nextId);
  const firstEvent = events[0];
  if (firstEvent) {
    newStep.selectedEvent = firstEvent;
  }
  return newStep;
}

export function createNextStep(nextId: number): FunnelStep {
  return {
    id: nextId,
    stepName: 'Unnamed step',
    isNameEditing: false,
    selectedEvent: null,
    attributes: [],
  };
}

export function duplicateStep(step: FunnelStep, nextId: number): FunnelStep {
  // Deep copy to avoid shared references, especially for attributes array
  const newStep = JSON.parse(JSON.stringify(step));
  newStep.id = nextId;
  return newStep;
}

export function updateStepEvent(step: FunnelStep, eventName: string): FunnelStep {
  return {
    ...step,
    selectedEvent: eventName,
    attributes: [] // Reset attributes when event changes
  };
}

export function addAttributeToStep(step: FunnelStep, nextAttrId: number): FunnelStep {
  const newAttribute = createInitialAttribute(nextAttrId);
  return {
    ...step,
    attributes: [...step.attributes, newAttribute]
  };
}

export function updateAttributeInStep(step: FunnelStep, updatedAttribute: AttributeFilter, index: number): FunnelStep {
  const newAttributes = [...step.attributes];
  newAttributes[index] = updatedAttribute;
  return {
    ...step,
    attributes: newAttributes
  };
}

export function removeAttributeFromStep(step: FunnelStep, attributeId: number): FunnelStep {
  return {
    ...step,
    attributes: step.attributes.filter(attr => attr.id !== attributeId)
  };
}


// --- Attribute Filter Logic ---

export function createInitialAttribute(id: number): AttributeFilter {
  return {
    id: id,
    attribute: null,
    operator: null,
    value: '',
    type: null,
  };
}

export function updateAttributeProperty(
  attribute: AttributeFilter,
  propertyName: string,
  properties: EventProperty[]
): AttributeFilter {
  const prop = properties.find(p => p.property === propertyName);
  const propType = prop ? prop.type : null;
  const newOperator = propType === 'number' ? 'equal to' : 'equals';

  return {
    ...attribute,
    attribute: propertyName,
    type: propType,
    operator: newOperator,
    value: propType === 'number' ? 0 : '',
    value2: undefined
  };
}

export function updateAttributeOperator(
  attribute: AttributeFilter,
  operator: string,
): AttributeFilter {
  const isNumber = attribute.type === 'number';
  const needsTwoValues = operator === 'in between';
  return {
    ...attribute,
    operator,
    value: needsTwoValues ? 0 : (isNumber ? 0 : ''),
    value2: needsTwoValues ? 0 : undefined
  };
}
