// Country names Wikidata is missing or gets wrong in a site language (ISO2 -> { lang: name }).
// The Netherlands: Wikidata's item is the Kingdom of the Netherlands (with Aruba, Curaçao and
// Sint Maarten), so its labels read "Kingdom of..."; the site uses the country's everyday name.
module.exports = {
  CY: { hi: 'साइप्रस', bn: 'সাইপ্রাস', ur: 'قبرص' },
  NL: { zh: '荷兰', hi: 'नीदरलैंड', es: 'Países Bajos', ar: 'هولندا', fr: 'Pays-Bas', bn: 'নেদারল্যান্ডস', ur: 'نیدرلینڈز', ru: 'Нидерланды', pt: 'Países Baixos', de: 'Niederlande', id: 'Belanda', it: 'Paesi Bassi', ja: 'オランダ', ko: '네덜란드', pl: 'Holandia', nl: 'Nederland' },
};
