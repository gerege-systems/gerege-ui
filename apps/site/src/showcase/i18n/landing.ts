import { defineDict } from './locale';

/**
 * Landing template copy (LandingTemplate + Pricing defaults). Proper nouns
 * (Northwind, Slack, GitHub, SOC 2, …) stay as-is in MN. Prices: USD in EN,
 * ₮ suffix in MN with demo-converted amounts.
 */
export const landingDict = defineDict({
  en: {
    cta: 'Start free',
    signIn: 'Sign in',
    navPrimary: 'Primary',
    navProduct: 'Product',
    navFeatures: 'Features',
    navPricing: 'Pricing',
    navCustomers: 'Customers',
    navFaq: 'FAQ',
    openMenu: 'Open menu',
    menu: 'Menu',

    heroBadge: 'New — real-time collaboration is here',
    heroTitleBefore: 'The workspace where teams ',
    heroTitleAccent: 'ship faster',
    heroTitleAfter: '.',
    heroBody:
      'Plan, track and launch — all in one calm, fast place. Replace the tab-sprawl with a single source of truth your whole team trusts.',
    bookDemo: 'Book a demo',
    heroRisk: 'Free 14-day trial · No credit card required',

    customersLabel: 'Customers',
    trustedBy: 'Trusted by teams at',

    featuresTitle: "Everything you need, nothing you don't",
    featuresBody: 'One tool that replaces five — without the bloat.',
    featFastTitle: 'Fast by default',
    featFastBody:
      'Ships a tuned Vite build and tree-shakeable components — your bundle stays lean.',
    featSecureTitle: 'Secure',
    featSecureBody: 'SSO, audit logs and role-based access on every plan. SOC 2 Type II certified.',
    featInsightTitle: 'Insightful',
    featInsightBody:
      'Real-time dashboards and exportable reports so the whole team sees the numbers.',
    featIntegrateTitle: 'Integrates',
    featIntegrateBody:
      'Native connectors for Slack, GitHub, Linear and 40+ tools, plus a typed REST API.',
    featDelightTitle: 'Delightful',
    featDelightBody:
      'A refined, accessible interface your team will actually enjoy using every day.',
    featOpenTitle: 'Open',
    featOpenBody: 'Built on open standards with a documented API and first-class self-hosting.',

    howTitle: 'Up and running in an afternoon',
    howBody: 'Three steps — no migration project, no consultants.',
    stepLabel: 'Step {n}: ',
    step1Title: 'Connect your tools',
    step1Body: 'Link GitHub, Slack and your tracker in two clicks — no migration needed.',
    step2Title: 'Plan in one place',
    step2Body: 'Roadmaps, issues and docs live together, so nothing falls between tabs.',
    step3Title: 'Ship and measure',
    step3Body: 'Launch from the same view and watch adoption land on a live dashboard.',

    ratingLabel: '5 out of 5 stars',
    quote:
      "“We cut our launch cycle in half. It's the first tool the whole company actually agreed on.”",
    quoteName: 'Jamie Morales',
    quoteRole: 'VP Engineering, Northwind',

    faqTitle: 'Frequently asked questions',
    faqBody: 'Everything you need to know before you start.',
    faq1Q: 'Can I cancel at any time?',
    faq1A:
      'Yes. One click in Settings; your plan stays active until the end of the billing period.',
    faq2Q: 'Is there a free plan?',
    faq2A:
      'The Starter plan is free forever for up to 3 projects. Paid plans include a 14-day trial with no card required.',
    faq3Q: 'Where is my data stored?',
    faq3A:
      'In the EU or US region you pick at sign-up, encrypted at rest and in transit. We never train on customer data.',
    faq4Q: 'Do you support SSO?',
    faq4A:
      'Google and Microsoft SSO ship on the Team plan; SAML and SCIM provisioning on Enterprise.',
    faq5Q: 'Can I import from another tool?',
    faq5A:
      'Yes — importers for Jira, Linear, Asana and CSV run in the background and keep your IDs and history.',

    finalTitle: 'Ready to ship faster?',
    finalBody: 'Join thousands of teams already moving quicker.',
    finalRisk: 'No credit card required · 14-day free trial',

    footProduct: 'Product',
    footCompany: 'Company',
    footResources: 'Resources',
    footLegal: 'Legal',
    footHow: 'How it works',
    footContact: 'Contact',
    footDocs: 'Docs',
    footApi: 'API',
    footStatus: 'Status',
    footPrivacy: 'Privacy',
    footTerms: 'Terms',
    footSecurity: 'Security',
    copyright: '© {year} Northwind, Inc. · Built with @gerege-systems/ui',

    backToSite: 'Back to site',
    legalNav: 'Legal',
    privacyTitle: 'Privacy policy',
    privacyBody:
      'We store the data you put into Northwind and the account details needed to bill you — nothing is sold or shared with advertisers. Export or delete everything from Settings at any time.',
    termsTitle: 'Terms of service',
    termsBody:
      'Use Northwind for lawful purposes on the plan you chose. Paid plans renew monthly and can be cancelled any time; access continues to the end of the billing period.',
    securityTitle: 'Security',
    securityBody:
      'Data is encrypted in transit and at rest, access is role-based with audit logs on every plan, and we are SOC 2 Type II certified. Report a vulnerability from the Help menu in the app.',

    signupTitle: 'Create your account',
    signupSubtitle: 'Start your 14-day free trial.',
    justLooking: 'Just looking?',

    pricingTitle: 'Plans that scale with your team',
    pricingBody:
      'Start free, upgrade when you need more. All paid plans include a 14-day trial — no credit card required.',
    mostPopular: 'Most popular',
    tierStarter: 'Starter',
    tierStarterPrice: '$0',
    tierStarterCadence: 'forever',
    tierStarterDesc: 'For individuals exploring the product.',
    tierStarterF1: 'Up to 3 projects',
    tierStarterF2: 'Community support',
    tierStarterF3: 'Single workspace',
    tierTeam: 'Team',
    tierTeamPrice: '$20',
    tierTeamCadence: 'per user / month',
    tierTeamDesc: 'For small teams running real workloads.',
    tierTeamF1: 'Unlimited projects',
    tierTeamF2: 'Email support, 24h response',
    tierTeamF3: 'SSO via Google & Microsoft',
    tierTeamF4: 'Audit log (30 days)',
    tierEnterprise: 'Enterprise',
    tierEnterprisePrice: 'Custom',
    tierEnterpriseCadence: 'annual',
    tierEnterpriseDesc: 'For organisations with custom requirements.',
    tierEnterpriseF1: 'Everything in Team',
    tierEnterpriseF2: 'SAML SSO + SCIM',
    tierEnterpriseF3: 'Dedicated CSM',
    tierEnterpriseF4: 'SOC 2 report + DPA',
    tierEnterpriseF5: 'Audit log (unlimited)',
    talkToSales: 'Talk to sales',
  },
  mn: {
    cta: 'Үнэгүй эхлэх',
    signIn: 'Нэвтрэх',
    navPrimary: 'Үндсэн цэс',
    navProduct: 'Бүтээгдэхүүн',
    navFeatures: 'Боломжууд',
    navPricing: 'Үнэ',
    navCustomers: 'Хэрэглэгчид',
    navFaq: 'Асуулт хариулт',
    openMenu: 'Цэс нээх',
    menu: 'Цэс',

    heroBadge: 'Шинэ — бодит цагийн хамтын ажиллагаа',
    heroTitleBefore: 'Багууд ',
    heroTitleAccent: 'хурдан хүргэдэг',
    heroTitleAfter: ' ажлын орчин.',
    heroBody:
      'Төлөвлө, хяна, хүргэ — бүгд нэг тайван, хурдан орчинд. Олон таб солихын оронд баг бүхэлдээ итгэх нэг эх сурвалж.',
    bookDemo: 'Демо захиалах',
    heroRisk: '14 хоног үнэгүй · Карт шаардахгүй',

    customersLabel: 'Хэрэглэгчид',
    trustedBy: 'Итгэдэг багууд',

    featuresTitle: 'Хэрэгтэй бүхэн, илүү юу ч үгүй',
    featuresBody: 'Тавыг орлох нэг хэрэгсэл — илүүдэлгүй.',
    featFastTitle: 'Анхнаасаа хурдан',
    featFastBody:
      'Тохируулсан Vite build, tree-shake хийгддэг компонентууд — bundle тань хөнгөн хэвээр.',
    featSecureTitle: 'Аюулгүй',
    featSecureBody:
      'SSO, аудит лог, үүрэгт суурилсан эрх бүх төлөвлөгөөнд. SOC 2 Type II гэрчилгээтэй.',
    featInsightTitle: 'Ойлгомжтой',
    featInsightBody: 'Бодит цагийн самбар, экспортлох тайлан — баг бүхэлдээ тоогоо хардаг.',
    featIntegrateTitle: 'Холбогддог',
    featIntegrateBody:
      'Slack, GitHub, Linear болон 40+ хэрэгсэлтэй холбогч, мөн төрөлжүүлсэн REST API.',
    featDelightTitle: 'Тааламжтай',
    featDelightBody: 'Баг тань өдөр бүр дуртайяа хэрэглэх нарийн, хүртээмжтэй интерфэйс.',
    featOpenTitle: 'Нээлттэй',
    featOpenBody: 'Нээлттэй стандарт, баримтжуулсан API, бүрэн self-hosting дэмжлэг.',

    howTitle: 'Нэг үдээс хойш бэлэн болно',
    howBody: 'Гурван алхам — шилжилтийн төсөлгүй, зөвлөхгүй.',
    stepLabel: 'Алхам {n}: ',
    step1Title: 'Хэрэгслээ холбох',
    step1Body: 'GitHub, Slack, tracker-ээ хоёр товшилтоор холбоно — шилжилт хэрэггүй.',
    step2Title: 'Нэг газар төлөвлөх',
    step2Body: 'Roadmap, асуудал, баримт нэг дор — таб хооронд юу ч алдагдахгүй.',
    step3Title: 'Хүргээд хэмжих',
    step3Body: 'Нэг дэлгэцээс нээлт хийгээд хэрэглээг бодит цагийн самбар дээр хар.',

    ratingLabel: '5-аас 5 од',
    quote:
      '“Нээлтийн мөчлөгөө хоёр дахин богиносгосон. Компани бүхэлдээ санал нийлсэн анхны хэрэгсэл.”',
    quoteName: 'Jamie Morales',
    quoteRole: 'Инженерийн дэд захирал, Northwind',

    faqTitle: 'Түгээмэл асуултууд',
    faqBody: 'Эхлэхийн өмнө мэдэх бүхэн.',
    faq1Q: 'Хүссэн үедээ цуцалж болох уу?',
    faq1A:
      'Болно. Тохиргоонд нэг товшилт; төлөвлөгөө тань төлбөрийн хугацаа дуустал идэвхтэй үлдэнэ.',
    faq2Q: 'Үнэгүй төлөвлөгөө бий юу?',
    faq2A:
      'Эхлэл төлөвлөгөө 3 хүртэлх төсөлд үүрд үнэгүй. Төлбөртэй төлөвлөгөө 14 хоногийн туршилттай, карт шаардахгүй.',
    faq3Q: 'Өгөгдөл минь хаана хадгалагдах вэ?',
    faq3A:
      'Бүртгүүлэхдээ сонгосон EU эсвэл US бүсэд, хадгалалт болон дамжуулалтын үед шифрлэгдсэн. Хэрэглэгчийн өгөгдлөөр хэзээ ч сургалт хийхгүй.',
    faq4Q: 'SSO дэмждэг үү?',
    faq4A: 'Google, Microsoft SSO — Баг төлөвлөгөөнд; SAML болон SCIM — Байгууллага төлөвлөгөөнд.',
    faq5Q: 'Өөр хэрэгслээс импортолж болох уу?',
    faq5A:
      'Болно — Jira, Linear, Asana, CSV импорт ард нь ажиллаж, ID болон түүхийг тань хадгална.',

    finalTitle: 'Хурдан хүргэхэд бэлэн үү?',
    finalBody: 'Аль хэдийн хурдассан мянга мянган багтай нэгдээрэй.',
    finalRisk: 'Карт шаардахгүй · 14 хоног үнэгүй',

    footProduct: 'Бүтээгдэхүүн',
    footCompany: 'Компани',
    footResources: 'Материал',
    footLegal: 'Хууль эрх зүй',
    footHow: 'Хэрхэн ажилладаг',
    footContact: 'Холбоо барих',
    footDocs: 'Баримт',
    footApi: 'API',
    footStatus: 'Төлөв',
    footPrivacy: 'Нууцлал',
    footTerms: 'Үйлчилгээний нөхцөл',
    footSecurity: 'Аюулгүй байдал',
    copyright: '© {year} Northwind, Inc. · @gerege-systems/ui дээр бүтээв',

    backToSite: 'Сайт руу буцах',
    legalNav: 'Хууль эрх зүй',
    privacyTitle: 'Нууцлалын бодлого',
    privacyBody:
      'Бид таны Northwind-д оруулсан өгөгдөл болон төлбөр тооцоонд шаардлагатай бүртгэлийн мэдээллийг л хадгална — зар сурталчилгааны компанид зарахгүй, дамжуулахгүй. Тохиргооноос хүссэн үедээ бүгдийг экспортлох эсвэл устгах боломжтой.',
    termsTitle: 'Үйлчилгээний нөхцөл',
    termsBody:
      'Northwind-ийг сонгосон төлөвлөгөөнийхөө хүрээнд хууль ёсны зорилгоор ашиглана. Төлбөртэй төлөвлөгөө сар бүр сунгагдаж, хүссэн үедээ цуцалж болно; хандалт төлбөрийн хугацаа дуустал үргэлжилнэ.',
    securityTitle: 'Аюулгүй байдал',
    securityBody:
      'Өгөгдөл дамжуулалт болон хадгалалтын үед шифрлэгдэнэ, хандалт үүрэгт суурилж, бүх төлөвлөгөөнд аудит логтой, SOC 2 Type II гэрчилгээтэй. Эмзэг байдал илэрвэл аппын Тусламж цэснээс мэдэгдээрэй.',

    signupTitle: 'Бүртгэл үүсгэх',
    signupSubtitle: '14 хоног үнэгүй туршаад үз.',
    justLooking: 'Зүгээр үзэж байна уу?',

    pricingTitle: 'Багтай тань хамт өсөх төлөвлөгөө',
    pricingBody:
      'Үнэгүй эхлээд хэрэгтэй үедээ ахиул. Төлбөртэй бүх төлөвлөгөө 14 хоногийн туршилттай — карт шаардахгүй.',
    mostPopular: 'Хамгийн эрэлттэй',
    tierStarter: 'Эхлэл',
    tierStarterPrice: '0₮',
    tierStarterCadence: 'үүрд',
    tierStarterDesc: 'Бүтээгдэхүүнийг туршиж буй хувь хүнд.',
    tierStarterF1: '3 хүртэлх төсөл',
    tierStarterF2: 'Нийгэмлэгийн дэмжлэг',
    tierStarterF3: 'Нэг ажлын орчин',
    tierTeam: 'Баг',
    tierTeamPrice: '59,000₮',
    tierTeamCadence: 'хэрэглэгч /сар',
    tierTeamDesc: 'Бодит ачаалалтай жижиг багт.',
    tierTeamF1: 'Хязгааргүй төсөл',
    tierTeamF2: 'И-мэйл дэмжлэг, 24 цагт хариулна',
    tierTeamF3: 'Google, Microsoft SSO',
    tierTeamF4: 'Аудит лог (30 хоног)',
    tierEnterprise: 'Байгууллага',
    tierEnterprisePrice: 'Тохиролцоно',
    tierEnterpriseCadence: 'жилээр',
    tierEnterpriseDesc: 'Тусгай шаардлагатай байгууллагад.',
    tierEnterpriseF1: 'Баг төлөвлөгөөний бүх боломж',
    tierEnterpriseF2: 'SAML SSO + SCIM',
    tierEnterpriseF3: 'Хувийн CSM',
    tierEnterpriseF4: 'SOC 2 тайлан + DPA',
    tierEnterpriseF5: 'Аудит лог (хязгааргүй)',
    talkToSales: 'Борлуулалттай холбогдох',
  },
});
