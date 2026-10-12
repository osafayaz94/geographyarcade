// Corrections to the world-countries dataset, used everywhere on the site.
module.exports = {
  // Currencies in use, main one first (ISO 4217 code -> English name for codes Intl may not know).
  currencies: {
    CU: [['CUP', 'Cuban Peso']], // the convertible peso (CUC) was withdrawn in 2021
    PS: [['ILS', 'Israeli New Shekel'], ['JOD', 'Jordanian Dinar'], ['EGP', 'Egyptian Pound']], // the shekel is the main one in use
    ZW: [['ZWG', 'Zimbabwe Gold'], ['USD', 'US Dollar']], // ZiG since 2024; the dataset lists every currency accepted, alphabetically
  },
  // Official languages (ISO 639-3 code -> English name).
  languages: {
    CH: { deu: 'German', fra: 'French', ita: 'Italian', roh: 'Romansh' }, // the dataset has Swiss German; the official language is standard German
    // The dataset mixes in regional, national or creole languages that are not official:
    AT: { deu: 'German' }, // dataset: Austro-Bavarian German
    IN: { hin: 'Hindi', eng: 'English' }, // dataset adds Tamil (official in Tamil Nadu, not nationally)
    BZ: { eng: 'English' },
    GW: { por: 'Portuguese' },
    JM: { eng: 'English' },
    NA: { eng: 'English' }, // the others are recognised national languages
    CD: { fra: 'French' }, // Kikongo, Lingala, Tshiluba and Swahili are national languages
  },
};
