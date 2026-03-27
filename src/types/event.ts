export interface EventRecord {
  id: number;
  user_id: number;
  title: string;
  description: string;
  category: string | null;
  location: string | null;
  event_date: string;
  image_url: string | null;
  status: 'active' | 'cancelled';
  created_at: string;
}

export interface CreateEventRequest {
  user_id: number;
  title: string;
  description: string;
  category?: string;
  location?: string;
  event_date: string;
  status?: 'active' | 'cancelled';
}
