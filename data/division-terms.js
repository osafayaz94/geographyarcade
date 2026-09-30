// What each country's first-level divisions are called in headings and titles
// (ISO2 -> key in i18n `term`). Countries not listed use "provinces".
// Sentences that state a number always say "first-level administrative divisions"
// instead, because most countries mix types (e.g. Nigeria: 36 states plus the FCT).
const groups = {
  states: 'US BR MX NG SD SS VE MY MM ER',
  federalStates: 'DE AT', // Bundesländer
  statesTerritories: 'AU',
  statesUts: 'IN',
  provincesTerritories: 'CA',
  prefectures: 'JP',
  countries: 'GB',
  regions: 'RU FR IT CL PE GH KZ UZ CM TZ ET SN ML NE ES CZ SK PL DK GN CI BF CF SA TM KG TJ BY UA NA LY GR NZ FI SO PH',
  departments: 'CO BO PY UY CG BJ HN GT SV NI HT',
  governorates: 'EG IQ SY YE OM TN JO LB KW BH',
  counties: 'KE NO SE LR HU HR RO EE LV LT AL IE',
  districts: 'BW CY IL MW UG',
  cantons: 'CH LU',
  divisions: 'BA', // Bosnia: cantons, an entity and a district
  municipalities: 'MK QA',
};

const map = {};
for (const [term, list] of Object.entries(groups)) for (const c of list.split(' ')) map[c] = term;
module.exports = (iso2) => map[iso2] || 'provinces';
