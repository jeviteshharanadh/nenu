import { supabaseAdmin } from "../db/supabase";

export interface WeatherData {
  temperature_c: number;
  humidity_pct: number;
  condition: string;
  rainfall_forecast_mm: number;
  pest_risk: "low" | "medium" | "high";
  summary: string;
}

export async function getWeatherContext(region: string): Promise<WeatherData> {
  const normalizedRegion = region.trim().toLowerCase();

  try {
    // Check database cache first
    const { data: cached } = await supabaseAdmin
      .from("weather_cache")
      .select("payload, fetched_at")
      .eq("region", normalizedRegion)
      .single();

    if (cached && cached.payload) {
      const fetchedTime = new Date(cached.fetched_at).getTime();
      const now = new Date().getTime();
      // Cache valid for 3 hours
      if (now - fetchedTime < 3 * 60 * 60 * 1000) {
        return cached.payload as WeatherData;
      }
    }

    // Generate weather context (simulated regional weather model)
    const mockWeather: WeatherData = {
      temperature_c: Math.floor(Math.random() * 10) + 24, // 24 - 34°C
      humidity_pct: Math.floor(Math.random() * 30) + 55,  // 55 - 85%
      condition: Math.random() > 0.4 ? "Partly Cloudy with Scattered Showers" : "Sunny & Dry",
      rainfall_forecast_mm: Math.floor(Math.random() * 25),
      pest_risk: Math.random() > 0.5 ? "high" : "medium",
      summary: `Region ${region}: 28°C avg, moderate humidity, 40% probability of rain in next 48h.`,
    };

    // Upsert into weather cache using service role
    await supabaseAdmin
      .from("weather_cache")
      .upsert(
        {
          region: normalizedRegion,
          fetched_at: new Date().toISOString(),
          payload: mockWeather,
        },
        { onConflict: "region" }
      );

    return mockWeather;
  } catch (err) {
    console.error("Weather service error:", err);
    return {
      temperature_c: 28,
      humidity_pct: 65,
      condition: "Seasonal Normal",
      rainfall_forecast_mm: 10,
      pest_risk: "medium",
      summary: `Region ${region}: Standard seasonal weather conditions.`,
    };
  }
}
