export interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'user';
  selected_charity_id: string | null;
  charity_contribution_pct: number;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  status: 'active' | 'inactive' | 'past_due' | 'canceled' | 'trialing';
  plan_type: 'monthly' | 'yearly' | null;
  current_period_start: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface Score {
  id: string;
  user_id: string;
  score: number;
  played_date: string;
  created_at: string;
}

export interface Charity {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  website_url: string | null;
  featured_status: boolean;
  created_at: string;
  updated_at: string;
}

export interface Draw {
  id: string;
  month: string;
  winning_numbers: number[];
  type: 'random' | 'algorithmic';
  status: 'simulation' | 'published';
  total_pool: number;
  rollover_amount: number;
  charity_total: number;
  created_at: string;
  updated_at: string;
}

export interface Winner {
  id: string;
  draw_id: string;
  user_id: string;
  match_tier: 3 | 4 | 5;
  prize_share: number;
  proof_image_url: string | null;
  verification_status: 'pending' | 'approved' | 'rejected';
  payout_status: 'pending' | 'paid' | 'failed';
  created_at: string;
  updated_at: string;
  users?: User;
  draws?: Draw;
}

export interface DrawSimulationResult {
  draw: Partial<Draw>;
  winners: {
    user_id: string;
    email: string;
    matched_numbers: number[];
    match_tier: number;
    prize_share: number;
  }[];
  pool_breakdown: {
    total_revenue: number;
    charity_total: number;
    prize_pool: number;
    tier5_pool: number;
    tier4_pool: number;
    tier3_pool: number;
    rollover: number;
  };
}
