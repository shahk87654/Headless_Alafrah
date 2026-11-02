export interface OrderTrackingInfo {
  company: string | null;
  number: string | null;
  url: string | null;
}

export interface TrackedOrder {
  name: string;
  displayFulfillmentStatus: string;
  processedAt: string | null;
  trackingInfo: OrderTrackingInfo[];
}
