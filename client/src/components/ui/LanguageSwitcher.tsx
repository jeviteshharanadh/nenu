import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Languages } from "lucide-react";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी (Hindi)" },
  { code: "te", label: "తెలుగు (Telugu)" },
  { code: "ta", label: "தமிழ் (Tamil)" },
  { code: "mr", label: "मराठी (Marathi)" },
  { code: "pa", label: "ਪੰਜਾਬੀ (Punjabi)" },
  { code: "bn", label: "বাংলা (Bengali)" },
  { code: "es", label: "Español (Spanish)" },
];

export const LanguageSwitcher: React.FC = () => {
  const { profile, updateLanguage } = useAuth();
  const currentLang = profile?.preferred_language || "en";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateLanguage(e.target.value);
  };

  return (
    <div className="relative flex items-center space-x-1 bg-slate-900/80 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs">
      <Languages className="w-4 h-4 text-agri-400 flex-shrink-0" />
      <select
        value={currentLang}
        onChange={handleChange}
        className="bg-transparent text-slate-200 focus:outline-none cursor-pointer text-xs pr-1 font-medium"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-200">
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;
