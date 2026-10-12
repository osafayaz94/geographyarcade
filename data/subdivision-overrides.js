// Manual decisions for the province/state data, keyed by ISO3.
//
//   skip:   reason string. The country gets no province pages because no open boundary
//           data reflects its current divisions. The next-largest country takes its place.
//   source: geoBoundaries collection to use instead of gbOpen (newer or more complete).
//   level:  geoBoundaries level to use instead of ADM1 (when ADM1 is the wrong tier).
//   iso:    { '<shapeName>': '<ISO 3166-2 code>' } to join rows whose name or code is off.
//   drop:   shapeNames or ISO codes to leave out.
//   qid:    { '<shapeName>': '<Wikidata QID>' } as a last resort.
module.exports = {
  //   source: 'osm' takes the current divisions from Wikidata (P150) and their shapes from
  //           OpenStreetMap (P402), for countries reorganised after the geoBoundaries release.
  //           nested: use the divisions of the country's P150 items; requireIso: drop items
  //           without an ISO 3166-2 code; drop: ISO codes or QIDs to leave out;
  //           osm: { QID: OSM relation } where Wikidata has no link or a stale one.
  // noCapitals: since the 2025 reform the provincial seats are wards, which make a poor quiz.
  VNM: { source: 'osm', noCapitals: true }, // 2025 merger to 34 provinces
  IDN: { source: 'osm' }, // 2022 Papua split to 38 provinces
  NOR: { source: 'osm', requireIso: true, drop: ['NO-21', 'NO-22'] }, // 2024 split back to 15 counties; not Svalbard, Jan Mayen, Bouvet
  OMN: { source: 'osm' }, // 11 governorates since 2011
  DZA: { source: 'osm' }, // 58 wilayas since 2019
  ETH: { source: 'osm' }, // Sidama (2020), South West (2021), South and Central Ethiopia (2023)
  PHL: { source: 'osm' }, // 2024 Negros Island Region
  IRL: { source: 'osm', drop: ['IE-C', 'IE-L', 'IE-M', 'IE-U'] }, // the 26 counties, not the 4 provinces
  MWI: { source: 'osm', nested: true, osm: { Q1058442: 7345872 } }, // the 28 districts inside the 3 regions; Zomba's relation found on Nominatim
  UGA: { source: 'osm', osm: { Q588927: 3501823, Q60769699: 14705445, Q60769700: 14691286, Q85774640: 14677876 } }, // districts (geoBoundaries ADM1 is the 4 regions, which have no capitals); Maracha, Kwania, Kikuube and Kitagwenda relations found on Nominatim
  // North Macedonia: the 70 municipalities outside Skopje, plus the City of Skopje as one unit
  // (its 10 municipalities are too small to click).
  MKD: { source: 'osm', drop: ['MK-801', 'MK-803', 'MK-804', 'MK-805', 'MK-808', 'MK-809', 'MK-811', 'MK-814', 'MK-815', 'MK-817'] },

  // Reorganised after the geoBoundaries release: current divisions from Wikidata + OpenStreetMap
  // (2026-10-12; they were skipped while Wikidata lacked the new divisions).
  KAZ: { source: 'osm' }, // 2022 reform added Abai, Jetisu and Ulytau
  // Wikidata still lists the divisions from before the reform, so these wait.
  AGO: { skip: '2024 reform to 21 provinces; Wikidata and geoBoundaries still show 18' },
  BFA: { skip: '2025 reform to 17 regions; Wikidata and geoBoundaries still show 13' },
  // geoBoundaries predates a reform: current divisions from Wikidata + OpenStreetMap.
  BDI: { skip: '2025 reform to 5 provinces; geoBoundaries shows the old 18 and Wikidata lacks OpenStreetMap links for the new ones' },
  SLE: { source: 'osm' }, // 2017: North West Province added
  GNQ: { skip: '2017: Djibloho added; geoBoundaries shows 7 and Wikidata lacks an OpenStreetMap link for Djibloho' },
  TLS: { source: 'osm' }, // 2022: Atauro became a municipality
  MNE: { source: 'osm' }, // municipalities added up to 2022 (Zeta)
  // geoBoundaries names here don't join cleanly to Wikidata (truncated or different units), so two
  // shapes landed on one item: take the official list from Wikidata and the shapes from OSM.
  SGP: { source: 'osm' },
  GMB: { source: 'osm' },
  // Same join problem, and Wikidata lacks OpenStreetMap links for some of their divisions.
  SYC: { skip: 'geoBoundaries names truncated (two Grand\'Anse districts joined to one item); OSM links missing on Wikidata' },
  MLT: { skip: 'geoBoundaries councils join two shapes to one item; OSM links missing on Wikidata' },
  LVA: { skip: 'geoBoundaries municipalities join two shapes to one item; OSM links missing on Wikidata' },
  // Too few first-level divisions to make a quiz, or the source has the wrong level.
  SVN: { skip: 'ADM1 in the source is the two cohesion regions; the 212 municipalities are too many' },
  PSE: { skip: 'only two divisions (West Bank, Gaza Strip)' },
  STP: { skip: 'only two divisions (São Tomé, Príncipe)' },
  AZE: { source: 'osm' }, // geoBoundaries ADM1 holds only the mainland and Nakhchivan
  MDG: { source: 'osm' }, // 2021 split to 23 regions
  CAF: { source: 'osm' }, // 2020 reform to 20 prefectures
  MLI: { source: 'osm' }, // 2023 reform to 19 regions

  // Better source or tier.
  ARG: { source: 'gbHumanitarian', iso: { 'Ciudad de Buenos Aires': 'AR-C', 'Buenos Aires': 'AR-B' } }, // adds the City of Buenos Aires
  IRN: { source: 'gbHumanitarian', iso: { Kerman: 'IR-08', Kermanshah: 'IR-05' } }, // 31 provinces
  MOZ: { source: 'gbHumanitarian', iso: { Maputo: 'MZ-L', 'Maputo City': 'MZ-MPM' } }, // adds Maputo City
  NER: { source: 'gbHumanitarian' }, // 7 regions plus Niamey
  TZA: {
    source: 'gbHumanitarian', // 31 regions incl. Songwe; the source has names only
    iso: { Arusha: 'TZ-01', 'Dar-es-salaam': 'TZ-02', Dodoma: 'TZ-03', Iringa: 'TZ-04', Kagera: 'TZ-05', 'Kaskazini Pemba': 'TZ-06', 'Kaskazini Unguja': 'TZ-07', Kigoma: 'TZ-08', Kilimanjaro: 'TZ-09', 'Kusini Pemba': 'TZ-10', 'Kusini Unguja': 'TZ-11', Lindi: 'TZ-12', Mara: 'TZ-13', Mbeya: 'TZ-14', 'Mjini Magharibi': 'TZ-15', Morogoro: 'TZ-16', Mtwara: 'TZ-17', Mwanza: 'TZ-18', Pwani: 'TZ-19', Rukwa: 'TZ-20', Ruvuma: 'TZ-21', Shinyanga: 'TZ-22', Singida: 'TZ-23', Tabora: 'TZ-24', Tanga: 'TZ-25', Manyara: 'TZ-26', Geita: 'TZ-27', Katavi: 'TZ-28', Njombe: 'TZ-29', Simiyu: 'TZ-30', Songwe: 'TZ-31' },
  },
  KGZ: {
    source: 'gbHumanitarian', // 7 regions plus Bishkek and Osh; the source has names only
    iso: { Batken: 'KG-B', Chui: 'KG-C', 'Bishkek (city)': 'KG-GB', 'Osh (city)': 'KG-GO', 'Jalal-Abad': 'KG-J', Naryn: 'KG-N', Osh: 'KG-O', Talas: 'KG-T', 'Issyk-Kul': 'KG-Y' },
  },
  PRK: { iso: { Jagang: 'KP-04' } },
  BEL: { level: 'ADM2' }, // ADM1 is the 3 regions; ADM2 is the 10 provinces plus Brussels
  BIH: {
    level: 'ADM2', // ADM1 is the 2 entities plus Brcko; ADM2 splits the Federation into its 10 cantons
    qid: { 'Zenica-Doboj Canton': 'Q18253', 'Posavina Canton': 'Q18249', 'Bosnian-Podrinje Canton Goražde': 'Q18256', 'Herzegovina-Neretva Canton': 'Q18273', 'Tuzla Canton': 'Q18250', 'West Herzegovina Canton': 'Q18275', 'Una-Sana Canton': 'Q18248', 'Canton 10': 'Q18277', 'Central Bosnia Canton': 'Q18262', 'Sarajevo Canton': 'Q18276' },
  },
  LBN: { qid: { 'Keserwan-Jbeil': 'Q56345291' } },
  ITA: {
    level: 'ADM2', // ADM1 is the 5 statistical macro-regions
    iso: { Piemonte: 'IT-21', "Valle d'Aosta": 'IT-23', Lombardia: 'IT-25', 'Trentino-Alto Adige': 'IT-32', Veneto: 'IT-34', 'Friuli Venezia Giulia': 'IT-36', Liguria: 'IT-42', 'Emilia-Romagna': 'IT-45', Toscana: 'IT-52', Umbria: 'IT-55', Marche: 'IT-57', Lazio: 'IT-62', Abruzzo: 'IT-65', Molise: 'IT-67', Campania: 'IT-72', Puglia: 'IT-75', Basilicata: 'IT-77', Calabria: 'IT-78', Sicilia: 'IT-82', Sardegna: 'IT-88' },
  },
  GRC: {
    level: 'ADM2', // ADM1 is the older decentralised administrations
    iso: { 'Anatolikis Makedonias kai Thr*': 'GR-A', 'Kentrikis Makedonias': 'GR-B', 'Dytikis Makedonias': 'GR-C', Ipeiroy: 'GR-D', Thessalias: 'GR-E', 'Ionion Nison': 'GR-F', 'Dytikis Elladas': 'GR-G', 'Stereas Elladas': 'GR-H', Attikis: 'GR-I', Peloponnisoy: 'GR-J', 'Voreioy Aigaioy': 'GR-K', 'Notioy Aigaioy': 'GR-L', Kritis: 'GR-M', 'Agion Oros': 'GR-69' },
  },

  // Site owner's policy (2026-10-12): a map of one country follows that country's own official
  // map; world and continent maps are decided case by case by the owner. So India's states map
  // keeps Jammu and Kashmir and Ladakh as India draws them (geoBoundaries' India data follows the
  // Survey of India, including Gilgit-Baltistan and Aksai Chin), and Pakistan's map adds Jammu and
  // Kashmir as Pakistan draws it. On world and continent maps (2026-09-28), Indian-administered
  // Jammu and Kashmir and Ladakh are part of Pakistan; Aksai Chin stays with China.
  // The added Pakistan unit takes its names from Wikidata Q1180.
  IND: { exportKashmir: ['Jammu and Kashmīr', 'Ladākh'] },
  // Wikidata's zh and ar labels say "state" (the Indian state); these are the plain region names.
  PAK: { addKashmir: { id: 'PAK-JK', name: 'Jammu and Kashmir', names: { zh: '查谟和克什米尔', ar: 'جامو وكشمير' } }, qid: { 'Jammu and Kashmir': 'Q1180' } },

  // Name and code fixes.
  CHN: {
    iso: { 'Guangzhou Province': 'CN-GD' }, // mislabelled Guangdong in the source
    // Owner's policy: one-country maps follow that government's official map, so China's includes
    // Taiwan Province (the source already does; Arunachal Pradesh and Aksai Chin lie within Tibet
    // and Xinjiang there). Its capital as the PRC designates it: Taipei.
    qid: { 'Taiwan Province': 'Q57251' },
    capital: { 'Taiwan Province': 'Q1867' },
  },
  // Same policy, units each government claims, with outlines from the other country's data:
  // Russia's constitution lists Crimea, Sevastopol and four Ukrainian regions (whole oblasts);
  // Serbia's districts include Kosovo (Serbia's five districts, built from Kosovo's seven); Venezuela's
  // states include Guayana Esequiba (Guyana's regions west of the Essequibo River).
  RUS: {
    addUnits: [
      { id: 'RUS-CR', name: 'Republic of Crimea', qid: 'Q15966495', file: 'UKR', names: ['Autonomous Republic of Crimea'] },
      { id: 'RUS-SEV', name: 'Sevastopol', qid: 'Q7525', file: 'UKR', names: ['Sevastopol'] },
      { id: 'RUS-DPR', name: "Donetsk People's Republic", qid: 'Q16150196', file: 'UKR', names: ['Donetsk Oblast'] },
      { id: 'RUS-LPR', name: "Luhansk People's Republic", qid: 'Q16746854', file: 'UKR', names: ['Luhansk Oblast'] },
      { id: 'RUS-ZAP', name: 'Zaporozhye Oblast', qid: 'Q114333615', file: 'UKR', names: ['Zaporizhia Oblast'], capital: 'Q157835' },
      { id: 'RUS-KHE', name: 'Kherson Oblast', qid: 'Q114331288', file: 'UKR', names: ['Kherson Oblast'], capital: 'Q156732' },
    ],
    capitalNames: { Q157835: { en: 'Zaporozhye' } },
  },
  SRB: {
    addUnits: [
      { id: 'SRB-KOS', name: 'Kosovo District', qid: 'Q1452368', gb: 'XKX', names: ['District of Prishtina', 'District of Ferizaj'] },
      { id: 'SRB-PEC', name: 'Peć District', qid: 'Q2510536', gb: 'XKX', names: ['District of Peja', 'District of Gjakova'] },
      { id: 'SRB-PRZ', name: 'Prizren District', qid: 'Q201085', gb: 'XKX', names: ['District of Prizren'] },
      { id: 'SRB-KMI', name: 'Kosovska Mitrovica District', qid: 'Q2017517', gb: 'XKX', names: ['District of Mitrovica'] },
      { id: 'SRB-KPO', name: 'Kosovo-Pomoravlje District', qid: 'Q124725', gb: 'XKX', names: ['District of Gjilan'] },
    ],
    // Serbian names of the district seats (Wikidata labels use the Albanian forms).
    capitalNames: { Q25270: { en: 'Priština' }, Q112657: { en: 'Peć' }, Q178168: { en: 'Kosovska Mitrovica' }, Q739808: { en: 'Gnjilane' } },
  },
  VEN: {
    addUnits: [
      { id: 'VEN-GE', name: 'Guayana Esequiba', qid: 'Q816253', file: 'GUY', names: ['Barina-Waini', 'Pomeroon-Supenaam', 'Cuyuni-Mazaruni', 'Potaro-Siparuni', 'Upper Takutu-Upper Essequibo'] },
    ],
  },
  CIV: { iso: { 'Bas-Sassandra': 'CI-BS', Denguele: 'CI-DN', "District Autonome D'Abidjan": 'CI-AB', 'District Autonome De Yamoussoukro': 'CI-YM', 'Goh-Djiboua': 'CI-GD', Lacs: 'CI-LC', Montagnes: 'CI-MG', Savanes: 'CI-SV', 'Valle Du Bandama': 'CI-VB', Woroba: 'CI-WR', Zanzan: 'CI-ZZ', Lagunes: 'CI-LG' } },
  ESP: { iso: { 'Comunitat Valenciana': 'ES-VC', 'Illes Balears': 'ES-IB' } },
  SYR: { iso: { Lattakia: 'SY-LA', 'Al-Hasakeh': 'SY-HA', 'As-Sweida': 'SY-SU', Damascus: 'SY-DI', 'Rural Damascus': 'SY-RD' } },
  // Poland switched to numeric ISO codes in 2020; the source still uses the old letters.
  POL: { iso: { 'Lower Silesian Voivodeship': 'PL-02', 'Kuyavian-Pomeranian Voivodeship': 'PL-04', 'Lublin Voivodeship': 'PL-06', 'Lubusz Voivodeship': 'PL-08', 'Łódź Voivodeship': 'PL-10', 'Lesser Poland Voivodeship': 'PL-12', 'Masovian Voivodeship': 'PL-14', 'Opole Voivodeship': 'PL-16', 'Subcarpathian Voivodeship': 'PL-18', 'Podlaskie Voivodeship': 'PL-20', 'Pomeranian Voivodeship': 'PL-22', 'Silesian Voivodeship': 'PL-24', 'Świętokrzyskie Voivodeship': 'PL-26', 'Warmian-Masurian Voivodeship': 'PL-28', 'Greater Poland Voivodeship': 'PL-30', 'West Pomeranian Voivodeship': 'PL-32' } },
  MEX: { iso: { 'Distrito Federal': 'MX-CMX', Mexico: 'MX-MEX' } },
  PER: { iso: { 'Municipalidad Metropolitana de Lima': 'PE-LMA' } },
  ECU: { iso: { Cotopaxi: 'EC-X', Chimborazo: 'EC-H' } },
  CHL: { iso: { 'Región de Magallanes y Antártica Chilena': 'CL-MA' } },
  NPL: { qid: { Gandaki: 'Q25104016' } },
  ZAF: { iso: { 'Nothern Cape': 'ZA-NC' } },
  USA: { drop: ['US-PR', 'US-GU', 'US-AS', 'US-MP', 'US-VI'] }, // territories, not drawable on the states map
  AUS: { drop: ['Other Territories'] },
  SDN: { drop: ['Abyei PCA'] }, // disputed area, not a state
};
