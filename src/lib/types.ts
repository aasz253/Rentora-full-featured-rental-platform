export type UserRole = 'landlord' | 'admin' | 'tenant';

export interface Profile {
  id: string;
  full_name: string;
  phone: string | null;
  role: UserRole;
  banned: boolean;
  banned_at: string | null;
  avatar_url: string | null;
  email_verified: boolean;
  referral_code: string | null;
  referred_by: string | null;
  reward_credits: number;
  created_at: string;
  updated_at: string;
}

export type PropertyType = 'house' | 'apartment' | 'condo' | 'studio' | 'villa';
export type Availability = 'available' | 'booked';

export interface Property {
  id: string;
  landlord_id: string;
  title: string;
  description: string;
  property_type: PropertyType;
  price: number;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  latitude: number | null;
  longitude: number | null;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number | null;
  images: string[];
  amenities: string[];
  availability: Availability;
  instant_book: boolean;
  video_tour_url: string | null;
  matterport_embed: string | null;
  neighborhood_score: number | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  property_id: string;
  tenant_id: string | null;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  move_in_date: string;
  lease_end_date: string | null;
  total_price: number;
  deposit_held: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  booking_reference: string;
  payment_intent_id: string | null;
  instant_book: boolean;
  created_at: string;
  properties?: Property;
}

export interface ChatMessage {
  id: string;
  sender_name: string;
  sender_email: string | null;
  message: string;
  is_admin: boolean;
  created_at: string;
}

export interface PropertyFilters {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: PropertyType;
}

export interface VisitorRecord {
  id: string;
  visitor_id: string;
  page_url: string;
  referrer: string | null;
  user_agent: string | null;
  visited_at: string;
}

export interface SavedSearch {
  id: string;
  user_id: string;
  search_params: Record<string, any>;
  email_alerts: boolean;
  last_alert_sent_at: string | null;
  created_at: string;
}

export interface Review {
  id: string;
  property_id: string;
  user_id: string | null;
  guest_name: string;
  guest_email: string | null;
  rating: number;
  comment: string;
  is_verified: boolean;
  is_flagged: boolean;
  blockchain_hash: string | null;
  created_at: string;
}

export interface MaintenanceRequest {
  id: string;
  property_id: string;
  tenant_id: string | null;
  guest_email: string | null;
  issue_description: string;
  priority: 'low' | 'medium' | 'high' | 'emergency';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  image_urls: string[];
  assigned_contractor: string | null;
  notes: string | null;
  created_at: string;
  resolved_at: string | null;
  properties?: Property;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referee_email: string;
  referee_name: string | null;
  status: 'pending' | 'joined' | 'rewarded' | 'expired';
  reward_amount: number;
  reward_issued: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'booking' | 'review' | 'maintenance' | 'referral' | 'alert';
  title: string;
  message: string;
  is_read: boolean;
  data: Record<string, any> | null;
  created_at: string;
}

export type PaymentMethod = 'mpesa' | 'paypal' | 'bank_transfer'

export interface Payment {
  id: string;
  booking_id: string;
  amount: number;
  type: 'deposit' | 'rent' | 'fee';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: PaymentMethod;
  payment_ref: string | null;
  mpesa_phone: string | null;
  mpesa_receipt: string | null;
  paypal_order_id: string | null;
  bank_account_name: string | null;
  bank_transfer_ref: string | null;
  proof_image_url: string | null;
  stripe_payment_id: string | null;
  created_at: string;
}

export interface MpesaRequest {
  phone: string;
  amount: number;
  account_ref: string;
}

export interface MpesaResponse {
  success: boolean;
  merchantRequestId: string;
  checkoutRequestId: string;
  responseDescription: string;
  customerMessage: string;
}

export interface PayPalOrderRequest {
  amount: number;
  bookingRef: string;
}

export interface BankTransferDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  branchCode: string;
  swiftCode: string;
  reference: string;
}

export interface DashboardStats {
  totalProperties: number;
  totalLandlords: number;
  totalBookings: number;
  totalVisitors: number;
  revenue: number;
  availableProperties: number;
  bookedProperties: number;
  bannedLandlords: number;
}
