// ── Complete sector mapping for all 532 tickers ───────────────────────────────
export const SECTOR_MAP: Record<string, string> = {
  // Technology
  A: "Health Care",       // Agilent Technologies
  AAPL: "Technology",
  ACN: "Technology",      // Accenture
  ACRV: "Health Care",    // Acrivon Therapeutics
  ADBE: "Technology",
  ADI: "Technology",      // Analog Devices
  ADP: "Technology",      // Automatic Data Processing
  ADSK: "Technology",
  AKAM: "Technology",     // Akamai
  AMAT: "Technology",     // Applied Materials
  AMD: "Technology",
  ANET: "Technology",     // Arista Networks
  APH: "Technology",      // Amphenol
  APP: "Technology",      // AppLovin
  AVGO: "Technology",     // Broadcom
  BR: "Technology",       // Broadridge Financial
  CDNS: "Technology",     // Cadence Design
  CDW: "Technology",
  CFLT: "Technology",     // Confluent
  CRM: "Technology",      // Salesforce
  CRSR: "Technology",     // Corsair Gaming
  CRWD: "Technology",     // CrowdStrike
  CSCO: "Technology",
  CSGP: "Technology",     // CoStar Group (listed as Real Estate by GICS but software)
  CTSH: "Technology",     // Cognizant
  DAY: "Technology",      // Dayforce / Ceridian
  DDOG: "Technology",     // Datadog
  DELL: "Technology",
  DUOL: "Technology",     // Duolingo
  EPAM: "Technology",
  FFIV: "Technology",     // F5 Networks
  FICO: "Technology",     // Fair Isaac
  FIS: "Technology",      // Fidelity National Info Services
  FTNT: "Technology",     // Fortinet
  GDDY: "Technology",     // GoDaddy
  GEN: "Technology",      // Gen Digital
  GLW: "Technology",      // Corning
  GPN: "Technology",      // Global Payments
  GRMN: "Technology",     // Garmin
  GRND: "Comm. Services", // Grindr
  HPE: "Technology",      // Hewlett Packard Enterprise
  HPQ: "Technology",      // HP Inc.
  IBM: "Technology",
  INTC: "Technology",
  INTU: "Technology",     // Intuit
  IT: "Technology",       // Gartner
  JBL: "Technology",      // Jabil
  JKHY: "Technology",     // Jack Henry & Associates
  KEYS: "Technology",     // Keysight Technologies
  KLAC: "Technology",     // KLA Corporation
  LOGI: "Technology",     // Logitech
  LRCX: "Technology",     // Lam Research
  MCHP: "Technology",     // Microchip Technology
  MPWR: "Technology",     // Monolithic Power Systems
  MSFT: "Technology",
  MSI: "Technology",      // Motorola Solutions
  MU: "Technology",       // Micron
  NOW: "Technology",      // ServiceNow
  NTAP: "Technology",     // NetApp
  NVDA: "Technology",
  NXPI: "Technology",     // NXP Semiconductors
  ON: "Technology",       // onsemi
  ORCL: "Technology",
  PANW: "Technology",     // Palo Alto Networks
  PAYC: "Technology",     // Paycom
  PAYX: "Technology",     // Paychex
  PLTR: "Technology",     // Palantir
  PTC: "Technology",      // PTC Inc.
  QBTS: "Technology",     // D-Wave Quantum
  QCOM: "Technology",     // Qualcomm
  RDDT: "Comm. Services", // Reddit
  ROK: "Technology",      // Rockwell Automation (GICS: Industrials, but automation/software)
  SNPS: "Technology",     // Synopsys
  STX: "Technology",      // Seagate
  SWKS: "Technology",     // Skyworks
  TEL: "Technology",      // TE Connectivity
  TER: "Technology",      // Teradyne
  TRMB: "Technology",     // Trimble
  TXN: "Technology",      // Texas Instruments
  TYL: "Technology",      // Tyler Technologies
  U: "Technology",        // Unity Software
  VRSN: "Technology",     // VeriSign
  WDAY: "Technology",     // Workday
  WDC: "Technology",      // Western Digital
  ZBRA: "Technology",     // Zebra Technologies
  ZM: "Technology",       // Zoom

  // Financials
  ACGL: "Financials",     // Arch Capital
  AFL: "Financials",      // Aflac
  AIG: "Financials",      // American Intl Group
  AIZ: "Financials",      // Assurant
  AJG: "Financials",      // Arthur J Gallagher
  ALL: "Financials",      // Allstate
  AMP: "Financials",      // Ameriprise
  AON: "Financials",      // Aon
  APO: "Financials",      // Apollo Global
  ARES: "Financials",     // Ares Management
  AXP: "Financials",      // American Express
  BAC: "Financials",      // Bank of America
  BEN: "Financials",      // Franklin Resources
  BK: "Financials",       // Bank of NY Mellon
  BLK: "Financials",      // BlackRock
  "BRK.B": "Financials",  // Berkshire Hathaway
  BRO: "Financials",      // Brown & Brown
  BX: "Financials",       // Blackstone
  C: "Financials",        // Citigroup
  CBOE: "Financials",     // Cboe Global Markets
  CFG: "Financials",      // Citizens Financial
  CINF: "Financials",     // Cincinnati Financial
  CME: "Financials",      // CME Group
  COF: "Financials",      // Capital One
  COIN: "Financials",     // Coinbase
  CPAY: "Financials",     // Corpay
  EG: "Financials",       // Everest Group
  ERIE: "Financials",     // Erie Indemnity
  FDS: "Financials",      // FactSet Research
  FIG: "Financials",      // Fortress Investment
  FITB: "Financials",     // Fifth Third Bancorp
  GL: "Financials",       // Globe Life
  GS: "Financials",       // Goldman Sachs
  HBAN: "Financials",     // Huntington Bancshares
  HIG: "Financials",      // Hartford Financial
  HOOD: "Financials",     // Robinhood
  ICE: "Financials",      // Intercontinental Exchange
  IVZ: "Financials",      // Invesco
  JPM: "Financials",      // JPMorgan Chase
  KEY: "Financials",      // KeyCorp
  KKR: "Financials",      // KKR & Co.
  L: "Financials",        // Loews
  MA: "Financials",       // Mastercard
  MCO: "Financials",      // Moody's
  MET: "Financials",      // MetLife
  MMC: "Financials",      // Marsh & McLennan
  MS: "Financials",       // Morgan Stanley
  MSCI: "Financials",     // MSCI Inc.
  MTB: "Financials",      // M&T Bank
  NDAQ: "Financials",     // Nasdaq Inc.
  NTRS: "Financials",     // Northern Trust
  PFG: "Financials",      // Principal Financial
  PGR: "Financials",      // Progressive
  PNC: "Financials",      // PNC Financial
  PRU: "Financials",      // Prudential
  PYPL: "Financials",     // PayPal
  RF: "Financials",       // Regions Financial
  RJF: "Financials",      // Raymond James
  SAN: "Financials",      // Banco Santander
  SCHW: "Financials",     // Charles Schwab
  SPGI: "Financials",     // S&P Global
  STT: "Financials",      // State Street
  SYF: "Financials",      // Synchrony Financial
  TFC: "Financials",      // Truist Financial
  TROW: "Financials",     // T. Rowe Price
  TRV: "Financials",      // Travelers
  USB: "Financials",      // U.S. Bancorp
  V: "Financials",        // Visa
  WFC: "Financials",      // Wells Fargo
  WRB: "Financials",      // W.R. Berkley
  WTW: "Financials",      // Willis Towers Watson

  // Health Care
  ABBV: "Health Care",    // AbbVie
  ABT: "Health Care",     // Abbott
  AMGN: "Health Care",    // Amgen
  BAX: "Health Care",     // Baxter
  BDX: "Health Care",     // Becton Dickinson
  BIIB: "Health Care",    // Biogen
  BMY: "Health Care",     // Bristol-Myers Squibb
  BNTC: "Health Care",    // Benitec Biopharma
  BSX: "Health Care",     // Boston Scientific
  CAH: "Health Care",     // Cardinal Health
  CAPR: "Health Care",    // Capricor Therapeutics
  CI: "Health Care",      // Cigna
  CNC: "Health Care",     // Centene
  COO: "Health Care",     // Cooper Companies
  COR: "Health Care",     // Cencora
  CRL: "Health Care",     // Charles River Labs
  CVS: "Health Care",     // CVS Health
  DGX: "Health Care",     // Quest Diagnostics
  DHR: "Health Care",     // Danaher
  DVA: "Health Care",     // DaVita
  DXCM: "Health Care",    // Dexcom
  ELV: "Health Care",     // Elevance Health
  EW: "Health Care",      // Edwards Lifesciences
  GEHC: "Health Care",    // GE HealthCare
  GILD: "Health Care",    // Gilead Sciences
  HAE: "Health Care",     // Haemonetics
  HCA: "Health Care",     // HCA Healthcare
  HIMS: "Health Care",    // Hims & Hers
  HOLX: "Health Care",    // Hologic
  HSIC: "Health Care",    // Henry Schein
  HUM: "Health Care",     // Humana
  IDXX: "Health Care",    // IDEXX Laboratories
  INCY: "Health Care",    // Incyte
  IQV: "Health Care",     // IQVIA
  ISRG: "Health Care",    // Intuitive Surgical
  JNJ: "Health Care",     // Johnson & Johnson
  LH: "Health Care",      // LabCorp
  LLY: "Health Care",     // Eli Lilly
  MAIA: "Health Care",    // MAIA Biotechnology
  MCK: "Health Care",     // McKesson
  MDT: "Health Care",     // Medtronic
  MOH: "Health Care",     // Molina Healthcare
  MRK: "Health Care",     // Merck
  MRNA: "Health Care",    // Moderna
  MTD: "Health Care",     // Mettler-Toledo
  NAMS: "Health Care",    // NanoStar / similar
  NTLA: "Health Care",    // Intellia Therapeutics
  PFE: "Health Care",     // Pfizer
  PODD: "Health Care",    // Insulet
  QCLS: "Health Care",    // (biotech - unclear)
  REGN: "Health Care",    // Regeneron
  RMD: "Health Care",     // ResMed
  RVTY: "Health Care",    // Revvity
  SOLV: "Health Care",    // Solventum
  STE: "Health Care",     // STERIS
  SYK: "Health Care",     // Stryker
  TECH: "Health Care",    // Bio-Techne
  TMO: "Health Care",     // Thermo Fisher
  UHS: "Health Care",     // Universal Health Services
  UNH: "Health Care",     // UnitedHealth
  VRTX: "Health Care",    // Vertex Pharma
  VTRS: "Health Care",    // Viatris
  WAT: "Health Care",     // Waters Corporation
  WST: "Health Care",     // West Pharmaceutical
  ZBH: "Health Care",     // Zimmer Biomet
  ZTS: "Health Care",     // Zoetis

  // Consumer Disc.
  ABNB: "Consumer Disc.", // Airbnb
  AMZN: "Consumer Disc.", // Amazon
  APTV: "Consumer Disc.", // Aptiv
  AZO: "Consumer Disc.",  // AutoZone
  BBW: "Consumer Disc.",  // Build-A-Bear
  BBY: "Consumer Disc.",  // Best Buy
  BKNG: "Consumer Disc.", // Booking Holdings
  BLDR: "Consumer Disc.", // Builders FirstSource
  BROS: "Consumer Disc.", // Dutch Bros
  CAVA: "Consumer Disc.", // Cava Group
  CCL: "Consumer Disc.",  // Carnival
  CMG: "Consumer Disc.",  // Chipotle
  DASH: "Consumer Disc.", // DoorDash
  DECK: "Consumer Disc.", // Deckers Outdoor
  DG: "Consumer Disc.",   // Dollar General
  DHI: "Consumer Disc.",  // D.R. Horton
  DLTR: "Consumer Disc.", // Dollar Tree
  DPZ: "Consumer Disc.",  // Domino's Pizza
  DRI: "Consumer Disc.",  // Darden Restaurants
  EBAY: "Consumer Disc.", // eBay
  EXPE: "Consumer Disc.", // Expedia
  F: "Consumer Disc.",    // Ford
  FIVE: "Consumer Disc.", // Five Below
  GM: "Consumer Disc.",   // General Motors
  GME: "Consumer Disc.",  // GameStop
  GPC: "Consumer Disc.",  // Genuine Parts
  HAS: "Consumer Disc.",  // Hasbro
  HD: "Consumer Disc.",   // Home Depot
  HLT: "Consumer Disc.",  // Hilton
  KMX: "Consumer Disc.",  // CarMax
  LEN: "Consumer Disc.",  // Lennar
  LINC: "Consumer Disc.", // Lincoln Educational
  LKQ: "Consumer Disc.",  // LKQ Corporation
  LOW: "Consumer Disc.",  // Lowe's
  LULU: "Consumer Disc.", // Lululemon
  LUV: "Consumer Disc.",  // Southwest Airlines
  LVLU: "Consumer Disc.", // Lulu's Fashion
  LVS: "Consumer Disc.",  // Las Vegas Sands
  LYV: "Consumer Disc.",  // Live Nation
  MAR: "Consumer Disc.",  // Marriott
  MCD: "Consumer Disc.",  // McDonald's
  MGM: "Consumer Disc.",  // MGM Resorts
  MHK: "Consumer Disc.",  // Mohawk Industries
  NCLH: "Consumer Disc.", // Norwegian Cruise Line
  NKE: "Consumer Disc.",  // Nike
  NVR: "Consumer Disc.",  // NVR Inc.
  ORLY: "Consumer Disc.", // O'Reilly Auto
  PHM: "Consumer Disc.",  // PulteGroup
  POOL: "Consumer Disc.", // Pool Corp
  RCL: "Consumer Disc.",  // Royal Caribbean
  RL: "Consumer Disc.",   // Ralph Lauren
  ROST: "Consumer Disc.", // Ross Stores
  SBUX: "Consumer Disc.", // Starbucks
  TGT: "Consumer Disc.",  // Target
  TJX: "Consumer Disc.",  // TJX
  TPR: "Consumer Disc.",  // Tapestry
  TSCO: "Consumer Disc.", // Tractor Supply
  TSLA: "Consumer Disc.", // Tesla
  UAA: "Consumer Disc.",  // Under Armour
  ULTA: "Consumer Disc.", // Ulta Beauty
  WSM: "Consumer Disc.",  // Williams-Sonoma
  WYNN: "Consumer Disc.", // Wynn Resorts
  YUM: "Consumer Disc.",  // Yum! Brands

  // Comm. Services
  CHTR: "Comm. Services", // Charter Communications
  CMCSA: "Comm. Services",// Comcast
  DIS: "Comm. Services",  // Walt Disney
  EA: "Comm. Services",   // Electronic Arts
  FOX: "Comm. Services",  // Fox
  FOXA: "Comm. Services", // Fox A
  GOOG: "Comm. Services", // Alphabet C
  GOOGL: "Comm. Services",// Alphabet A
  IPG: "Comm. Services",  // Interpublic
  META: "Comm. Services", // Meta
  MTCH: "Comm. Services", // Match Group
  NFLX: "Comm. Services", // Netflix
  NWS: "Comm. Services",  // News Corp
  NWSA: "Comm. Services", // News Corp A
  OMC: "Comm. Services",  // Omnicom
  PARA: "Comm. Services", // Paramount
  RBLX: "Comm. Services", // Roblox
  T: "Comm. Services",    // AT&T
  TKO: "Comm. Services",  // TKO Group
  TMUS: "Comm. Services", // T-Mobile
  TTWO: "Comm. Services", // Take-Two
  VZ: "Comm. Services",   // Verizon
  WBD: "Comm. Services",  // Warner Bros Discovery

  // Industrials
  ALLE: "Industrials",    // Allegion
  AMTM: "Industrials",    // Amentum
  AOS: "Industrials",     // A.O. Smith
  AXON: "Industrials",    // Axon Enterprise
  BA: "Industrials",      // Boeing
  CAT: "Industrials",     // Caterpillar
  CARR: "Industrials",    // Carrier Global
  CHRW: "Industrials",    // CH Robinson
  CMI: "Industrials",     // Cummins
  CPRT: "Industrials",    // Copart
  CSX: "Industrials",     // CSX
  CTAS: "Industrials",    // Cintas
  DAL: "Industrials",     // Delta Air Lines
  DE: "Industrials",      // Deere
  DOV: "Industrials",     // Dover
  EFX: "Industrials",     // Equifax
  EME: "Industrials",     // EMCOR
  EMR: "Industrials",     // Emerson Electric
  ETN: "Industrials",     // Eaton
  EXPD: "Industrials",    // Expeditors Intl
  FAST: "Industrials",    // Fastenal
  FDX: "Industrials",     // FedEx
  FTV: "Industrials",     // Fortive
  GD: "Industrials",      // General Dynamics
  GE: "Industrials",      // GE Aerospace
  GEV: "Industrials",     // GE Vernova
  GNRC: "Industrials",    // Generac
  GWW: "Industrials",     // W.W. Grainger
  HON: "Industrials",     // Honeywell
  HUBB: "Industrials",    // Hubbell
  HWM: "Industrials",     // Howmet Aerospace
  IEX: "Industrials",     // IDEX
  IR: "Industrials",      // Ingersoll Rand
  ITW: "Industrials",     // Illinois Tool Works
  J: "Industrials",       // Jacobs Solutions
  JBHT: "Industrials",    // J.B. Hunt
  JCI: "Industrials",     // Johnson Controls
  LDOS: "Industrials",    // Leidos
  LHX: "Industrials",     // L3Harris
  LII: "Industrials",     // Lennox
  LMT: "Industrials",     // Lockheed Martin
  MAS: "Industrials",     // Masco
  MMM: "Industrials",     // 3M
  NDSN: "Industrials",    // Nordson
  NOC: "Industrials",     // Northrop Grumman
  NSC: "Industrials",     // Norfolk Southern
  ODFL: "Industrials",    // Old Dominion Freight
  OTIS: "Industrials",    // Otis
  PCAR: "Industrials",    // PACCAR
  PH: "Industrials",      // Parker-Hannifin
  PNR: "Industrials",     // Pentair
  PWR: "Industrials",     // Quanta Services
  RKLB: "Industrials",    // Rocket Lab
  ROL: "Industrials",     // Rollins
  ROP: "Industrials",     // Roper Technologies
  RSG: "Industrials",     // Republic Services
  RTX: "Industrials",     // RTX / Raytheon
  SNA: "Industrials",     // Snap-on
  SWK: "Industrials",     // Stanley Black & Decker
  TDG: "Industrials",     // TransDigm
  TDY: "Industrials",     // Teledyne
  TT: "Industrials",      // Trane Technologies
  TXT: "Industrials",     // Textron
  UAL: "Industrials",     // United Airlines
  UBER: "Industrials",    // Uber
  UNP: "Industrials",     // Union Pacific
  UPS: "Industrials",     // UPS
  URI: "Industrials",     // United Rentals
  USAR: "Industrials",    // US LBM / similar
  VLTO: "Industrials",    // Veralto
  VRSK: "Industrials",    // Verisk Analytics
  WAB: "Industrials",     // Westinghouse Air Brake
  WM: "Industrials",      // Waste Management
  XYL: "Industrials",     // Xylem

  // Consumer Staples
  ADM: "Consumer Staples",// Archer Daniels Midland
  BG: "Consumer Staples", // Bunge Global
  BRBR: "Consumer Staples",// BellRing Brands
  CAG: "Consumer Staples",// Conagra
  CELH: "Consumer Staples",// Celsius Holdings
  CHD: "Consumer Staples",// Church & Dwight
  CL: "Consumer Staples", // Colgate-Palmolive
  CLX: "Consumer Staples",// Clorox
  COST: "Consumer Staples",// Costco
  CPB: "Consumer Staples",// Campbell Soup
  EL: "Consumer Staples", // Estee Lauder
  GIS: "Consumer Staples",// General Mills
  HRL: "Consumer Staples",// Hormel
  HSY: "Consumer Staples",// Hershey
  K: "Consumer Staples",  // Kellanova
  KDP: "Consumer Staples",// Keurig Dr Pepper
  KHC: "Consumer Staples",// Kraft Heinz
  KMB: "Consumer Staples",// Kimberly-Clark
  KO: "Consumer Staples", // Coca-Cola
  KR: "Consumer Staples", // Kroger
  KVUE: "Consumer Staples",// Kenvue
  LW: "Consumer Staples", // Lamb Weston
  MDLZ: "Consumer Staples",// Mondelez
  MKC: "Consumer Staples",// McCormick
  MNST: "Consumer Staples",// Monster Beverage
  MO: "Consumer Staples", // Altria
  PEP: "Consumer Staples",// PepsiCo
  PG: "Consumer Staples", // Procter & Gamble
  PM: "Consumer Staples", // Philip Morris
  SJM: "Consumer Staples",// J.M. Smucker
  SMPL: "Consumer Staples",// Simply Good Foods
  STZ: "Consumer Staples",// Constellation Brands
  SYY: "Consumer Staples",// Sysco
  TAP: "Consumer Staples",// Molson Coors
  TSN: "Consumer Staples",// Tyson Foods
  WMT: "Consumer Staples",// Walmart

  // Energy
  APA: "Energy",          // APA Corp
  BKR: "Energy",          // Baker Hughes
  COP: "Energy",          // ConocoPhillips
  CTRA: "Energy",         // Coterra Energy
  CVX: "Energy",          // Chevron
  DVN: "Energy",          // Devon Energy
  EOG: "Energy",          // EOG Resources
  EQT: "Energy",          // EQT Corporation
  EXE: "Energy",          // Expand Energy
  FANG: "Energy",         // Diamondback Energy
  HAL: "Energy",          // Halliburton
  KMI: "Energy",          // Kinder Morgan
  MPC: "Energy",          // Marathon Petroleum
  OKE: "Energy",          // ONEOK
  OXY: "Energy",          // Occidental
  PSX: "Energy",          // Phillips 66
  SLB: "Energy",          // Schlumberger
  TPL: "Energy",          // Texas Pacific Land
  TRGP: "Energy",         // Targa Resources
  VLO: "Energy",          // Valero
  WMB: "Energy",          // Williams Companies
  XOM: "Energy",          // ExxonMobil

  // Real Estate
  AMT: "Real Estate",     // American Tower
  ARE: "Real Estate",     // Alexandria Real Estate
  AVB: "Real Estate",     // AvalonBay
  BXP: "Real Estate",     // Boston Properties
  CCI: "Real Estate",     // Crown Castle
  CPT: "Real Estate",     // Camden Property
  DLR: "Real Estate",     // Digital Realty
  DOC: "Real Estate",     // Healthpeak
  EQIX: "Real Estate",    // Equinix
  EQR: "Real Estate",     // Equity Residential
  ESS: "Real Estate",     // Essex Property
  EXR: "Real Estate",     // Extra Space Storage
  FRT: "Real Estate",     // Federal Realty
  HST: "Real Estate",     // Host Hotels
  INVH: "Real Estate",    // Invitation Homes
  IRM: "Real Estate",     // Iron Mountain
  KIM: "Real Estate",     // Kimco Realty
  MAA: "Real Estate",     // Mid-America Apartment
  O: "Real Estate",       // Realty Income
  PLD: "Real Estate",     // Prologis
  PSA: "Real Estate",     // Public Storage
  SBAC: "Real Estate",    // SBA Communications
  SPG: "Real Estate",     // Simon Property
  UDR: "Real Estate",     // United Dominion Realty
  VICI: "Real Estate",    // VICI Properties
  VTR: "Real Estate",     // Ventas
  WELL: "Real Estate",    // Welltower
  WY: "Real Estate",      // Weyerhaeuser

  // Utilities
  AEE: "Utilities",       // Ameren
  AEP: "Utilities",       // American Electric Power
  AES: "Utilities",       // AES Corporation
  ATO: "Utilities",       // Atmos Energy
  AWK: "Utilities",       // American Water Works
  CEG: "Utilities",       // Constellation Energy
  CMS: "Utilities",       // CMS Energy
  CNP: "Utilities",       // CenterPoint Energy
  D: "Utilities",         // Dominion Energy
  DTE: "Utilities",       // DTE Energy
  DUK: "Utilities",       // Duke Energy
  ED: "Utilities",        // Consolidated Edison
  EIX: "Utilities",       // Edison International
  ES: "Utilities",        // Eversource Energy
  ETR: "Utilities",       // Entergy
  EVRG: "Utilities",      // Evergy
  EXC: "Utilities",       // Exelon
  FSLR: "Utilities",      // First Solar
  FE: "Utilities",        // FirstEnergy
  LNT: "Utilities",       // Alliant Energy
  NEE: "Utilities",       // NextEra Energy
  NI: "Utilities",        // NiSource
  NRG: "Utilities",       // NRG Energy
  PCG: "Utilities",       // PG&E
  PEG: "Utilities",       // PSEG
  PNW: "Utilities",       // Pinnacle West
  PPL: "Utilities",       // PPL Corporation
  SRE: "Utilities",       // Sempra
  SO: "Utilities",        // Southern Company
  VST: "Utilities",       // Vistra
  WEC: "Utilities",       // WEC Energy
  XEL: "Utilities",       // Xcel Energy

  // Materials
  ALB: "Materials",       // Albemarle
  AMCR: "Materials",      // Amcor
  APD: "Materials",       // Air Products
  AVY: "Materials",       // Avery Dennison
  BALL: "Materials",      // Ball Corporation
  CF: "Materials",        // CF Industries
  CRH: "Materials",       // CRH
  CTVA: "Materials",      // Corteva (agrochemical)
  DD: "Materials",        // DuPont
  DOW: "Materials",       // Dow Inc.
  ECL: "Materials",       // Ecolab
  EMN: "Materials",       // Eastman Chemical
  FCX: "Materials",       // Freeport-McMoRan
  IFF: "Materials",       // Intl Flavors
  IP: "Materials",        // International Paper
  LIN: "Materials",       // Linde
  LYB: "Materials",       // LyondellBasell
  MOS: "Materials",       // Mosaic
  MLM: "Materials",       // Martin Marietta
  NEM: "Materials",       // Newmont
  NUE: "Materials",       // Nucor
  PKG: "Materials",       // Packaging Corp
  PPG: "Materials",       // PPG Industries
  SHW: "Materials",       // Sherwin-Williams
  STLD: "Materials",      // Steel Dynamics
  SW: "Materials",        // Smurfit WestRock
  VMC: "Materials",       // Vulcan Materials
};

