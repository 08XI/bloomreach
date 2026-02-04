
import { Injectable, signal, computed } from '@angular/core';
import { Event, EventProperty } from '../models/filter.model';

@Injectable({ providedIn: 'root' })
export class DataService {
  private data = signal<Event[]>([
    {
      "type": "session_start",
      "properties": [
        { "property": "activity", "type": "string" },
        { "property": "browser", "type": "string" },
        { "property": "cookie", "type": "string" },
        { "property": "device", "type": "string" },
        { "property": "location", "type": "string" },
        { "property": "os", "type": "string" },
        { "property": "path", "type": "string" },
        { "property": "referrer", "type": "string" },
        { "property": "ip", "type": "string" },
        { "property": "country", "type": "string" },
        { "property": "state", "type": "string" },
        { "property": "city", "type": "string" },
        { "property": "latitude", "type": "number" },
        { "property": "longitude", "type": "number" }
      ]
    },
    {
      "type": "session_end",
      "properties": [
        { "property": "activity", "type": "string" },
        { "property": "browser", "type": "string" },
        { "property": "cookie", "type": "string" },
        { "property": "device", "type": "string" },
        { "property": "location", "type": "string" },
        { "property": "os", "type": "string" },
        { "property": "path", "type": "string" },
        { "property": "referrer", "type": "string" },
        { "property": "created", "type": "number" },
        { "property": "last_update", "type": "number" },
        { "property": "duration", "type": "number" },
        { "property": "ip", "type": "string" },
        { "property": "country", "type": "string" },
        { "property": "state", "type": "string" },
        { "property": "city", "type": "string" },
        { "property": "latitude", "type": "number" },
        { "property": "longitude", "type": "number" }
      ]
    },
    {
      "type": "page_visit",
      "properties": [
        { "property": "browser", "type": "string" },
        { "property": "device", "type": "string" },
        { "property": "location", "type": "string" },
        { "property": "os", "type": "string" },
        { "property": "path", "type": "string" },
        { "property": "referrer", "type": "string" }
      ]
    },
    {
      "type": "purchase",
      "properties": [
        { "property": "purchase_status", "type": "string" },
        { "property": "total_price", "type": "number" },
        { "property": "product_list", "type": "string" },
        { "property": "product_ids", "type": "string" },
        { "property": "voucher", "type": "string" },
        { "property": "discount_value", "type": "number" },
        { "property": "currency", "type": "string" },
        { "property": "payment_method", "type": "string" },
        { "property": "purchase_id", "type": "string" },
        { "property": "purchase_source_type", "type": "string" }
      ]
    },
    {
      "type": "cart_update",
      "properties": [
        { "property": "product_id", "type": "string" },
        { "property": "variant_id", "type": "string" },
        { "property": "category_level_1", "type": "string" },
        { "property": "category_level_2", "type": "string" },
        { "property": "category_level_3", "type": "string" },
        { "property": "product_list", "type": "string" },
        { "property": "action", "type": "string" }
      ]
    },
    {
      "type": "view_item",
      "properties": [
        { "property": "product_id", "type": "string" },
        { "property": "variant_id", "type": "string" },
        { "property": "category_level_1", "type": "string" },
        { "property": "category_level_2", "type": "string" },
        { "property": "category_level_3", "type": "string" }
      ]
    }
  ]);

  getEvents = computed(() => this.data().map(e => e.type));

  getEventProperties(eventType: string | null): EventProperty[] {
    if (!eventType) return [];
    const event = this.data().find(e => e.type === eventType);
    return event ? event.properties : [];
  }
}
