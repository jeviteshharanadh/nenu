export type AdvisoryDomain =
  | "crop_selection"
  | "disease_pest_diagnosis"
  | "fertilizer_nutrition"
  | "irrigation_water_management"
  | "soil_health"
  | "weather_risk_advisory"
  | "market_post_harvest";

export type AdvisoryStatus = "pending" | "processing" | "completed" | "failed";
export type UrgencyLevel = "low" | "medium" | "high";
export type GrowthStage = "seedling" | "vegetative" | "flowering" | "fruiting" | "maturity";
export type IrrigationMethod = "drip" | "sprinkler" | "flood" | "rainfed" | "manual";

export interface Farm {
  id: string;
  owner_id: string;
  name: string;
  region: string;
  latitude?: number | null;
  longitude?: number | null;
  area_acres: number;
  soil_type: string;
  irrigation_source?: string | null;
  primary_crops: string[];
  created_at: string;
  updated_at: string;
}

export interface AdvisoryRequest {
  id: string;
  farmer_id: string;
  farm_id: string;
  advisory_domain: AdvisoryDomain;
  title: string;
  description: string;
  urgency: UrgencyLevel;
  crop_type?: string | null;
  growth_stage?: GrowthStage | null;
  target_season?: string | null;
  available_water_source?: string | null;
  symptoms_observed?: string[] | null;
  first_noticed_days_ago?: number | null;
  last_fertilizer_applied?: string | null;
  last_applied_days_ago?: number | null;
  current_irrigation_method?: IrrigationMethod | null;
  soil_test_available?: boolean | null;
  soil_ph?: number | null;
  visible_soil_issues?: string[] | null;
  expected_harvest_date?: string | null;
  quantity_estimate_kg?: number | null;
  status: AdvisoryStatus;
  failure_reason?: string | null;
  created_at: string;
  updated_at: string;

  farm?: Farm;
  images?: Array<{ id: string; storage_path: string; mime_type: string }>;
  report?: {
    id: string;
    request_id: string;
    summary: string;
    report_json: any;
    model_name: string;
    language: string;
    generated_at: string;
  };
}
