import React from 'react';
import { LanguageSelectorContainer } from './styles';

export default function LanguageSelector({ currentLanguage, onChangeLanguage }) {
  const languages = {
    en: 'English',
    fr: 'Français',
    es: 'Español',
    de: 'Deutsch',   // German
    it: 'Italiano',  // Italian
    ja: '日本語',     // Japanese
    zh: '中文',       // Chinese (Mandarin)
    ko: '한국어',     // Korean
    ru: 'Русский',   // Russian
    pt: 'Português', // Portuguese
    hi: 'हिन्दी',    // Hindi
    ar: 'العربية',   // Arabic
    af: 'Afrikaans', // Afrikaans
    sv: 'Svenska',   // Swedish
    no: 'Norsk',     // Norwegian
    nl: 'Nederlands',// Dutch
    tr: 'Türkçe',    // Turkish
    fa: 'فارسی',     // Persian
    th: 'ไทย',       // Thai
    vi: 'Tiếng Việt',// Vietnamese
    id: 'Bahasa Indonesia', // Indonesian
    el: 'Ελληνικά',  // Greek
    he: 'עברית',     // Hebrew
    pl: 'Polski',    // Polish
  };

  return (
    <LanguageSelectorContainer>
      <label htmlFor="language-select">Select Language: </label>
      <select
        id="language-select"
        value={currentLanguage}
        onChange={(e) => onChangeLanguage(e.target.value)}
      >
        {Object.entries(languages).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    </LanguageSelectorContainer>
  );
} 