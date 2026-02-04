
export interface EventProperty {
  property: string;
  type: 'string' | 'number';
}

export interface Event {
  type: string;
  properties: EventProperty[];
}

export interface AttributeFilter {
  id: number;
  attribute: string | null;
  operator: string | null;
  value: string | number;
  value2?: string | number;
  type: 'string' | 'number' | null;
}

export interface FunnelStep {
  id: number;
  stepName: string;
  isNameEditing: boolean;
  selectedEvent: string | null;
  attributes: AttributeFilter[];
}
