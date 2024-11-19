import { Languages } from 'lucide-react';

interface TranslationDropdownProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'zh', name: '中文' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
];

export default function TranslationDropdown({ selectedLanguage, onLanguageChange }: TranslationDropdownProps) {
  return (
    <div className="flex items-center space-x-2">
      <Languages className="w-4 h-4 text-gray-500" />
      <select
        value={selectedLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="form-select rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}