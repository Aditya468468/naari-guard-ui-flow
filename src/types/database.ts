// Temporary database types until Supabase auto-generates the types
export interface TrustCircleContact {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  email?: string | null;
  relationship?: string | null;
  is_emergency_contact: boolean;
  is_sharing: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
}

export interface AudioRecording {
  id: string;
  user_id: string;
  duration: string;
  file_path: string;
  detected_keywords: string[];
  date: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CabRide {
  id: string;
  user_id: string;
  driver_name: string;
  vehicle_number: string;
  cab_company: string;
  source_location: string;
  destination_location: string;
  auto_fetched: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}