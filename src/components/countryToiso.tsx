let MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

// ISO to country name mapping for reverse lookup
const ISO_TO_COUNTRY: Record<string, string> = {
  "MULTINACIONAL": "Multinacional",
  "US": "United States", "GB": "United Kingdom", "CA": "Canada", "AU": "Australia",
  "DE": "Germany", "FR": "France", "JP": "Japan", "IN": "India", "BR": "Brazil",
  "MX": "Mexico", "ES": "Spain", "IT": "Italy", "KR": "South Korea", "RU": "Russia",
  "CN": "China", "NL": "Netherlands", "SE": "Sweden", "NO": "Norway", "CH": "Switzerland",
  "AT": "Austria", "BE": "Belgium", "DK": "Denmark", "FI": "Finland", "PL": "Poland",
  "CZ": "Czechia", "HU": "Hungary", "RO": "Romania", "GR": "Greece", "PT": "Portugal",
  "IE": "Ireland", "ZA": "South Africa", "EG": "Egypt", "NG": "Nigeria", "KE": "Kenya",
  "AR": "Argentina", "CL": "Chile", "CO": "Colombia", "PE": "Peru", "VE": "Venezuela",
  "TR": "Turkey", "SA": "Saudi Arabia", "AE": "United Arab Emirates", "IL": "Israel",
  "IR": "Iran", "PK": "Pakistan", "BD": "Bangladesh", "TH": "Thailand", "MY": "Malaysia",
  "SG": "Singapore", "PH": "Philippines", "ID": "Indonesia", "VN": "Vietnam", "TW": "Taiwan",
  "HK": "Hong Kong", "MM": "Myanmar", "LK": "Sri Lanka", "NP": "Nepal", "AF": "Afghanistan",
  "IQ": "Iraq", "SY": "Syria", "JO": "Jordan", "LB": "Lebanon", "PS": "Palestine",
  "KW": "Kuwait", "QA": "Qatar", "BH": "Bahrain", "OM": "Oman", "YE": "Yemen",
  "CR": "Costa Rica", "DO": "Dominican Republic", "CU": "Cuba", "PA": "Panama",
  "GT": "Guatemala", "HN": "Honduras", "SV": "El Salvador", "NI": "Nicaragua",
  "BZ": "Belize", "JM": "Jamaica", "HT": "Haiti", "TT": "Trinidad and Tobago",
  "LC": "Saint Lucia", "BB": "Barbados", "AG": "Antigua and Barbuda", "DM": "Dominica",
  "GD": "Grenada", "VC": "Saint Vincent and the Grenadines", "KN": "Saint Kitts and Nevis",
  "GY": "Guyana", "SR": "Suriname", "EC": "Ecuador", "BO": "Bolivia", "UY": "Uruguay",
  "PY": "Paraguay", "CW": "Curaçao", "AW": "Aruba", "BM": "Bermuda", "MU": "Mauritius",
  "SC": "Seychelles", "MG": "Madagascar", "MW": "Malawi", "ZM": "Zambia", "ZW": "Zimbabwe",
  "BW": "Botswana", "NA": "Namibia", "AO": "Angola", "CG": "Congo", "GA": "Gabon",
  "GH": "Ghana", "CI": "Côte d'Ivoire", "SN": "Senegal", "MA": "Morocco", "DZ": "Algeria",
  "TN": "Tunisia", "LY": "Libya", "SD": "Sudan", "ET": "Ethiopia", "UG": "Uganda",
  "TZ": "Tanzania", "MZ": "Mozambique", "LV": "Latvia", "LT": "Lithuania", "EE": "Estonia",
  "BG": "Bulgaria", "HR": "Croatia", "SI": "Slovenia", "SK": "Slovakia", "MD": "Moldova",
  "UA": "Ukraine", "BY": "Belarus", "KZ": "Kazakhstan", "UZ": "Uzbekistan", "TJ": "Tajikistan",
  "KG": "Kyrgyzstan", "TM": "Turkmenistan", "MN": "Mongolia", "LA": "Laos", "KH": "Cambodia",
  "BT": "Bhutan", "MV": "Maldives", "BN": "Brunei", "TL": "Timor-Leste", "FM": "Micronesia",
  "MH": "Marshall Islands", "PW": "Palau", "NC": "New Caledonia", "FJ": "Fiji",
  "WS": "Samoa", "KI": "Kiribati", "TO": "Tonga", "NZ": "New Zealand", "SB": "Solomon Islands",
  "VU": "Vanuatu", "PF": "French Polynesia", "GU": "Guam", "VI": "US Virgin Islands",
  "AS": "American Samoa", "MP": "Northern Mariana Islands", "PR": "Puerto Rico",
};

export async function countryNameToIso(name) {
    const resp = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(name)}.json?types=country&access_token=${MAPBOX_ACCESS_TOKEN}`);
    const data = await resp.json();
    if (data.features && data.features.length > 0) {
      const feat = data.features[0];
      // sometimes in feat.properties or feat.context you'll find iso codes
      // or feat.properties.iso_3166_1, etc.
      return feat.properties.short_code.toUpperCase() || null;
    }
    return null;
}

export function isoToCountryName(isoCode: string): string | null {
  return ISO_TO_COUNTRY[isoCode.toUpperCase()] || null;
}