'use client';

interface LanguageFilterProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

const languages = [
  { code: 'all', name: 'All Languages' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'bn', name: 'Bengali' },
  { code: 'kn', name: 'Kannada' },
];

export default function LanguageFilter({ selectedLanguage, onLanguageChange }: LanguageFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => onLanguageChange(lang.code)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
            ${selectedLanguage === lang.code
              ? 'bg-primary text-white'
              : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
            }`}
        >
          {lang.name}
        </button>
      ))}
    </div>
  );
} 