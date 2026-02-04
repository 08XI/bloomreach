import { TestBed } from '@angular/core/testing';
import { DataService } from './data.service';

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of all event types', () => {
    const events = service.getEvents();
    expect(events.length).toBeGreaterThan(0);
    expect(events).toContain('session_start');
    expect(events).toContain('purchase');
  });

  it('should return properties for a valid event type', () => {
    const properties = service.getEventProperties('purchase');
    expect(properties.length).toBeGreaterThan(0);
    expect(properties.find(p => p.property === 'total_price')?.type).toBe('number');
    expect(properties.find(p => p.property === 'currency')?.type).toBe('string');
  });

  it('should return an empty array for a non-existent event type', () => {
    const properties = service.getEventProperties('non_existent_event');
    expect(properties).toEqual([]);
  });

  it('should return an empty array if event type is null', () => {
    const properties = service.getEventProperties(null);
    expect(properties).toEqual([]);
  });
});
