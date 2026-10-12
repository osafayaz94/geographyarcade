// International organisations and groups: member countries (curated, as of October 2026; Wikidata's
// membership data is incomplete), the headquarters city, and the Wikidata item for the names,
// founding year and current head (scripts/fetch-organizations.js -> data/organizations.json).
// `count` is the official number of member countries, checked against `members` when fetching.
// `note`: key of a sentence in src/i18n-pages.js for members that are not countries on this site.
module.exports = [
  { key: 'g20', slug: 'g20-countries', qid: 'Q19771', hq: null, count: 19, note: 'orgNoteG20',
    members: 'AR AU BR CA CN FR DE IN ID IT JP KR MX RU SA ZA TR GB US' },
  { key: 'g7', slug: 'g7-countries', qid: 'Q1764511', hq: null, count: 7, note: 'orgNoteG7',
    members: 'CA FR DE IT JP GB US' },
  { key: 'brics', slug: 'brics-countries', qid: 'Q243630', hq: null, count: 10,
    members: 'BR RU IN CN ZA EG ET IR AE ID' },
  { key: 'asean', slug: 'asean-countries', qid: 'Q7768', hq: 'Q3630', count: 11, // Timor-Leste joined in October 2025
    members: 'BN KH ID LA MY MM PH SG TH VN TL' },
  { key: 'saarc', slug: 'saarc-countries', qid: 'Q145700', hq: 'Q3037', count: 8,
    members: 'AF BD BT IN MV NP PK LK' },
  { key: 'sco', slug: 'sco-countries', qid: 'Q485207', hq: 'Q956', count: 10, // Iran 2023, Belarus 2024
    members: 'CN IN IR KZ KG PK RU TJ UZ BY' },
  { key: 'gcc', slug: 'gcc-countries', qid: 'Q217172', hq: 'Q3692', count: 6, name: { en: 'Gulf Cooperation Council (GCC)' },
    members: 'BH KW OM QA SA AE' },
  { key: 'arab-league', slug: 'arab-league-countries', qid: 'Q7172', hq: 'Q85', count: 22,
    members: 'DZ BH KM DJ EG IQ JO KW LB LY MR MA OM PS QA SA SO SD SY TN AE YE' },
  { key: 'oic', slug: 'oic-countries', qid: 'Q47543', hq: 'Q374365', count: 57,
    members: 'AF AL DZ AZ BH BD BJ BN BF CM TD KM CI DJ EG GA GM GN GW GY ID IR IQ JO KZ KW KG LB LY MY MV ML MR MA MZ NE NG OM PK PS QA SA SN SL SO SD SR SY TJ TG TN TR TM UG AE UZ YE' },
  { key: 'opec', slug: 'opec-countries', qid: 'Q7795', hq: 'Q1741', count: 12,
    members: 'DZ CG GQ GA IR IQ KW LY NG SA AE VE' },
  { key: 'eu', slug: 'european-union-countries', qid: 'Q458', hq: 'Q239', count: 27,
    members: 'AT BE BG HR CY CZ DK EE FI FR DE GR HU IE IT LV LT LU MT NL PL PT RO SK SI ES SE' },
  { key: 'nato', slug: 'nato-countries', qid: 'Q7184', hq: 'Q239', count: 32,
    members: 'AL BE BG CA HR CZ DK EE FI FR DE GR HU IS IT LV LT LU ME NL MK NO PL PT RO SK SI ES SE TR GB US' },
  { key: 'african-union', slug: 'african-union-countries', qid: 'Q7159', hq: 'Q3624', count: 54, note: 'orgNoteAU',
    members: 'DZ AO BJ BW BF BI CV CM CF TD KM CG CD CI DJ EG GQ ER SZ ET GA GM GH GN GW KE LS LR LY MG MW ML MR MU MA MZ NA NE NG RW ST SN SC SL SO ZA SS SD TZ TG TN UG ZM ZW' },
  { key: 'commonwealth', slug: 'commonwealth-countries', qid: 'Q7785', hq: 'Q84', count: 56,
    members: 'AG AU BS BD BB BZ BW BN CM CA CY DM SZ FJ GA GM GH GD GY IN JM KE KI LS MW MY MV MT MU MZ NA NR NZ NG PK PG RW KN LC VC WS SC SL SG SB ZA LK TZ TO TT TV UG GB VU ZM TG' },
  { key: 'mercosur', slug: 'mercosur-countries', qid: 'Q4264', hq: 'Q1335', count: 5, note: 'orgNoteMercosur', name: { en: 'Mercosur' }, // Bolivia full member since 2024
    members: 'AR BR PY UY BO' },
  { key: 'un-security-council', slug: 'un-security-council-permanent-members', qid: 'Q37470', hq: 'Q60', count: 5, note: 'orgNoteUNSC',
    members: 'CN FR RU GB US' },
];
