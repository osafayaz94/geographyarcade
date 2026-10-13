// Text of the "About us" (/about-us/) and "Privacy policy" (/privacy/) pages, per language.
// Placeholders: {n} countries, {p} countries with province maps, {l} languages, {e} the contact
// email (shown as a link), {d} the policy date.
// Every statement here must stay true: if the site starts storing anything new (accounts, ads,
// another analytics tool), update the privacy text and PRIVACY_DATE in build.js first.
module.exports = {
  en: {
    navUs: 'About us', navPrivacy: 'Privacy',

    pdfBtn: "Download PDF",
    histHubTitle: "Ancient civilizations: timeline and maps",
    histHubDesc: "The major civilizations and empires of history, from the Indus Valley to the Inca, in order of when they began. See when each one lasted and the area it covered on a map of today's borders.",
    histHubShort: "Ancient civilizations",
    histTitle: "{name}: dates, area and map",
    histDesc: "When was {name}? It lasted from {a} to {b}. See the area it covered on a map of today's borders and the modern countries it included.",
    histAnswer: "{name}: from {a} to {b} ({d}). Area covered: parts of {list}.",
    fPeriod: "Period",
    fDuration: "Duration",
    fCovered: "Modern countries covered",
    fMapShows: "Map shows",
    histMapYear: "The area around {y}",
    histMapCaption: "Orange: the approximate area of {name} around {y}, on today's borders.",
    histWiki: "Read more on Wikipedia",
    histAbout: "About this map",
    histNote: "The map is approximate. Ancient borders were not fixed lines, and the shape comes from the open Historical Basemaps project, which warns that historical boundaries are uncertain. It shows one moment in time, not the whole period.",
    histSource: "Map data: Historical Basemaps (GPL-3.0 licence)",
    histSame: "Other civilizations at the same time",
    fCivs: "Ancient civilizations here",
    histTimeline: "Timeline",
    thPeriod: "Period",
    eraBCE: "{n} BCE",
    eraCE: "{n} CE",
    eraCirca: "c. {x}",
    histRange: "{a} to {b}",
    durAbout: "about {n} years",
    regTitle: "{org}: list of countries",
    regDesc: "Which countries are in {org}? All {n} countries with a map, a quiz and a free printable map worksheet.",
    regAnswer: "{org} includes {n} countries: {list}.",
    fCountries: "Countries",
    regHubTitle: "Regions and country groups",
    fFormer: "Former state",
    fFormerRange: "{n} ({a} to {b})",
    fUnitedUntil: "United until",
    fBecame: "Independent since",
    orgNoteKosovo: "Kosovo declared independence from Serbia in 2008. Its status is disputed, and it is not one of the 195 countries counted on this site.",
    orgNoteGuianas: "French Guiana is part of France, so it is not listed as a separate country.",
    fPartOf: "Part of",
    legendGroup: "Orange: the countries in this group.",
    gbH: "UK, Britain and Great Britain: what is the difference?",
    gbUK: "The United Kingdom (UK) is the sovereign country. It is made up of England, Scotland, Wales and Northern Ireland.",
    gbGB: "Great Britain is the main island. As a political term it means England, Scotland and Wales, and it does not include Northern Ireland.",
    gbBr: "Britain is an everyday word. It usually means Great Britain, and many people use it for the whole UK.",
    gbIsles: "The British Isles is the geographic group of islands: Great Britain, Ireland and many smaller islands. Ireland is a separate country, not part of the UK.",
    gbQ: "What is the difference between the UK, Great Britain and Britain?",
    printSetTitle: "{t}: printable map worksheet (PDF)",
    printSetDesc: "{t} ({n}) on a free printable map: a blank map, a numbered worksheet, a labeled map and an answer key, each as its own PDF.",
    orgMem: "{org} member countries",
    printSecSets: "Equator, hemispheres and organisations",

    orgHubTitle: "International organisations: member countries",

    orgHubDesc: "Which countries belong to the G20, G7, BRICS, ASEAN, SAARC, SCO, the EU, NATO and other groups: member lists, maps and quizzes.",

    orgTitle: "{org}: member countries",

    orgAnswer: "{org} has {n} member countries: {list}.",

    fFounded: "Founded",

    fHQ: "Headquarters",

    fHead: "Head",

    fMembers: "Member countries",

    fWebsite: "Website",

    noHQ: "No permanent headquarters",

    headSource: "Head as listed on Wikidata on {d}.",

    orgQuiz: "Find the {n} members on the map",

    fMemberOf: "Member of",

    orgNoteG20: "The European Union and the African Union are also members.",

    orgNoteG7: "Russia was also a member from 1997 to 2014, when the group was called the G8.",

    orgNoteAU: "The Sahrawi Arab Democratic Republic (Western Sahara) is also a member.",

    orgNoteMercosur: "Venezuela is a member, but suspended.",

    orgNoteUNSC: "These are the five permanent members; ten more are elected for two-year terms.",

    orgDesc: "{org}: the {n} member countries on a map, with founding year, headquarters and head, plus a quiz.",

    moreIn: "More countries in {cont}",

    qLoc: "Where is {c}?",

    aLoc: "{c} is in {cont}. It borders {list}.",

    aLocNone: "{c} is in {cont} and has no land borders.",

    qCur: "What currency does {c} use?",

    aCur: "The currency of {c} is {list}.",

    qLang: "What language is spoken in {c}?",

    aLang: "The official language of {c}: {list}.",

    qCall: "What is the calling code of {c}?",

    aCall: "The international calling code of {c} is {code}.",

    fCalling: "Calling code",

    aboutMaps: "Country maps use Natural Earth 1:50m boundaries (public domain) through the world-atlas package. Province and state maps use geoBoundaries ADM1 boundaries (licences listed per country below), or OpenStreetMap where divisions changed more recently. A map of a single country follows that country's own official map, including land it claims: India's and Pakistan's both include Jammu and Kashmir, China's includes Taiwan, Russia's includes Crimea and four Ukrainian regions, Serbia's includes Kosovo and Venezuela's includes Guayana Esequiba. On world and continent maps, Indian-administered Jammu and Kashmir and Ladakh are shown as part of Pakistan, Crimea as part of Ukraine, the Golan Heights as part of Syria and Taiwan as part of China; Kosovo and the Falkland Islands are shown but not asked about. Maps are simplified so they load fast, so small details are smoothed.",
    aPopWB: "The World Bank puts the population of {c} at {pop} ({year}).",
    aboutData: "Country names, capitals, province names, province capitals and province populations come from Wikidata (CC0), fetched on {d}. Country populations come from the World Bank (CC BY 4.0), the latest year it publishes, the same year for every country; Vatican City's comes from Wikidata. ISO codes, areas, borders, languages and currencies come from the world-countries dataset (ODbL). Where these sources differ from official ones (a missing second capital, a regional language listed as official), the site corrects them.",
    kashmirQuiz: "That applies to the world and continent maps. A map of a single country (its states or provinces) follows that country's own official map, so the quizzes of both India and Pakistan include Jammu and Kashmir.",
    usTitle: 'About Geography Arcade',
    usDesc: 'Who makes Geography Arcade, why it is free, and how we keep the quizzes, maps and facts accurate.',
    us: [
      ['What Geography Arcade is', 'Geography Arcade is a free website for learning geography by playing. It has map quizzes, capitals and flags games and printable maps for all {n} countries, plus provinces and states for {p} countries, in {l} languages.'],
      ['Who we are', 'Geography Arcade is made by a small independent team. We are not part of any school, publisher or government. We build the quizzes, write the explanations and check the data ourselves.'],
      ['Why it is free', 'Everything on the site is free to play and free to print, with no account and no paywall. We want anyone with a browser to be able to learn the map of the world, in their own language.'],
      ['How we keep it accurate', 'Country names, capitals and population come from Wikidata, and the maps from Natural Earth, geoBoundaries and OpenStreetMap. The data refreshes automatically every month, and a changed name waits a few weeks before it appears, so a bad edit at the source does not reach the quizzes.'],
      ['For teachers and parents', 'You are welcome to use the quizzes and printable maps in class and at home. Every printable map comes as a blank map, a worksheet, a labelled map and an answer key.'],
      ['Spotted a mistake?', 'Write to us at {e} and we will look into it.'],
    ],
    usSources: 'See every data source',
    pvTitle: 'Privacy policy',
    pvDesc: 'What Geography Arcade collects (very little), how we use Google Analytics, and the choices you have.',
    pvDate: 'Last updated: {d}',
    pv: [
      ['The short version', 'You can use Geography Arcade without an account and without telling us anything about yourself. We use Google Analytics to count visits and see which pages are useful, with its advertising features turned off. We do not sell data and we do not show ads.'],
      ['What stays on your device', 'Your best quiz scores are saved in your browser (local storage) so you can try to beat them. They never leave your device. You can delete them by clearing this site\'s data in your browser.'],
      ['Google Analytics', 'We use Google Analytics 4 to understand how the site is used: which pages are visited, roughly where visitors are (country and city), which device and browser they use, which site sent them and how they use a page. Google may use your IP address to work out your approximate location, but Google Analytics 4 does not store IP addresses. Google Signals and advertising features are turned off.'],
      ['Cookies', 'Outside the European Economic Area, the UK and Switzerland, Google Analytics sets two first-party cookies (_ga and _ga_ followed by an ID) to tell new visits from returning ones. In the European Economic Area, the UK and Switzerland, no analytics cookies are set: Google receives only cookieless measurement pings. The site sets no other cookies.'],
      ['Fonts', 'Some text uses web fonts from Google Fonts, so your browser downloads them from Google\'s servers, which see your IP address.'],
      ['Hosting', 'The site is hosted by Hostinger. Like most web hosts, its servers may keep standard access logs (IP address, browser and the page requested) for security and to keep the site running.'],
      ['Email', 'If you write to {e}, we use your address and message only to reply to you.'],
      ['Children', 'Geography Arcade is made for learners of all ages, including children. The site has no accounts, forms or chat, so nobody can give us personal information through it.'],
      ['Your choices', 'You can block Google Analytics with your browser\'s privacy settings, a content blocker or Google\'s opt-out add-on (tools.google.com/dlpage/gaoptout). The quizzes and printable maps work the same either way.'],
      ['Changes to this policy', 'If we add something new, such as optional accounts to save your progress across devices, we will update this page first and change the date at the top.'],
      ['Contact', 'Questions about privacy: {e}.'],
    ],
  },
  zh: {
    navUs: '关于我们', navPrivacy: '隐私',

    pdfBtn: "下载 PDF",
    histHubTitle: "古代文明：时间线和地图",
    histHubDesc: "从印度河流域到印加的历史上主要文明和帝国，按出现的先后排列。查看每个文明延续的时间，以及它在今天国界地图上的范围。",
    histHubShort: "古代文明",
    histTitle: "{name}：年代、范围和地图",
    histDesc: "{name}是什么时候？它从{a}延续到{b}。在今天的国界地图上查看它的范围和涉及的现代国家。",
    histAnswer: "{name}：{a}至{b}（{d}）。涵盖范围：{list}的部分地区。",
    fPeriod: "时期",
    fDuration: "持续时间",
    fCovered: "涉及的现代国家",
    fMapShows: "地图显示",
    histMapYear: "{y}前后的范围",
    histMapCaption: "橙色：{name}在{y}前后的大致范围，叠加在今天的国界上。",
    histWiki: "在维基百科了解更多",
    histAbout: "关于这张地图",
    histNote: "地图为大致范围。古代的边界并不是固定的线，图形来自开放的 Historical Basemaps 项目，该项目提醒历史边界并不确定。地图只显示某一时刻，而不是整个时期。",
    histSource: "地图数据：Historical Basemaps（GPL-3.0 许可）",
    histSame: "同一时期的其他文明",
    fCivs: "这里的古代文明",
    histTimeline: "时间线",
    thPeriod: "时期",
    eraBCE: "公元前{n}年",
    eraCE: "公元{n}年",
    eraCirca: "约{x}",
    histRange: "{a}至{b}",
    durAbout: "约{n}年",
    regTitle: "{org}：国家列表",
    regDesc: "{org}包括哪些国家？共 {n} 个国家，附地图、测验和免费可打印地图练习纸。",
    regAnswer: "{org}包括 {n} 个国家：{list}。",
    fCountries: "国家",
    regHubTitle: "地区和国家组",
    fFormer: "前国家",
    fFormerRange: "{n}（{a}年至{b}年）",
    fUnitedUntil: "统一至",
    fBecame: "独立年份",
    orgNoteKosovo: "科索沃于 2008 年宣布脱离塞尔维亚独立，其地位存在争议，不在本站统计的 195 个国家之内。",
    orgNoteGuianas: "法属圭亚那属于法国，因此不单独列为国家。",
    fPartOf: "所属地区",
    legendGroup: "橙色：本组的国家。",
    gbH: "英国、不列颠和大不列颠有什么区别？",
    gbUK: "联合王国（英国）是主权国家，由英格兰、苏格兰、威尔士和北爱尔兰组成。",
    gbGB: "大不列颠是主岛。作为政治概念，它指英格兰、苏格兰和威尔士，不包括北爱尔兰。",
    gbBr: "不列颠是日常用语，通常指大不列颠，许多人也用它指整个联合王国。",
    gbIsles: "不列颠群岛是地理概念，包括大不列颠岛、爱尔兰岛和许多小岛。爱尔兰是独立国家，不属于联合王国。",
    gbQ: "英国、不列颠和大不列颠有什么区别？",
    printSetTitle: "{t}：可打印地图练习纸（PDF）",
    printSetDesc: "{t}（{n} 个）免费可打印地图：空白地图、编号练习纸、标注地图和答案页，每种都有单独的 PDF。",
    orgMem: "{org}成员国",
    printSecSets: "赤道、南北半球和国际组织",

    orgHubTitle: "国际组织：成员国",

    orgHubDesc: "哪些国家属于二十国集团、七国集团、金砖国家、东盟、南盟、上合组织、欧盟、北约等组织：成员名单、地图和测验。",

    orgTitle: "{org}：成员国",

    orgAnswer: "{org}有 {n} 个成员国：{list}。",

    fFounded: "成立",

    fHQ: "总部",

    fHead: "负责人",

    fMembers: "成员国",

    fWebsite: "网站",

    noHQ: "没有常设总部",

    headSource: "负责人以 Wikidata 于{d}的记录为准。",

    orgQuiz: "在地图上找出全部 {n} 个成员国",

    fMemberOf: "所属组织",

    orgNoteG20: "欧盟和非洲联盟也是成员。",

    orgNoteG7: "俄罗斯在 1997 年至 2014 年间也是成员，当时称为八国集团。",

    orgNoteAU: "阿拉伯撒哈拉民主共和国（西撒哈拉）也是成员。",

    orgNoteMercosur: "委内瑞拉是成员，但已被暂停资格。",

    orgNoteUNSC: "这是五个常任理事国；另有十个成员经选举产生，任期两年。",

    orgDesc: "{org}：地图上的 {n} 个成员国，以及成立年份、总部和负责人，并附测验。",

    moreIn: "{cont}的其他国家",

    qLoc: "{c}在哪里？",

    aLoc: "{c}位于{cont}，与{list}接壤。",

    aLocNone: "{c}位于{cont}，没有陆地邻国。",

    qCur: "{c}使用什么货币？",

    aCur: "{c}的货币是{list}。",

    qLang: "{c}说什么语言？",

    aLang: "{c}的官方语言：{list}。",

    qCall: "{c}的国际电话区号是多少？",

    aCall: "{c}的国际电话区号是 {code}。",

    fCalling: "电话区号",

    aboutMaps: "国家地图使用 Natural Earth 1:50m 边界（公有领域），通过 world-atlas 软件包提供。省份和州的地图使用 geoBoundaries ADM1 边界（各国许可见下文），区划近年有变化的国家则使用 OpenStreetMap。单个国家的地图以该国官方地图为准，包括其主张的领土：印度和巴基斯坦的地图都包含查谟和克什米尔，中国的包含台湾，俄罗斯的包含克里米亚和乌克兰的四个地区，塞尔维亚的包含科索沃，委内瑞拉的包含埃塞奎博圭亚那。在世界地图和各大洲地图上，印度控制的查谟和克什米尔以及拉达克显示为巴基斯坦的一部分，克里米亚为乌克兰的一部分，戈兰高地为叙利亚的一部分，台湾为中国的一部分；科索沃和福克兰群岛会显示，但不出题。地图经过简化以便快速加载，因此细小部分会被平滑处理。",
    aPopWB: "据世界银行统计，{c}的人口为 {pop}（{year}年）。",
    aboutData: "国家名称、首都、省份名称、省会和省份人口来自 Wikidata（CC0），获取于{d}。国家人口来自世界银行（CC BY 4.0），采用其公布的最新年份，所有国家为同一年；梵蒂冈的人口来自 Wikidata。ISO 代码、面积、边界、语言和货币来自 world-countries 数据集（ODbL）。这些来源与官方资料不一致时（例如漏掉第二个首都，或把地区语言列为官方语言），本站会加以更正。",
    kashmirQuiz: "这适用于世界地图和各大洲地图。单个国家的地图（其省份或州）以该国官方地图为准，因此印度和巴基斯坦的测验都包含查谟和克什米尔。",
    usTitle: '关于 Geography Arcade',
    usDesc: '谁在制作 Geography Arcade、为什么免费，以及我们如何保证测验、地图和资料准确。',
    us: [
      ['Geography Arcade 是什么', 'Geography Arcade 是一个通过游戏学习地理的免费网站，提供全部 {n} 个国家的地图测验、首都和国旗游戏以及可打印地图，另有 {p} 个国家的省份和州，共 {l} 种语言。'],
      ['我们是谁', 'Geography Arcade 由一个独立的小团队制作。我们不隶属于任何学校、出版社或政府。测验、说明文字和数据核对都由我们自己完成。'],
      ['为什么免费', '网站上的所有内容都可以免费玩、免费打印，无需注册，也没有付费墙。我们希望任何有浏览器的人都能用自己的语言认识世界地图。'],
      ['我们如何保证准确', '国家名称、首都和人口来自 Wikidata，地图来自 Natural Earth、geoBoundaries 和 OpenStreetMap。数据每月自动更新；名称有变动时会先等待几周再显示，这样源头的错误编辑不会进入测验。'],
      ['给老师和家长', '欢迎在课堂和家里使用这些测验和可打印地图。每张可打印地图都有空白图、练习纸、标注图和答案页四种版本。'],
      ['发现错误？', '请写信到 {e}，我们会核实处理。'],
    ],
    usSources: '查看全部数据来源',
    pvTitle: '隐私政策',
    pvDesc: 'Geography Arcade 收集哪些信息（很少）、如何使用 Google Analytics，以及你可以做的选择。',
    pvDate: '最后更新：{d}',
    pv: [
      ['简要说明', '使用 Geography Arcade 无需注册，也不需要告诉我们任何个人信息。我们使用 Google Analytics 统计访问量、了解哪些页面有用，并关闭了其广告功能。我们不出售数据，也不展示广告。'],
      ['保存在你设备上的内容', '你的测验最佳成绩保存在浏览器（本地存储）中，方便你挑战自己。这些成绩不会离开你的设备。你可以在浏览器中清除本站数据来删除它们。'],
      ['Google Analytics', '我们使用 Google Analytics 4 了解网站的使用情况：访问了哪些页面、访客的大致位置（国家和城市）、使用的设备和浏览器、从哪个网站来，以及如何使用页面。Google 可能会用你的 IP 地址估算大致位置，但 Google Analytics 4 不会存储 IP 地址。Google 信号和广告功能均已关闭。'],
      ['Cookie', '在欧洲经济区、英国和瑞士以外，Google Analytics 会设置两个第一方 Cookie（_ga 和 _ga_ 加编号），用来区分新访问和回访。在欧洲经济区、英国和瑞士，不会设置任何分析 Cookie，Google 只会收到不含 Cookie 的统计信号。本站不设置其他 Cookie。'],
      ['字体', '部分文字使用 Google Fonts 的网络字体，因此你的浏览器会从 Google 的服务器下载字体，服务器会看到你的 IP 地址。'],
      ['托管', '本站由 Hostinger 托管。和大多数网站主机一样，其服务器可能会保留标准访问日志（IP 地址、浏览器和所访问的页面），用于安全和网站运行。'],
      ['电子邮件', '如果你写信到 {e}，我们只会用你的地址和来信内容来回复你。'],
      ['儿童', 'Geography Arcade 面向所有年龄的学习者，包括儿童。网站没有账户、表单或聊天功能，因此任何人都无法通过它向我们提供个人信息。'],
      ['你的选择', '你可以通过浏览器的隐私设置、内容拦截工具或 Google 的停用插件（tools.google.com/dlpage/gaoptout）屏蔽 Google Analytics。无论是否屏蔽，测验和可打印地图都能照常使用。'],
      ['政策变更', '如果我们增加新功能，例如可选的账户以便在不同设备间保存进度，我们会先更新本页并修改顶部的日期。'],
      ['联系', '隐私相关问题：{e}。'],
    ],
  },
  hi: {
    navUs: 'हमारे बारे में', navPrivacy: 'गोपनीयता',

    pdfBtn: "PDF डाउनलोड करें",
    histHubTitle: "प्राचीन सभ्यताएँ: समयरेखा और नक्शे",
    histHubDesc: "सिंधु घाटी से लेकर इंका तक इतिहास की प्रमुख सभ्यताएँ और साम्राज्य, उनके शुरू होने के क्रम में। देखिए हर एक कब तक चली और आज की सीमाओं वाले नक्शे पर उसका क्षेत्र कितना था।",
    histHubShort: "प्राचीन सभ्यताएँ",
    histTitle: "{name}: कालखंड, क्षेत्र और नक्शा",
    histDesc: "{name} कब था? यह {a} से {b} तक रहा। आज की सीमाओं वाले नक्शे पर उसका क्षेत्र और उसमें आने वाले आधुनिक देश देखिए।",
    histAnswer: "{name}: {a} से {b} तक ({d})। फैला क्षेत्र: {list} के हिस्से।",
    fPeriod: "कालखंड",
    fDuration: "अवधि",
    fCovered: "आज के देश जो इसमें आते थे",
    fMapShows: "नक्शा दिखाता है",
    histMapYear: "{y} के आसपास का क्षेत्र",
    histMapCaption: "नारंगी: {name} का {y} के आसपास का अनुमानित क्षेत्र, आज की सीमाओं पर।",
    histWiki: "विकिपीडिया पर और पढ़ें",
    histAbout: "इस नक्शे के बारे में",
    histNote: "नक्शा अनुमानित है। प्राचीन सीमाएँ पक्की रेखाएँ नहीं थीं, और आकार खुले Historical Basemaps प्रोजेक्ट से लिया गया है, जो चेतावनी देता है कि ऐतिहासिक सीमाएँ अनिश्चित हैं। यह एक क्षण दिखाता है, पूरा कालखंड नहीं।",
    histSource: "नक्शे का डेटा: Historical Basemaps (GPL-3.0 लाइसेंस)",
    histSame: "उसी समय की अन्य सभ्यताएँ",
    fCivs: "यहाँ की प्राचीन सभ्यताएँ",
    histTimeline: "समयरेखा",
    thPeriod: "कालखंड",
    eraBCE: "{n} ईसा पूर्व",
    eraCE: "{n} ईस्वी",
    eraCirca: "लगभग {x}",
    histRange: "{a} से {b} तक",
    durAbout: "लगभग {n} वर्ष",
    regTitle: "{org}: देशों की सूची",
    regDesc: "{org} में कौन-से देश हैं? सभी {n} देश, नक्शे, क्विज़ और मुफ़्त प्रिंट करने योग्य नक्शा वर्कशीट के साथ।",
    regAnswer: "{org} में {n} देश शामिल हैं: {list}।",
    fCountries: "देश",
    regHubTitle: "क्षेत्र और देशों के समूह",
    fFormer: "पूर्व राज्य",
    fFormerRange: "{n} ({a} से {b} तक)",
    fUnitedUntil: "कब तक एकजुट रहे",
    fBecame: "स्वतंत्र हुआ",
    orgNoteKosovo: "कोसोवो ने 2008 में सर्बिया से स्वतंत्रता की घोषणा की। उसकी स्थिति विवादित है, और वह इस साइट के 195 देशों में शामिल नहीं है।",
    orgNoteGuianas: "फ़्रेंच गुयाना फ़्रांस का हिस्सा है, इसलिए उसे अलग देश के रूप में नहीं गिना गया।",
    fPartOf: "किस क्षेत्र का हिस्सा",
    legendGroup: "नारंगी: इस समूह के देश।",
    gbH: "यूके, ब्रिटेन और ग्रेट ब्रिटेन में क्या फ़र्क़ है?",
    gbUK: "यूनाइटेड किंगडम (यूके) संप्रभु देश है। इसमें इंग्लैंड, स्कॉटलैंड, वेल्स और उत्तरी आयरलैंड शामिल हैं।",
    gbGB: "ग्रेट ब्रिटेन मुख्य द्वीप है। राजनीतिक शब्द के रूप में इसका मतलब इंग्लैंड, स्कॉटलैंड और वेल्स है; उत्तरी आयरलैंड इसमें शामिल नहीं है।",
    gbBr: "ब्रिटेन रोज़मर्रा का शब्द है। आम तौर पर इसका मतलब ग्रेट ब्रिटेन होता है, और कई लोग इसे पूरे यूके के लिए भी इस्तेमाल करते हैं।",
    gbIsles: "ब्रिटिश द्वीपसमूह द्वीपों का भौगोलिक समूह है: ग्रेट ब्रिटेन, आयरलैंड और कई छोटे द्वीप। आयरलैंड अलग देश है, यूके का हिस्सा नहीं।",
    gbQ: "यूके, ग्रेट ब्रिटेन और ब्रिटेन में क्या अंतर है?",
    printSetTitle: "{t}: प्रिंट करने योग्य नक्शा और वर्कशीट (PDF)",
    printSetDesc: "{t} ({n}) का मुफ़्त प्रिंट करने योग्य नक्शा: खाली नक्शा, नंबर वाली वर्कशीट, नाम वाला नक्शा और उत्तर कुंजी, हर एक अलग PDF में।",
    orgMem: "{org} के सदस्य देश",
    printSecSets: "भूमध्य रेखा, गोलार्ध और अंतरराष्ट्रीय संगठन",

    orgHubTitle: "अंतरराष्ट्रीय संगठन: सदस्य देश",

    orgHubDesc: "G20, G7, ब्रिक्स, आसियान, सार्क, एससीओ, यूरोपीय संघ, नाटो और दूसरे समूहों में कौन-से देश हैं: सदस्यों की सूची, नक्शे और क्विज़।",

    orgTitle: "{org}: सदस्य देश",

    orgAnswer: "{org} के {n} सदस्य देश हैं: {list}।",

    fFounded: "स्थापना",

    fHQ: "मुख्यालय",

    fHead: "प्रमुख",

    fMembers: "सदस्य देश",

    fWebsite: "वेबसाइट",

    noHQ: "कोई स्थायी मुख्यालय नहीं",

    headSource: "प्रमुख का नाम Wikidata के {d} के रिकॉर्ड के अनुसार।",

    orgQuiz: "नक्शे पर सभी {n} सदस्य ढूँढें",

    fMemberOf: "सदस्यता",

    orgNoteG20: "यूरोपीय संघ और अफ़्रीकी संघ भी सदस्य हैं।",

    orgNoteG7: "रूस भी 1997 से 2014 तक सदस्य था, तब इस समूह को G8 कहा जाता था।",

    orgNoteAU: "सहरावी अरब लोकतांत्रिक गणराज्य (पश्चिमी सहारा) भी सदस्य है।",

    orgNoteMercosur: "वेनेज़ुएला सदस्य है, लेकिन निलंबित है।",

    orgNoteUNSC: "ये पाँच स्थायी सदस्य हैं; दस और सदस्य दो साल के लिए चुने जाते हैं।",

    orgDesc: "{org}: नक्शे पर {n} सदस्य देश, स्थापना वर्ष, मुख्यालय और प्रमुख के साथ, और एक क्विज़।",

    moreIn: "{cont} के और देश",

    qLoc: "{c} कहाँ स्थित है?",

    aLoc: "{c} {cont} में स्थित है। इसकी सीमा {list} से लगती है।",

    aLocNone: "{c} {cont} में स्थित है और इसकी कोई स्थलीय सीमा नहीं है।",

    qCur: "{c} की मुद्रा क्या है?",

    aCur: "{c} की मुद्रा: {list}।",

    qLang: "{c} में कौन-सी भाषा बोली जाती है?",

    aLang: "{c} की आधिकारिक भाषा: {list}।",

    qCall: "{c} का कॉलिंग कोड क्या है?",

    aCall: "{c} का अंतरराष्ट्रीय कॉलिंग कोड {code} है।",

    fCalling: "कॉलिंग कोड",

    aboutMaps: "देशों के नक्शे world-atlas पैकेज के ज़रिए Natural Earth 1:50m सीमाओं (सार्वजनिक डोमेन) का उपयोग करते हैं। प्रांतों और राज्यों के नक्शे geoBoundaries ADM1 सीमाओं (हर देश का लाइसेंस नीचे दिया है) का, या जहाँ विभाजन हाल में बदले हैं वहाँ OpenStreetMap का उपयोग करते हैं। किसी एक देश का नक्शा उसी देश के आधिकारिक नक्शे के अनुसार है, उसके दावे वाली ज़मीन समेत: भारत और पाकिस्तान दोनों के नक्शों में जम्मू और कश्मीर शामिल है, चीन के नक्शे में ताइवान, रूस के नक्शे में क्रीमिया और यूक्रेन के चार क्षेत्र, सर्बिया के नक्शे में कोसोवो और वेनेज़ुएला के नक्शे में गुयाना एसेक्विबा। विश्व और महाद्वीपों के नक्शों पर भारत-प्रशासित जम्मू और कश्मीर तथा लद्दाख पाकिस्तान के हिस्से के रूप में, क्रीमिया यूक्रेन के, गोलान हाइट्स सीरिया के और ताइवान चीन के हिस्से के रूप में दिखाए गए हैं; कोसोवो और फ़ॉकलैंड द्वीप दिखाए गए हैं पर उन पर सवाल नहीं पूछे जाते। नक्शे जल्दी लोड हों, इसलिए उन्हें सरल बनाया गया है और छोटे विवरण चिकने कर दिए गए हैं।",
    aPopWB: "विश्व बैंक के अनुसार {c} की जनसंख्या {pop} ({year}) है।",
    aboutData: "देशों के नाम, राजधानियाँ, प्रांतों के नाम, प्रांतों की राजधानियाँ और प्रांतों की जनसंख्या Wikidata (CC0) से ली गई है, {d} को। देशों की जनसंख्या विश्व बैंक (CC BY 4.0) से है, उसका प्रकाशित सबसे नया वर्ष, सभी देशों के लिए एक ही वर्ष; वेटिकन सिटी की जनसंख्या Wikidata से है। ISO कोड, क्षेत्रफल, सीमाएँ, भाषाएँ और मुद्राएँ world-countries डेटासेट (ODbL) से हैं। जहाँ ये स्रोत आधिकारिक जानकारी से अलग हैं (जैसे दूसरी राजधानी छूट जाना, या किसी क्षेत्रीय भाषा को आधिकारिक बताना), वहाँ साइट उन्हें ठीक करती है।",
    kashmirQuiz: "यह विश्व और महाद्वीपों के नक्शों पर लागू होता है। किसी एक देश का नक्शा (उसके राज्य या प्रांत) उसी देश के आधिकारिक नक्शे के अनुसार है, इसलिए भारत और पाकिस्तान दोनों की क्विज़ में जम्मू और कश्मीर शामिल है।",
    usTitle: 'Geography Arcade के बारे में',
    usDesc: 'Geography Arcade कौन बनाता है, यह मुफ़्त क्यों है, और हम क्विज़, नक्शों और तथ्यों को सही कैसे रखते हैं।',
    us: [
      ['Geography Arcade क्या है', 'Geography Arcade खेल-खेल में भूगोल सीखने की एक मुफ़्त वेबसाइट है। इसमें सभी {n} देशों के नक्शा क्विज़, राजधानी और झंडे के खेल और प्रिंट करने योग्य नक्शे हैं, साथ ही {p} देशों के प्रांत और राज्य, {l} भाषाओं में।'],
      ['हम कौन हैं', 'Geography Arcade एक छोटी स्वतंत्र टीम बनाती है। हम किसी स्कूल, प्रकाशक या सरकार से जुड़े नहीं हैं। क्विज़ बनाना, व्याख्याएँ लिखना और डेटा की जाँच हम खुद करते हैं।'],
      ['यह मुफ़्त क्यों है', 'साइट पर सब कुछ खेलने और प्रिंट करने के लिए मुफ़्त है, बिना खाते और बिना पेवॉल के। हम चाहते हैं कि ब्राउज़र वाला हर व्यक्ति अपनी भाषा में दुनिया का नक्शा सीख सके।'],
      ['हम इसे सही कैसे रखते हैं', 'देशों के नाम, राजधानियाँ और जनसंख्या Wikidata से आती हैं, और नक्शे Natural Earth, geoBoundaries और OpenStreetMap से। डेटा हर महीने अपने आप अपडेट होता है, और बदला हुआ नाम कुछ हफ़्ते रुककर दिखता है, ताकि स्रोत पर हुई गलत एडिट क्विज़ तक न पहुँचे।'],
      ['शिक्षकों और अभिभावकों के लिए', 'क्विज़ और प्रिंट करने योग्य नक्शे कक्षा और घर में इस्तेमाल करने के लिए आपका स्वागत है। हर प्रिंट नक्शा खाली नक्शा, वर्कशीट, नाम वाला नक्शा और उत्तर कुंजी के रूप में मिलता है।'],
      ['कोई गलती दिखी?', 'हमें {e} पर लिखें, हम उसे जाँचेंगे।'],
    ],
    usSources: 'सभी डेटा स्रोत देखें',
    pvTitle: 'गोपनीयता नीति',
    pvDesc: 'Geography Arcade क्या जानकारी लेता है (बहुत कम), हम Google Analytics का उपयोग कैसे करते हैं, और आपके पास कौन से विकल्प हैं।',
    pvDate: 'अंतिम अपडेट: {d}',
    pv: [
      ['संक्षेप में', 'आप Geography Arcade बिना खाते के और अपने बारे में कुछ भी बताए बिना इस्तेमाल कर सकते हैं। हम विज़िट गिनने और यह देखने के लिए कि कौन से पेज उपयोगी हैं, Google Analytics का उपयोग करते हैं, और इसकी विज्ञापन सुविधाएँ बंद हैं। हम डेटा नहीं बेचते और विज्ञापन नहीं दिखाते।'],
      ['आपके डिवाइस पर क्या रहता है', 'आपके क्विज़ के सबसे अच्छे स्कोर आपके ब्राउज़र (लोकल स्टोरेज) में सेव होते हैं, ताकि आप उन्हें तोड़ने की कोशिश कर सकें। वे आपके डिवाइस से बाहर नहीं जाते। ब्राउज़र में इस साइट का डेटा साफ़ करके आप उन्हें हटा सकते हैं।'],
      ['Google Analytics', 'हम Google Analytics 4 से समझते हैं कि साइट कैसे इस्तेमाल होती है: कौन से पेज देखे गए, विज़िटर लगभग कहाँ हैं (देश और शहर), कौन सा डिवाइस और ब्राउज़र है, वे किस साइट से आए और पेज का उपयोग कैसे करते हैं। Google आपके IP पते से अनुमानित स्थान निकाल सकता है, लेकिन Google Analytics 4 IP पते संग्रहीत नहीं करता। Google Signals और विज्ञापन सुविधाएँ बंद हैं।'],
      ['कुकीज़', 'यूरोपीय आर्थिक क्षेत्र, यूके और स्विट्ज़रलैंड के बाहर Google Analytics दो फ़र्स्ट-पार्टी कुकीज़ (_ga और _ga_ के बाद एक ID) सेट करता है, ताकि नई और दोबारा आने वाली विज़िट में फ़र्क़ हो सके। यूरोपीय आर्थिक क्षेत्र, यूके और स्विट्ज़रलैंड में कोई एनालिटिक्स कुकी सेट नहीं होती: Google को सिर्फ़ बिना कुकी वाले माप संकेत मिलते हैं। साइट कोई और कुकी सेट नहीं करती।'],
      ['फ़ॉन्ट', 'कुछ टेक्स्ट Google Fonts के वेब फ़ॉन्ट इस्तेमाल करता है, इसलिए आपका ब्राउज़र उन्हें Google के सर्वर से डाउनलोड करता है, जो आपका IP पता देखते हैं।'],
      ['होस्टिंग', 'साइट Hostinger पर होस्ट है। ज़्यादातर वेब होस्ट की तरह, इसके सर्वर सुरक्षा और साइट चलाने के लिए सामान्य एक्सेस लॉग (IP पता, ब्राउज़र और माँगा गया पेज) रख सकते हैं।'],
      ['ईमेल', 'अगर आप {e} पर लिखते हैं, तो हम आपका पता और संदेश सिर्फ़ जवाब देने के लिए इस्तेमाल करते हैं।'],
      ['बच्चे', 'Geography Arcade हर उम्र के सीखने वालों के लिए है, बच्चों समेत। साइट पर कोई खाता, फ़ॉर्म या चैट नहीं है, इसलिए कोई भी इसके ज़रिए हमें निजी जानकारी नहीं दे सकता।'],
      ['आपके विकल्प', 'आप ब्राउज़र की गोपनीयता सेटिंग, कंटेंट ब्लॉकर या Google के ऑप्ट-आउट ऐड-ऑन (tools.google.com/dlpage/gaoptout) से Google Analytics को रोक सकते हैं। क्विज़ और प्रिंट नक्शे दोनों हालत में वैसे ही चलते हैं।'],
      ['इस नीति में बदलाव', 'अगर हम कुछ नया जोड़ते हैं, जैसे अलग-अलग डिवाइस पर प्रगति सेव करने के लिए वैकल्पिक खाते, तो हम पहले यह पेज अपडेट करेंगे और ऊपर की तारीख बदलेंगे।'],
      ['संपर्क', 'गोपनीयता से जुड़े सवाल: {e}।'],
    ],
  },
  es: {
    navUs: 'Quiénes somos', navPrivacy: 'Privacidad',

    pdfBtn: "Descargar PDF",
    histHubTitle: "Civilizaciones antiguas: línea de tiempo y mapas",
    histHubDesc: "Las grandes civilizaciones e imperios de la historia, del valle del Indo a los incas, por orden de aparición. Mira cuándo duró cada una y el territorio que abarcó en un mapa con las fronteras de hoy.",
    histHubShort: "Civilizaciones antiguas",
    histTitle: "{name}: fechas, territorio y mapa",
    histDesc: "¿Cuándo existió {name}? De {a} a {b}. Mira su territorio en un mapa con las fronteras actuales y los países modernos que abarcaba.",
    histAnswer: "{name}: de {a} a {b} ({d}). Zona que abarcaba: partes de {list}.",
    fPeriod: "Período",
    fDuration: "Duración",
    fCovered: "Países actuales que abarcaba",
    fMapShows: "El mapa muestra",
    histMapYear: "El territorio hacia {y}",
    histMapCaption: "Naranja: territorio aproximado de {name} hacia {y}, sobre las fronteras actuales.",
    histWiki: "Más en Wikipedia",
    histAbout: "Sobre este mapa",
    histNote: "El mapa es aproximado. Las fronteras antiguas no eran líneas fijas, y la forma procede del proyecto abierto Historical Basemaps, que advierte de que los límites históricos son inciertos. Muestra un momento, no todo el período.",
    histSource: "Datos del mapa: Historical Basemaps (licencia GPL-3.0)",
    histSame: "Otras civilizaciones de la misma época",
    fCivs: "Civilizaciones antiguas de aquí",
    histTimeline: "Línea de tiempo",
    thPeriod: "Período",
    eraBCE: "{n} a. C.",
    eraCE: "{n} d. C.",
    eraCirca: "h. {x}",
    histRange: "de {a} a {b}",
    durAbout: "unos {n} años",
    regTitle: "{org}: lista de países",
    regDesc: "¿Qué países forman {org}? Los {n} países con mapa, quiz y ficha de mapa imprimible gratis.",
    regAnswer: "{org} incluye {n} países: {list}.",
    fCountries: "Países",
    regHubTitle: "Regiones y grupos de países",
    fFormer: "Estado anterior",
    fFormerRange: "{n} ({a} a {b})",
    fUnitedUntil: "Unidos hasta",
    fBecame: "Independiente desde",
    orgNoteKosovo: "Kosovo declaró su independencia de Serbia en 2008. Su estatus es disputado y no es uno de los 195 países que cuenta este sitio.",
    orgNoteGuianas: "La Guayana Francesa es parte de Francia, por lo que no figura como país aparte.",
    fPartOf: "Forma parte de",
    legendGroup: "Naranja: los países de este grupo.",
    gbH: "Reino Unido, Gran Bretaña e Islas Británicas: ¿cuál es la diferencia?",
    gbUK: "El Reino Unido es el país soberano. Lo forman Inglaterra, Escocia, Gales e Irlanda del Norte.",
    gbGB: "Gran Bretaña es la isla principal. Como término político significa Inglaterra, Escocia y Gales, sin Irlanda del Norte.",
    gbBr: "En el habla cotidiana, «Gran Bretaña» suele usarse para todo el Reino Unido, aunque en sentido estricto no es lo mismo.",
    gbIsles: "Las Islas Británicas son el grupo geográfico de islas: Gran Bretaña, Irlanda y muchas islas menores. Irlanda es un país independiente y no forma parte del Reino Unido.",
    gbQ: "¿Cuál es la diferencia entre el Reino Unido y Gran Bretaña?",
    printSetTitle: "{t}: mapa imprimible y ficha (PDF)",
    printSetDesc: "{t} ({n}) en un mapa imprimible gratis: mapa mudo, ficha numerada, mapa con nombres y solucionario, cada uno en su propio PDF.",
    orgMem: "Países miembros de {org}",
    printSecSets: "Ecuador, hemisferios y organizaciones",

    orgHubTitle: "Organizaciones internacionales: países miembros",

    orgHubDesc: "Qué países forman parte del G20, el G7, los BRICS, la ASEAN, la SAARC, la OCS, la UE, la OTAN y otros grupos: listas de miembros, mapas y juegos.",

    orgTitle: "{org}: países miembros",

    orgAnswer: "{org} tiene {n} países miembros: {list}.",

    fFounded: "Fundación",

    fHQ: "Sede",

    fHead: "Dirigente",

    fMembers: "Países miembros",

    fWebsite: "Sitio web",

    noHQ: "Sin sede permanente",

    headSource: "Dirigente según Wikidata el {d}.",

    orgQuiz: "Encuentra en el mapa los {n} miembros",

    fMemberOf: "Miembro de",

    orgNoteG20: "La Unión Europea y la Unión Africana también son miembros.",

    orgNoteG7: "Rusia también fue miembro de 1997 a 2014, cuando el grupo se llamaba G8.",

    orgNoteAU: "La República Árabe Saharaui Democrática (Sáhara Occidental) también es miembro.",

    orgNoteMercosur: "Venezuela es miembro, pero está suspendida.",

    orgNoteUNSC: "Son los cinco miembros permanentes; otros diez se eligen por dos años.",

    orgDesc: "{org}: los {n} países miembros en un mapa, con año de fundación, sede y dirigente, y un juego.",

    moreIn: "Más países: {cont}",

    qLoc: "¿Dónde está {c}?",

    aLoc: "{c} está en {cont}. Limita con {list}.",

    aLocNone: "{c} está en {cont} y no tiene fronteras terrestres.",

    qCur: "¿Qué moneda se usa en {c}?",

    aCur: "La moneda de {c}: {list}.",

    qLang: "¿Qué idioma se habla en {c}?",

    aLang: "Idioma oficial de {c}: {list}.",

    qCall: "¿Cuál es el prefijo telefónico de {c}?",

    aCall: "El prefijo telefónico internacional de {c} es {code}.",

    fCalling: "Prefijo telefónico",

    aboutMaps: "Los mapas de países usan los límites de Natural Earth 1:50m (dominio público) a través del paquete world-atlas. Los mapas de provincias y estados usan los límites ADM1 de geoBoundaries (licencias por país más abajo), u OpenStreetMap donde las divisiones cambiaron hace poco. El mapa de un solo país sigue el mapa oficial de ese país, incluidos los territorios que reclama: los de la India y Pakistán incluyen Jammu y Cachemira, el de China incluye Taiwán, el de Rusia incluye Crimea y cuatro regiones ucranianas, el de Serbia incluye Kosovo y el de Venezuela incluye la Guayana Esequiba. En los mapas del mundo y de los continentes, Jammu y Cachemira y Ladakh administrados por la India aparecen como parte de Pakistán, Crimea como parte de Ucrania, los Altos del Golán como parte de Siria y Taiwán como parte de China; Kosovo y las islas Malvinas se muestran, pero no se preguntan. Los mapas están simplificados para que carguen rápido, así que los detalles pequeños se suavizan.",
    aPopWB: "Según el Banco Mundial, {c} tiene {pop} habitantes ({year}).",
    aboutData: "Los nombres de países, capitales, provincias y capitales de provincia, y la población de las provincias, vienen de Wikidata (CC0), obtenidos el {d}. La población de los países viene del Banco Mundial (CC BY 4.0), el último año que publica, el mismo para todos los países; la de la Ciudad del Vaticano viene de Wikidata. Los códigos ISO, superficies, fronteras, idiomas y monedas vienen del conjunto world-countries (ODbL). Cuando estas fuentes difieren de las oficiales (una segunda capital que falta, un idioma regional dado como oficial), el sitio las corrige.",
    kashmirQuiz: "Eso se aplica a los mapas del mundo y de los continentes. El mapa de un solo país (sus estados o provincias) sigue el mapa oficial de ese país, por eso los juegos de la India y de Pakistán incluyen Jammu y Cachemira.",
    usTitle: 'Sobre Geography Arcade',
    usDesc: 'Quién hace Geography Arcade, por qué es gratis y cómo mantenemos correctos los juegos, los mapas y los datos.',
    us: [
      ['Qué es Geography Arcade', 'Geography Arcade es una web gratuita para aprender geografía jugando. Tiene juegos de mapas, de capitales y de banderas y mapas para imprimir de los {n} países, además de provincias y estados de {p} países, en {l} idiomas.'],
      ['Quiénes somos', 'Geography Arcade lo hace un pequeño equipo independiente. No pertenecemos a ningún colegio, editorial ni gobierno. Creamos los juegos, escribimos las explicaciones y revisamos los datos nosotros mismos.'],
      ['Por qué es gratis', 'Todo en la web es gratis para jugar y para imprimir, sin cuenta y sin muro de pago. Queremos que cualquier persona con un navegador pueda aprender el mapa del mundo en su propio idioma.'],
      ['Cómo cuidamos los datos', 'Los nombres de los países, las capitales y la población vienen de Wikidata, y los mapas de Natural Earth, geoBoundaries y OpenStreetMap. Los datos se actualizan solos cada mes, y un nombre que cambia espera unas semanas antes de aparecer, para que una edición errónea en la fuente no llegue a los juegos.'],
      ['Para docentes y familias', 'Puedes usar los juegos y los mapas para imprimir en clase y en casa. Cada mapa imprimible viene como mapa mudo, ficha, mapa con nombres y solucionario.'],
      ['¿Has visto un error?', 'Escríbenos a {e} y lo revisaremos.'],
    ],
    usSources: 'Ver todas las fuentes de datos',
    pvTitle: 'Política de privacidad',
    pvDesc: 'Qué recoge Geography Arcade (muy poco), cómo usamos Google Analytics y qué opciones tienes.',
    pvDate: 'Última actualización: {d}',
    pv: [
      ['En resumen', 'Puedes usar Geography Arcade sin cuenta y sin darnos ningún dato personal. Usamos Google Analytics para contar visitas y ver qué páginas son útiles, con sus funciones publicitarias desactivadas. No vendemos datos ni mostramos anuncios.'],
      ['Lo que se queda en tu dispositivo', 'Tus mejores puntuaciones se guardan en tu navegador (almacenamiento local) para que intentes superarlas. Nunca salen de tu dispositivo. Puedes borrarlas eliminando los datos de este sitio en tu navegador.'],
      ['Google Analytics', 'Usamos Google Analytics 4 para entender cómo se usa la web: qué páginas se visitan, desde dónde aproximadamente (país y ciudad), con qué dispositivo y navegador, desde qué web llegan y cómo usan una página. Google puede usar tu dirección IP para calcular tu ubicación aproximada, pero Google Analytics 4 no guarda direcciones IP. Google Signals y las funciones publicitarias están desactivadas.'],
      ['Cookies', 'Fuera del Espacio Económico Europeo, el Reino Unido y Suiza, Google Analytics crea dos cookies propias (_ga y _ga_ seguida de un identificador) para distinguir visitas nuevas de las repetidas. En el Espacio Económico Europeo, el Reino Unido y Suiza no se crea ninguna cookie de analítica: Google recibe solo señales de medición sin cookies. La web no crea ninguna otra cookie.'],
      ['Fuentes tipográficas', 'Parte del texto usa fuentes de Google Fonts, así que tu navegador las descarga de los servidores de Google, que ven tu dirección IP.'],
      ['Alojamiento', 'La web está alojada en Hostinger. Como la mayoría de los proveedores, sus servidores pueden guardar registros de acceso estándar (dirección IP, navegador y página pedida) por seguridad y para mantener la web en marcha.'],
      ['Correo', 'Si nos escribes a {e}, usamos tu dirección y tu mensaje solo para responderte.'],
      ['Menores', 'Geography Arcade está pensado para estudiantes de todas las edades, también niños. La web no tiene cuentas, formularios ni chat, así que nadie puede darnos datos personales a través de ella.'],
      ['Tus opciones', 'Puedes bloquear Google Analytics con los ajustes de privacidad de tu navegador, un bloqueador de contenido o el complemento de inhabilitación de Google (tools.google.com/dlpage/gaoptout). Los juegos y los mapas para imprimir funcionan igual en ambos casos.'],
      ['Cambios en esta política', 'Si añadimos algo nuevo, como cuentas opcionales para guardar tu progreso entre dispositivos, actualizaremos primero esta página y cambiaremos la fecha de arriba.'],
      ['Contacto', 'Preguntas sobre privacidad: {e}.'],
    ],
  },
  ar: {
    navUs: 'من نحن', navPrivacy: 'الخصوصية',

    pdfBtn: "تنزيل PDF",
    histHubTitle: "الحضارات القديمة: الخط الزمني والخرائط",
    histHubDesc: "أبرز حضارات التاريخ وإمبراطورياته، من وادي السند إلى الإنكا، مرتبة حسب زمن ظهورها. اطّلع على مدة كل منها والمساحة التي غطّتها على خريطة بحدود اليوم.",
    histHubShort: "الحضارات القديمة",
    histTitle: "{name}: التواريخ والمساحة والخريطة",
    histDesc: "متى كانت {name}؟ من {a} إلى {b}. شاهد المنطقة التي شملتها على خريطة بحدود اليوم والدول الحديثة التي ضمتها.",
    histAnswer: "{name}: من {a} إلى {b} ({d}). المنطقة التي شملتها: أجزاء من {list}.",
    fPeriod: "الفترة",
    fDuration: "المدة",
    fCovered: "الدول الحديثة التي شملتها",
    fMapShows: "تعرض الخريطة",
    histMapYear: "المنطقة نحو {y}",
    histMapCaption: "البرتقالي: المنطقة التقريبية لـ{name} نحو {y}، على حدود اليوم.",
    histWiki: "اقرأ المزيد في ويكيبيديا",
    histAbout: "عن هذه الخريطة",
    histNote: "الخريطة تقريبية. لم تكن الحدود القديمة خطوطًا ثابتة، وشكلها مأخوذ من مشروع Historical Basemaps المفتوح الذي ينبّه إلى أن الحدود التاريخية غير مؤكدة. وهي تعرض لحظة واحدة لا الفترة كلها.",
    histSource: "بيانات الخريطة: Historical Basemaps (رخصة GPL-3.0)",
    histSame: "حضارات أخرى في الفترة نفسها",
    fCivs: "الحضارات القديمة هنا",
    histTimeline: "الخط الزمني",
    thPeriod: "الفترة",
    eraBCE: "{n} ق.م",
    eraCE: "{n} م",
    eraCirca: "نحو {x}",
    histRange: "من {a} إلى {b}",
    durAbout: "نحو {n} سنة",
    regTitle: "{org}: قائمة الدول",
    regDesc: "ما الدول التي تضمها {org}؟ جميع الدول البالغ عددها {n} مع خريطة واختبار وورقة خريطة مجانية للطباعة.",
    regAnswer: "تضم {org} {n} دولة: {list}.",
    fCountries: "الدول",
    regHubTitle: "المناطق ومجموعات الدول",
    fFormer: "الدولة السابقة",
    fFormerRange: "{n} (من {a} إلى {b})",
    fUnitedUntil: "ظلّت متحدة حتى",
    fBecame: "مستقلة منذ",
    orgNoteKosovo: "أعلنت كوسوفو استقلالها عن صربيا عام 2008. وضعها محل خلاف، وليست من الدول الـ195 المعتمدة في هذا الموقع.",
    orgNoteGuianas: "غويانا الفرنسية جزء من فرنسا، لذلك لا تُدرج دولةً مستقلة.",
    fPartOf: "جزء من",
    legendGroup: "البرتقالي: دول هذه المجموعة.",
    gbH: "المملكة المتحدة وبريطانيا وبريطانيا العظمى: ما الفرق؟",
    gbUK: "المملكة المتحدة هي الدولة ذات السيادة، وتتألف من إنجلترا واسكتلندا وويلز وأيرلندا الشمالية.",
    gbGB: "بريطانيا العظمى هي الجزيرة الرئيسية. وكمصطلح سياسي تعني إنجلترا واسكتلندا وويلز دون أيرلندا الشمالية.",
    gbBr: "«بريطانيا» كلمة يومية، وتعني عادةً بريطانيا العظمى، ويستخدمها كثيرون للدلالة على المملكة المتحدة كلها.",
    gbIsles: "الجزر البريطانية مجموعة جغرافية من الجزر: بريطانيا العظمى وأيرلندا وجزر أصغر كثيرة. أيرلندا دولة مستقلة وليست جزءًا من المملكة المتحدة.",
    gbQ: "ما الفرق بين المملكة المتحدة وبريطانيا وبريطانيا العظمى؟",
    printSetTitle: "{t}: خريطة للطباعة وورقة عمل (PDF)",
    printSetDesc: "{t} ({n}) على خريطة مجانية للطباعة: خريطة صمّاء، وورقة عمل مرقمة، وخريطة بالأسماء، ومفتاح للإجابات، لكل منها ملف PDF خاص.",
    orgMem: "الدول الأعضاء في {org}",
    printSecSets: "خط الاستواء ونصفا الكرة الأرضية والمنظمات الدولية",

    orgHubTitle: "المنظمات الدولية: الدول الأعضاء",

    orgHubDesc: "ما الدول الأعضاء في مجموعة العشرين ومجموعة السبع وبريكس وآسيان وسارك ومنظمة شنغهاي والاتحاد الأوروبي والناتو وغيرها: قوائم الأعضاء وخرائط واختبارات.",

    orgTitle: "{org}: الدول الأعضاء",

    orgAnswer: "تضم {org} دولًا أعضاء عددها {n}: {list}.",

    fFounded: "التأسيس",

    fHQ: "المقر",

    fHead: "الرئيس",

    fMembers: "الدول الأعضاء",

    fWebsite: "الموقع الإلكتروني",

    noHQ: "لا يوجد مقر دائم",

    headSource: "اسم الرئيس كما في Wikidata بتاريخ {d}.",

    orgQuiz: "حدّد الأعضاء ({n}) على الخريطة",

    fMemberOf: "عضو في",

    orgNoteG20: "الاتحاد الأوروبي والاتحاد الأفريقي عضوان أيضًا.",

    orgNoteG7: "كانت روسيا أيضًا عضوًا من 1997 إلى 2014، حين كانت المجموعة تُسمى مجموعة الثماني.",

    orgNoteAU: "الجمهورية العربية الصحراوية الديمقراطية (الصحراء الغربية) عضو أيضًا.",

    orgNoteMercosur: "فنزويلا عضو، لكن عضويتها معلّقة.",

    orgNoteUNSC: "هؤلاء هم الأعضاء الخمسة الدائمون؛ ويُنتخب عشرة أعضاء آخرون لمدة سنتين.",

    orgDesc: "{org}: الدول الأعضاء ({n}) على الخريطة، مع سنة التأسيس والمقر والرئيس، واختبار.",

    moreIn: "دول أخرى في {cont}",

    qLoc: "أين تقع {c}؟",

    aLoc: "تقع {c} في {cont}، وتحدها {list}.",

    aLocNone: "تقع {c} في {cont}، وليس لها حدود برية.",

    qCur: "ما عملة {c}؟",

    aCur: "عملة {c}: {list}.",

    qLang: "ما اللغة الرسمية في {c}؟",

    aLang: "اللغة الرسمية في {c}: {list}.",

    qCall: "ما رمز الاتصال الدولي لـ{c}؟",

    aCall: "رمز الاتصال الدولي لـ{c} هو {code}.",

    fCalling: "رمز الاتصال",

    aboutMaps: "تستخدم خرائط الدول حدود Natural Earth بمقياس 1:50m (ملكية عامة) عبر حزمة world-atlas. وتستخدم خرائط المقاطعات والولايات حدود geoBoundaries من المستوى ADM1 (التراخيص مذكورة لكل دولة أدناه)، أو OpenStreetMap حيث تغيّرت التقسيمات مؤخرًا. خريطة الدولة الواحدة تتبع الخريطة الرسمية لتلك الدولة، بما في ذلك الأراضي التي تطالب بها: خريطتا الهند وباكستان تضمان جامو وكشمير، وخريطة الصين تضم تايوان، وخريطة روسيا تضم القرم وأربع مناطق أوكرانية، وخريطة صربيا تضم كوسوفو، وخريطة فنزويلا تضم غيانا إسيكيبا. وعلى خرائط العالم والقارات تظهر جامو وكشمير ولداخ الخاضعتان لإدارة الهند جزءًا من باكستان، والقرم جزءًا من أوكرانيا، ومرتفعات الجولان جزءًا من سوريا، وتايوان جزءًا من الصين؛ أما كوسوفو وجزر فوكلاند فتظهر دون أن تُطرح عنها أسئلة. الخرائط مبسّطة لتُحمَّل بسرعة، لذا تُنعَّم التفاصيل الصغيرة.",
    aPopWB: "يقدّر البنك الدولي عدد سكان {c} بـ {pop} ({year}).",
    aboutData: "أسماء الدول والعواصم وأسماء المقاطعات وعواصمها وعدد سكانها من Wikidata (CC0)، جُلبت في {d}. أما عدد سكان الدول فمن البنك الدولي (CC BY 4.0)، بأحدث سنة ينشرها، وهي السنة نفسها لكل الدول؛ وعدد سكان مدينة الفاتيكان من Wikidata. رموز ISO والمساحات والحدود واللغات والعملات من مجموعة بيانات world-countries (ODbL). وحين تختلف هذه المصادر عن المصادر الرسمية (عاصمة ثانية ناقصة، أو لغة إقليمية مذكورة كلغة رسمية) يصححها الموقع.",
    kashmirQuiz: "ينطبق ذلك على خرائط العالم والقارات. أما خريطة الدولة الواحدة (ولاياتها أو مقاطعاتها) فتتبع الخريطة الرسمية لتلك الدولة، لذلك يضم اختبارا الهند وباكستان كلاهما جامو وكشمير.",
    usTitle: 'عن Geography Arcade',
    usDesc: 'من يصنع Geography Arcade، ولماذا هو مجاني، وكيف نحافظ على دقة الاختبارات والخرائط والمعلومات.',
    us: [
      ['ما هو Geography Arcade', 'Geography Arcade موقع مجاني لتعلّم الجغرافيا باللعب. فيه اختبارات خرائط وألعاب للعواصم والأعلام وخرائط قابلة للطباعة لجميع الدول ({n})، إضافة إلى المقاطعات والولايات في {p} دولة، بـ{l} لغة.'],
      ['من نحن', 'يصنع Geography Arcade فريق مستقل صغير. لسنا تابعين لأي مدرسة أو دار نشر أو حكومة. نبني الاختبارات ونكتب الشروح ونراجع البيانات بأنفسنا.'],
      ['لماذا هو مجاني', 'كل ما في الموقع مجاني للعب والطباعة، بلا حساب وبلا اشتراك مدفوع. نريد أن يتمكن أي شخص لديه متصفح من تعلّم خريطة العالم بلغته.'],
      ['كيف نحافظ على الدقة', 'تأتي أسماء الدول والعواصم وعدد السكان من Wikidata، والخرائط من Natural Earth وgeoBoundaries وOpenStreetMap. تتحدث البيانات تلقائيًا كل شهر، وينتظر الاسم المتغيّر بضعة أسابيع قبل أن يظهر، حتى لا يصل تعديل خاطئ في المصدر إلى الاختبارات.'],
      ['للمعلمين والأهالي', 'يمكنكم استخدام الاختبارات والخرائط القابلة للطباعة في الفصل وفي البيت. كل خريطة للطباعة متوفرة كخريطة صمّاء وورقة عمل وخريطة بالأسماء ومفتاح للإجابات.'],
      ['وجدت خطأ؟', 'راسلنا على {e} وسنراجعه.'],
    ],
    usSources: 'اطّلع على جميع مصادر البيانات',
    pvTitle: 'سياسة الخصوصية',
    pvDesc: 'ما الذي يجمعه Geography Arcade (القليل جدًا)، وكيف نستخدم Google Analytics، وما الخيارات المتاحة لك.',
    pvDate: 'آخر تحديث: {d}',
    pv: [
      ['باختصار', 'يمكنك استخدام Geography Arcade بلا حساب ودون أن تخبرنا بأي شيء عن نفسك. نستخدم Google Analytics لعدّ الزيارات ومعرفة الصفحات المفيدة، مع إيقاف ميزاته الإعلانية. لا نبيع البيانات ولا نعرض إعلانات.'],
      ['ما يبقى على جهازك', 'تُحفظ أفضل نتائجك في الاختبارات في متصفحك (التخزين المحلي) لتحاول تجاوزها. لا تغادر جهازك أبدًا. يمكنك حذفها بمسح بيانات هذا الموقع في متصفحك.'],
      ['Google Analytics', 'نستخدم Google Analytics 4 لفهم طريقة استخدام الموقع: الصفحات التي تُزار، والموقع التقريبي للزوار (الدولة والمدينة)، والجهاز والمتصفح، والموقع الذي جاؤوا منه، وطريقة استخدامهم للصفحة. قد تستخدم Google عنوان IP لتقدير موقعك التقريبي، لكن Google Analytics 4 لا يخزّن عناوين IP. ميزة Google Signals والميزات الإعلانية متوقفة.'],
      ['ملفات تعريف الارتباط', 'خارج المنطقة الاقتصادية الأوروبية والمملكة المتحدة وسويسرا، يضع Google Analytics ملفّي تعريف ارتباط من الطرف الأول (_ga و_ga_ متبوعًا بمعرّف) للتمييز بين الزيارة الجديدة والزيارة المتكررة. وفي المنطقة الاقتصادية الأوروبية والمملكة المتحدة وسويسرا لا يُوضع أي ملف تعريف ارتباط للتحليلات، وتصل إلى Google إشارات قياس بلا ملفات تعريف ارتباط فقط. لا يضع الموقع أي ملفات أخرى.'],
      ['الخطوط', 'يستخدم بعض النص خطوطًا من Google Fonts، فيحمّلها متصفحك من خوادم Google التي ترى عنوان IP الخاص بك.'],
      ['الاستضافة', 'الموقع مستضاف لدى Hostinger. ومثل معظم شركات الاستضافة، قد تحتفظ خوادمها بسجلات وصول عادية (عنوان IP والمتصفح والصفحة المطلوبة) لأغراض الأمان وتشغيل الموقع.'],
      ['البريد الإلكتروني', 'إذا راسلتنا على {e}، نستخدم عنوانك ورسالتك للرد عليك فقط.'],
      ['الأطفال', 'Geography Arcade مصمم للمتعلمين من جميع الأعمار، ومنهم الأطفال. لا توجد في الموقع حسابات أو نماذج أو محادثة، لذلك لا يمكن لأحد أن يعطينا معلومات شخصية من خلاله.'],
      ['خياراتك', 'يمكنك حظر Google Analytics من إعدادات الخصوصية في متصفحك، أو بأداة حظر المحتوى، أو بإضافة إلغاء الاشتراك من Google (tools.google.com/dlpage/gaoptout). تعمل الاختبارات والخرائط القابلة للطباعة بالطريقة نفسها في الحالتين.'],
      ['تغييرات هذه السياسة', 'إذا أضفنا شيئًا جديدًا، مثل حسابات اختيارية لحفظ تقدمك بين الأجهزة، فسنحدّث هذه الصفحة أولًا ونغيّر التاريخ في أعلاها.'],
      ['التواصل', 'أسئلة عن الخصوصية: {e}.'],
    ],
  },
  fr: {
    navUs: 'Qui sommes-nous', navPrivacy: 'Confidentialité',

    pdfBtn: "Télécharger le PDF",
    histHubTitle: "Civilisations antiques : frise chronologique et cartes",
    histHubDesc: "Les grandes civilisations et empires de l'histoire, de la vallée de l'Indus aux Incas, dans l'ordre de leur apparition. Voyez la durée de chacun et le territoire couvert sur une carte aux frontières d'aujourd'hui.",
    histHubShort: "Civilisations antiques",
    histTitle: "{name} : dates, territoire et carte",
    histDesc: "Quand a existé {name} ? De {a} à {b}. Découvrez son territoire sur une carte aux frontières actuelles et les pays modernes concernés.",
    histAnswer: "{name} : de {a} à {b} ({d}). Zone couverte : des parties de {list}.",
    fPeriod: "Période",
    fDuration: "Durée",
    fCovered: "Pays actuels concernés",
    fMapShows: "La carte montre",
    histMapYear: "Le territoire vers {y}",
    histMapCaption: "Orange : territoire approximatif de {name} vers {y}, sur les frontières actuelles.",
    histWiki: "En savoir plus sur Wikipédia",
    histAbout: "À propos de cette carte",
    histNote: "La carte est approximative. Les frontières antiques n'étaient pas des lignes fixes, et le tracé vient du projet ouvert Historical Basemaps, qui prévient que les limites historiques sont incertaines. Elle montre un instant, pas toute la période.",
    histSource: "Données de la carte : Historical Basemaps (licence GPL-3.0)",
    histSame: "Autres civilisations à la même époque",
    fCivs: "Civilisations antiques ici",
    histTimeline: "Chronologie",
    thPeriod: "Période",
    eraBCE: "{n} av. J.-C.",
    eraCE: "{n} apr. J.-C.",
    eraCirca: "vers {x}",
    histRange: "de {a} à {b}",
    durAbout: "environ {n} ans",
    regTitle: "{org} : liste des pays",
    regDesc: "Quels pays composent {org} ? Les {n} pays avec une carte, un quiz et une fiche de carte à imprimer gratuite.",
    regAnswer: "{org} comprend {n} pays : {list}.",
    fCountries: "Pays",
    regHubTitle: "Régions et groupes de pays",
    fFormer: "Ancien État",
    fFormerRange: "{n} ({a} à {b})",
    fUnitedUntil: "Unis jusqu'en",
    fBecame: "Indépendant depuis",
    orgNoteKosovo: "Le Kosovo a proclamé son indépendance de la Serbie en 2008. Son statut est contesté et il ne fait pas partie des 195 pays comptés sur ce site.",
    orgNoteGuianas: "La Guyane française fait partie de la France : elle n'est donc pas listée comme pays distinct.",
    fPartOf: "Fait partie de",
    legendGroup: "Orange : les pays de ce groupe.",
    gbH: "Royaume-Uni, Grande-Bretagne et îles Britanniques : quelle différence ?",
    gbUK: "Le Royaume-Uni est l'État souverain. Il est formé de l'Angleterre, de l'Écosse, du pays de Galles et de l'Irlande du Nord.",
    gbGB: "La Grande-Bretagne est l'île principale. Au sens politique, elle désigne l'Angleterre, l'Écosse et le pays de Galles, sans l'Irlande du Nord.",
    gbBr: "Dans la conversation courante, « Grande-Bretagne » désigne souvent tout le Royaume-Uni, mais ce n'est pas exact au sens strict.",
    gbIsles: "Les îles Britanniques forment un groupe géographique : la Grande-Bretagne, l'Irlande et de nombreuses îles plus petites. L'Irlande est un pays indépendant, qui ne fait pas partie du Royaume-Uni.",
    gbQ: "Quelle est la différence entre le Royaume-Uni et la Grande-Bretagne ?",
    printSetTitle: "{t} : carte à imprimer et fiche (PDF)",
    printSetDesc: "{t} ({n}) sur une carte gratuite à imprimer : carte muette, fiche numérotée, carte avec les noms et corrigé, chacun dans son propre PDF.",
    orgMem: "Pays membres de {org}",
    printSecSets: "Équateur, hémisphères et organisations",

    orgHubTitle: "Organisations internationales : pays membres",

    orgHubDesc: "Quels pays font partie du G20, du G7, des BRICS, de l'ASEAN, de l'ASACR, de l'OCS, de l'UE, de l'OTAN et d'autres groupes : listes des membres, cartes et quiz.",

    orgTitle: "{org} : pays membres",

    orgAnswer: "{org} compte {n} pays membres : {list}.",

    fFounded: "Création",

    fHQ: "Siège",

    fHead: "Dirigeant",

    fMembers: "Pays membres",

    fWebsite: "Site web",

    noHQ: "Pas de siège permanent",

    headSource: "Dirigeant selon Wikidata au {d}.",

    orgQuiz: "Trouvez les {n} membres sur la carte",

    fMemberOf: "Membre de",

    orgNoteG20: "L'Union européenne et l'Union africaine sont aussi membres.",

    orgNoteG7: "La Russie a aussi été membre de 1997 à 2014, quand le groupe s'appelait le G8.",

    orgNoteAU: "La République arabe sahraouie démocratique (Sahara occidental) est aussi membre.",

    orgNoteMercosur: "Le Venezuela est membre, mais suspendu.",

    orgNoteUNSC: "Ce sont les cinq membres permanents ; dix autres sont élus pour deux ans.",

    orgDesc: "{org} : les {n} pays membres sur une carte, avec année de création, siège et dirigeant, et un quiz.",

    moreIn: "Autres pays : {cont}",

    qLoc: "{c} : où se trouve ce pays ?",

    aLoc: "{c} se trouve en {cont}. Pays voisins : {list}.",

    aLocNone: "{c} se trouve en {cont} et n'a pas de frontière terrestre.",

    qCur: "{c} : quelle est la monnaie ?",

    aCur: "Monnaie de {c} : {list}.",

    qLang: "{c} : quelle langue y parle-t-on ?",

    aLang: "Langue officielle de {c} : {list}.",

    qCall: "{c} : quel est l'indicatif téléphonique ?",

    aCall: "L'indicatif téléphonique international de {c} est {code}.",

    fCalling: "Indicatif téléphonique",

    aboutMaps: "Les cartes des pays utilisent les frontières Natural Earth 1:50m (domaine public) via le paquet world-atlas. Les cartes des provinces et États utilisent les limites ADM1 de geoBoundaries (licences par pays ci-dessous), ou OpenStreetMap là où les divisions ont changé récemment. La carte d'un seul pays suit la carte officielle de ce pays, y compris les territoires qu'il revendique : celles de l'Inde et du Pakistan incluent toutes deux le Jammu-et-Cachemire, celle de la Chine inclut Taïwan, celle de la Russie la Crimée et quatre régions ukrainiennes, celle de la Serbie le Kosovo et celle du Venezuela la Guayana Esequiba. Sur les cartes du monde et des continents, le Jammu-et-Cachemire et le Ladakh administrés par l'Inde font partie du Pakistan, la Crimée de l'Ukraine, le plateau du Golan de la Syrie et Taïwan de la Chine ; le Kosovo et les îles Malouines sont affichés mais ne font pas l'objet de questions. Les cartes sont simplifiées pour charger vite, les petits détails sont donc lissés.",
    aPopWB: "Selon la Banque mondiale, la population de {c} est de {pop} habitants ({year}).",
    aboutData: "Les noms des pays, les capitales, les noms des provinces, leurs chefs-lieux et leur population viennent de Wikidata (CC0), récupérés le {d}. La population des pays vient de la Banque mondiale (CC BY 4.0), la dernière année publiée, la même pour tous les pays ; celle de la Cité du Vatican vient de Wikidata. Les codes ISO, superficies, frontières, langues et monnaies viennent du jeu de données world-countries (ODbL). Quand ces sources diffèrent des sources officielles (une deuxième capitale manquante, une langue régionale donnée comme officielle), le site les corrige.",
    kashmirQuiz: "Cela vaut pour les cartes du monde et des continents. La carte d'un seul pays (ses États ou provinces) suit la carte officielle de ce pays : les quiz de l'Inde et du Pakistan incluent donc tous deux le Jammu-et-Cachemire.",
    usTitle: 'À propos de Geography Arcade',
    usDesc: 'Qui fait Geography Arcade, pourquoi c\'est gratuit et comment nous gardons les quiz, les cartes et les données exacts.',
    us: [
      ['Ce qu\'est Geography Arcade', 'Geography Arcade est un site gratuit pour apprendre la géographie en jouant. Il propose des quiz de cartes, des jeux sur les capitales et les drapeaux et des cartes à imprimer pour les {n} pays, ainsi que les provinces et États de {p} pays, en {l} langues.'],
      ['Qui sommes-nous', 'Geography Arcade est fait par une petite équipe indépendante. Nous ne dépendons d\'aucune école, d\'aucun éditeur ni d\'aucun gouvernement. Nous créons les quiz, rédigeons les explications et vérifions les données nous-mêmes.'],
      ['Pourquoi c\'est gratuit', 'Tout le site est gratuit, pour jouer comme pour imprimer, sans compte ni abonnement. Nous voulons que toute personne disposant d\'un navigateur puisse apprendre la carte du monde dans sa propre langue.'],
      ['Comment nous gardons des données exactes', 'Les noms des pays, les capitales et la population viennent de Wikidata, et les cartes de Natural Earth, geoBoundaries et OpenStreetMap. Les données se mettent à jour automatiquement chaque mois, et un nom modifié attend quelques semaines avant d\'apparaître, pour qu\'une mauvaise modification à la source n\'atteigne pas les quiz.'],
      ['Pour les enseignants et les parents', 'Vous pouvez utiliser les quiz et les cartes à imprimer en classe et à la maison. Chaque carte à imprimer existe en carte muette, en fiche, en carte avec noms et avec corrigé.'],
      ['Vous avez repéré une erreur ?', 'Écrivez-nous à {e} et nous vérifierons.'],
    ],
    usSources: 'Voir toutes les sources de données',
    pvTitle: 'Politique de confidentialité',
    pvDesc: 'Ce que Geography Arcade collecte (très peu), comment nous utilisons Google Analytics et les choix dont vous disposez.',
    pvDate: 'Dernière mise à jour : {d}',
    pv: [
      ['En bref', 'Vous pouvez utiliser Geography Arcade sans compte et sans nous dire quoi que ce soit sur vous. Nous utilisons Google Analytics pour compter les visites et voir quelles pages sont utiles, avec ses fonctions publicitaires désactivées. Nous ne vendons pas de données et n\'affichons pas de publicité.'],
      ['Ce qui reste sur votre appareil', 'Vos meilleurs scores sont enregistrés dans votre navigateur (stockage local) pour que vous puissiez essayer de les battre. Ils ne quittent jamais votre appareil. Vous pouvez les supprimer en effaçant les données de ce site dans votre navigateur.'],
      ['Google Analytics', 'Nous utilisons Google Analytics 4 pour comprendre l\'usage du site : les pages visitées, la localisation approximative des visiteurs (pays et ville), l\'appareil et le navigateur, le site d\'où ils viennent et la façon dont ils utilisent une page. Google peut utiliser votre adresse IP pour estimer votre position approximative, mais Google Analytics 4 ne stocke pas les adresses IP. Google Signals et les fonctions publicitaires sont désactivés.'],
      ['Cookies', 'Hors de l\'Espace économique européen, du Royaume-Uni et de la Suisse, Google Analytics dépose deux cookies propriétaires (_ga et _ga_ suivi d\'un identifiant) pour distinguer les nouvelles visites des visites répétées. Dans l\'Espace économique européen, au Royaume-Uni et en Suisse, aucun cookie de mesure d\'audience n\'est déposé : Google ne reçoit que des signaux de mesure sans cookie. Le site ne dépose aucun autre cookie.'],
      ['Polices', 'Une partie du texte utilise des polices de Google Fonts : votre navigateur les télécharge depuis les serveurs de Google, qui voient votre adresse IP.'],
      ['Hébergement', 'Le site est hébergé par Hostinger. Comme la plupart des hébergeurs, ses serveurs peuvent conserver des journaux d\'accès standard (adresse IP, navigateur et page demandée) pour la sécurité et le bon fonctionnement du site.'],
      ['E-mail', 'Si vous nous écrivez à {e}, nous utilisons votre adresse et votre message uniquement pour vous répondre.'],
      ['Enfants', 'Geography Arcade s\'adresse aux apprenants de tous âges, y compris les enfants. Le site n\'a ni compte, ni formulaire, ni messagerie : personne ne peut donc nous transmettre d\'informations personnelles par son biais.'],
      ['Vos choix', 'Vous pouvez bloquer Google Analytics avec les réglages de confidentialité de votre navigateur, un bloqueur de contenu ou le module de désactivation de Google (tools.google.com/dlpage/gaoptout). Les quiz et les cartes à imprimer fonctionnent de la même façon dans les deux cas.'],
      ['Modifications de cette politique', 'Si nous ajoutons quelque chose de nouveau, comme des comptes facultatifs pour enregistrer votre progression sur plusieurs appareils, nous mettrons d\'abord cette page à jour et changerons la date en haut.'],
      ['Contact', 'Questions sur la confidentialité : {e}.'],
    ],
  },
  de: {
    navUs: 'Über uns', navPrivacy: 'Datenschutz',

    pdfBtn: "PDF herunterladen",
    histHubTitle: "Antike Kulturen: Zeitstrahl und Karten",
    histHubDesc: "Die großen Kulturen und Reiche der Geschichte, vom Indus-Tal bis zu den Inka, in der Reihenfolge ihres Beginns. Sehen Sie, wie lange jede bestand und welches Gebiet sie auf einer Karte mit den heutigen Grenzen umfasste.",
    histHubShort: "Antike Kulturen",
    histTitle: "{name}: Zeitraum, Gebiet und Karte",
    histDesc: "Wann gab es {name}? Von {a} bis {b}. Das Gebiet auf einer Karte mit den heutigen Grenzen und die betroffenen modernen Länder.",
    histAnswer: "{name}: von {a} bis {b} ({d}). Gebiet: Teile von {list}.",
    fPeriod: "Zeitraum",
    fDuration: "Dauer",
    fCovered: "Heutige Länder im Gebiet",
    fMapShows: "Die Karte zeigt",
    histMapYear: "Das Gebiet um {y}",
    histMapCaption: "Orange: ungefähres Gebiet von {name} um {y}, auf den heutigen Grenzen.",
    histWiki: "Mehr bei Wikipedia",
    histAbout: "Über diese Karte",
    histNote: "Die Karte ist ungefähr. Antike Grenzen waren keine festen Linien, und die Form stammt aus dem offenen Projekt Historical Basemaps, das warnt, dass historische Grenzen unsicher sind. Sie zeigt einen Zeitpunkt, nicht den ganzen Zeitraum.",
    histSource: "Kartendaten: Historical Basemaps (Lizenz GPL-3.0)",
    histSame: "Andere Kulturen zur selben Zeit",
    fCivs: "Antike Kulturen hier",
    histTimeline: "Zeitstrahl",
    thPeriod: "Zeitraum",
    eraBCE: "{n} v. Chr.",
    eraCE: "{n} n. Chr.",
    eraCirca: "ca. {x}",
    histRange: "{a} bis {b}",
    durAbout: "etwa {n} Jahre",
    regTitle: "{org}: Liste der Länder",
    regDesc: "Welche Länder gehören zu {org}? Alle {n} Länder mit Karte, Quiz und kostenlosem druckbaren Kartenarbeitsblatt.",
    regAnswer: "{org} umfasst {n} Länder: {list}.",
    fCountries: "Länder",
    regHubTitle: "Regionen und Ländergruppen",
    fFormer: "Früherer Staat",
    fFormerRange: "{n} ({a} bis {b})",
    fUnitedUntil: "Vereint bis",
    fBecame: "Unabhängig seit",
    orgNoteKosovo: "Der Kosovo erklärte 2008 seine Unabhängigkeit von Serbien. Sein Status ist umstritten, und er gehört nicht zu den 195 Ländern, die diese Seite zählt.",
    orgNoteGuianas: "Französisch-Guayana gehört zu Frankreich und steht deshalb nicht als eigenes Land in der Liste.",
    fPartOf: "Teil von",
    legendGroup: "Orange: die Länder dieser Gruppe.",
    gbH: "Vereinigtes Königreich, Großbritannien und Britische Inseln: Was ist der Unterschied?",
    gbUK: "Das Vereinigte Königreich (UK) ist der souveräne Staat. Es besteht aus England, Schottland, Wales und Nordirland.",
    gbGB: "Großbritannien ist die Hauptinsel. Als politischer Begriff meint es England, Schottland und Wales, aber nicht Nordirland.",
    gbBr: "Im Alltag wird «Großbritannien» oft für das ganze Vereinigte Königreich gebraucht, das ist streng genommen aber nicht dasselbe.",
    gbIsles: "Die Britischen Inseln sind eine geografische Inselgruppe: Großbritannien, Irland und viele kleinere Inseln. Irland ist ein eigener Staat und gehört nicht zum Vereinigten Königreich.",
    gbQ: "Was ist der Unterschied zwischen dem Vereinigten Königreich und Großbritannien?",
    printSetTitle: "{t}: Karte und Arbeitsblatt zum Ausdrucken (PDF)",
    printSetDesc: "{t} ({n}) auf einer kostenlosen Karte zum Ausdrucken: stumme Karte, nummeriertes Arbeitsblatt, beschriftete Karte und Lösungen, jeweils als eigenes PDF.",
    orgMem: "{org}: Mitgliedstaaten",
    printSecSets: "Äquator, Hemisphären und Organisationen",

    orgHubTitle: "Internationale Organisationen: Mitgliedsländer",

    orgHubDesc: "Welche Länder gehören zu G20, G7, BRICS, ASEAN, SAARC, SOZ, EU, NATO und anderen Gruppen: Mitgliederlisten, Karten und Quiz.",

    orgTitle: "{org}: Mitgliedsländer",

    orgAnswer: "{org} hat {n} Mitgliedsländer: {list}.",

    fFounded: "Gründung",

    fHQ: "Sitz",

    fHead: "Leitung",

    fMembers: "Mitgliedsländer",

    fWebsite: "Website",

    noHQ: "Kein ständiger Sitz",

    headSource: "Leitung laut Wikidata am {d}.",

    orgQuiz: "Finde die {n} Mitglieder auf der Karte",

    fMemberOf: "Mitglied in",

    orgNoteG20: "Auch die Europäische Union und die Afrikanische Union sind Mitglieder.",

    orgNoteG7: "Russland war von 1997 bis 2014 ebenfalls Mitglied, als die Gruppe G8 hieß.",

    orgNoteAU: "Auch die Demokratische Arabische Republik Sahara (Westsahara) ist Mitglied.",

    orgNoteMercosur: "Venezuela ist Mitglied, aber suspendiert.",

    orgNoteUNSC: "Das sind die fünf ständigen Mitglieder; zehn weitere werden für zwei Jahre gewählt.",

    orgDesc: "{org}: die {n} Mitgliedsländer auf einer Karte, mit Gründungsjahr, Sitz und Leitung, dazu ein Quiz.",

    moreIn: "Weitere Länder in {cont}",

    qLoc: "Wo liegt {c}?",

    aLoc: "{c} liegt in {cont}. Nachbarländer: {list}.",

    aLocNone: "{c} liegt in {cont} und hat keine Landgrenzen.",

    qCur: "Welche Währung hat {c}?",

    aCur: "Währung von {c}: {list}.",

    qLang: "Welche Sprache spricht man in {c}?",

    aLang: "Amtssprache von {c}: {list}.",

    qCall: "Was ist die Vorwahl von {c}?",

    aCall: "Die internationale Vorwahl von {c} ist {code}.",

    fCalling: "Vorwahl",

    aboutMaps: "Länderkarten nutzen die Grenzen von Natural Earth 1:50m (gemeinfrei) über das Paket world-atlas. Karten der Provinzen und Bundesstaaten nutzen die ADM1-Grenzen von geoBoundaries (Lizenzen je Land unten) oder OpenStreetMap, wo sich die Gliederung zuletzt geändert hat. Die Karte eines einzelnen Landes folgt der offiziellen Karte dieses Landes, einschließlich beanspruchter Gebiete: Die Karten Indiens und Pakistans enthalten beide Jammu und Kashmir, die Chinas enthält Taiwan, die Russlands die Krim und vier ukrainische Regionen, die Serbiens den Kosovo und die Venezuelas Guayana Esequiba. Auf Welt- und Kontinentkarten gehören das von Indien verwaltete Jammu und Kashmir sowie Ladakh zu Pakistan, die Krim zur Ukraine, die Golanhöhen zu Syrien und Taiwan zu China; der Kosovo und die Falklandinseln werden gezeigt, aber nicht abgefragt. Die Karten sind vereinfacht, damit sie schnell laden, deshalb sind kleine Details geglättet.",
    aPopWB: "Laut Weltbank hat {c} {pop} Einwohner ({year}).",
    aboutData: "Ländernamen, Hauptstädte, Namen und Hauptstädte der Provinzen sowie deren Einwohnerzahlen stammen aus Wikidata (CC0), abgerufen am {d}. Die Einwohnerzahlen der Länder stammen von der Weltbank (CC BY 4.0), aus dem neuesten veröffentlichten Jahr, für alle Länder dasselbe Jahr; die der Vatikanstadt aus Wikidata. ISO-Codes, Flächen, Grenzen, Sprachen und Währungen stammen aus dem Datensatz world-countries (ODbL). Wo diese Quellen von offiziellen Angaben abweichen (eine fehlende zweite Hauptstadt, eine Regionalsprache als Amtssprache), korrigiert die Seite sie.",
    kashmirQuiz: "Das gilt für die Welt- und Kontinentkarten. Die Karte eines einzelnen Landes (seine Bundesstaaten oder Provinzen) folgt der offiziellen Karte dieses Landes, daher enthalten die Quiz zu Indien und zu Pakistan beide Jammu und Kashmir.",
    usTitle: 'Über Geography Arcade',
    usDesc: 'Wer Geography Arcade macht, warum es kostenlos ist und wie wir Quiz, Karten und Fakten korrekt halten.',
    us: [
      ['Was Geography Arcade ist', 'Geography Arcade ist eine kostenlose Website, auf der man Geografie spielerisch lernt. Es gibt Kartenquiz, Hauptstadt- und Flaggenspiele und Karten zum Ausdrucken für alle {n} Länder, dazu Provinzen und Bundesstaaten von {p} Ländern, in {l} Sprachen.'],
      ['Wer wir sind', 'Geography Arcade wird von einem kleinen unabhängigen Team gemacht. Wir gehören zu keiner Schule, keinem Verlag und keiner Regierung. Die Quiz, die Erklärungen und die Prüfung der Daten machen wir selbst.'],
      ['Warum es kostenlos ist', 'Alles auf der Website ist kostenlos, zum Spielen wie zum Ausdrucken, ohne Konto und ohne Bezahlschranke. Jeder mit einem Browser soll die Weltkarte in seiner eigenen Sprache lernen können.'],
      ['Wie wir die Daten korrekt halten', 'Ländernamen, Hauptstädte und Einwohnerzahlen kommen aus Wikidata, die Karten aus Natural Earth, geoBoundaries und OpenStreetMap. Die Daten werden jeden Monat automatisch aktualisiert, und ein geänderter Name wartet einige Wochen, bevor er erscheint, damit eine falsche Bearbeitung an der Quelle nicht in die Quiz gelangt.'],
      ['Für Lehrkräfte und Eltern', 'Die Quiz und Karten zum Ausdrucken dürfen gern im Unterricht und zu Hause genutzt werden. Jede Karte gibt es als stumme Karte, Arbeitsblatt, beschriftete Karte und Lösungsblatt.'],
      ['Einen Fehler entdeckt?', 'Schreib uns an {e}, und wir sehen es uns an.'],
    ],
    usSources: 'Alle Datenquellen ansehen',
    pvTitle: 'Datenschutzerklärung',
    pvDesc: 'Was Geography Arcade erfasst (sehr wenig), wie wir Google Analytics nutzen und welche Wahl du hast.',
    pvDate: 'Zuletzt aktualisiert: {d}',
    pv: [
      ['Kurz gesagt', 'Du kannst Geography Arcade ohne Konto nutzen, ohne uns etwas über dich zu verraten. Wir nutzen Google Analytics, um Besuche zu zählen und zu sehen, welche Seiten nützlich sind; die Werbefunktionen sind ausgeschaltet. Wir verkaufen keine Daten und zeigen keine Werbung.'],
      ['Was auf deinem Gerät bleibt', 'Deine besten Quizergebnisse werden in deinem Browser gespeichert (Local Storage), damit du sie überbieten kannst. Sie verlassen dein Gerät nie. Du kannst sie löschen, indem du die Daten dieser Website in deinem Browser entfernst.'],
      ['Google Analytics', 'Wir nutzen Google Analytics 4, um zu verstehen, wie die Website genutzt wird: welche Seiten aufgerufen werden, wo die Besucher ungefähr sind (Land und Stadt), welches Gerät und welchen Browser sie nutzen, von welcher Website sie kommen und wie sie eine Seite nutzen. Google kann deine IP-Adresse nutzen, um deinen ungefähren Standort zu bestimmen, aber Google Analytics 4 speichert keine IP-Adressen. Google Signals und Werbefunktionen sind ausgeschaltet.'],
      ['Cookies', 'Außerhalb des Europäischen Wirtschaftsraums, des Vereinigten Königreichs und der Schweiz setzt Google Analytics zwei Erstanbieter-Cookies (_ga und _ga_ mit einer Kennung), um neue von wiederkehrenden Besuchen zu unterscheiden. Im Europäischen Wirtschaftsraum, im Vereinigten Königreich und in der Schweiz werden keine Analyse-Cookies gesetzt: Google erhält nur cookielose Messsignale. Die Website setzt keine weiteren Cookies.'],
      ['Schriften', 'Ein Teil des Textes nutzt Schriften von Google Fonts. Dein Browser lädt sie von Googles Servern, die dabei deine IP-Adresse sehen.'],
      ['Hosting', 'Die Website wird bei Hostinger gehostet. Wie die meisten Hoster können dessen Server übliche Zugriffsprotokolle (IP-Adresse, Browser und aufgerufene Seite) für die Sicherheit und den Betrieb der Website speichern.'],
      ['E-Mail', 'Wenn du uns an {e} schreibst, nutzen wir deine Adresse und Nachricht nur, um dir zu antworten.'],
      ['Kinder', 'Geography Arcade ist für Lernende jeden Alters gemacht, auch für Kinder. Die Website hat keine Konten, Formulare oder Chats, daher kann uns niemand darüber persönliche Daten geben.'],
      ['Deine Wahl', 'Du kannst Google Analytics mit den Datenschutzeinstellungen deines Browsers, einem Inhaltsblocker oder Googles Deaktivierungs-Add-on (tools.google.com/dlpage/gaoptout) blockieren. Die Quiz und Karten zum Ausdrucken funktionieren in beiden Fällen gleich.'],
      ['Änderungen dieser Erklärung', 'Wenn wir etwas Neues einführen, etwa freiwillige Konten, um deinen Fortschritt geräteübergreifend zu speichern, aktualisieren wir zuerst diese Seite und ändern das Datum oben.'],
      ['Kontakt', 'Fragen zum Datenschutz: {e}.'],
    ],
  },
  bn: {
    navUs: 'আমাদের সম্পর্কে', navPrivacy: 'গোপনীয়তা',

    pdfBtn: "PDF ডাউনলোড করুন",
    histHubTitle: "প্রাচীন সভ্যতা: সময়রেখা ও মানচিত্র",
    histHubDesc: "সিন্ধু উপত্যকা থেকে ইনকা পর্যন্ত ইতিহাসের প্রধান সভ্যতা ও সাম্রাজ্য, শুরুর ক্রম অনুযায়ী। প্রতিটি কত সময় টিকে ছিল এবং আজকের সীমানার মানচিত্রে তার এলাকা কতটা ছিল দেখুন।",
    histHubShort: "প্রাচীন সভ্যতা",
    histTitle: "{name}: সময়কাল, এলাকা ও মানচিত্র",
    histDesc: "{name} কখন ছিল? {a} থেকে {b} পর্যন্ত। আজকের সীমানার মানচিত্রে এর এলাকা এবং আধুনিক দেশগুলো দেখুন।",
    histAnswer: "{name}: {a} থেকে {b} পর্যন্ত ({d})। এলাকা: {list}-এর কিছু অংশ।",
    fPeriod: "সময়কাল",
    fDuration: "স্থায়িত্ব",
    fCovered: "আজকের যেসব দেশ এর মধ্যে ছিল",
    fMapShows: "মানচিত্র দেখায়",
    histMapYear: "{y} সালের কাছাকাছি এলাকা",
    histMapCaption: "কমলা: আজকের সীমানায় {y} সালের কাছাকাছি {name}-এর আনুমানিক এলাকা।",
    histWiki: "উইকিপিডিয়ায় আরও পড়ুন",
    histAbout: "এই মানচিত্র সম্পর্কে",
    histNote: "মানচিত্রটি আনুমানিক। প্রাচীন সীমানা নির্দিষ্ট রেখা ছিল না, এবং আকৃতি খোলা Historical Basemaps প্রকল্প থেকে নেওয়া, যা সতর্ক করে যে ঐতিহাসিক সীমানা অনিশ্চিত। এটি একটি মুহূর্ত দেখায়, পুরো সময়কাল নয়।",
    histSource: "মানচিত্রের তথ্য: Historical Basemaps (GPL-3.0 লাইসেন্স)",
    histSame: "একই সময়ের অন্য সভ্যতা",
    fCivs: "এখানকার প্রাচীন সভ্যতা",
    histTimeline: "সময়রেখা",
    thPeriod: "সময়কাল",
    eraBCE: "{n} খ্রিস্টপূর্ব",
    eraCE: "{n} খ্রিস্টাব্দ",
    eraCirca: "আনুমানিক {x}",
    histRange: "{a} থেকে {b} পর্যন্ত",
    durAbout: "প্রায় {n} বছর",
    regTitle: "{org}: দেশের তালিকা",
    regDesc: "{org}-এ কোন কোন দেশ আছে? মানচিত্র, কুইজ ও বিনামূল্যের প্রিন্টযোগ্য মানচিত্র ওয়ার্কশিটসহ সব {n}টি দেশ।",
    regAnswer: "{org}-এ {n}টি দেশ আছে: {list}।",
    fCountries: "দেশ",
    regHubTitle: "অঞ্চল ও দেশের গোষ্ঠী",
    fFormer: "প্রাক্তন রাষ্ট্র",
    fFormerRange: "{n} ({a} থেকে {b} পর্যন্ত)",
    fUnitedUntil: "ঐক্যবদ্ধ ছিল",
    fBecame: "স্বাধীন হয়েছে",
    orgNoteKosovo: "কসোভো ২০০৮ সালে সার্বিয়া থেকে স্বাধীনতা ঘোষণা করে। এর মর্যাদা বিতর্কিত, এবং এটি এই সাইটের 195টি দেশের মধ্যে নেই।",
    orgNoteGuianas: "ফরাসি গায়ানা ফ্রান্সের অংশ, তাই এটি আলাদা দেশ হিসেবে তালিকাভুক্ত নয়।",
    fPartOf: "যে অঞ্চলের অংশ",
    legendGroup: "কমলা: এই গোষ্ঠীর দেশগুলো।",
    gbH: "ইউকে, ব্রিটেন ও গ্রেট ব্রিটেনের মধ্যে পার্থক্য কী?",
    gbUK: "যুক্তরাজ্য (ইউকে) সার্বভৌম দেশ। এতে ইংল্যান্ড, স্কটল্যান্ড, ওয়েলস ও উত্তর আয়ারল্যান্ড আছে।",
    gbGB: "গ্রেট ব্রিটেন প্রধান দ্বীপ। রাজনৈতিক শব্দ হিসেবে এর অর্থ ইংল্যান্ড, স্কটল্যান্ড ও ওয়েলস; উত্তর আয়ারল্যান্ড এতে নেই।",
    gbBr: "ব্রিটেন প্রতিদিনের কথাবার্তার শব্দ। সাধারণত এর অর্থ গ্রেট ব্রিটেন, আর অনেকে পুরো যুক্তরাজ্য বোঝাতেও এটি ব্যবহার করেন।",
    gbIsles: "ব্রিটিশ দ্বীপপুঞ্জ দ্বীপগুলোর ভৌগোলিক গুচ্ছ: গ্রেট ব্রিটেন, আয়ারল্যান্ড ও অনেক ছোট দ্বীপ। আয়ারল্যান্ড আলাদা দেশ, যুক্তরাজ্যের অংশ নয়।",
    gbQ: "যুক্তরাজ্য, ব্রিটেন ও গ্রেট ব্রিটেনের মধ্যে পার্থক্য কী?",
    printSetTitle: "{t}: প্রিন্টযোগ্য মানচিত্র ও ওয়ার্কশিট (PDF)",
    printSetDesc: "{t} ({n}) বিনামূল্যের প্রিন্টযোগ্য মানচিত্রে: ফাঁকা মানচিত্র, নম্বর দেওয়া ওয়ার্কশিট, নামসহ মানচিত্র এবং উত্তরপত্র, প্রতিটি আলাদা PDF-এ।",
    orgMem: "{org}-এর সদস্য দেশ",
    printSecSets: "বিষুবরেখা, গোলার্ধ ও আন্তর্জাতিক সংস্থা",

    orgHubTitle: "আন্তর্জাতিক সংস্থা: সদস্য দেশ",

    orgHubDesc: "জি২০, জি৭, ব্রিকস, আসিয়ান, সার্ক, এসসিও, ইউরোপীয় ইউনিয়ন, ন্যাটো ও অন্যান্য জোটে কোন কোন দেশ আছে: সদস্যদের তালিকা, মানচিত্র ও কুইজ।",

    orgTitle: "{org}: সদস্য দেশ",

    orgAnswer: "{org}-এর সদস্য দেশ {n}টি: {list}।",

    fFounded: "প্রতিষ্ঠা",

    fHQ: "সদর দপ্তর",

    fHead: "প্রধান",

    fMembers: "সদস্য দেশ",

    fWebsite: "ওয়েবসাইট",

    noHQ: "কোনো স্থায়ী সদর দপ্তর নেই",

    headSource: "প্রধানের নাম Wikidata-র {d} তারিখের তথ্য অনুযায়ী।",

    orgQuiz: "মানচিত্রে {n}টি সদস্য খুঁজুন",

    fMemberOf: "সদস্যপদ",

    orgNoteG20: "ইউরোপীয় ইউনিয়ন ও আফ্রিকান ইউনিয়নও সদস্য।",

    orgNoteG7: "রাশিয়াও ১৯৯৭ থেকে ২০১৪ পর্যন্ত সদস্য ছিল, তখন জোটটির নাম ছিল জি৮।",

    orgNoteAU: "সাহরাউই আরব গণতান্ত্রিক প্রজাতন্ত্র (পশ্চিম সাহারা)ও সদস্য।",

    orgNoteMercosur: "ভেনেজুয়েলা সদস্য, তবে স্থগিত।",

    orgNoteUNSC: "এরা পাঁচ স্থায়ী সদস্য; আরও দশটি সদস্য দুই বছরের জন্য নির্বাচিত হয়।",

    orgDesc: "{org}: মানচিত্রে {n}টি সদস্য দেশ, প্রতিষ্ঠার বছর, সদর দপ্তর ও প্রধানসহ, আর একটি কুইজ।",

    moreIn: "{cont}-এর আরও দেশ",

    qLoc: "{c} কোথায় অবস্থিত?",

    aLoc: "{c} {cont}-এ অবস্থিত। এর প্রতিবেশী দেশ: {list}।",

    aLocNone: "{c} {cont}-এ অবস্থিত; এর কোনো স্থল সীমান্ত নেই।",

    qCur: "{c}-এর মুদ্রার নাম কী?",

    aCur: "{c}-এর মুদ্রা: {list}।",

    qLang: "{c}-এর ভাষা কী?",

    aLang: "{c}-এর সরকারি ভাষা: {list}।",

    qCall: "{c}-এর কলিং কোড কত?",

    aCall: "{c}-এর আন্তর্জাতিক কলিং কোড {code}।",

    fCalling: "কলিং কোড",

    aboutMaps: "দেশের মানচিত্রে world-atlas প্যাকেজের মাধ্যমে Natural Earth 1:50m সীমানা (পাবলিক ডোমেইন) ব্যবহার করা হয়। প্রদেশ ও রাজ্যের মানচিত্রে geoBoundaries ADM1 সীমানা (প্রতিটি দেশের লাইসেন্স নিচে দেওয়া) বা যেখানে বিভাগ সম্প্রতি বদলেছে সেখানে OpenStreetMap ব্যবহার করা হয়। একটি দেশের মানচিত্র সেই দেশের সরকারি মানচিত্র অনুসরণ করে, তার দাবি করা ভূখণ্ডসহ: ভারত ও পাকিস্তান দুই দেশের মানচিত্রেই জম্মু ও কাশ্মীর আছে, চীনের মানচিত্রে তাইওয়ান, রাশিয়ার মানচিত্রে ক্রিমিয়া ও ইউক্রেনের চারটি অঞ্চল, সার্বিয়ার মানচিত্রে কসোভো এবং ভেনেজুয়েলার মানচিত্রে গায়ানা এসেকিবা। বিশ্ব ও মহাদেশের মানচিত্রে ভারত-শাসিত জম্মু ও কাশ্মীর এবং লাদাখ পাকিস্তানের অংশ, ক্রিমিয়া ইউক্রেনের, গোলান মালভূমি সিরিয়ার এবং তাইওয়ান চীনের অংশ হিসেবে দেখানো হয়েছে; কসোভো ও ফকল্যান্ড দ্বীপপুঞ্জ দেখানো হয়, কিন্তু এদের নিয়ে প্রশ্ন করা হয় না। দ্রুত লোড হওয়ার জন্য মানচিত্র সরল করা হয়েছে, তাই ছোট খুঁটিনাটি মসৃণ করা হয়েছে।",
    aPopWB: "বিশ্বব্যাংকের হিসাবে {c}-এর জনসংখ্যা {pop} ({year})।",
    aboutData: "দেশের নাম, রাজধানী, প্রদেশের নাম, প্রদেশের রাজধানী ও প্রদেশের জনসংখ্যা Wikidata (CC0) থেকে নেওয়া, {d} তারিখে। দেশের জনসংখ্যা বিশ্বব্যাংক (CC BY 4.0) থেকে, তাদের প্রকাশিত সর্বশেষ বছরের, সব দেশের জন্য একই বছর; ভ্যাটিকান সিটির জনসংখ্যা Wikidata থেকে। ISO কোড, আয়তন, সীমান্ত, ভাষা ও মুদ্রা world-countries ডেটাসেট (ODbL) থেকে। এসব উৎস যেখানে সরকারি তথ্যের সঙ্গে মেলে না (যেমন দ্বিতীয় রাজধানী বাদ পড়া, বা আঞ্চলিক ভাষাকে সরকারি ভাষা বলা), সেখানে সাইটটি তা সংশোধন করে।",
    kashmirQuiz: "এটি বিশ্ব ও মহাদেশের মানচিত্রের ক্ষেত্রে প্রযোজ্য। একটি দেশের মানচিত্র (তার রাজ্য বা প্রদেশ) সেই দেশের সরকারি মানচিত্র অনুসরণ করে, তাই ভারত ও পাকিস্তান দুই দেশের কুইজেই জম্মু ও কাশ্মীর আছে।",
    usTitle: 'Geography Arcade সম্পর্কে',
    usDesc: 'Geography Arcade কারা বানায়, এটি কেন বিনামূল্যে, আর আমরা কুইজ, মানচিত্র ও তথ্য কীভাবে নির্ভুল রাখি।',
    us: [
      ['Geography Arcade কী', 'Geography Arcade খেলতে খেলতে ভূগোল শেখার একটি বিনামূল্যের ওয়েবসাইট। এতে সব {n}টি দেশের মানচিত্র কুইজ, রাজধানী ও পতাকার খেলা এবং প্রিন্টযোগ্য মানচিত্র আছে, সঙ্গে {p}টি দেশের প্রদেশ ও রাজ্য, {l}টি ভাষায়।'],
      ['আমরা কারা', 'Geography Arcade বানায় একটি ছোট স্বাধীন দল। আমরা কোনো স্কুল, প্রকাশক বা সরকারের অংশ নই। কুইজ তৈরি, ব্যাখ্যা লেখা আর তথ্য যাচাই আমরা নিজেরাই করি।'],
      ['এটি কেন বিনামূল্যে', 'সাইটের সবকিছু খেলা ও প্রিন্ট করা বিনামূল্যে, কোনো অ্যাকাউন্ট বা পেওয়াল ছাড়াই। আমরা চাই ব্রাউজার আছে এমন যে কেউ নিজের ভাষায় বিশ্বের মানচিত্র শিখতে পারুক।'],
      ['আমরা কীভাবে তথ্য নির্ভুল রাখি', 'দেশের নাম, রাজধানী ও জনসংখ্যা আসে Wikidata থেকে, আর মানচিত্র Natural Earth, geoBoundaries ও OpenStreetMap থেকে। তথ্য প্রতি মাসে নিজে থেকে আপডেট হয়, আর কোনো নাম বদলালে তা দেখানোর আগে কয়েক সপ্তাহ অপেক্ষা করে, যাতে উৎসে ভুল সম্পাদনা কুইজে না পৌঁছায়।'],
      ['শিক্ষক ও অভিভাবকদের জন্য', 'ক্লাসে ও বাড়িতে কুইজ এবং প্রিন্টযোগ্য মানচিত্র ব্যবহার করতে পারেন। প্রতিটি প্রিন্ট মানচিত্র ফাঁকা মানচিত্র, ওয়ার্কশিট, নামসহ মানচিত্র ও উত্তরপত্র হিসেবে পাওয়া যায়।'],
      ['কোনো ভুল চোখে পড়েছে?', '{e}-এ আমাদের লিখুন, আমরা খতিয়ে দেখব।'],
    ],
    usSources: 'সব তথ্যসূত্র দেখুন',
    pvTitle: 'গোপনীয়তা নীতি',
    pvDesc: 'Geography Arcade কী তথ্য নেয় (খুব সামান্য), আমরা Google Analytics কীভাবে ব্যবহার করি, এবং আপনার কী কী বিকল্প আছে।',
    pvDate: 'সর্বশেষ আপডেট: {d}',
    pv: [
      ['সংক্ষেপে', 'অ্যাকাউন্ট ছাড়া এবং নিজের সম্পর্কে কিছু না জানিয়েই Geography Arcade ব্যবহার করতে পারেন। ভিজিট গোনা ও কোন পেজ কাজে লাগছে তা দেখতে আমরা Google Analytics ব্যবহার করি, এর বিজ্ঞাপন সুবিধা বন্ধ রেখে। আমরা তথ্য বিক্রি করি না এবং বিজ্ঞাপন দেখাই না।'],
      ['আপনার ডিভাইসে যা থাকে', 'আপনার কুইজের সেরা স্কোর আপনার ব্রাউজারে (লোকাল স্টোরেজ) সেভ থাকে, যাতে আপনি তা ছাড়িয়ে যাওয়ার চেষ্টা করতে পারেন। এগুলো কখনো আপনার ডিভাইস ছেড়ে যায় না। ব্রাউজারে এই সাইটের ডেটা মুছে ফেলে এগুলো মুছতে পারেন।'],
      ['Google Analytics', 'সাইট কীভাবে ব্যবহার হচ্ছে তা বুঝতে আমরা Google Analytics 4 ব্যবহার করি: কোন পেজ দেখা হচ্ছে, দর্শকেরা মোটামুটি কোথায় (দেশ ও শহর), কোন ডিভাইস ও ব্রাউজার, কোন সাইট থেকে এসেছেন এবং পেজ কীভাবে ব্যবহার করছেন। আনুমানিক অবস্থান বের করতে Google আপনার IP ঠিকানা ব্যবহার করতে পারে, তবে Google Analytics 4 IP ঠিকানা সংরক্ষণ করে না। Google Signals ও বিজ্ঞাপন সুবিধা বন্ধ।'],
      ['কুকি', 'ইউরোপীয় অর্থনৈতিক অঞ্চল, যুক্তরাজ্য ও সুইজারল্যান্ডের বাইরে Google Analytics দুটি ফার্স্ট-পার্টি কুকি (_ga এবং _ga_ সঙ্গে একটি আইডি) সেট করে, নতুন ও ফিরে আসা ভিজিট আলাদা করতে। ইউরোপীয় অর্থনৈতিক অঞ্চল, যুক্তরাজ্য ও সুইজারল্যান্ডে কোনো অ্যানালিটিক্স কুকি সেট হয় না: Google শুধু কুকি ছাড়া পরিমাপ সংকেত পায়। সাইট আর কোনো কুকি সেট করে না।'],
      ['ফন্ট', 'কিছু লেখায় Google Fonts-এর ওয়েব ফন্ট ব্যবহার হয়, তাই আপনার ব্রাউজার সেগুলো Google-এর সার্ভার থেকে ডাউনলোড করে, যারা আপনার IP ঠিকানা দেখতে পায়।'],
      ['হোস্টিং', 'সাইটটি Hostinger-এ হোস্ট করা। বেশিরভাগ ওয়েব হোস্টের মতো এর সার্ভার নিরাপত্তা ও সাইট চালু রাখার জন্য সাধারণ অ্যাক্সেস লগ (IP ঠিকানা, ব্রাউজার ও চাওয়া পেজ) রাখতে পারে।'],
      ['ইমেইল', '{e}-এ লিখলে আমরা আপনার ঠিকানা ও বার্তা শুধু উত্তর দেওয়ার জন্য ব্যবহার করি।'],
      ['শিশু', 'Geography Arcade শিশুসহ সব বয়সের শিক্ষার্থীদের জন্য। সাইটে কোনো অ্যাকাউন্ট, ফর্ম বা চ্যাট নেই, তাই কেউ এর মাধ্যমে আমাদের ব্যক্তিগত তথ্য দিতে পারে না।'],
      ['আপনার বিকল্প', 'ব্রাউজারের গোপনীয়তা সেটিং, কনটেন্ট ব্লকার বা Google-এর অপ্ট-আউট অ্যাড-অন (tools.google.com/dlpage/gaoptout) দিয়ে Google Analytics বন্ধ করতে পারেন। দুই ক্ষেত্রেই কুইজ ও প্রিন্ট মানচিত্র একইভাবে চলে।'],
      ['এই নীতির পরিবর্তন', 'নতুন কিছু যোগ করলে, যেমন বিভিন্ন ডিভাইসে অগ্রগতি সেভ রাখার জন্য ঐচ্ছিক অ্যাকাউন্ট, আমরা আগে এই পেজ আপডেট করব এবং ওপরের তারিখ বদলাব।'],
      ['যোগাযোগ', 'গোপনীয়তা নিয়ে প্রশ্ন: {e}।'],
    ],
  },
  pt: {
    navUs: 'Quem somos', navPrivacy: 'Privacidade',

    pdfBtn: "Baixar PDF",
    histHubTitle: "Civilizações antigas: linha do tempo e mapas",
    histHubDesc: "As grandes civilizações e impérios da história, do vale do Indo aos incas, por ordem de surgimento. Veja quanto tempo durou cada uma e o território que abrangeu num mapa com as fronteiras de hoje.",
    histHubShort: "Civilizações antigas",
    histTitle: "{name}: datas, território e mapa",
    histDesc: "Quando existiu {name}? De {a} a {b}. Veja o território num mapa com as fronteiras atuais e os países modernos que abrangia.",
    histAnswer: "{name}: de {a} a {b} ({d}). Área coberta: partes de {list}.",
    fPeriod: "Período",
    fDuration: "Duração",
    fCovered: "Países atuais abrangidos",
    fMapShows: "O mapa mostra",
    histMapYear: "O território por volta de {y}",
    histMapCaption: "Laranja: território aproximado de {name} por volta de {y}, sobre as fronteiras atuais.",
    histWiki: "Saiba mais na Wikipédia",
    histAbout: "Sobre este mapa",
    histNote: "O mapa é aproximado. As fronteiras antigas não eram linhas fixas, e a forma vem do projeto aberto Historical Basemaps, que avisa que os limites históricos são incertos. Mostra um momento, não todo o período.",
    histSource: "Dados do mapa: Historical Basemaps (licença GPL-3.0)",
    histSame: "Outras civilizações na mesma época",
    fCivs: "Civilizações antigas aqui",
    histTimeline: "Linha do tempo",
    thPeriod: "Período",
    eraBCE: "{n} a.C.",
    eraCE: "{n} d.C.",
    eraCirca: "c. {x}",
    histRange: "de {a} a {b}",
    durAbout: "cerca de {n} anos",
    regTitle: "{org}: lista dos países",
    regDesc: "Que países fazem parte de {org}? Os {n} países com mapa, quiz e ficha de mapa para imprimir grátis.",
    regAnswer: "{org} inclui {n} países: {list}.",
    fCountries: "Países",
    regHubTitle: "Regiões e grupos de países",
    fFormer: "Estado anterior",
    fFormerRange: "{n} ({a} a {b})",
    fUnitedUntil: "Unidos até",
    fBecame: "Independente desde",
    orgNoteKosovo: "O Kosovo declarou independência da Sérvia em 2008. O seu estatuto é contestado e não é um dos 195 países contados neste site.",
    orgNoteGuianas: "A Guiana Francesa faz parte da França, por isso não aparece como país separado.",
    fPartOf: "Faz parte de",
    legendGroup: "Laranja: os países deste grupo.",
    gbH: "Reino Unido, Grã-Bretanha e Ilhas Britânicas: qual é a diferença?",
    gbUK: "O Reino Unido é o país soberano. É formado por Inglaterra, Escócia, País de Gales e Irlanda do Norte.",
    gbGB: "A Grã-Bretanha é a ilha principal. Como termo político, significa Inglaterra, Escócia e País de Gales, sem a Irlanda do Norte.",
    gbBr: "No dia a dia, «Grã-Bretanha» costuma ser usada para todo o Reino Unido, mas, em sentido estrito, não é a mesma coisa.",
    gbIsles: "As Ilhas Britânicas são o grupo geográfico de ilhas: Grã-Bretanha, Irlanda e muitas ilhas menores. A Irlanda é um país independente e não faz parte do Reino Unido.",
    gbQ: "Qual é a diferença entre Reino Unido e Grã-Bretanha?",
    printSetTitle: "{t}: mapa para imprimir e ficha (PDF)",
    printSetDesc: "{t} ({n}) num mapa grátis para imprimir: mapa mudo, ficha numerada, mapa com nomes e gabarito, cada um em seu próprio PDF.",
    orgMem: "Países-membros de {org}",
    printSecSets: "Equador, hemisférios e organizações",

    orgHubTitle: "Organizações internacionais: países-membros",

    orgHubDesc: "Quais países fazem parte do G20, G7, BRICS, ASEAN, SAARC, OCX, UE, OTAN e outros grupos: listas de membros, mapas e quizzes.",

    orgTitle: "{org}: países-membros",

    orgAnswer: "{org} tem {n} países-membros: {list}.",

    fFounded: "Fundação",

    fHQ: "Sede",

    fHead: "Dirigente",

    fMembers: "Países-membros",

    fWebsite: "Site",

    noHQ: "Sem sede permanente",

    headSource: "Dirigente segundo o Wikidata em {d}.",

    orgQuiz: "Encontre os {n} membros no mapa",

    fMemberOf: "Membro de",

    orgNoteG20: "A União Europeia e a União Africana também são membros.",

    orgNoteG7: "A Rússia também foi membro de 1997 a 2014, quando o grupo se chamava G8.",

    orgNoteAU: "A República Árabe Saaraui Democrática (Saara Ocidental) também é membro.",

    orgNoteMercosur: "A Venezuela é membro, mas está suspensa.",

    orgNoteUNSC: "Estes são os cinco membros permanentes; outros dez são eleitos por dois anos.",

    orgDesc: "{org}: os {n} países-membros num mapa, com ano de fundação, sede e dirigente, e um quiz.",

    moreIn: "Mais países: {cont}",

    qLoc: "Onde fica {c}?",

    aLoc: "{c} fica na {cont}. Faz fronteira com {list}.",

    aLocNone: "{c} fica na {cont} e não tem fronteiras terrestres.",

    qCur: "Qual é a moeda de {c}?",

    aCur: "Moeda de {c}: {list}.",

    qLang: "Que língua se fala em {c}?",

    aLang: "Língua oficial de {c}: {list}.",

    qCall: "Qual é o código de discagem de {c}?",

    aCall: "O código internacional de discagem de {c} é {code}.",

    fCalling: "Código de discagem",

    aboutMaps: "Os mapas dos países usam as fronteiras Natural Earth 1:50m (domínio público) por meio do pacote world-atlas. Os mapas de províncias e estados usam os limites ADM1 do geoBoundaries (licenças por país abaixo), ou o OpenStreetMap onde as divisões mudaram recentemente. O mapa de um único país segue o mapa oficial desse país, incluindo os territórios que ele reivindica: os da Índia e do Paquistão incluem Jammu e Caxemira, o da China inclui Taiwan, o da Rússia inclui a Crimeia e quatro regiões ucranianas, o da Sérvia inclui Kosovo e o da Venezuela inclui a Guiana Essequiba. Nos mapas do mundo e dos continentes, Jammu e Caxemira e Ladakh administrados pela Índia aparecem como parte do Paquistão, a Crimeia como parte da Ucrânia, as Colinas de Golã como parte da Síria e Taiwan como parte da China; Kosovo e as Ilhas Malvinas aparecem, mas não são perguntados. Os mapas são simplificados para carregar rápido, por isso os detalhes pequenos são suavizados.",
    aPopWB: "Segundo o Banco Mundial, a população de {c} é de {pop} habitantes ({year}).",
    aboutData: "Os nomes dos países, capitais, nomes e capitais das províncias e a população das províncias vêm do Wikidata (CC0), obtidos em {d}. A população dos países vem do Banco Mundial (CC BY 4.0), o ano mais recente publicado, o mesmo para todos os países; a da Cidade do Vaticano vem do Wikidata. Códigos ISO, áreas, fronteiras, idiomas e moedas vêm do conjunto world-countries (ODbL). Quando essas fontes diferem das oficiais (uma segunda capital ausente, um idioma regional dado como oficial), o site as corrige.",
    kashmirQuiz: "Isso vale para os mapas do mundo e dos continentes. O mapa de um único país (seus estados ou províncias) segue o mapa oficial desse país, por isso os quizzes da Índia e do Paquistão incluem Jammu e Caxemira.",
    usTitle: 'Sobre o Geography Arcade',
    usDesc: 'Quem faz o Geography Arcade, por que ele é grátis e como mantemos quizzes, mapas e dados corretos.',
    us: [
      ['O que é o Geography Arcade', 'O Geography Arcade é um site grátis para aprender geografia jogando. Tem quizzes de mapa, jogos de capitais e bandeiras e mapas para imprimir dos {n} países, além de províncias e estados de {p} países, em {l} idiomas.'],
      ['Quem somos', 'O Geography Arcade é feito por uma pequena equipe independente. Não fazemos parte de nenhuma escola, editora ou governo. Criamos os quizzes, escrevemos as explicações e conferimos os dados nós mesmos.'],
      ['Por que é grátis', 'Tudo no site é grátis para jogar e para imprimir, sem cadastro e sem paywall. Queremos que qualquer pessoa com um navegador possa aprender o mapa do mundo no próprio idioma.'],
      ['Como mantemos os dados corretos', 'Nomes de países, capitais e população vêm do Wikidata, e os mapas do Natural Earth, geoBoundaries e OpenStreetMap. Os dados se atualizam sozinhos todo mês, e um nome alterado espera algumas semanas antes de aparecer, para que uma edição errada na fonte não chegue aos quizzes.'],
      ['Para professores e famílias', 'Fique à vontade para usar os quizzes e mapas para imprimir na sala de aula e em casa. Cada mapa para imprimir vem como mapa mudo, ficha, mapa com nomes e gabarito.'],
      ['Achou um erro?', 'Escreva para {e} e vamos verificar.'],
    ],
    usSources: 'Ver todas as fontes de dados',
    pvTitle: 'Política de privacidade',
    pvDesc: 'O que o Geography Arcade coleta (muito pouco), como usamos o Google Analytics e quais escolhas você tem.',
    pvDate: 'Última atualização: {d}',
    pv: [
      ['Em resumo', 'Você pode usar o Geography Arcade sem cadastro e sem nos contar nada sobre você. Usamos o Google Analytics para contar visitas e ver quais páginas são úteis, com os recursos de publicidade desativados. Não vendemos dados e não mostramos anúncios.'],
      ['O que fica no seu dispositivo', 'Seus melhores resultados ficam salvos no navegador (armazenamento local) para você tentar superá-los. Eles nunca saem do seu dispositivo. Você pode apagá-los limpando os dados deste site no navegador.'],
      ['Google Analytics', 'Usamos o Google Analytics 4 para entender como o site é usado: quais páginas são visitadas, onde os visitantes estão aproximadamente (país e cidade), qual dispositivo e navegador usam, de qual site vieram e como usam uma página. O Google pode usar seu endereço IP para estimar sua localização aproximada, mas o Google Analytics 4 não armazena endereços IP. O Google Signals e os recursos de publicidade estão desativados.'],
      ['Cookies', 'Fora do Espaço Econômico Europeu, do Reino Unido e da Suíça, o Google Analytics cria dois cookies próprios (_ga e _ga_ seguido de um identificador) para diferenciar visitas novas de visitas repetidas. No Espaço Econômico Europeu, no Reino Unido e na Suíça, nenhum cookie de análise é criado: o Google recebe apenas sinais de medição sem cookies. O site não cria nenhum outro cookie.'],
      ['Fontes', 'Parte do texto usa fontes do Google Fonts, então seu navegador as baixa dos servidores do Google, que veem seu endereço IP.'],
      ['Hospedagem', 'O site é hospedado pela Hostinger. Como a maioria das hospedagens, os servidores podem guardar registros de acesso padrão (endereço IP, navegador e página pedida) por segurança e para manter o site funcionando.'],
      ['E-mail', 'Se você escrever para {e}, usamos seu endereço e sua mensagem só para responder.'],
      ['Crianças', 'O Geography Arcade é feito para estudantes de todas as idades, inclusive crianças. O site não tem contas, formulários nem chat, então ninguém consegue nos passar informações pessoais por ele.'],
      ['Suas escolhas', 'Você pode bloquear o Google Analytics nas configurações de privacidade do navegador, com um bloqueador de conteúdo ou com o complemento de desativação do Google (tools.google.com/dlpage/gaoptout). Os quizzes e os mapas para imprimir funcionam do mesmo jeito nos dois casos.'],
      ['Mudanças nesta política', 'Se adicionarmos algo novo, como contas opcionais para salvar seu progresso entre dispositivos, vamos atualizar esta página antes e mudar a data no topo.'],
      ['Contato', 'Dúvidas sobre privacidade: {e}.'],
    ],
  },
  ru: {
    navUs: 'О нас', navPrivacy: 'Конфиденциальность',

    pdfBtn: "Скачать PDF",
    histHubTitle: "Древние цивилизации: хронология и карты",
    histHubDesc: "Главные цивилизации и империи истории, от долины Инда до инков, в порядке их появления. Смотрите, сколько каждая просуществовала и какую территорию занимала, на карте с современными границами.",
    histHubShort: "Древние цивилизации",
    histTitle: "{name}: даты, территория и карта",
    histDesc: "Когда существовала {name}? С {a} по {b}. Территория на карте с современными границами и современные страны, которые она охватывала.",
    histAnswer: "{name}: с {a} по {b} ({d}). Территория: части современных стран: {list}.",
    fPeriod: "Период",
    fDuration: "Длительность",
    fCovered: "Современные страны на этой территории",
    fMapShows: "Карта показывает",
    histMapYear: "Территория около {y} года",
    histMapCaption: "Оранжевым: примерная территория ({name}) около {y} года на современных границах.",
    histWiki: "Подробнее в Википедии",
    histAbout: "Об этой карте",
    histNote: "Карта приблизительная. Древние границы не были чёткими линиями, а контур взят из открытого проекта Historical Basemaps, который предупреждает, что исторические границы неточны. Она показывает один момент, а не весь период.",
    histSource: "Данные карты: Historical Basemaps (лицензия GPL-3.0)",
    histSame: "Другие цивилизации того же времени",
    fCivs: "Древние цивилизации здесь",
    histTimeline: "Хронология",
    thPeriod: "Период",
    eraBCE: "{n} г. до н. э.",
    eraCE: "{n} г. н. э.",
    eraCirca: "ок. {x}",
    histRange: "с {a} по {b}",
    durAbout: "около {n} лет",
    regTitle: "{org}: список стран",
    regDesc: "Какие страны входят в {org}? Все {n} стран с картой, викториной и бесплатным печатным рабочим листом с картой.",
    regAnswer: "{org}, всего стран: {n}. {list}.",
    fCountries: "Страны",
    regHubTitle: "Регионы и группы стран",
    fFormer: "Бывшее государство",
    fFormerRange: "{n} (с {a} по {b} год)",
    fUnitedUntil: "Были едины до",
    fBecame: "Независимость с",
    orgNoteKosovo: "Косово провозгласило независимость от Сербии в 2008 году. Его статус оспаривается, и оно не входит в 195 стран, учитываемых на этом сайте.",
    orgNoteGuianas: "Французская Гвиана входит в состав Франции, поэтому отдельной страной не указана.",
    fPartOf: "Входит в",
    legendGroup: "Оранжевым: страны этой группы.",
    gbH: "Великобритания, Британия и Британские острова: в чём разница?",
    gbUK: "Соединённое Королевство (Великобритания): суверенное государство, в которое входят Англия, Шотландия, Уэльс и Северная Ирландия.",
    gbGB: "Остров Великобритания: главный остров. В политическом смысле это Англия, Шотландия и Уэльс, без Северной Ирландии.",
    gbBr: "В разговорной речи слово «Британия» обычно означает всё Соединённое Королевство, хотя строго говоря это не одно и то же.",
    gbIsles: "Британские острова: географическая группа островов, куда входят остров Великобритания, Ирландия и множество мелких островов. Ирландия является отдельной страной и не входит в Соединённое Королевство.",
    gbQ: "Чем отличаются Великобритания и Соединённое Королевство?",
    printSetTitle: "{t}: карта для печати и рабочий лист (PDF)",
    printSetDesc: "{t} ({n}) на бесплатной карте для печати: контурная карта, рабочий лист с номерами, карта с названиями и ответы, каждый в отдельном PDF.",
    orgMem: "{org}: страны-члены",
    printSecSets: "Экватор, полушария и организации",

    orgHubTitle: "Международные организации: страны-участницы",

    orgHubDesc: "Какие страны входят в G20, G7, БРИКС, АСЕАН, СААРК, ШОС, ЕС, НАТО и другие объединения: списки, карты и викторины.",

    orgTitle: "{org}: страны-участницы",

    orgAnswer: "В {org} входит стран: {n}. Это {list}.",

    fFounded: "Основание",

    fHQ: "Штаб-квартира",

    fHead: "Руководитель",

    fMembers: "Страны-участницы",

    fWebsite: "Сайт",

    noHQ: "Нет постоянной штаб-квартиры",

    headSource: "Руководитель по данным Wikidata на {d}.",

    orgQuiz: "Найдите на карте всех участников ({n})",

    fMemberOf: "Членство",

    orgNoteG20: "Европейский союз и Африканский союз тоже входят в группу.",

    orgNoteG7: "Россия тоже входила в группу с 1997 по 2014 год, когда она называлась G8.",

    orgNoteAU: "Сахарская Арабская Демократическая Республика (Западная Сахара) тоже является членом.",

    orgNoteMercosur: "Венесуэла является членом, но её членство приостановлено.",

    orgNoteUNSC: "Это пять постоянных членов; ещё десять избираются на два года.",

    orgDesc: "{org}: страны-участницы ({n}) на карте, год основания, штаб-квартира и руководитель, а также викторина.",

    moreIn: "Другие страны ({cont})",

    qLoc: "Где находится {c}?",

    aLoc: "{c} находится в регионе: {cont}. Соседние страны: {list}.",

    aLocNone: "{c} находится в регионе: {cont}; сухопутных границ нет.",

    qCur: "Какая валюта: {c}?",

    aCur: "Валюта ({c}): {list}.",

    qLang: "На каком языке говорят: {c}?",

    aLang: "Официальный язык ({c}): {list}.",

    qCall: "Какой телефонный код: {c}?",

    aCall: "Международный телефонный код ({c}): {code}.",

    fCalling: "Телефонный код",

    aboutMaps: "Карты стран используют границы Natural Earth 1:50m (общественное достояние) через пакет world-atlas. Карты провинций и штатов используют границы ADM1 из geoBoundaries (лицензии по странам указаны ниже) или OpenStreetMap там, где деление недавно менялось. Карта одной страны следует официальной карте этой страны, включая территории, на которые она претендует: карты Индии и Пакистана обе включают Джамму и Кашмир, карта Китая включает Тайвань, карта России включает Крым и четыре украинских региона, карта Сербии включает Косово, а карта Венесуэлы включает Гайана-Эссекибо. На картах мира и континентов управляемые Индией Джамму и Кашмир и Ладакх показаны как часть Пакистана, Крым как часть Украины, Голанские высоты как часть Сирии, а Тайвань как часть Китая; Косово и Фолклендские острова показаны, но о них не спрашивают. Карты упрощены, чтобы быстро загружаться, поэтому мелкие детали сглажены.",
    aPopWB: "По данным Всемирного банка, население ({c}) составляет {pop} ({year}).",
    aboutData: "Названия стран, столицы, названия и центры провинций, а также население провинций взяты из Wikidata (CC0), загружены {d}. Население стран взято у Всемирного банка (CC BY 4.0), за последний опубликованный год, одинаковый для всех стран; население Ватикана взято из Wikidata. Коды ISO, площади, границы, языки и валюты взяты из набора данных world-countries (ODbL). Если эти источники расходятся с официальными (не указана вторая столица, региональный язык назван официальным), сайт их исправляет.",
    kashmirQuiz: "Это относится к картам мира и континентов. Карта одной страны (её штатов или провинций) следует официальной карте этой страны, поэтому викторины и по Индии, и по Пакистану включают Джамму и Кашмир.",
    usTitle: 'О Geography Arcade',
    usDesc: 'Кто делает Geography Arcade, почему он бесплатный и как мы следим за точностью викторин, карт и фактов.',
    us: [
      ['Что такое Geography Arcade', 'Geography Arcade это бесплатный сайт, где географию учат играя. Здесь есть викторины по картам, игры про столицы и флаги и карты для печати по всем странам ({n}), а также провинции и штаты {p} стран, на {l} языках.'],
      ['Кто мы', 'Geography Arcade делает небольшая независимая команда. Мы не относимся ни к какой школе, издательству или государству. Викторины, пояснения и проверку данных мы делаем сами.'],
      ['Почему это бесплатно', 'Всё на сайте бесплатно: и играть, и печатать, без регистрации и платного доступа. Мы хотим, чтобы любой человек с браузером мог выучить карту мира на своём языке.'],
      ['Как мы следим за точностью', 'Названия стран, столицы и население берутся из Wikidata, а карты из Natural Earth, geoBoundaries и OpenStreetMap. Данные обновляются автоматически каждый месяц, а изменённое название появляется только через несколько недель, чтобы ошибочная правка в источнике не попала в викторины.'],
      ['Учителям и родителям', 'Викторины и карты для печати можно свободно использовать на уроках и дома. Каждая карта для печати есть в четырёх вариантах: контурная карта, рабочий лист, карта с названиями и лист с ответами.'],
      ['Нашли ошибку?', 'Напишите нам на {e}, и мы проверим.'],
    ],
    usSources: 'Все источники данных',
    pvTitle: 'Политика конфиденциальности',
    pvDesc: 'Что собирает Geography Arcade (очень мало), как мы используем Google Analytics и какой у вас есть выбор.',
    pvDate: 'Последнее обновление: {d}',
    pv: [
      ['Коротко', 'Geography Arcade можно пользоваться без регистрации и ничего не сообщая о себе. Мы используем Google Analytics, чтобы считать посещения и понимать, какие страницы полезны; рекламные функции отключены. Мы не продаём данные и не показываем рекламу.'],
      ['Что остаётся на вашем устройстве', 'Ваши лучшие результаты сохраняются в браузере (локальное хранилище), чтобы вы могли попробовать их превзойти. Они никогда не покидают ваше устройство. Удалить их можно, очистив данные этого сайта в браузере.'],
      ['Google Analytics', 'Мы используем Google Analytics 4, чтобы понимать, как используется сайт: какие страницы открывают, где примерно находятся посетители (страна и город), какое у них устройство и браузер, с какого сайта они пришли и как пользуются страницей. Google может использовать ваш IP-адрес, чтобы определить примерное местоположение, но Google Analytics 4 не хранит IP-адреса. Google Signals и рекламные функции отключены.'],
      ['Файлы cookie', 'За пределами Европейской экономической зоны, Великобритании и Швейцарии Google Analytics устанавливает два основных файла cookie (_ga и _ga_ с идентификатором), чтобы отличать новые посещения от повторных. В Европейской экономической зоне, Великобритании и Швейцарии аналитические cookie не устанавливаются: Google получает только сигналы измерения без cookie. Других cookie сайт не устанавливает.'],
      ['Шрифты', 'Часть текста использует шрифты Google Fonts, поэтому браузер загружает их с серверов Google, которые видят ваш IP-адрес.'],
      ['Хостинг', 'Сайт размещён на Hostinger. Как и у большинства хостингов, его серверы могут хранить стандартные журналы доступа (IP-адрес, браузер и запрошенная страница) для безопасности и работы сайта.'],
      ['Электронная почта', 'Если вы напишете на {e}, мы используем ваш адрес и сообщение только для ответа вам.'],
      ['Дети', 'Geography Arcade создан для учащихся любого возраста, в том числе детей. На сайте нет аккаунтов, форм и чатов, поэтому через него никто не может передать нам личные данные.'],
      ['Ваш выбор', 'Вы можете заблокировать Google Analytics в настройках конфиденциальности браузера, блокировщиком контента или надстройкой Google для отключения (tools.google.com/dlpage/gaoptout). Викторины и карты для печати работают одинаково в обоих случаях.'],
      ['Изменения политики', 'Если мы добавим что-то новое, например необязательные аккаунты для сохранения прогресса на разных устройствах, мы сначала обновим эту страницу и изменим дату вверху.'],
      ['Контакты', 'Вопросы о конфиденциальности: {e}.'],
    ],
  },
  ur: {
    navUs: 'ہمارے بارے میں', navPrivacy: 'رازداری',

    pdfBtn: "PDF ڈاؤن لوڈ کریں",
    histHubTitle: "قدیم تہذیبیں: ٹائم لائن اور نقشے",
    histHubDesc: "وادیٔ سندھ سے انکا تک تاریخ کی بڑی تہذیبیں اور سلطنتیں، ان کے آغاز کی ترتیب سے۔ دیکھیں ہر ایک کتنا عرصہ قائم رہی اور آج کی سرحدوں والے نقشے پر اس کا علاقہ کتنا تھا۔",
    histHubShort: "قدیم تہذیبیں",
    histTitle: "{name}: دور، علاقہ اور نقشہ",
    histDesc: "{name} کب تھا؟ {a} سے {b} تک۔ آج کی سرحدوں والے نقشے پر اس کا علاقہ اور جدید ممالک دیکھیں۔",
    histAnswer: "{name}: {a} سے {b} تک ({d})۔ علاقہ: {list} کے حصے۔",
    fPeriod: "دور",
    fDuration: "مدت",
    fCovered: "آج کے وہ ممالک جو اس میں آتے تھے",
    fMapShows: "نقشہ دکھاتا ہے",
    histMapYear: "{y} کے آس پاس کا علاقہ",
    histMapCaption: "نارنجی: آج کی سرحدوں پر {y} کے آس پاس {name} کا اندازاً علاقہ۔",
    histWiki: "ویکی پیڈیا پر مزید پڑھیں",
    histAbout: "اس نقشے کے بارے میں",
    histNote: "نقشہ اندازاً ہے۔ قدیم سرحدیں پکی لکیریں نہیں تھیں، اور شکل کھلے Historical Basemaps منصوبے سے لی گئی ہے جو خبردار کرتا ہے کہ تاریخی سرحدیں غیر یقینی ہیں۔ یہ ایک لمحہ دکھاتا ہے، پورا دور نہیں۔",
    histSource: "نقشے کا ڈیٹا: Historical Basemaps (GPL-3.0 لائسنس)",
    histSame: "اسی وقت کی دوسری تہذیبیں",
    fCivs: "یہاں کی قدیم تہذیبیں",
    histTimeline: "ٹائم لائن",
    thPeriod: "دور",
    eraBCE: "{n} قبل مسیح",
    eraCE: "{n} عیسوی",
    eraCirca: "تقریباً {x}",
    histRange: "{a} سے {b} تک",
    durAbout: "تقریباً {n} سال",
    regTitle: "{org}: ممالک کی فہرست",
    regDesc: "{org} میں کون سے ممالک ہیں؟ نقشے، کوئز اور مفت پرنٹ کے قابل نقشہ ورک شیٹ کے ساتھ تمام {n} ممالک۔",
    regAnswer: "{org} میں {n} ممالک شامل ہیں: {list}۔",
    fCountries: "ممالک",
    regHubTitle: "خطے اور ممالک کے گروہ",
    fFormer: "سابق ریاست",
    fFormerRange: "{n} ({a} سے {b} تک)",
    fUnitedUntil: "اس وقت تک متحد",
    fBecame: "آزاد ہوئے",
    orgNoteKosovo: "کوسووو نے 2008 میں سربیا سے آزادی کا اعلان کیا۔ اس کی حیثیت متنازع ہے، اور وہ اس سائٹ کے 195 ممالک میں شامل نہیں۔",
    orgNoteGuianas: "فرانسیسی گیانا فرانس کا حصہ ہے، اس لیے اسے الگ ملک کے طور پر شامل نہیں کیا گیا۔",
    fPartOf: "جس خطے کا حصہ",
    legendGroup: "نارنجی: اس گروہ کے ممالک۔",
    gbH: "برطانیہ، گریٹ برطانیہ اور برطانوی جزائر میں کیا فرق ہے؟",
    gbUK: "یونائیٹڈ کنگڈم (برطانیہ) خودمختار ملک ہے۔ اس میں انگلینڈ، سکاٹ لینڈ، ویلز اور شمالی آئرلینڈ شامل ہیں۔",
    gbGB: "گریٹ برطانیہ مرکزی جزیرہ ہے۔ سیاسی اصطلاح کے طور پر اس کا مطلب انگلینڈ، سکاٹ لینڈ اور ویلز ہے، شمالی آئرلینڈ اس میں شامل نہیں۔",
    gbBr: "روزمرہ گفتگو میں 'برطانیہ' عموماً پورے یونائیٹڈ کنگڈم کے لیے بولا جاتا ہے، مگر سختی سے دیکھیں تو یہ ایک ہی چیز نہیں۔",
    gbIsles: "برطانوی جزائر جزیروں کا جغرافیائی گروہ ہیں: گریٹ برطانیہ، آئرلینڈ اور بہت سے چھوٹے جزیرے۔ آئرلینڈ الگ ملک ہے اور یونائیٹڈ کنگڈم کا حصہ نہیں۔",
    gbQ: "برطانیہ اور گریٹ برطانیہ میں کیا فرق ہے؟",
    printSetTitle: "{t}: پرنٹ کے قابل نقشہ اور ورک شیٹ (PDF)",
    printSetDesc: "{t} ({n}) مفت پرنٹ کے قابل نقشے پر: خالی نقشہ، نمبر والی ورک شیٹ، ناموں والا نقشہ اور جوابات، ہر ایک الگ PDF میں۔",
    orgMem: "{org} کے رکن ممالک",
    printSecSets: "خط استوا، نصف کرے اور بین الاقوامی تنظیمیں",

    orgHubTitle: "بین الاقوامی تنظیمیں: رکن ممالک",

    orgHubDesc: "جی20، جی7، برکس، آسیان، سارک، ایس سی او، یورپی یونین، نیٹو اور دوسرے گروپوں میں کون سے ممالک ہیں: رکن ممالک کی فہرستیں، نقشے اور کوئز۔",

    orgTitle: "{org}: رکن ممالک",

    orgAnswer: "{org} کے {n} رکن ممالک ہیں: {list}۔",

    fFounded: "قیام",

    fHQ: "صدر دفتر",

    fHead: "سربراہ",

    fMembers: "رکن ممالک",

    fWebsite: "ویب سائٹ",

    noHQ: "کوئی مستقل صدر دفتر نہیں",

    headSource: "سربراہ کا نام Wikidata کے {d} کے ریکارڈ کے مطابق۔",

    orgQuiz: "نقشے پر تمام {n} ارکان تلاش کریں",

    fMemberOf: "رکنیت",

    orgNoteG20: "یورپی یونین اور افریقی یونین بھی رکن ہیں۔",

    orgNoteG7: "روس بھی 1997 سے 2014 تک رکن تھا، جب اس گروپ کو جی8 کہا جاتا تھا۔",

    orgNoteAU: "صحراوی عرب جمہوری ریاست (مغربی صحارا) بھی رکن ہے۔",

    orgNoteMercosur: "وینزویلا رکن ہے، مگر معطل ہے۔",

    orgNoteUNSC: "یہ پانچ مستقل ارکان ہیں؛ مزید دس ارکان دو سال کے لیے منتخب ہوتے ہیں۔",

    orgDesc: "{org}: نقشے پر {n} رکن ممالک، سالِ قیام، صدر دفتر اور سربراہ کے ساتھ، اور ایک کوئز۔",

    moreIn: "{cont} کے مزید ممالک",

    qLoc: "{c} کہاں واقع ہے؟",

    aLoc: "{c} {cont} میں واقع ہے۔ اس کے ہمسایہ ممالک: {list}۔",

    aLocNone: "{c} {cont} میں واقع ہے اور اس کی کوئی زمینی سرحد نہیں۔",

    qCur: "{c} کی کرنسی کیا ہے؟",

    aCur: "{c} کی کرنسی: {list}۔",

    qLang: "{c} میں کون سی زبان بولی جاتی ہے؟",

    aLang: "{c} کی سرکاری زبان: {list}۔",

    qCall: "{c} کا کالنگ کوڈ کیا ہے؟",

    aCall: "{c} کا بین الاقوامی کالنگ کوڈ {code} ہے۔",

    fCalling: "کالنگ کوڈ",

    aboutMaps: "ممالک کے نقشے world-atlas پیکیج کے ذریعے Natural Earth 1:50m سرحدیں (پبلک ڈومین) استعمال کرتے ہیں۔ صوبوں اور ریاستوں کے نقشے geoBoundaries ADM1 سرحدیں (ہر ملک کا لائسنس نیچے درج ہے) استعمال کرتے ہیں، یا جہاں تقسیم حال ہی میں بدلی ہو وہاں OpenStreetMap۔ کسی ایک ملک کا نقشہ اسی ملک کے سرکاری نقشے کے مطابق ہے، اس کے دعوے والی زمین سمیت: بھارت اور پاکستان دونوں کے نقشوں میں جموں و کشمیر شامل ہے، چین کے نقشے میں تائیوان، روس کے نقشے میں کریمیا اور یوکرین کے چار علاقے، سربیا کے نقشے میں کوسووو اور وینزویلا کے نقشے میں گیانا ایسیکیبو۔ دنیا اور براعظموں کے نقشوں پر بھارت کے زیرِ انتظام جموں و کشمیر اور لداخ پاکستان کا حصہ، کریمیا یوکرین کا، گولان کی پہاڑیاں شام کا اور تائیوان چین کا حصہ دکھائے گئے ہیں؛ کوسووو اور فاک لینڈ جزائر دکھائے جاتے ہیں مگر ان کے بارے میں سوال نہیں پوچھا جاتا۔ نقشوں کو تیزی سے لوڈ کرنے کے لیے سادہ بنایا گیا ہے، اس لیے چھوٹی تفصیلات ہموار کر دی گئی ہیں۔",
    aPopWB: "عالمی بینک کے مطابق {c} کی آبادی {pop} ({year}) ہے۔",
    aboutData: "ممالک کے نام، دارالحکومت، صوبوں کے نام، صوبائی دارالحکومت اور صوبوں کی آبادی Wikidata (CC0) سے لی گئی ہے، {d} کو۔ ممالک کی آبادی عالمی بینک (CC BY 4.0) سے ہے، اس کا شائع کردہ تازہ ترین سال، تمام ممالک کے لیے ایک ہی سال؛ ویٹیکن سٹی کی آبادی Wikidata سے ہے۔ ISO کوڈ، رقبہ، سرحدیں، زبانیں اور کرنسیاں world-countries ڈیٹاسیٹ (ODbL) سے ہیں۔ جہاں یہ ماخذ سرکاری معلومات سے مختلف ہوں (جیسے دوسرا دارالحکومت رہ جانا، یا کسی علاقائی زبان کو سرکاری کہنا)، وہاں سائٹ انہیں درست کرتی ہے۔",
    kashmirQuiz: "یہ دنیا اور براعظموں کے نقشوں پر لاگو ہوتا ہے۔ کسی ایک ملک کا نقشہ (اس کی ریاستیں یا صوبے) اسی ملک کے سرکاری نقشے کے مطابق ہے، اس لیے بھارت اور پاکستان دونوں کے کوئز میں جموں و کشمیر شامل ہے۔",
    usTitle: 'Geography Arcade کے بارے میں',
    usDesc: 'Geography Arcade کون بناتا ہے، یہ مفت کیوں ہے، اور ہم کوئز، نقشوں اور معلومات کو درست کیسے رکھتے ہیں۔',
    us: [
      ['Geography Arcade کیا ہے', 'Geography Arcade کھیل کھیل میں جغرافیہ سیکھنے کی ایک مفت ویب سائٹ ہے۔ اس میں تمام {n} ممالک کے نقشہ کوئز، دارالحکومتوں اور جھنڈوں کے کھیل اور قابلِ پرنٹ نقشے ہیں، ساتھ میں {p} ممالک کے صوبے اور ریاستیں، {l} زبانوں میں۔'],
      ['ہم کون ہیں', 'Geography Arcade ایک چھوٹی آزاد ٹیم بناتی ہے۔ ہمارا کسی اسکول، ناشر یا حکومت سے تعلق نہیں۔ کوئز بنانا، وضاحتیں لکھنا اور ڈیٹا کی جانچ ہم خود کرتے ہیں۔'],
      ['یہ مفت کیوں ہے', 'سائٹ پر سب کچھ کھیلنے اور پرنٹ کرنے کے لیے مفت ہے، بغیر اکاؤنٹ اور بغیر پے وال کے۔ ہم چاہتے ہیں کہ براؤزر رکھنے والا ہر شخص اپنی زبان میں دنیا کا نقشہ سیکھ سکے۔'],
      ['ہم معلومات درست کیسے رکھتے ہیں', 'ممالک کے نام، دارالحکومت اور آبادی Wikidata سے آتے ہیں، اور نقشے Natural Earth، geoBoundaries اور OpenStreetMap سے۔ ڈیٹا ہر مہینے خود بخود اپ ڈیٹ ہوتا ہے، اور بدلا ہوا نام کچھ ہفتے رک کر دکھایا جاتا ہے، تاکہ ماخذ پر ہونے والی غلط ترمیم کوئز تک نہ پہنچے۔'],
      ['اساتذہ اور والدین کے لیے', 'کوئز اور قابلِ پرنٹ نقشے کلاس اور گھر میں استعمال کرنے کے لیے حاضر ہیں۔ ہر پرنٹ نقشہ خالی نقشے، ورک شیٹ، ناموں والے نقشے اور جوابات کی صورت میں ملتا ہے۔'],
      ['کوئی غلطی نظر آئی؟', 'ہمیں {e} پر لکھیں، ہم اسے دیکھیں گے۔'],
    ],
    usSources: 'تمام ڈیٹا ماخذ دیکھیں',
    pvTitle: 'رازداری کی پالیسی',
    pvDesc: 'Geography Arcade کیا معلومات لیتا ہے (بہت کم)، ہم Google Analytics کیسے استعمال کرتے ہیں، اور آپ کے پاس کیا اختیارات ہیں۔',
    pvDate: 'آخری اپ ڈیٹ: {d}',
    pv: [
      ['مختصراً', 'آپ Geography Arcade بغیر اکاؤنٹ اور اپنے بارے میں کچھ بتائے بغیر استعمال کر سکتے ہیں۔ ہم وزٹ گننے اور یہ دیکھنے کے لیے کہ کون سے صفحات مفید ہیں Google Analytics استعمال کرتے ہیں، اس کی اشتہاری سہولیات بند رکھ کر۔ ہم ڈیٹا نہیں بیچتے اور اشتہار نہیں دکھاتے۔'],
      ['آپ کے آلے پر کیا رہتا ہے', 'آپ کے کوئز کے بہترین اسکور آپ کے براؤزر (لوکل اسٹوریج) میں محفوظ ہوتے ہیں تاکہ آپ انہیں توڑنے کی کوشش کر سکیں۔ یہ کبھی آپ کے آلے سے باہر نہیں جاتے۔ براؤزر میں اس سائٹ کا ڈیٹا صاف کر کے آپ انہیں مٹا سکتے ہیں۔'],
      ['Google Analytics', 'ہم Google Analytics 4 سے سمجھتے ہیں کہ سائٹ کیسے استعمال ہوتی ہے: کون سے صفحات دیکھے گئے، وزیٹر تقریباً کہاں ہیں (ملک اور شہر)، کون سا آلہ اور براؤزر ہے، کس سائٹ سے آئے اور صفحہ کیسے استعمال کرتے ہیں۔ Google آپ کے IP ایڈریس سے تقریبی مقام نکال سکتا ہے، لیکن Google Analytics 4 IP ایڈریس محفوظ نہیں کرتا۔ Google Signals اور اشتہاری سہولیات بند ہیں۔'],
      ['کوکیز', 'یورپی اقتصادی علاقے، برطانیہ اور سوئٹزرلینڈ سے باہر Google Analytics دو فرسٹ پارٹی کوکیز (_ga اور _ga_ کے بعد ایک ID) لگاتا ہے، تاکہ نئے اور دوبارہ آنے والے وزٹ میں فرق ہو سکے۔ یورپی اقتصادی علاقے، برطانیہ اور سوئٹزرلینڈ میں کوئی اینالیٹکس کوکی نہیں لگتی: Google کو صرف بغیر کوکی کے پیمائشی سگنل ملتے ہیں۔ سائٹ کوئی اور کوکی نہیں لگاتی۔'],
      ['فونٹ', 'کچھ متن Google Fonts کے ویب فونٹ استعمال کرتا ہے، اس لیے آپ کا براؤزر انہیں Google کے سرورز سے ڈاؤن لوڈ کرتا ہے، جو آپ کا IP ایڈریس دیکھتے ہیں۔'],
      ['ہوسٹنگ', 'سائٹ Hostinger پر ہوسٹ ہے۔ زیادہ تر ویب ہوسٹس کی طرح اس کے سرورز سیکیورٹی اور سائٹ چلانے کے لیے عام رسائی لاگ (IP ایڈریس، براؤزر اور مانگا گیا صفحہ) رکھ سکتے ہیں۔'],
      ['ای میل', 'اگر آپ {e} پر لکھتے ہیں تو ہم آپ کا پتا اور پیغام صرف جواب دینے کے لیے استعمال کرتے ہیں۔'],
      ['بچے', 'Geography Arcade بچوں سمیت ہر عمر کے سیکھنے والوں کے لیے ہے۔ سائٹ پر کوئی اکاؤنٹ، فارم یا چیٹ نہیں، اس لیے کوئی بھی اس کے ذریعے ہمیں ذاتی معلومات نہیں دے سکتا۔'],
      ['آپ کے اختیارات', 'آپ براؤزر کی رازداری کی ترتیبات، کنٹینٹ بلاکر یا Google کے آپٹ آؤٹ ایڈ آن (tools.google.com/dlpage/gaoptout) سے Google Analytics روک سکتے ہیں۔ دونوں صورتوں میں کوئز اور پرنٹ نقشے ویسے ہی چلتے ہیں۔'],
      ['اس پالیسی میں تبدیلی', 'اگر ہم کچھ نیا شامل کریں، جیسے مختلف آلات پر پیش رفت محفوظ رکھنے کے لیے اختیاری اکاؤنٹ، تو ہم پہلے یہ صفحہ اپ ڈیٹ کریں گے اور اوپر کی تاریخ بدلیں گے۔'],
      ['رابطہ', 'رازداری سے متعلق سوالات: {e}۔'],
    ],
  },
  id: {
    navUs: 'Tentang kami', navPrivacy: 'Privasi',

    pdfBtn: "Unduh PDF",
    histHubTitle: "Peradaban kuno: lini masa dan peta",
    histHubDesc: "Peradaban dan kekaisaran besar dalam sejarah, dari Lembah Indus sampai Inka, berurutan menurut awal berdirinya. Lihat berapa lama masing-masing bertahan dan wilayahnya di peta dengan batas negara masa kini.",
    histHubShort: "Peradaban kuno",
    histTitle: "{name}: tahun, wilayah, dan peta",
    histDesc: "Kapan {name} ada? Dari {a} sampai {b}. Lihat wilayahnya di peta dengan batas negara masa kini beserta negara modern yang dicakup.",
    histAnswer: "{name}: {a} sampai {b} ({d}). Wilayah: sebagian {list}.",
    fPeriod: "Periode",
    fDuration: "Lama",
    fCovered: "Negara modern yang dicakup",
    fMapShows: "Peta menunjukkan",
    histMapYear: "Wilayah sekitar {y}",
    histMapCaption: "Oranye: perkiraan wilayah {name} sekitar {y}, di atas batas negara masa kini.",
    histWiki: "Baca lebih lanjut di Wikipedia",
    histAbout: "Tentang peta ini",
    histNote: "Peta ini perkiraan. Batas kuno bukan garis tetap, dan bentuknya berasal dari proyek terbuka Historical Basemaps, yang memperingatkan bahwa batas sejarah tidak pasti. Peta menunjukkan satu momen, bukan seluruh periode.",
    histSource: "Data peta: Historical Basemaps (lisensi GPL-3.0)",
    histSame: "Peradaban lain pada masa yang sama",
    fCivs: "Peradaban kuno di sini",
    histTimeline: "Lini masa",
    thPeriod: "Periode",
    eraBCE: "{n} SM",
    eraCE: "{n} M",
    eraCirca: "sekitar {x}",
    histRange: "{a} sampai {b}",
    durAbout: "sekitar {n} tahun",
    regTitle: "{org}: daftar negara",
    regDesc: "Negara mana saja di {org}? Semua {n} negara dengan peta, kuis, dan lembar kerja peta cetak gratis.",
    regAnswer: "{org} mencakup {n} negara: {list}.",
    fCountries: "Negara",
    regHubTitle: "Wilayah dan kelompok negara",
    fFormer: "Negara terdahulu",
    fFormerRange: "{n} ({a} sampai {b})",
    fUnitedUntil: "Bersatu hingga",
    fBecame: "Merdeka sejak",
    orgNoteKosovo: "Kosovo mendeklarasikan kemerdekaan dari Serbia pada 2008. Statusnya diperdebatkan, dan Kosovo bukan salah satu dari 195 negara yang dihitung di situs ini.",
    orgNoteGuianas: "Guyana Prancis adalah bagian dari Prancis, jadi tidak didaftar sebagai negara tersendiri.",
    fPartOf: "Bagian dari",
    legendGroup: "Oranye: negara-negara dalam kelompok ini.",
    gbH: "UK, Britania, dan Great Britain: apa bedanya?",
    gbUK: "Britania Raya (United Kingdom, UK) adalah negara berdaulat. Terdiri atas Inggris, Skotlandia, Wales, dan Irlandia Utara.",
    gbGB: "Great Britain adalah pulau utama. Sebagai istilah politik, artinya Inggris, Skotlandia, dan Wales, tanpa Irlandia Utara.",
    gbBr: "Dalam percakapan sehari-hari, 'Britania' atau 'Inggris' sering dipakai untuk seluruh UK, padahal tidak persis sama.",
    gbIsles: "Kepulauan Britania adalah kelompok pulau secara geografis: Great Britain, Irlandia, dan banyak pulau kecil. Irlandia negara tersendiri dan bukan bagian dari UK.",
    gbQ: "Apa beda UK, Britania, dan Great Britain?",
    printSetTitle: "{t}: peta cetak dan lembar kerja (PDF)",
    printSetDesc: "{t} ({n}) di peta cetak gratis: peta kosong, lembar kerja bernomor, peta berlabel, dan kunci jawaban, masing-masing dalam PDF tersendiri.",
    orgMem: "Negara anggota {org}",
    printSecSets: "Khatulistiwa, belahan bumi, dan organisasi",

    orgHubTitle: "Organisasi internasional: negara anggota",

    orgHubDesc: "Negara mana saja yang tergabung dalam G20, G7, BRICS, ASEAN, SAARC, SCO, Uni Eropa, NATO, dan kelompok lain: daftar anggota, peta, dan kuis.",

    orgTitle: "{org}: negara anggota",

    orgAnswer: "{org} punya {n} negara anggota: {list}.",

    fFounded: "Didirikan",

    fHQ: "Markas",

    fHead: "Pemimpin",

    fMembers: "Negara anggota",

    fWebsite: "Situs web",

    noHQ: "Tidak punya markas tetap",

    headSource: "Pemimpin menurut Wikidata pada {d}.",

    orgQuiz: "Temukan {n} anggota di peta",

    fMemberOf: "Anggota dari",

    orgNoteG20: "Uni Eropa dan Uni Afrika juga menjadi anggota.",

    orgNoteG7: "Rusia juga menjadi anggota pada 1997 sampai 2014, ketika kelompok ini disebut G8.",

    orgNoteAU: "Republik Demokratik Arab Sahrawi (Sahara Barat) juga menjadi anggota.",

    orgNoteMercosur: "Venezuela adalah anggota, tetapi keanggotaannya ditangguhkan.",

    orgNoteUNSC: "Ini adalah lima anggota tetap; sepuluh anggota lain dipilih untuk dua tahun.",

    orgDesc: "{org}: {n} negara anggota di peta, dengan tahun berdiri, markas, dan pemimpin, serta kuis.",

    moreIn: "Negara lain di {cont}",

    qLoc: "Di mana letak {c}?",

    aLoc: "{c} terletak di {cont}. Berbatasan dengan {list}.",

    aLocNone: "{c} terletak di {cont} dan tidak punya perbatasan darat.",

    qCur: "Apa mata uang {c}?",

    aCur: "Mata uang {c}: {list}.",

    qLang: "Bahasa apa yang digunakan di {c}?",

    aLang: "Bahasa resmi {c}: {list}.",

    qCall: "Berapa kode telepon {c}?",

    aCall: "Kode telepon internasional {c} adalah {code}.",

    fCalling: "Kode telepon",

    aboutMaps: "Peta negara menggunakan batas Natural Earth 1:50m (domain publik) melalui paket world-atlas. Peta provinsi dan negara bagian menggunakan batas ADM1 dari geoBoundaries (lisensi per negara tercantum di bawah), atau OpenStreetMap jika pembagian wilayahnya baru berubah. Peta satu negara mengikuti peta resmi negara itu, termasuk wilayah yang diklaimnya: peta India dan Pakistan sama-sama mencakup Jammu dan Kashmir, peta Tiongkok mencakup Taiwan, peta Rusia mencakup Krimea dan empat wilayah Ukraina, peta Serbia mencakup Kosovo, dan peta Venezuela mencakup Guayana Esequiba. Di peta dunia dan peta benua, Jammu dan Kashmir serta Ladakh yang dikelola India ditampilkan sebagai bagian Pakistan, Krimea sebagai bagian Ukraina, Dataran Tinggi Golan sebagai bagian Suriah, dan Taiwan sebagai bagian Tiongkok; Kosovo dan Kepulauan Falkland ditampilkan, tetapi tidak ditanyakan. Peta disederhanakan agar cepat dimuat, sehingga detail kecil dihaluskan.",
    aPopWB: "Menurut Bank Dunia, jumlah penduduk {c} adalah {pop} ({year}).",
    aboutData: "Nama negara, ibu kota, nama dan ibu kota provinsi, serta jumlah penduduk provinsi berasal dari Wikidata (CC0), diambil pada {d}. Jumlah penduduk negara berasal dari Bank Dunia (CC BY 4.0), tahun terbaru yang diterbitkannya, tahun yang sama untuk semua negara; penduduk Kota Vatikan berasal dari Wikidata. Kode ISO, luas, perbatasan, bahasa, dan mata uang berasal dari dataset world-countries (ODbL). Jika sumber ini berbeda dari sumber resmi (ibu kota kedua yang terlewat, bahasa daerah yang disebut resmi), situs ini memperbaikinya.",
    kashmirQuiz: "Itu berlaku untuk peta dunia dan peta benua. Peta satu negara (negara bagian atau provinsinya) mengikuti peta resmi negara itu, sehingga kuis India maupun Pakistan sama-sama mencakup Jammu dan Kashmir.",
    usTitle: 'Tentang Geography Arcade',
    usDesc: 'Siapa yang membuat Geography Arcade, mengapa gratis, dan bagaimana kami menjaga kuis, peta, dan fakta tetap akurat.',
    us: [
      ['Apa itu Geography Arcade', 'Geography Arcade adalah situs gratis untuk belajar geografi sambil bermain. Ada kuis peta, permainan ibu kota dan bendera, serta peta cetak untuk semua {n} negara, ditambah provinsi dan negara bagian dari {p} negara, dalam {l} bahasa.'],
      ['Siapa kami', 'Geography Arcade dibuat oleh tim independen kecil. Kami bukan bagian dari sekolah, penerbit, atau pemerintah mana pun. Kami sendiri yang membuat kuis, menulis penjelasan, dan memeriksa data.'],
      ['Mengapa gratis', 'Semua yang ada di situs ini gratis untuk dimainkan dan dicetak, tanpa akun dan tanpa paywall. Kami ingin siapa pun yang punya browser bisa mempelajari peta dunia dalam bahasanya sendiri.'],
      ['Cara kami menjaga akurasi', 'Nama negara, ibu kota, dan jumlah penduduk berasal dari Wikidata, dan peta dari Natural Earth, geoBoundaries, dan OpenStreetMap. Data diperbarui otomatis setiap bulan, dan nama yang berubah menunggu beberapa minggu sebelum muncul, supaya suntingan keliru di sumbernya tidak sampai ke kuis.'],
      ['Untuk guru dan orang tua', 'Silakan gunakan kuis dan peta cetak di kelas maupun di rumah. Setiap peta cetak tersedia sebagai peta kosong, lembar kerja, peta berlabel, dan kunci jawaban.'],
      ['Menemukan kesalahan?', 'Kirim email ke {e} dan kami akan memeriksanya.'],
    ],
    usSources: 'Lihat semua sumber data',
    pvTitle: 'Kebijakan privasi',
    pvDesc: 'Apa yang dikumpulkan Geography Arcade (sangat sedikit), cara kami memakai Google Analytics, dan pilihan yang kamu miliki.',
    pvDate: 'Terakhir diperbarui: {d}',
    pv: [
      ['Ringkasnya', 'Kamu bisa memakai Geography Arcade tanpa akun dan tanpa memberi tahu apa pun tentang dirimu. Kami memakai Google Analytics untuk menghitung kunjungan dan melihat halaman mana yang berguna, dengan fitur iklannya dimatikan. Kami tidak menjual data dan tidak menampilkan iklan.'],
      ['Yang tetap ada di perangkatmu', 'Skor kuis terbaikmu disimpan di browser (penyimpanan lokal) agar kamu bisa mencoba memecahkannya. Skor itu tidak pernah keluar dari perangkatmu. Kamu bisa menghapusnya dengan membersihkan data situs ini di browser.'],
      ['Google Analytics', 'Kami memakai Google Analytics 4 untuk memahami cara situs digunakan: halaman yang dikunjungi, perkiraan lokasi pengunjung (negara dan kota), perangkat dan browser yang dipakai, situs asal mereka, dan cara mereka memakai halaman. Google dapat memakai alamat IP-mu untuk memperkirakan lokasi, tetapi Google Analytics 4 tidak menyimpan alamat IP. Google Signals dan fitur iklan dimatikan.'],
      ['Cookie', 'Di luar Kawasan Ekonomi Eropa, Inggris, dan Swiss, Google Analytics memasang dua cookie pihak pertama (_ga dan _ga_ diikuti ID) untuk membedakan kunjungan baru dan kunjungan ulang. Di Kawasan Ekonomi Eropa, Inggris, dan Swiss, tidak ada cookie analitik yang dipasang: Google hanya menerima sinyal pengukuran tanpa cookie. Situs ini tidak memasang cookie lain.'],
      ['Font', 'Sebagian teks memakai font dari Google Fonts, jadi browsermu mengunduhnya dari server Google, yang melihat alamat IP-mu.'],
      ['Hosting', 'Situs ini di-hosting oleh Hostinger. Seperti kebanyakan penyedia hosting, servernya dapat menyimpan log akses standar (alamat IP, browser, dan halaman yang diminta) untuk keamanan dan agar situs tetap berjalan.'],
      ['Email', 'Jika kamu menulis ke {e}, kami memakai alamat dan pesanmu hanya untuk membalas.'],
      ['Anak-anak', 'Geography Arcade dibuat untuk pelajar segala usia, termasuk anak-anak. Situs ini tidak punya akun, formulir, atau obrolan, jadi tidak ada yang bisa memberi kami informasi pribadi melaluinya.'],
      ['Pilihanmu', 'Kamu bisa memblokir Google Analytics lewat pengaturan privasi browser, pemblokir konten, atau add-on penonaktifan dari Google (tools.google.com/dlpage/gaoptout). Kuis dan peta cetak tetap berjalan sama dalam kedua kasus.'],
      ['Perubahan kebijakan ini', 'Jika kami menambahkan sesuatu yang baru, misalnya akun opsional untuk menyimpan kemajuanmu di berbagai perangkat, kami akan memperbarui halaman ini terlebih dahulu dan mengubah tanggal di atas.'],
      ['Kontak', 'Pertanyaan tentang privasi: {e}.'],
    ],
  },
  it: {
    navUs: 'Chi siamo', navPrivacy: 'Privacy',

    pdfBtn: "Scarica il PDF",
    histHubTitle: "Civiltà antiche: linea del tempo e mappe",
    histHubDesc: "Le grandi civiltà e imperi della storia, dalla valle dell'Indo agli Inca, in ordine di nascita. Guarda quanto è durata ciascuna e il territorio coperto su una mappa con i confini di oggi.",
    histHubShort: "Civiltà antiche",
    histTitle: "{name}: date, territorio e mappa",
    histDesc: "Quando è esistita {name}? Dal {a} al {b}. Guarda il territorio su una mappa con i confini di oggi e i paesi moderni coinvolti.",
    histAnswer: "{name}: dal {a} al {b} ({d}). Area coperta: parti di {list}.",
    fPeriod: "Periodo",
    fDuration: "Durata",
    fCovered: "Paesi attuali coperti",
    fMapShows: "La mappa mostra",
    histMapYear: "Il territorio intorno al {y}",
    histMapCaption: "Arancione: territorio approssimativo di {name} intorno al {y}, sui confini di oggi.",
    histWiki: "Leggi di più su Wikipedia",
    histAbout: "Su questa mappa",
    histNote: "La mappa è approssimativa. I confini antichi non erano linee fisse, e la forma viene dal progetto aperto Historical Basemaps, che avverte che i confini storici sono incerti. Mostra un momento, non tutto il periodo.",
    histSource: "Dati della mappa: Historical Basemaps (licenza GPL-3.0)",
    histSame: "Altre civiltà della stessa epoca",
    fCivs: "Civiltà antiche qui",
    histTimeline: "Linea del tempo",
    thPeriod: "Periodo",
    eraBCE: "{n} a.C.",
    eraCE: "{n} d.C.",
    eraCirca: "c. {x}",
    histRange: "dal {a} al {b}",
    durAbout: "circa {n} anni",
    regTitle: "{org}: elenco dei paesi",
    regDesc: "Quali paesi fanno parte di {org}? Tutti i {n} paesi con mappa, quiz e scheda di mappa da stampare gratis.",
    regAnswer: "{org} comprende {n} paesi: {list}.",
    fCountries: "Paesi",
    regHubTitle: "Regioni e gruppi di paesi",
    fFormer: "Stato precedente",
    fFormerRange: "{n} (dal {a} al {b})",
    fUnitedUntil: "Uniti fino al",
    fBecame: "Indipendente dal",
    orgNoteKosovo: "Il Kosovo ha dichiarato l'indipendenza dalla Serbia nel 2008. Il suo status è contestato e non è uno dei 195 paesi contati in questo sito.",
    orgNoteGuianas: "La Guyana francese fa parte della Francia, quindi non è elencata come paese separato.",
    fPartOf: "Fa parte di",
    legendGroup: "Arancione: i paesi di questo gruppo.",
    gbH: "Regno Unito, Gran Bretagna e Isole Britanniche: qual è la differenza?",
    gbUK: "Il Regno Unito è lo stato sovrano. È formato da Inghilterra, Scozia, Galles e Irlanda del Nord.",
    gbGB: "La Gran Bretagna è l'isola principale. Come termine politico indica Inghilterra, Scozia e Galles, senza l'Irlanda del Nord.",
    gbBr: "Nel linguaggio di tutti i giorni «Gran Bretagna» si usa spesso per tutto il Regno Unito, ma in senso stretto non è la stessa cosa.",
    gbIsles: "Le Isole Britanniche sono il gruppo geografico di isole: Gran Bretagna, Irlanda e molte isole minori. L'Irlanda è un paese indipendente e non fa parte del Regno Unito.",
    gbQ: "Qual è la differenza tra Regno Unito e Gran Bretagna?",
    printSetTitle: "{t}: mappa da stampare e scheda (PDF)",
    printSetDesc: "{t} ({n}) su una mappa gratuita da stampare: mappa muta, scheda numerata, mappa con i nomi e soluzioni, ognuna in un PDF a parte.",
    orgMem: "{org}: paesi membri",
    printSecSets: "Equatore, emisferi e organizzazioni",

    orgHubTitle: "Organizzazioni internazionali: paesi membri",

    orgHubDesc: "Quali paesi fanno parte di G20, G7, BRICS, ASEAN, SAARC, SCO, UE, NATO e altri gruppi: elenchi dei membri, cartine e quiz.",

    orgTitle: "{org}: paesi membri",

    orgAnswer: "{org} conta {n} paesi membri: {list}.",

    fFounded: "Fondazione",

    fHQ: "Sede",

    fHead: "Guida",

    fMembers: "Paesi membri",

    fWebsite: "Sito web",

    noHQ: "Nessuna sede permanente",

    headSource: "Guida secondo Wikidata al {d}.",

    orgQuiz: "Trova i {n} membri sulla cartina",

    fMemberOf: "Membro di",

    orgNoteG20: "Anche l'Unione europea e l'Unione africana sono membri.",

    orgNoteG7: "Anche la Russia è stata membro dal 1997 al 2014, quando il gruppo si chiamava G8.",

    orgNoteAU: "Anche la Repubblica Araba Sahrawi Democratica (Sahara Occidentale) è membro.",

    orgNoteMercosur: "Il Venezuela è membro, ma sospeso.",

    orgNoteUNSC: "Sono i cinque membri permanenti; altri dieci vengono eletti per due anni.",

    orgDesc: "{org}: i {n} paesi membri su una cartina, con anno di fondazione, sede e guida, e un quiz.",

    moreIn: "Altri paesi: {cont}",

    qLoc: "Dove si trova {c}?",

    aLoc: "{c} si trova in {cont}. Confina con {list}.",

    aLocNone: "{c} si trova in {cont} e non ha confini terrestri.",

    qCur: "Qual è la valuta di {c}?",

    aCur: "Valuta di {c}: {list}.",

    qLang: "Che lingua si parla in {c}?",

    aLang: "Lingua ufficiale di {c}: {list}.",

    qCall: "Qual è il prefisso telefonico di {c}?",

    aCall: "Il prefisso telefonico internazionale di {c} è {code}.",

    fCalling: "Prefisso telefonico",

    aboutMaps: "Le cartine dei paesi usano i confini Natural Earth 1:50m (pubblico dominio) tramite il pacchetto world-atlas. Le cartine di province e stati usano i confini ADM1 di geoBoundaries (licenze per paese qui sotto), oppure OpenStreetMap dove le suddivisioni sono cambiate di recente. La cartina di un solo paese segue la cartina ufficiale di quel paese, compresi i territori che rivendica: quelle dell'India e del Pakistan includono entrambe Jammu e Kashmir, quella della Cina include Taiwan, quella della Russia la Crimea e quattro regioni ucraine, quella della Serbia il Kosovo e quella del Venezuela la Guayana Esequiba. Sulle cartine del mondo e dei continenti, Jammu e Kashmir e Ladakh amministrati dall'India sono mostrati come parte del Pakistan, la Crimea come parte dell'Ucraina, le alture del Golan come parte della Siria e Taiwan come parte della Cina; il Kosovo e le isole Falkland sono mostrati, ma non sono oggetto di domande. Le cartine sono semplificate per caricarsi in fretta, quindi i dettagli piccoli sono smussati.",
    aPopWB: "Secondo la Banca Mondiale, la popolazione di {c} è di {pop} abitanti ({year}).",
    aboutData: "I nomi dei paesi, le capitali, i nomi e i capoluoghi delle province e la popolazione delle province vengono da Wikidata (CC0), scaricati il {d}. La popolazione dei paesi viene dalla Banca Mondiale (CC BY 4.0), l'ultimo anno pubblicato, lo stesso per tutti i paesi; quella della Città del Vaticano viene da Wikidata. Codici ISO, superfici, confini, lingue e valute vengono dal dataset world-countries (ODbL). Quando queste fonti differiscono da quelle ufficiali (una seconda capitale mancante, una lingua regionale indicata come ufficiale), il sito le corregge.",
    kashmirQuiz: "Questo vale per le cartine del mondo e dei continenti. La cartina di un solo paese (i suoi stati o province) segue la cartina ufficiale di quel paese, perciò i quiz dell'India e del Pakistan includono entrambi Jammu e Kashmir.",
    usTitle: 'Chi è Geography Arcade',
    usDesc: 'Chi fa Geography Arcade, perché è gratis e come teniamo corretti quiz, cartine e dati.',
    us: [
      ['Che cos\'è Geography Arcade', 'Geography Arcade è un sito gratuito per imparare la geografia giocando. Ci sono quiz sulle cartine, giochi su capitali e bandiere e cartine da stampare per tutti i {n} paesi, più province e stati di {p} paesi, in {l} lingue.'],
      ['Chi siamo', 'Geography Arcade è fatto da un piccolo team indipendente. Non facciamo parte di nessuna scuola, casa editrice o governo. Creiamo i quiz, scriviamo le spiegazioni e controlliamo i dati da soli.'],
      ['Perché è gratis', 'Tutto sul sito è gratis, sia per giocare sia per stampare, senza account e senza abbonamenti. Vogliamo che chiunque abbia un browser possa imparare la cartina del mondo nella propria lingua.'],
      ['Come teniamo i dati corretti', 'Nomi dei paesi, capitali e popolazione vengono da Wikidata, e le cartine da Natural Earth, geoBoundaries e OpenStreetMap. I dati si aggiornano da soli ogni mese, e un nome cambiato aspetta qualche settimana prima di comparire, così una modifica sbagliata alla fonte non arriva nei quiz.'],
      ['Per insegnanti e genitori', 'Potete usare liberamente i quiz e le cartine da stampare in classe e a casa. Ogni cartina da stampare è disponibile come cartina muta, scheda, cartina con nomi e soluzioni.'],
      ['Hai trovato un errore?', 'Scrivici a {e} e lo verificheremo.'],
    ],
    usSources: 'Vedi tutte le fonti dei dati',
    pvTitle: 'Informativa sulla privacy',
    pvDesc: 'Cosa raccoglie Geography Arcade (pochissimo), come usiamo Google Analytics e quali scelte hai.',
    pvDate: 'Ultimo aggiornamento: {d}',
    pv: [
      ['In breve', 'Puoi usare Geography Arcade senza account e senza dirci nulla di te. Usiamo Google Analytics per contare le visite e capire quali pagine sono utili, con le funzioni pubblicitarie disattivate. Non vendiamo dati e non mostriamo pubblicità.'],
      ['Cosa resta sul tuo dispositivo', 'I tuoi punteggi migliori vengono salvati nel browser (archiviazione locale) così puoi provare a superarli. Non lasciano mai il tuo dispositivo. Puoi cancellarli eliminando i dati di questo sito nel browser.'],
      ['Google Analytics', 'Usiamo Google Analytics 4 per capire come viene usato il sito: quali pagine vengono visitate, dove si trovano più o meno i visitatori (paese e città), quale dispositivo e browser usano, da quale sito arrivano e come usano una pagina. Google può usare il tuo indirizzo IP per stimare la tua posizione approssimativa, ma Google Analytics 4 non memorizza gli indirizzi IP. Google Signals e le funzioni pubblicitarie sono disattivati.'],
      ['Cookie', 'Fuori dallo Spazio economico europeo, dal Regno Unito e dalla Svizzera, Google Analytics imposta due cookie proprietari (_ga e _ga_ seguito da un identificativo) per distinguere le visite nuove da quelle ripetute. Nello Spazio economico europeo, nel Regno Unito e in Svizzera non viene impostato alcun cookie di analisi: Google riceve solo segnali di misurazione senza cookie. Il sito non imposta altri cookie.'],
      ['Caratteri', 'Parte del testo usa caratteri di Google Fonts, quindi il tuo browser li scarica dai server di Google, che vedono il tuo indirizzo IP.'],
      ['Hosting', 'Il sito è ospitato da Hostinger. Come la maggior parte dei provider, i suoi server possono conservare normali registri di accesso (indirizzo IP, browser e pagina richiesta) per la sicurezza e il funzionamento del sito.'],
      ['Email', 'Se ci scrivi a {e}, usiamo il tuo indirizzo e il tuo messaggio solo per risponderti.'],
      ['Bambini', 'Geography Arcade è pensato per chi impara a ogni età, bambini compresi. Il sito non ha account, moduli o chat, quindi nessuno può darci informazioni personali attraverso di esso.'],
      ['Le tue scelte', 'Puoi bloccare Google Analytics con le impostazioni privacy del browser, un blocco contenuti o il componente aggiuntivo di disattivazione di Google (tools.google.com/dlpage/gaoptout). Quiz e cartine da stampare funzionano allo stesso modo in entrambi i casi.'],
      ['Modifiche a questa informativa', 'Se aggiungiamo qualcosa di nuovo, come account facoltativi per salvare i progressi su più dispositivi, aggiorneremo prima questa pagina e cambieremo la data in alto.'],
      ['Contatti', 'Domande sulla privacy: {e}.'],
    ],
  },
  ja: {
    navUs: '運営者について', navPrivacy: 'プライバシー',

    pdfBtn: "PDFをダウンロード",
    histHubTitle: "古代文明：年表と地図",
    histHubDesc: "インダス文明からインカまで、歴史上の主な文明と帝国を、始まった順に紹介します。それぞれが続いた期間と、今の国境の地図上での範囲がわかります。",
    histHubShort: "古代文明",
    histTitle: "{name}：時代、範囲、地図",
    histDesc: "{name}はいつ？{a}から{b}まで。今の国境の地図で、その範囲と含まれる現在の国を見られます。",
    histAnswer: "{name}：{a}から{b}まで（{d}）。範囲：現在の{list}の一部。",
    fPeriod: "時代",
    fDuration: "期間",
    fCovered: "含まれる現在の国",
    fMapShows: "地図が示すもの",
    histMapYear: "{y}ごろの範囲",
    histMapCaption: "オレンジ：{y}ごろの{name}のおおよその範囲（今の国境の上）。",
    histWiki: "ウィキペディアで詳しく見る",
    histAbout: "この地図について",
    histNote: "この地図はおおよそのものです。古代の国境は固定された線ではなく、形はオープンな Historical Basemaps プロジェクトに基づいています。同プロジェクトは歴史上の境界は不確かだと注意しています。ある一時点を示すもので、期間全体ではありません。",
    histSource: "地図データ：Historical Basemaps（GPL-3.0 ライセンス）",
    histSame: "同じ時代のほかの文明",
    fCivs: "この地域の古代文明",
    histTimeline: "年表",
    thPeriod: "時代",
    eraBCE: "紀元前{n}年",
    eraCE: "{n}年",
    eraCirca: "{x}頃",
    histRange: "{a}から{b}まで",
    durAbout: "約{n}年間",
    regTitle: "{org}：国の一覧",
    regDesc: "{org}にはどの国が含まれる？全{n}か国を、地図、クイズ、無料の印刷用地図ワークシートで紹介します。",
    regAnswer: "{org}には{n}か国が含まれます：{list}。",
    fCountries: "国",
    regHubTitle: "地域と国のグループ",
    fFormer: "かつての国家",
    fFormerRange: "{n}（{a}年から{b}年）",
    fUnitedUntil: "統一が続いたのは",
    fBecame: "独立した年",
    orgNoteKosovo: "コソボは2008年にセルビアからの独立を宣言しました。地位については争いがあり、このサイトで数える195か国には含まれていません。",
    orgNoteGuianas: "フランス領ギアナはフランスの一部なので、独立した国としては載せていません。",
    fPartOf: "所属する地域",
    legendGroup: "オレンジ：このグループの国。",
    gbH: "イギリス、ブリテン、グレートブリテンの違いは？",
    gbUK: "連合王国（UK、イギリス）は主権国家で、イングランド、スコットランド、ウェールズ、北アイルランドからなります。",
    gbGB: "グレートブリテンは主島の名前です。政治用語としてはイングランド、スコットランド、ウェールズを指し、北アイルランドは含みません。",
    gbBr: "「ブリテン」は日常的な言葉で、ふつうグレートブリテンを指しますが、連合王国全体の意味で使う人も多くいます。",
    gbIsles: "ブリテン諸島は地理上の島々のまとまりで、グレートブリテン島、アイルランド島、多くの小さな島を含みます。アイルランドは独立国で、連合王国の一部ではありません。",
    gbQ: "イギリス、ブリテン、グレートブリテンの違いは何ですか？",
    printSetTitle: "{t}：印刷用地図ワークシート（PDF）",
    printSetDesc: "{t}（{n}か国）の無料印刷用地図：白地図、番号付きワークシート、名前入り地図、解答。それぞれ別のPDFでダウンロードできます。",
    orgMem: "{org}加盟国",
    printSecSets: "赤道・北半球・南半球と国際機関",

    orgHubTitle: "国際機関：加盟国",

    orgHubDesc: "G20、G7、BRICS、ASEAN、南アジア地域協力連合、上海協力機構、EU、NATO などに加盟する国：加盟国の一覧、地図、クイズ。",

    orgTitle: "{org}：加盟国",

    orgAnswer: "{org}の加盟国は{n}か国です：{list}。",

    fFounded: "設立",

    fHQ: "本部",

    fHead: "代表",

    fMembers: "加盟国",

    fWebsite: "ウェブサイト",

    noHQ: "常設の本部はありません",

    headSource: "代表は{d}時点の Wikidata によります。",

    orgQuiz: "{n}の加盟国を地図で探そう",

    fMemberOf: "加盟機関",

    orgNoteG20: "欧州連合とアフリカ連合も加盟しています。",

    orgNoteG7: "ロシアも1997年から2014年まで加盟しており、当時はG8と呼ばれていました。",

    orgNoteAU: "サハラ・アラブ民主共和国（西サハラ）も加盟しています。",

    orgNoteMercosur: "ベネズエラは加盟国ですが、資格停止中です。",

    orgNoteUNSC: "これは5つの常任理事国です。ほかに10か国が任期2年で選ばれます。",

    orgDesc: "{org}：{n}の加盟国を地図で表示し、設立年、本部、代表も紹介。クイズ付き。",

    moreIn: "{cont}のほかの国",

    qLoc: "{c}はどこにありますか？",

    aLoc: "{c}は{cont}にあり、{list}と国境を接しています。",

    aLocNone: "{c}は{cont}にあり、陸の国境はありません。",

    qCur: "{c}の通貨は何ですか？",

    aCur: "{c}の通貨：{list}。",

    qLang: "{c}では何語が話されていますか？",

    aLang: "{c}の公用語：{list}。",

    qCall: "{c}の国際電話番号は？",

    aCall: "{c}の国番号は{code}です。",

    fCalling: "国番号",

    aboutMaps: "国の地図は world-atlas パッケージを通じて Natural Earth 1:50m の境界（パブリックドメイン）を使用しています。州・県の地図は geoBoundaries の ADM1 境界（各国のライセンスは下記）、または区分が最近変わった国では OpenStreetMap を使用しています。1つの国の地図は、その国が主張する領土を含め、その国の公式地図に従います。インドとパキスタンの地図はどちらもジャンムー・カシミールを含み、中国の地図は台湾を、ロシアの地図はクリミアとウクライナの4地域を、セルビアの地図はコソボを、ベネズエラの地図はグアヤナ・エセキバを含みます。世界地図と大陸の地図では、インドが管理するジャンムー・カシミールとラダックはパキスタンの一部、クリミアはウクライナの一部、ゴラン高原はシリアの一部、台湾は中国の一部として表示しています。コソボとフォークランド諸島は表示しますが、出題はしません。地図は速く読み込めるよう簡略化しているため、細かな部分はなめらかになっています。",
    aPopWB: "世界銀行によると、{c}の人口は{pop}人です（{year}年）。",
    aboutData: "国名、首都、州・県の名前と州都・県庁所在地、州・県の人口は Wikidata（CC0）から{d}に取得しています。国の人口は世界銀行（CC BY 4.0）の最新の公表年のもので、すべての国で同じ年です。バチカン市国の人口は Wikidata から取得しています。ISO コード、面積、国境、言語、通貨は world-countries データセット（ODbL）によるものです。これらの情報源が公式の情報と異なる場合（2つ目の首都が抜けている、地域の言語が公用語とされている など）は、当サイトで修正しています。",
    kashmirQuiz: "これは世界地図と大陸の地図に当てはまります。1つの国の地図（州や県）はその国の公式地図に従うため、インドとパキスタンのクイズにはどちらもジャンムー・カシミールが含まれます。",
    usTitle: 'Geography Arcade について',
    usDesc: 'Geography Arcade を作っているのは誰か、なぜ無料なのか、クイズ・地図・データの正確さをどう保っているか。',
    us: [
      ['Geography Arcade とは', 'Geography Arcade は、遊びながら地理を学べる無料のウェブサイトです。全{n}か国の地図クイズ、首都と国旗のゲーム、印刷用地図に加え、{p}か国の州・県などを{l}の言語で用意しています。'],
      ['私たちについて', 'Geography Arcade は小さな独立チームが運営しています。学校、出版社、政府とは関係ありません。クイズ作り、解説の執筆、データの確認はすべて自分たちで行っています。'],
      ['なぜ無料なのか', 'サイトのすべてが無料で遊べて無料で印刷できます。アカウント登録も有料の壁もありません。ブラウザがあれば誰でも、自分の言語で世界地図を学べるようにしたいと考えています。'],
      ['正確さを保つしくみ', '国名、首都、人口は Wikidata から、地図は Natural Earth、geoBoundaries、OpenStreetMap から取得しています。データは毎月自動で更新され、名前が変わった場合は数週間待ってから反映するので、元データの誤った編集がクイズに入りません。'],
      ['先生と保護者の方へ', 'クイズと印刷用地図は、授業でも家庭でも自由に使えます。印刷用地図はすべて、白地図、ワークシート、名前入り地図、解答の4種類があります。'],
      ['間違いを見つけたら', '{e} までご連絡ください。確認します。'],
    ],
    usSources: 'すべてのデータ出典を見る',
    pvTitle: 'プライバシーポリシー',
    pvDesc: 'Geography Arcade が収集する情報（ごくわずか）、Google アナリティクスの使い方、あなたが選べること。',
    pvDate: '最終更新日：{d}',
    pv: [
      ['要点', 'Geography Arcade はアカウントなしで、個人情報を何も伝えずに利用できます。訪問数を数え、どのページが役立っているかを知るために Google アナリティクスを使っていますが、広告機能はオフにしています。データを販売することも、広告を表示することもありません。'],
      ['あなたの端末に残るもの', 'クイズのベストスコアは、記録更新を目指せるようブラウザ（ローカルストレージ）に保存されます。端末の外に送られることはありません。ブラウザでこのサイトのデータを消去すれば削除できます。'],
      ['Google アナリティクス', 'サイトの使われ方を知るために Google アナリティクス 4 を使っています。見られたページ、訪問者のおおよその場所（国と都市）、端末とブラウザ、どのサイトから来たか、ページの使い方などです。Google はおおよその位置を推定するために IP アドレスを使うことがありますが、Google アナリティクス 4 は IP アドレスを保存しません。Google シグナルと広告機能はオフです。'],
      ['Cookie', '欧州経済領域、英国、スイス以外では、Google アナリティクスが新規訪問と再訪問を区別するために2つのファーストパーティ Cookie（_ga と、ID付きの _ga_）を設定します。欧州経済領域、英国、スイスでは分析用 Cookie は設定されず、Google には Cookie を使わない計測信号だけが送られます。このサイトはほかの Cookie を設定しません。'],
      ['フォント', '一部の文字には Google Fonts のウェブフォントを使っているため、ブラウザは Google のサーバーからフォントを読み込みます。その際、サーバーにはあなたの IP アドレスが見えます。'],
      ['ホスティング', 'このサイトは Hostinger でホストされています。多くのホスティング会社と同様に、セキュリティとサイト運営のため、サーバーが標準的なアクセスログ（IP アドレス、ブラウザ、要求されたページ）を保存することがあります。'],
      ['メール', '{e} にご連絡いただいた場合、アドレスとメッセージは返信のためだけに使います。'],
      ['子どもについて', 'Geography Arcade は子どもを含むあらゆる年齢の学習者向けです。アカウント、フォーム、チャットがないため、サイトを通じて個人情報を受け取ることはありません。'],
      ['あなたの選択', 'ブラウザのプライバシー設定、コンテンツブロッカー、Google のオプトアウト アドオン（tools.google.com/dlpage/gaoptout）で Google アナリティクスをブロックできます。どちらの場合も、クイズと印刷用地図は同じように使えます。'],
      ['このポリシーの変更', '複数の端末で進み具合を保存できる任意のアカウントなど、新しい機能を加える場合は、先にこのページを更新し、上部の日付を変えます。'],
      ['お問い合わせ', 'プライバシーに関するご質問：{e}'],
    ],
  },
  ko: {
    navUs: '소개', navPrivacy: '개인정보',

    pdfBtn: "PDF 다운로드",
    histHubTitle: "고대 문명: 연표와 지도",
    histHubDesc: "인더스 문명에서 잉카까지, 역사 속 주요 문명과 제국을 시작된 순서대로 소개합니다. 각각 얼마나 이어졌는지, 오늘날의 국경 지도에서 어느 범위였는지 확인하세요.",
    histHubShort: "고대 문명",
    histTitle: "{name}: 시기, 영역, 지도",
    histDesc: "{name}은(는) 언제였을까? {a}부터 {b}까지. 오늘날의 국경 지도에서 영역과 포함된 현대 국가를 확인하세요.",
    histAnswer: "{name}: {a}부터 {b}까지({d}). 범위: 오늘날의 {list} 일부.",
    fPeriod: "시기",
    fDuration: "지속 기간",
    fCovered: "포함된 현대 국가",
    fMapShows: "지도가 보여 주는 것",
    histMapYear: "{y}년경의 영역",
    histMapCaption: "주황색: {y}년경 {name}의 대략적인 영역(오늘날의 국경 위).",
    histWiki: "위키백과에서 더 보기",
    histAbout: "이 지도에 대하여",
    histNote: "이 지도는 대략적인 것입니다. 고대의 경계는 고정된 선이 아니었고, 모양은 공개 프로젝트 Historical Basemaps에서 가져왔으며 이 프로젝트는 역사적 경계가 불확실하다고 경고합니다. 한 시점을 보여 줄 뿐 전체 기간이 아닙니다.",
    histSource: "지도 데이터: Historical Basemaps (GPL-3.0 라이선스)",
    histSame: "같은 시기의 다른 문명",
    fCivs: "이곳의 고대 문명",
    histTimeline: "연표",
    thPeriod: "시기",
    eraBCE: "기원전 {n}년",
    eraCE: "{n}년",
    eraCirca: "약 {x}",
    histRange: "{a}부터 {b}까지",
    durAbout: "약 {n}년",
    regTitle: "{org}: 국가 목록",
    regDesc: "{org}에는 어떤 나라가 속할까요? 지도, 퀴즈, 무료 인쇄용 지도 학습지와 함께 {n}개국을 모두 소개합니다.",
    regAnswer: "{org}에는 {n}개국이 있습니다: {list}.",
    fCountries: "국가",
    regHubTitle: "지역과 국가 그룹",
    fFormer: "이전 국가",
    fFormerRange: "{n} ({a}년부터 {b}년까지)",
    fUnitedUntil: "통합이 유지된 시기",
    fBecame: "독립 연도",
    orgNoteKosovo: "코소보는 2008년 세르비아로부터 독립을 선언했습니다. 지위에 대한 논란이 있으며, 이 사이트가 집계하는 195개국에는 포함되지 않습니다.",
    orgNoteGuianas: "프랑스령 기아나는 프랑스의 일부이므로 별개 국가로 나열하지 않았습니다.",
    fPartOf: "소속 지역",
    legendGroup: "주황색: 이 그룹의 국가.",
    gbH: "영국, 브리튼, 그레이트브리튼은 무엇이 다를까요?",
    gbUK: "연합왕국(UK, 영국)은 주권 국가로 잉글랜드, 스코틀랜드, 웨일스, 북아일랜드로 이루어져 있습니다.",
    gbGB: "그레이트브리튼은 본섬의 이름입니다. 정치적 용어로는 잉글랜드, 스코틀랜드, 웨일스를 뜻하며 북아일랜드는 포함하지 않습니다.",
    gbBr: "브리튼은 일상에서 쓰는 말로, 보통 그레이트브리튼을 가리키지만 영국 전체를 뜻하는 말로 쓰는 사람도 많습니다.",
    gbIsles: "브리튼 제도는 지리상의 섬 무리로, 그레이트브리튼섬, 아일랜드섬과 많은 작은 섬을 포함합니다. 아일랜드는 독립 국가이며 영국의 일부가 아닙니다.",
    gbQ: "영국, 브리튼, 그레이트브리튼은 무엇이 다른가요?",
    printSetTitle: "{t}: 인쇄용 지도 학습지 (PDF)",
    printSetDesc: "{t}({n}) 무료 인쇄용 지도: 백지도, 번호 학습지, 이름 지도, 정답지를 각각 PDF로 받을 수 있습니다.",
    orgMem: "{org} 회원국",
    printSecSets: "적도, 반구, 국제기구",

    orgHubTitle: "국제기구: 회원국",

    orgHubDesc: "G20, G7, 브릭스, 아세안, 남아시아지역협력연합, 상하이협력기구, 유럽연합, 나토 등에 속한 나라: 회원국 목록, 지도, 퀴즈.",

    orgTitle: "{org}: 회원국",

    orgAnswer: "{org}의 회원국은 {n}개국입니다: {list}.",

    fFounded: "창설",

    fHQ: "본부",

    fHead: "수장",

    fMembers: "회원국",

    fWebsite: "웹사이트",

    noHQ: "상설 본부 없음",

    headSource: "수장은 {d} 기준 Wikidata 자료입니다.",

    orgQuiz: "지도에서 {n}개 회원국 찾기",

    fMemberOf: "가입 기구",

    orgNoteG20: "유럽연합과 아프리카연합도 회원입니다.",

    orgNoteG7: "러시아도 1997년부터 2014년까지 회원이었으며, 당시에는 G8이라 불렸습니다.",

    orgNoteAU: "사라위 아랍 민주 공화국(서사하라)도 회원입니다.",

    orgNoteMercosur: "베네수엘라는 회원국이지만 자격이 정지되었습니다.",

    orgNoteUNSC: "5개 상임이사국입니다. 나머지 10개국은 2년 임기로 선출됩니다.",

    orgDesc: "{org}: 지도로 보는 {n}개 회원국, 창설 연도, 본부, 수장, 그리고 퀴즈.",

    moreIn: "{cont}의 다른 나라",

    qLoc: "{c}는 어디에 있나요?",

    aLoc: "{c}는 {cont}에 있으며 {list}와 국경을 접합니다.",

    aLocNone: "{c}는 {cont}에 있으며 육지 국경이 없습니다.",

    qCur: "{c}의 통화는 무엇인가요?",

    aCur: "{c}의 통화: {list}.",

    qLang: "{c}에서는 어떤 언어를 쓰나요?",

    aLang: "{c}의 공용어: {list}.",

    qCall: "{c}의 국가 번호는 무엇인가요?",

    aCall: "{c}의 국제 전화 국가 번호는 {code}입니다.",

    fCalling: "국가 번호",

    aboutMaps: "나라 지도는 world-atlas 패키지를 통해 Natural Earth 1:50m 경계(퍼블릭 도메인)를 사용합니다. 주와 도 지도는 geoBoundaries ADM1 경계(나라별 라이선스는 아래 참조)를 사용하며, 행정구역이 최근에 바뀐 나라는 OpenStreetMap을 사용합니다. 한 나라의 지도는 그 나라가 주장하는 영토를 포함해 그 나라의 공식 지도를 따릅니다. 인도와 파키스탄 지도에는 모두 잠무 카슈미르가, 중국 지도에는 대만이, 러시아 지도에는 크림반도와 우크라이나의 네 지역이, 세르비아 지도에는 코소보가, 베네수엘라 지도에는 과야나에세키바가 들어 있습니다. 세계 지도와 대륙 지도에서는 인도가 관할하는 잠무 카슈미르와 라다크를 파키스탄의 일부로, 크림반도를 우크라이나의 일부로, 골란고원을 시리아의 일부로, 대만을 중국의 일부로 표시합니다. 코소보와 포클랜드 제도는 표시하지만 문제로 내지는 않습니다. 지도는 빠르게 불러오도록 단순화했기 때문에 작은 부분은 매끄럽게 처리되어 있습니다.",
    aPopWB: "세계은행에 따르면 {c}의 인구는 {pop}명입니다({year}년).",
    aboutData: "나라 이름, 수도, 주·도 이름과 주도, 주·도 인구는 Wikidata(CC0)에서 {d}에 가져왔습니다. 나라 인구는 세계은행(CC BY 4.0)이 발표한 최신 연도의 자료로, 모든 나라가 같은 연도입니다. 바티칸 시국의 인구는 Wikidata에서 가져왔습니다. ISO 코드, 면적, 국경, 언어, 통화는 world-countries 데이터셋(ODbL)에서 가져왔습니다. 이 자료가 공식 자료와 다를 때(두 번째 수도가 빠진 경우, 지역 언어가 공용어로 적힌 경우 등)에는 사이트에서 바로잡습니다.",
    kashmirQuiz: "이는 세계 지도와 대륙 지도에 해당합니다. 한 나라의 지도(주나 도)는 그 나라의 공식 지도를 따르므로, 인도와 파키스탄 퀴즈 모두에 잠무 카슈미르가 들어 있습니다.",
    usTitle: 'Geography Arcade 소개',
    usDesc: 'Geography Arcade를 누가 만드는지, 왜 무료인지, 퀴즈와 지도와 정보를 어떻게 정확하게 유지하는지 알려드립니다.',
    us: [
      ['Geography Arcade란', 'Geography Arcade는 게임으로 지리를 배우는 무료 웹사이트입니다. 전 세계 {n}개국의 지도 퀴즈, 수도와 국기 게임, 인쇄용 지도에 더해 {p}개국의 주와 도를 {l}개 언어로 제공합니다.'],
      ['우리는 누구인가', 'Geography Arcade는 작은 독립 팀이 만듭니다. 어떤 학교, 출판사, 정부에도 속해 있지 않습니다. 퀴즈 제작, 설명 작성, 데이터 확인을 모두 직접 합니다.'],
      ['왜 무료인가', '사이트의 모든 것은 무료로 플레이하고 무료로 인쇄할 수 있으며, 계정이나 유료 결제가 필요 없습니다. 브라우저만 있으면 누구나 자기 언어로 세계 지도를 배울 수 있기를 바랍니다.'],
      ['정확성을 지키는 방법', '나라 이름, 수도, 인구는 Wikidata에서, 지도는 Natural Earth, geoBoundaries, OpenStreetMap에서 가져옵니다. 데이터는 매달 자동으로 갱신되며, 바뀐 이름은 몇 주 기다린 뒤에 반영되어 원본의 잘못된 편집이 퀴즈에 들어가지 않습니다.'],
      ['선생님과 부모님께', '퀴즈와 인쇄용 지도를 수업과 가정에서 자유롭게 사용하세요. 모든 인쇄용 지도는 백지도, 학습지, 이름 지도, 정답지로 제공됩니다.'],
      ['오류를 발견하셨나요?', '{e}로 알려 주시면 확인하겠습니다.'],
    ],
    usSources: '모든 데이터 출처 보기',
    pvTitle: '개인정보 처리방침',
    pvDesc: 'Geography Arcade가 수집하는 정보(아주 적음), Google 애널리틱스를 사용하는 방법, 그리고 선택할 수 있는 사항.',
    pvDate: '최종 업데이트: {d}',
    pv: [
      ['요약', 'Geography Arcade는 계정 없이, 자신에 대한 정보를 알려 주지 않고도 이용할 수 있습니다. 방문 수를 세고 어떤 페이지가 유용한지 보기 위해 Google 애널리틱스를 사용하며, 광고 기능은 꺼 두었습니다. 데이터를 판매하지 않으며 광고를 표시하지 않습니다.'],
      ['기기에 남는 정보', '퀴즈 최고 점수는 기록을 깰 수 있도록 브라우저(로컬 스토리지)에 저장됩니다. 기기 밖으로 전송되지 않습니다. 브라우저에서 이 사이트의 데이터를 지우면 삭제됩니다.'],
      ['Google 애널리틱스', '사이트가 어떻게 이용되는지 알기 위해 Google 애널리틱스 4를 사용합니다. 방문한 페이지, 방문자의 대략적인 위치(국가와 도시), 사용 기기와 브라우저, 유입된 사이트, 페이지 이용 방식 등입니다. Google은 대략적인 위치를 추정하기 위해 IP 주소를 사용할 수 있지만, Google 애널리틱스 4는 IP 주소를 저장하지 않습니다. Google 신호와 광고 기능은 꺼져 있습니다.'],
      ['쿠키', '유럽 경제 지역, 영국, 스위스 밖에서는 Google 애널리틱스가 신규 방문과 재방문을 구분하기 위해 퍼스트 파티 쿠키 두 개(_ga, 그리고 ID가 붙은 _ga_)를 설정합니다. 유럽 경제 지역, 영국, 스위스에서는 분석 쿠키를 설정하지 않으며, Google은 쿠키 없는 측정 신호만 받습니다. 이 사이트는 다른 쿠키를 설정하지 않습니다.'],
      ['글꼴', '일부 텍스트는 Google Fonts의 웹 글꼴을 사용하므로, 브라우저가 Google 서버에서 글꼴을 내려받으며 이때 서버는 IP 주소를 보게 됩니다.'],
      ['호스팅', '이 사이트는 Hostinger에서 호스팅됩니다. 대부분의 웹 호스트처럼 보안과 사이트 운영을 위해 서버가 일반적인 접속 기록(IP 주소, 브라우저, 요청한 페이지)을 보관할 수 있습니다.'],
      ['이메일', '{e}로 연락하시면 주소와 메시지는 답장에만 사용합니다.'],
      ['어린이', 'Geography Arcade는 어린이를 포함한 모든 연령의 학습자를 위한 사이트입니다. 계정, 양식, 채팅이 없으므로 누구도 사이트를 통해 개인정보를 제공할 수 없습니다.'],
      ['선택할 수 있는 사항', '브라우저의 개인정보 설정, 콘텐츠 차단기, Google의 차단 부가기능(tools.google.com/dlpage/gaoptout)으로 Google 애널리틱스를 차단할 수 있습니다. 어느 경우든 퀴즈와 인쇄용 지도는 똑같이 작동합니다.'],
      ['방침 변경', '여러 기기에서 진행 상황을 저장하는 선택형 계정처럼 새로운 기능을 추가하면, 먼저 이 페이지를 업데이트하고 위의 날짜를 바꾸겠습니다.'],
      ['문의', '개인정보 관련 문의: {e}'],
    ],
  },
  pl: {
    navUs: 'O nas', navPrivacy: 'Prywatność',

    pdfBtn: "Pobierz PDF",
    histHubTitle: "Starożytne cywilizacje: oś czasu i mapy",
    histHubDesc: "Najważniejsze cywilizacje i imperia w historii, od doliny Indusu po Inków, w kolejności powstania. Zobacz, jak długo trwała każda z nich i jaki obszar zajmowała, na mapie z dzisiejszymi granicami.",
    histHubShort: "Starożytne cywilizacje",
    histTitle: "{name}: daty, zasięg i mapa",
    histDesc: "Kiedy istniało {name}? Od {a} do {b}. Zobacz zasięg na mapie z dzisiejszymi granicami i współczesne państwa.",
    histAnswer: "{name}: od {a} do {b} ({d}). Zasięg: części obecnych państw: {list}.",
    fPeriod: "Okres",
    fDuration: "Czas trwania",
    fCovered: "Współczesne państwa na tym obszarze",
    fMapShows: "Mapa pokazuje",
    histMapYear: "Obszar około {y}",
    histMapCaption: "Pomarańczowy: przybliżony obszar ({name}) około {y}, na dzisiejszych granicach.",
    histWiki: "Więcej w Wikipedii",
    histAbout: "O tej mapie",
    histNote: "Mapa jest przybliżona. Dawne granice nie były stałymi liniami, a kształt pochodzi z otwartego projektu Historical Basemaps, który ostrzega, że granice historyczne są niepewne. Pokazuje jeden moment, a nie cały okres.",
    histSource: "Dane mapy: Historical Basemaps (licencja GPL-3.0)",
    histSame: "Inne cywilizacje w tym samym czasie",
    fCivs: "Starożytne cywilizacje tutaj",
    histTimeline: "Oś czasu",
    thPeriod: "Okres",
    eraBCE: "{n} p.n.e.",
    eraCE: "{n} n.e.",
    eraCirca: "ok. {x}",
    histRange: "od {a} do {b}",
    durAbout: "około {n} lat",
    regTitle: "{org}: lista państw",
    regDesc: "Jakie państwa należą do {org}? Wszystkie {n} państw z mapą, quizem i darmową kartą pracy z mapą do druku.",
    regAnswer: "{org} obejmuje {n} państw: {list}.",
    fCountries: "Państwa",
    regHubTitle: "Regiony i grupy państw",
    fFormer: "Dawne państwo",
    fFormerRange: "{n} (od {a} do {b})",
    fUnitedUntil: "Zjednoczone do",
    fBecame: "Niepodległe od",
    orgNoteKosovo: "Kosowo ogłosiło niepodległość od Serbii w 2008 roku. Jego status jest sporny i nie należy do 195 państw liczonych na tej stronie.",
    orgNoteGuianas: "Gujana Francuska jest częścią Francji, więc nie figuruje jako osobne państwo.",
    fPartOf: "Część regionu",
    legendGroup: "Pomarańczowy: państwa z tej grupy.",
    gbH: "Zjednoczone Królestwo, Wielka Brytania i Wyspy Brytyjskie: jaka jest różnica?",
    gbUK: "Zjednoczone Królestwo (UK) to suwerenne państwo. Tworzą je Anglia, Szkocja, Walia i Irlandia Północna.",
    gbGB: "Wielka Brytania to główna wyspa. Jako termin polityczny oznacza Anglię, Szkocję i Walię, bez Irlandii Północnej.",
    gbBr: "W mowie potocznej «Wielka Brytania» często oznacza całe Zjednoczone Królestwo, choć ściśle rzecz biorąc to nie to samo.",
    gbIsles: "Wyspy Brytyjskie to geograficzna grupa wysp: Wielka Brytania, Irlandia i wiele mniejszych wysp. Irlandia jest osobnym państwem i nie należy do Zjednoczonego Królestwa.",
    gbQ: "Jaka jest różnica między Zjednoczonym Królestwem a Wielką Brytanią?",
    printSetTitle: "{t}: mapa do druku i karta pracy (PDF)",
    printSetDesc: "{t} ({n}) na darmowej mapie do druku: mapa konturowa, karta pracy z numerami, mapa z nazwami i odpowiedzi, każda w osobnym PDF.",
    orgMem: "{org}: państwa członkowskie",
    printSecSets: "Równik, półkule i organizacje",

    orgHubTitle: "Organizacje międzynarodowe: państwa członkowskie",

    orgHubDesc: "Które państwa należą do G20, G7, BRICS, ASEAN, SAARC, SOW, UE, NATO i innych grup: listy członków, mapy i quizy.",

    orgTitle: "{org}: państwa członkowskie",

    orgAnswer: "Liczba państw członkowskich ({org}): {n}. Są to: {list}.",

    fFounded: "Założenie",

    fHQ: "Siedziba",

    fHead: "Przewodniczący",

    fMembers: "Państwa członkowskie",

    fWebsite: "Strona internetowa",

    noHQ: "Brak stałej siedziby",

    headSource: "Przewodniczący według Wikidata z dnia {d}.",

    orgQuiz: "Znajdź na mapie wszystkich członków ({n})",

    fMemberOf: "Członkostwo",

    orgNoteG20: "Członkami są też Unia Europejska i Unia Afrykańska.",

    orgNoteG7: "Rosja również była członkiem od 1997 do 2014 roku, gdy grupa nazywała się G8.",

    orgNoteAU: "Członkiem jest też Saharyjska Arabska Republika Demokratyczna (Sahara Zachodnia).",

    orgNoteMercosur: "Wenezuela jest członkiem, ale jej członkostwo zawieszono.",

    orgNoteUNSC: "To pięciu stałych członków; dziesięciu kolejnych wybiera się na dwa lata.",

    orgDesc: "{org}: państwa członkowskie ({n}) na mapie, z rokiem założenia, siedzibą i przewodniczącym, oraz quiz.",

    moreIn: "Inne kraje ({cont})",

    qLoc: "Gdzie leży {c}?",

    aLoc: "{c} leży w regionie: {cont}. Graniczy z: {list}.",

    aLocNone: "{c} leży w regionie: {cont} i nie ma granic lądowych.",

    qCur: "Jaka jest waluta ({c})?",

    aCur: "Waluta ({c}): {list}.",

    qLang: "Jakim językiem mówi się ({c})?",

    aLang: "Język urzędowy ({c}): {list}.",

    qCall: "Jaki jest numer kierunkowy ({c})?",

    aCall: "Międzynarodowy numer kierunkowy ({c}) to {code}.",

    fCalling: "Numer kierunkowy",

    aboutMaps: "Mapy państw korzystają z granic Natural Earth 1:50m (domena publiczna) za pośrednictwem pakietu world-atlas. Mapy prowincji i stanów korzystają z granic geoBoundaries ADM1 (licencje podane niżej dla każdego kraju) lub z OpenStreetMap tam, gdzie podział niedawno się zmienił. Mapa jednego państwa jest zgodna z oficjalną mapą tego państwa, łącznie z terenami, do których rości sobie prawo: mapy Indii i Pakistanu obejmują Dżammu i Kaszmir, mapa Chin obejmuje Tajwan, mapa Rosji Krym i cztery regiony Ukrainy, mapa Serbii Kosowo, a mapa Wenezueli Gujanę Essequibo. Na mapach świata i kontynentów administrowane przez Indie Dżammu i Kaszmir oraz Ladakh są pokazane jako część Pakistanu, Krym jako część Ukrainy, Wzgórza Golan jako część Syrii, a Tajwan jako część Chin; Kosowo i Falklandy są pokazane, ale nie ma o nie pytań. Mapy są uproszczone, aby szybko się wczytywały, więc drobne szczegóły są wygładzone.",
    aPopWB: "Według Banku Światowego liczba ludności ({c}) wynosi {pop} ({year}).",
    aboutData: "Nazwy państw, stolice, nazwy i stolice prowincji oraz liczba ludności prowincji pochodzą z Wikidata (CC0), pobrane {d}. Liczba ludności państw pochodzi z Banku Światowego (CC BY 4.0), z najnowszego opublikowanego roku, tego samego dla wszystkich państw; dla Watykanu z Wikidata. Kody ISO, powierzchnie, granice, języki i waluty pochodzą ze zbioru world-countries (ODbL). Gdy te źródła różnią się od oficjalnych (brak drugiej stolicy, język regionalny podany jako urzędowy), strona je poprawia.",
    kashmirQuiz: "Dotyczy to map świata i kontynentów. Mapa jednego państwa (jego stanów lub prowincji) jest zgodna z oficjalną mapą tego państwa, dlatego quizy o Indiach i o Pakistanie obejmują Dżammu i Kaszmir.",
    usTitle: 'O Geography Arcade',
    usDesc: 'Kto tworzy Geography Arcade, dlaczego jest za darmo i jak dbamy o poprawność quizów, map i danych.',
    us: [
      ['Czym jest Geography Arcade', 'Geography Arcade to darmowa strona do nauki geografii przez zabawę. Są tu quizy z mapą, gry o stolicach i flagach oraz mapy do druku dla wszystkich państw (łącznie {n}), a także prowincje i stany {p} państw, w {l} językach.'],
      ['Kim jesteśmy', 'Geography Arcade tworzy mały niezależny zespół. Nie należymy do żadnej szkoły, wydawnictwa ani rządu. Quizy, objaśnienia i sprawdzanie danych robimy sami.'],
      ['Dlaczego za darmo', 'Wszystko na stronie jest darmowe, zarówno gra, jak i druk, bez konta i bez opłat. Chcemy, żeby każdy, kto ma przeglądarkę, mógł poznać mapę świata w swoim języku.'],
      ['Jak dbamy o poprawność', 'Nazwy państw, stolice i liczba ludności pochodzą z Wikidata, a mapy z Natural Earth, geoBoundaries i OpenStreetMap. Dane aktualizują się automatycznie co miesiąc, a zmieniona nazwa czeka kilka tygodni, zanim się pojawi, żeby błędna edycja w źródle nie trafiła do quizów.'],
      ['Dla nauczycieli i rodziców', 'Quizy i mapy do druku można swobodnie wykorzystywać na lekcjach i w domu. Każda mapa do druku jest dostępna jako mapa konturowa, karta pracy, mapa z nazwami i odpowiedzi.'],
      ['Znalazłeś błąd?', 'Napisz do nas na {e}, a sprawdzimy to.'],
    ],
    usSources: 'Zobacz wszystkie źródła danych',
    pvTitle: 'Polityka prywatności',
    pvDesc: 'Co zbiera Geography Arcade (bardzo mało), jak korzystamy z Google Analytics i jakie masz możliwości.',
    pvDate: 'Ostatnia aktualizacja: {d}',
    pv: [
      ['W skrócie', 'Z Geography Arcade możesz korzystać bez konta i bez podawania czegokolwiek o sobie. Korzystamy z Google Analytics, żeby liczyć odwiedziny i sprawdzać, które strony są przydatne; funkcje reklamowe są wyłączone. Nie sprzedajemy danych i nie wyświetlamy reklam.'],
      ['Co zostaje na Twoim urządzeniu', 'Twoje najlepsze wyniki w quizach są zapisywane w przeglądarce (pamięć lokalna), żebyś mógł próbować je pobić. Nigdy nie opuszczają Twojego urządzenia. Możesz je usunąć, czyszcząc dane tej strony w przeglądarce.'],
      ['Google Analytics', 'Korzystamy z Google Analytics 4, żeby rozumieć, jak używana jest strona: które strony są odwiedzane, gdzie mniej więcej są odwiedzający (kraj i miasto), jakiego urządzenia i przeglądarki używają, z jakiej strony przyszli i jak korzystają ze strony. Google może używać Twojego adresu IP do określenia przybliżonej lokalizacji, ale Google Analytics 4 nie przechowuje adresów IP. Google Signals i funkcje reklamowe są wyłączone.'],
      ['Pliki cookie', 'Poza Europejskim Obszarem Gospodarczym, Wielką Brytanią i Szwajcarią Google Analytics zapisuje dwa własne pliki cookie (_ga oraz _ga_ z identyfikatorem), żeby odróżnić nowe wizyty od powrotów. W Europejskim Obszarze Gospodarczym, Wielkiej Brytanii i Szwajcarii nie są zapisywane żadne analityczne pliki cookie: Google otrzymuje tylko sygnały pomiarowe bez plików cookie. Strona nie zapisuje żadnych innych plików cookie.'],
      ['Czcionki', 'Część tekstu korzysta z czcionek Google Fonts, więc przeglądarka pobiera je z serwerów Google, które widzą Twój adres IP.'],
      ['Hosting', 'Strona jest hostowana przez Hostinger. Jak większość firm hostingowych, jej serwery mogą przechowywać standardowe logi dostępu (adres IP, przeglądarka i żądana strona) ze względów bezpieczeństwa i dla działania strony.'],
      ['E-mail', 'Jeśli napiszesz na {e}, używamy Twojego adresu i wiadomości tylko po to, żeby Ci odpowiedzieć.'],
      ['Dzieci', 'Geography Arcade jest dla uczących się w każdym wieku, także dla dzieci. Strona nie ma kont, formularzy ani czatu, więc nikt nie może przekazać nam przez nią danych osobowych.'],
      ['Twoje możliwości', 'Możesz zablokować Google Analytics w ustawieniach prywatności przeglądarki, programem blokującym treści lub dodatkiem Google do rezygnacji (tools.google.com/dlpage/gaoptout). Quizy i mapy do druku działają tak samo w obu przypadkach.'],
      ['Zmiany tej polityki', 'Jeśli dodamy coś nowego, na przykład opcjonalne konta do zapisywania postępów na różnych urządzeniach, najpierw zaktualizujemy tę stronę i zmienimy datę na górze.'],
      ['Kontakt', 'Pytania dotyczące prywatności: {e}.'],
    ],
  },
  nl: {
    navUs: 'Over ons', navPrivacy: 'Privacy',

    pdfBtn: "PDF downloaden",
    histHubTitle: "Oude beschavingen: tijdlijn en kaarten",
    histHubDesc: "De grote beschavingen en rijken uit de geschiedenis, van de Indusvallei tot de Inca, in volgorde van ontstaan. Bekijk hoe lang elk bestond en welk gebied het besloeg op een kaart met de grenzen van nu.",
    histHubShort: "Oude beschavingen",
    histTitle: "{name}: periode, gebied en kaart",
    histDesc: "Wanneer bestond {name}? Van {a} tot {b}. Bekijk het gebied op een kaart met de grenzen van nu en de moderne landen.",
    histAnswer: "{name}: van {a} tot {b} ({d}). Gebied: delen van {list}.",
    fPeriod: "Periode",
    fDuration: "Duur",
    fCovered: "Moderne landen in het gebied",
    fMapShows: "De kaart toont",
    histMapYear: "Het gebied rond {y}",
    histMapCaption: "Oranje: ongeveer het gebied van {name} rond {y}, op de grenzen van nu.",
    histWiki: "Meer op Wikipedia",
    histAbout: "Over deze kaart",
    histNote: "De kaart is bij benadering. Oude grenzen waren geen vaste lijnen, en de vorm komt uit het open project Historical Basemaps, dat waarschuwt dat historische grenzen onzeker zijn. Hij toont één moment, niet de hele periode.",
    histSource: "Kaartgegevens: Historical Basemaps (licentie GPL-3.0)",
    histSame: "Andere beschavingen in dezelfde tijd",
    fCivs: "Oude beschavingen hier",
    histTimeline: "Tijdlijn",
    thPeriod: "Periode",
    eraBCE: "{n} v.Chr.",
    eraCE: "{n} n.Chr.",
    eraCirca: "ca. {x}",
    histRange: "{a} tot {b}",
    durAbout: "ongeveer {n} jaar",
    regTitle: "{org}: lijst van landen",
    regDesc: "Welke landen horen bij {org}? Alle {n} landen met kaart, quiz en gratis printbaar kaartwerkblad.",
    regAnswer: "{org} omvat {n} landen: {list}.",
    fCountries: "Landen",
    regHubTitle: "Regio's en landengroepen",
    fFormer: "Voormalige staat",
    fFormerRange: "{n} ({a} tot {b})",
    fUnitedUntil: "Verenigd tot",
    fBecame: "Onafhankelijk sinds",
    orgNoteKosovo: "Kosovo verklaarde zich in 2008 onafhankelijk van Servië. De status is omstreden en Kosovo hoort niet bij de 195 landen die deze site telt.",
    orgNoteGuianas: "Frans-Guyana hoort bij Frankrijk en staat daarom niet als apart land in de lijst.",
    fPartOf: "Onderdeel van",
    legendGroup: "Oranje: de landen van deze groep.",
    gbH: "Verenigd Koninkrijk, Groot-Brittannië en de Britse Eilanden: wat is het verschil?",
    gbUK: "Het Verenigd Koninkrijk (VK) is het soevereine land. Het bestaat uit Engeland, Schotland, Wales en Noord-Ierland.",
    gbGB: "Groot-Brittannië is het hoofdeiland. Als politieke term betekent het Engeland, Schotland en Wales, zonder Noord-Ierland.",
    gbBr: "In het dagelijks taalgebruik wordt «Groot-Brittannië» vaak voor het hele Verenigd Koninkrijk gebruikt, maar strikt genomen is dat niet hetzelfde.",
    gbIsles: "De Britse Eilanden zijn de geografische eilandengroep: Groot-Brittannië, Ierland en veel kleinere eilanden. Ierland is een apart land en geen deel van het Verenigd Koninkrijk.",
    gbQ: "Wat is het verschil tussen het Verenigd Koninkrijk en Groot-Brittannië?",
    printSetTitle: "{t}: printbare kaart en werkblad (PDF)",
    printSetDesc: "{t} ({n}) op een gratis printbare kaart: blinde kaart, genummerd werkblad, kaart met namen en antwoorden, elk als eigen PDF.",
    orgMem: "Lidstaten van {org}",
    printSecSets: "Evenaar, halfronden en organisaties",

    orgHubTitle: "Internationale organisaties: lidstaten",

    orgHubDesc: "Welke landen horen bij de G20, G7, BRICS, ASEAN, SAARC, SCO, EU, NAVO en andere groepen: ledenlijsten, kaarten en quizzen.",

    orgTitle: "{org}: lidstaten",

    orgAnswer: "{org} heeft {n} lidstaten: {list}.",

    fFounded: "Opgericht",

    fHQ: "Hoofdkantoor",

    fHead: "Leiding",

    fMembers: "Lidstaten",

    fWebsite: "Website",

    noHQ: "Geen vast hoofdkantoor",

    headSource: "Leiding volgens Wikidata op {d}.",

    orgQuiz: "Vind de {n} leden op de kaart",

    fMemberOf: "Lid van",

    orgNoteG20: "Ook de Europese Unie en de Afrikaanse Unie zijn lid.",

    orgNoteG7: "Rusland was van 1997 tot 2014 ook lid, toen de groep G8 heette.",

    orgNoteAU: "Ook de Arabische Democratische Republiek Sahara (Westelijke Sahara) is lid.",

    orgNoteMercosur: "Venezuela is lid, maar geschorst.",

    orgNoteUNSC: "Dit zijn de vijf permanente leden; tien andere worden voor twee jaar gekozen.",

    orgDesc: "{org}: de {n} lidstaten op een kaart, met oprichtingsjaar, hoofdkantoor en leiding, plus een quiz.",

    moreIn: "Meer landen in {cont}",

    qLoc: "Waar ligt {c}?",

    aLoc: "{c} ligt in {cont}. Buurlanden: {list}.",

    aLocNone: "{c} ligt in {cont} en heeft geen landgrenzen.",

    qCur: "Welke munt gebruikt {c}?",

    aCur: "Munt van {c}: {list}.",

    qLang: "Welke taal spreekt men in {c}?",

    aLang: "Officiële taal van {c}: {list}.",

    qCall: "Wat is het landnummer van {c}?",

    aCall: "Het internationale landnummer van {c} is {code}.",

    fCalling: "Landnummer",

    aboutMaps: "Landkaarten gebruiken de grenzen van Natural Earth 1:50m (publiek domein) via het pakket world-atlas. Kaarten van provincies en staten gebruiken de ADM1-grenzen van geoBoundaries (licenties per land hieronder), of OpenStreetMap waar de indeling onlangs is veranderd. De kaart van één land volgt de officiële kaart van dat land, inclusief gebied dat het claimt: de kaarten van India en Pakistan bevatten allebei Jammu en Kasjmir, die van China bevat Taiwan, die van Rusland de Krim en vier Oekraïense regio's, die van Servië Kosovo en die van Venezuela Guayana Esequiba. Op de wereldkaart en de kaarten van de werelddelen horen het door India bestuurde Jammu en Kasjmir en Ladakh bij Pakistan, de Krim bij Oekraïne, de Golanhoogten bij Syrië en Taiwan bij China; Kosovo en de Falklandeilanden worden getoond, maar er wordt niet naar gevraagd. De kaarten zijn vereenvoudigd zodat ze snel laden, dus kleine details zijn gladgestreken.",
    aPopWB: "Volgens de Wereldbank heeft {c} {pop} inwoners ({year}).",
    aboutData: "Namen van landen, hoofdsteden, namen en hoofdsteden van provincies en het inwonertal van provincies komen uit Wikidata (CC0), opgehaald op {d}. Het inwonertal van landen komt van de Wereldbank (CC BY 4.0), het nieuwste gepubliceerde jaar, voor alle landen hetzelfde jaar; dat van Vaticaanstad komt uit Wikidata. ISO-codes, oppervlaktes, grenzen, talen en munten komen uit de dataset world-countries (ODbL). Waar deze bronnen afwijken van officiële bronnen (een ontbrekende tweede hoofdstad, een streektaal die als officieel staat vermeld), corrigeert de site ze.",
    kashmirQuiz: "Dat geldt voor de wereldkaart en de kaarten van de werelddelen. De kaart van één land (zijn staten of provincies) volgt de officiële kaart van dat land, dus de quizzen over India en over Pakistan bevatten allebei Jammu en Kasjmir.",
    usTitle: 'Over Geography Arcade',
    usDesc: 'Wie Geography Arcade maakt, waarom het gratis is en hoe we de quizzen, kaarten en feiten kloppend houden.',
    us: [
      ['Wat Geography Arcade is', 'Geography Arcade is een gratis website om spelenderwijs aardrijkskunde te leren. Er zijn kaartquizzen, spellen over hoofdsteden en vlaggen en kaarten om te printen voor alle {n} landen, plus provincies en staten van {p} landen, in {l} talen.'],
      ['Wie we zijn', 'Geography Arcade wordt gemaakt door een klein onafhankelijk team. We horen niet bij een school, uitgever of overheid. De quizzen, de uitleg en het controleren van de gegevens doen we zelf.'],
      ['Waarom het gratis is', 'Alles op de site is gratis om te spelen en te printen, zonder account en zonder betaalmuur. We willen dat iedereen met een browser de wereldkaart kan leren in de eigen taal.'],
      ['Hoe we de gegevens kloppend houden', 'Landnamen, hoofdsteden en inwonertallen komen uit Wikidata, en de kaarten uit Natural Earth, geoBoundaries en OpenStreetMap. De gegevens worden elke maand automatisch bijgewerkt, en een gewijzigde naam wacht een paar weken voordat hij verschijnt, zodat een foute bewerking bij de bron de quizzen niet bereikt.'],
      ['Voor leraren en ouders', 'Je mag de quizzen en printbare kaarten gerust gebruiken in de klas en thuis. Elke printbare kaart is er als blinde kaart, werkblad, kaart met namen en antwoordblad.'],
      ['Een fout gezien?', 'Mail ons op {e} en we zoeken het uit.'],
    ],
    usSources: 'Bekijk alle gegevensbronnen',
    pvTitle: 'Privacybeleid',
    pvDesc: 'Wat Geography Arcade verzamelt (heel weinig), hoe we Google Analytics gebruiken en welke keuzes je hebt.',
    pvDate: 'Laatst bijgewerkt: {d}',
    pv: [
      ['Kort gezegd', 'Je kunt Geography Arcade gebruiken zonder account en zonder ons iets over jezelf te vertellen. We gebruiken Google Analytics om bezoeken te tellen en te zien welke pagina\'s nuttig zijn, met de advertentiefuncties uitgeschakeld. We verkopen geen gegevens en tonen geen advertenties.'],
      ['Wat op je apparaat blijft', 'Je beste quizscores worden in je browser bewaard (lokale opslag), zodat je ze kunt proberen te verbeteren. Ze verlaten je apparaat nooit. Je kunt ze wissen door de gegevens van deze site in je browser te verwijderen.'],
      ['Google Analytics', 'We gebruiken Google Analytics 4 om te begrijpen hoe de site wordt gebruikt: welke pagina\'s worden bezocht, waar bezoekers ongeveer zijn (land en stad), welk apparaat en welke browser ze gebruiken, via welke site ze komen en hoe ze een pagina gebruiken. Google kan je IP-adres gebruiken om je locatie bij benadering te bepalen, maar Google Analytics 4 slaat geen IP-adressen op. Google Signals en advertentiefuncties staan uit.'],
      ['Cookies', 'Buiten de Europese Economische Ruimte, het Verenigd Koninkrijk en Zwitserland plaatst Google Analytics twee first-party cookies (_ga en _ga_ gevolgd door een ID) om nieuwe bezoeken van terugkerende te onderscheiden. In de Europese Economische Ruimte, het Verenigd Koninkrijk en Zwitserland worden geen analysecookies geplaatst: Google ontvangt alleen meetsignalen zonder cookies. De site plaatst geen andere cookies.'],
      ['Lettertypen', 'Een deel van de tekst gebruikt lettertypen van Google Fonts, dus je browser downloadt ze van de servers van Google, die je IP-adres zien.'],
      ['Hosting', 'De site wordt gehost door Hostinger. Zoals de meeste hosts kunnen de servers standaard toegangslogs bewaren (IP-adres, browser en opgevraagde pagina) voor de beveiliging en om de site draaiende te houden.'],
      ['E-mail', 'Als je ons mailt op {e}, gebruiken we je adres en bericht alleen om je te antwoorden.'],
      ['Kinderen', 'Geography Arcade is gemaakt voor leerlingen van alle leeftijden, ook kinderen. De site heeft geen accounts, formulieren of chat, dus niemand kan ons via de site persoonlijke gegevens geven.'],
      ['Jouw keuzes', 'Je kunt Google Analytics blokkeren met de privacyinstellingen van je browser, een contentblocker of de opt-out-add-on van Google (tools.google.com/dlpage/gaoptout). De quizzen en printbare kaarten werken in beide gevallen hetzelfde.'],
      ['Wijzigingen in dit beleid', 'Als we iets nieuws toevoegen, zoals optionele accounts om je voortgang op meerdere apparaten te bewaren, passen we eerst deze pagina aan en veranderen we de datum bovenaan.'],
      ['Contact', 'Vragen over privacy: {e}.'],
    ],
  },
};
