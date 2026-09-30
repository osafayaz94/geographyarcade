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
  },
};
