import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

export const NearbyHospitals: React.FC = () => {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          console.error("Geolocation error:", err);
          setError("Please enable location access to find nearby hospitals.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  const fetchHospitals = async () => {
    if (!location) return;
    setLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Find 5 hospitals nearby my current location. Provide their names and addresses.",
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const hospitalData = chunks
        .filter((chunk: any) => chunk.web)
        .map((chunk: any) => ({
          name: chunk.web.title,
          uri: chunk.web.uri,
        }));

      if (hospitalData.length === 0) {
        // Fallback if no specific maps chunks but text response exists
        // In a real scenario, we'd parse the text or rely on the tool
        setError("No specific hospital data found in the response metadata, but here is the AI's response: " + (response.text || "No results."));
      } else {
        setHospitals(hospitalData);
      }
    } catch (err) {
      console.error("Error fetching hospitals:", err);
      setError(`Failed to fetch nearby hospitals. Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location) {
      fetchHospitals();
    }
  }, [location]);

  return (
    <div className="nearby-hospitals">
      <div className="page-head flex items-start justify-between mb-6">
        <div>
          <div className="page-title text-[22px] font-extrabold tracking-tight">Nearby Hospitals</div>
          <div className="page-subtitle text-[13px] text-text-2 mt-0.5">Find medical facilities in your area</div>
        </div>
        <button 
          className="btn btn-primary bg-primary text-white px-4 py-2 rounded-lg text-[13px] font-semibold flex items-center gap-2"
          onClick={fetchHospitals}
          disabled={loading || !location}
        >
          {loading ? "🔄 Searching..." : "🔍 Refresh Search"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm mb-6 flex items-center gap-3">
          <span>⚠️</span> {error}
        </div>
      )}

      {!location && !error && (
        <div className="bg-blue-50 border border-blue-200 text-blue-600 p-4 rounded-xl text-sm mb-6 flex items-center gap-3">
          <span>📍</span> Requesting your location...
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hospitals.map((hospital, idx) => (
          <div key={idx} className="hospital-card bg-white rounded-xl border-1.5 border-border-custom p-5 transition-all hover:border-primary hover:shadow-lg">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-2xl shrink-0">🏥</div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-text-custom mb-1">{hospital.name}</h3>
                <p className="text-[11px] text-text-3 mb-4 line-clamp-2">Hospital / Medical Center</p>
                <a 
                  href={hospital.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                >
                  📍 View on Google Maps
                  <span className="text-[10px]">↗</span>
                </a>
              </div>
            </div>
          </div>
        ))}

        {hospitals.length === 0 && !loading && location && !error && (
          <div className="col-span-full text-center py-12 bg-bg-custom rounded-2xl border border-dashed border-border-custom">
            <div className="text-4xl mb-3">🔍</div>
            <div className="text-sm font-bold text-text-2">No hospitals found in your immediate vicinity.</div>
            <div className="text-xs text-text-3 mt-1">Try refreshing the search or checking your location settings.</div>
          </div>
        )}

        {loading && Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-white rounded-xl border-1.5 border-border-custom p-5 h-32">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl"></div>
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                <div className="h-3 bg-gray-100 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
