'use client';

import { useState } from 'react';

const INDIAN_LANGUAGES = [
  { code: 'hi', name: 'Hindi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'bn', name: 'Bengali' },
  { code: 'kn', name: 'Kannada' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'mr', name: 'Marathi' },
  { code: 'or', name: 'Odia' },
];

interface LanguageFilterProps {
  onLanguageChange: (language: string) => void;
}

export default function LanguageFilter({ onLanguageChange }: LanguageFilterProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('all');

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    onLanguageChange(language);
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">Filter by Language</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleLanguageChange('all')}
          className={`px-3 py-1 rounded-full text-sm ${
            selectedLanguage === 'all'
              ? 'bg-primary text-white'
              : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          All Languages
        </button>
        {INDIAN_LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedLanguage === lang.code
                ? 'bg-primary text-white'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            {lang.name}
          </button>
        ))}
      </div>
    </div>
  );
} 