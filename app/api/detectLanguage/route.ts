import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const langresponse = await fetch(`https://ipinfo.io/${ip}/json?token=${process.env.IPINFO_API_KEY}`);
  const data = await langresponse.json();

  // Extended mapping of country to language
  const countryToLanguage = {
    'US': 'en',
    'FR': 'fr',
    'ES': 'es',
    'DE': 'de',   // Germany - German
    'IT': 'it',   // Italy - Italian
    'JP': 'ja',   // Japan - Japanese
    'CN': 'zh',   // China - Chinese (Mandarin)
    'KR': 'ko',   // South Korea - Korean
    'RU': 'ru',   // Russia - Russian
    'BR': 'pt',   // Brazil - Portuguese
    'IN': 'hi',   // India - Hindi
    'SA': 'ar',   // Saudi Arabia - Arabic
    'MX': 'es',   // Mexico - Spanish
    'CA': 'en',   // Canada - English (default), French (optional)
    'AU': 'en',   // Australia - English
    'NG': 'en',   // Nigeria - English
    'ZA': 'af',   // South Africa - Afrikaans (default), Zulu, etc.
    'SE': 'sv',   // Sweden - Swedish
    'NO': 'no',   // Norway - Norwegian
    'NL': 'nl',   // Netherlands - Dutch
    'TR': 'tr',   // Turkey - Turkish
    'IR': 'fa',   // Iran - Persian
    'TH': 'th',   // Thailand - Thai
    'EG': 'ar',   // Egypt - Arabic
    'VN': 'vi',   // Vietnam - Vietnamese
    'ID': 'id',   // Indonesia - Indonesian
    'GR': 'el',   // Greece - Greek
    'IL': 'he',   // Israel - Hebrew
    'PL': 'pl',   // Poland - Polish
    'PH': 'en',   // Philippines - English (default), Filipino
    // Add more mappings as needed
  };

  const language = countryToLanguage[data.country as keyof typeof countryToLanguage] || 'en'; // Default to English
  console.log(`language: ${language}`);
  return NextResponse.json({ language });
}