// Canonical order for sectors (most active to least, based on S&P composition)
export const SECTOR_ORDER = [
  "Technology",
  "Financials",
  "Health Care",
  "Consumer Disc.",
  "Industrials",
  "Comm. Services",
  "Consumer Staples",
  "Energy",
  "Real Estate",
  "Utilities",
  "Materials",
  "Weighted Avg.",
];

// S&P 500 sector weightings (%) for weighted-average composite
export const SECTOR_WEIGHT: Record<string, number> = {
  "Technology": 33.4,
  "Financials": 12.9,
  "Comm. Services": 11.0,
  "Consumer Disc.": 10.4,
  "Health Care": 9.4,
  "Industrials": 8.6,
  "Consumer Staples": 5.0,
  "Energy": 3.2,
  "Utilities": 2.2,
  "Materials": 2.2,
  "Real Estate": 1.9,
};

// Sector → SPDR ETF mapping
export const SECTOR_ETF: Record<string, string> = {
  "Technology": "XLK",
  "Financials": "XLF",
  "Health Care": "XLV",
  "Consumer Disc.": "XLY",
  "Industrials": "XLI",
  "Comm. Services": "XLC",
  "Consumer Staples": "XLP",
  "Energy": "XLE",
  "Real Estate": "XLRE",
  "Utilities": "XLU",
  "Materials": "XLB",
  "Weighted Avg.": "SPY",
};

export function getSector(ticker: string): string {
  return SECTOR_MAP[ticker] ?? "Technology";
}
