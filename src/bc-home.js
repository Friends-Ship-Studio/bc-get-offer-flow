/*
 * ================================================================
 * BuildCasa Get Offer Flow
 * ================================================================
 * This is the custom JavaScript that helps power the BuildCasa.com Get Offer flow
 * It provides the state management and business logic for the BuildCasa Webflow site
 * The state is connected with the HTML and presentation logic via AlpineJS stores and directives
 * The site pages, HTML, and CSS are all designed, built, and hosted via the BuildCasa Webflow account
 */

/*
 * ----------------------------------------------------------------
 * Imports
 * ----------------------------------------------------------------
 */
import Alpine from 'alpinejs'
import { createAddressViewModel } from './modules/LegacyAddressViewModel'
import { createContactViewModel } from './modules/LegacyContactViewModel'
import { createEstimateViewModel } from './modules/LegacyEstimateViewModel'
import { trackEvent } from './modules/LegacyTracking'

/*
 * ----------------------------------------------------------------
 * Initialization Procedure
 * ----------------------------------------------------------------
 */

// Create global variable to hold references to the Alpine stores used for state management
const $store = {}

// Initialize the Alpine stores with custom state and business logic that powers the Get Offer flow
initViewModels($store)
initFlowState($store)
initUIHelpers($store)

// Start Alpine.js to enable the interactive behaviors of the Get Offer flow
Alpine.start()

/*
 * ----------------------------------------------------------------
 * Initialization Functions
 * ----------------------------------------------------------------
 */

function initViewModels(globalStore) {
  createAddressViewModel(globalStore)
  createContactViewModel(globalStore)
  createEstimateViewModel(globalStore)
  globalStore.personalizationViewModel = createPersonalizationViewModel()
  globalStore.experimentationViewModel = createExperimentationViewModel()
  globalStore.aduCalculatorViewModel = createAduCalculatorViewModel()
}

function initFlowState(globalStore) {
  globalStore.flowStateMachine = createFlowStateMachine()
  globalStore.flowState = createFlowState()
}

function initUIHelpers(globalStore) {
  globalStore.modalHelpers = createModalHelpers()
}

/*
 * ================================================================
 * Temp: Legacy 'Modules'
 * ================================================================
 * These scripts will be split out into their own modules / files
 * Then refactored for better flexibility and maintainability
 */

/**
 * ----------------------------------------------------------------
 * createPersonalizationViewModel
 * ----------------------------------------------------------------
 * Creates and returns reference to an Alpine store for the personalizationViewModel
 * Contains data used to personalize the user experience
 * Initially, it fetches and stores geolocation data from the user's IP address
 * And,
 * Can be accessed in HTML via directive attribute values w/ `$store.personalizationViewModel`
 *
 * - userGeo: Object, w/ the geolocation data provided by integrated IP lookup API
 * - market: Getter, returns the supported market based on the userGeo city, if one is found
 * - bcPhoneNumber: Getter, returns the correct BuildCasa phone number based on the userGeo
 * - bcPhoneNumberHref: Getter, returns the correct BuildCasa phone number based on the userGeo in href format (for `tel:` links)
 * - init: Function, run automatically by Alpine as soon as the store is created, to initialize the values (including advanced logic)
 */
function createPersonalizationViewModel() {
  Alpine.store('personalizationViewModel', {
    userGeo: {},
    marketsData: {},
    get market() {
      return getMarketForCity(this.userGeo.city, this.marketsData)
    },
    get bcPhoneNumber() {
      return getBcPhoneNumberForCity(this.userGeo.city, this.marketsData)
    },
    get bcPhoneNumberHref() {
      return `tel:+1${this.bcPhoneNumber.replace(/\D/g, '')}`
    },
    async init() {
      this.marketsData = {
        Sacramento: {
          bcPhoneNumber: '(916) 619-1442',
          cities: [
            'Alta',
            'Auburn',
            'Carnelian Bay',
            'Cedar Flat',
            'Colfax',
            'Dollar Point',
            'Dutch Flat',
            'Foresthill',
            'Granite Bay',
            'Kings Beach',
            'Kingvale',
            'Lincoln',
            'Loomis',
            'Meadow Vista',
            'Newcastle',
            'North Auburn',
            'Penryn',
            'Rocklin',
            'Roseville',
            'Sheridan',
            'Sunnyside-Tahoe City',
            'Tahoe Vista',
            'Tahoma',
            'Truckee',
            'Antelope',
            'Arden-Arcade',
            'Carmichael',
            'Citrus Heights',
            'Clay',
            'Courtland',
            'Elk Grove',
            'Elverta',
            'Fair Oaks',
            'Florin',
            'Folsom',
            'Foothill Farms',
            'Franklin',
            'Freeport',
            'Fruitridge Pocket',
            'Galt',
            'Gold River',
            'Herald',
            'Hood',
            'Isleton',
            'La Riviera',
            'Lemon Hill',
            'Mather',
            'McClellan Park',
            'North Highlands',
            'Orangevale',
            'Parkway',
            'Rancho Cordova',
            'Rancho Murieta',
            'Rio Linda',
            'Rosemont',
            'Sacramento',
            'Vineyard',
            'Walnut Grove',
            'Wilton',
            'Clarksburg',
            'Davis',
            'Dunnigan',
            'El Macero',
            'Esparto',
            'Guinda',
            'Knights Landing',
            'Madison',
            'Monument Hills',
            'Rumsey',
            'Tancred',
            'West Sacramento',
            'Winters',
            'Woodland',
            'Yolo',
          ],
        },
        'Bay Area': {
          bcPhoneNumber: '(415) 941-5861',
          cities: [
            'Alameda',
            'Albany',
            'Ashland',
            'Berkeley',
            'Castro Valley',
            'Cherryland',
            'Dublin',
            'Emeryville',
            'Fairview',
            'Fremont',
            'Hayward',
            'Livermore',
            'Newark',
            'Oakland',
            'Piedmont',
            'Pleasanton',
            'San Leandro',
            'San Lorenzo',
            'Sunol',
            'Union City',
            'Acalanes Ridge',
            'Alamo',
            'Alhambra Valley',
            'Antioch',
            'Bay Point',
            'Bayview',
            'Bethel Island',
            'Blackhawk',
            'Brentwood',
            'Byron',
            'Camino Tassajara',
            'Castle Hill',
            'Clayton',
            'Clyde',
            'Concord',
            'Contra Costa Centre',
            'Crockett',
            'Danville',
            'Diablo',
            'Discovery Bay',
            'East Richmond Heights',
            'El Cerrito',
            'El Sobrante',
            'Hercules',
            'Kensington',
            'Knightsen',
            'Lafayette',
            'Martinez',
            'Montalvin Manor',
            'Moraga',
            'Mountain View',
            'Norris Canyon',
            'North Gate',
            'North Richmond',
            'Oakley',
            'Orinda',
            'Pacheco',
            'Pinole',
            'Pittsburg',
            'Pleasant Hill',
            'Port Costa',
            'Reliez Valley',
            'Richmond',
            'Rodeo',
            'Rollingwood',
            'San Miguel',
            'San Pablo',
            'San Ramon',
            'Saranap',
            'Shell Ridge',
            'Tara Hills',
            'Vine Hill',
            'Walnut Creek',
            'Alto',
            'Belvedere',
            'Black Point-Green Point',
            'Bolinas',
            'Corte Madera',
            'Dillon Beach',
            'Fairfax',
            'Inverness',
            'Kentfield',
            'Lagunitas-Forest Knolls',
            'Larkspur',
            'Lucas Valley-Marinwood',
            'Marin City',
            'Mill Valley',
            'Muir Beach',
            'Nicasio',
            'Novato',
            'Point Reyes Station',
            'Ross',
            'San Anselmo',
            'San Geronimo',
            'San Rafael',
            'Santa Venetia',
            'Sausalito',
            'Sleepy Hollow',
            'Stinson Beach',
            'Strawberry',
            'Tamalpais-Homestead Valley',
            'Tiburon',
            'Tomales',
            'Woodacre',
            'Atwater',
            'Ballico',
            'Bear Creek',
            'Cressey',
            'Delhi',
            'Dos Palos',
            'Dos Palos Y',
            'El Nido',
            'Franklin',
            'Gustine',
            'Hilmar-Irwin',
            'Le Grand',
            'Livingston',
            'Los Banos',
            'McSwain',
            'Merced',
            'Planada',
            'Santa Nella',
            'Snelling',
            'South Dos Palos',
            'Stevinson',
            'Tuttle',
            'Volta',
            'Winton',
            'Aromas',
            'Boronda',
            'Bradley',
            'Carmel Valley Village',
            'Carmel-by-the-Sea',
            'Castroville',
            'Chualar',
            'Del Monte Forest',
            'Del Rey Oaks',
            'Elkhorn',
            'Gonzales',
            'Greenfield',
            'King City',
            'Las Lomas',
            'Lockwood',
            'Marina',
            'Monterey',
            'Moss Landing',
            'Pacific Grove',
            'Pajaro',
            'Pine Canyon',
            'Prunedale',
            'Salinas',
            'San Ardo',
            'San Lucas',
            'Sand City',
            'Seaside',
            'Soledad',
            'Spreckels',
            'American Canyon',
            'Angwin',
            'Calistoga',
            'Deer Park',
            'Napa',
            'Silverado Resort',
            'St. Helena',
            'Vallejo',
            'Yountville',
            'August',
            'Country Club',
            'Dogtown',
            'Escalon',
            'Farmington',
            'French Camp',
            'Garden Acres',
            'Kennedy',
            'Lathrop',
            'Linden',
            'Lockeford',
            'Lodi',
            'Manteca',
            'Mountain House',
            'Peters',
            'Ripon',
            'Stockton',
            'Taft Mosswood',
            'Tracy',
            'Woodbridge',
            'Baywood Park',
            'Belmont',
            'Brisbane',
            'Broadmoor',
            'Burlingame',
            'Colma',
            'Daly City',
            'El Granada',
            'Highlands',
            'Hillsborough',
            'Millbrae',
            'Montara',
            'Moss Beach',
            'Pacifica',
            'San Bruno',
            'San Mateo',
            'South San Francisco',
            'Alum Rock',
            'Burbank',
            'Cambrian Park',
            'Campbell',
            'Cupertino',
            'East Foothills',
            'Fremont',
            'Fruitdale',
            'Gilroy',
            'Lexington Hills',
            'Los Altos',
            'Los Altos Hills',
            'Los Gatos',
            'Loyola',
            'Milpitas',
            'Monte Sereno',
            'Morgan Hill',
            'Mountain View',
            'Palo Alto',
            'Portola Valley',
            'San Jose',
            'San Martin',
            'Santa Clara',
            'Saratoga',
            'Stanford',
            'Sunnyvale',
            'Allendale',
            'Benicia',
            'Dixon',
            'Elmira',
            'Fairfield',
            'Green Valley',
            'Hartley',
            'Rio Vista',
            'Suisun City',
            'Vacaville',
            'Vallejo',
            'Bloomfield',
            'Bodega',
            'Bodega Bay',
            'Boyes Hot Springs',
            'Carmet',
            'Cazadero',
            'Cloverdale',
            'Cotati',
            'El Verano',
            'Eldridge',
            'Fetters Hot Springs-Agua Caliente',
            'Forestville',
            'Fulton',
            'Geyserville',
            'Glen Ellen',
            'Graton',
            'Guerneville',
            'Healdsburg',
            'Jenner',
            'Kenwood',
            'Larkfield-Wikiup',
            'Monte Rio',
            'Occidental',
            'Penngrove',
            'Petaluma',
            'Rohnert Park',
            'Salmon Creek',
            'Santa Rosa',
            'Sea Ranch',
            'Sebastopol',
            'Sereno del Mar',
            'Sonoma',
            'Temelec',
            'Timber Cove',
            'Valley Ford',
            'Windsor',
          ],
        },
        SoCal: {
          bcPhoneNumber: '(213) 322-1360',
          cities: [
            'Auberry',
            'Big Creek',
            'Biola',
            'Bowles',
            'Calwa',
            'Cantua Creek',
            'Caruthers',
            'Centerville',
            'Clovis',
            'Coalinga',
            'Del Rey',
            'Easton',
            'Firebaugh',
            'Fort Washington',
            'Fowler',
            'Fresno',
            'Friant',
            'Huron',
            'Kerman',
            'Kingsburg',
            'Lanare',
            'Laton',
            'Malaga',
            'Mayfair',
            'Mendota',
            'Millerton',
            'Minkler',
            'Monmouth',
            'Old Fig Garden',
            'Orange Cove',
            'Parlier',
            'Raisin City',
            'Reedley',
            'Riverdale',
            'San Joaquin',
            'Sanger',
            'Selma',
            'Shaver Lake',
            'Squaw Valley',
            'Sunnyside',
            'Tarpey Village',
            'Three Rocks',
            'Tranquillity',
            'West Park',
            'Westside',
            'Alta Sierra',
            'Arvin',
            'Bakersfield',
            'Bakersfield Country Club',
            'Bear Valley Springs',
            'Benton Park',
            'Bodfish',
            'Boron',
            'Buttonwillow',
            'California City',
            'Casa Loma',
            'Cherokee Strip',
            'China Lake Acres',
            'Choctaw Valley',
            'Cottonwood',
            'Delano',
            'Derby Acres',
            'Di Giorgio',
            'Dustin Acres',
            'East Bakersfield',
            'East Niles',
            'Edison',
            'Edmundson Acres',
            'El Adobe',
            'Fairfax',
            'Ford City',
            'Frazier Park',
            'Fuller Acres',
            'Glennville',
            'Golden Hills',
            'Goodmanville',
            'Greenacres',
            'Greenfield',
            'Hillcrest',
            'Inyokern',
            'Johannesburg',
            'Keene',
            'Kernville',
            'La Cresta',
            'Lake Isabella',
            'Lake of the Woods',
            'Lakeside',
            'Lamont',
            'Lebec',
            'Lost Hills',
            'Maricopa',
            'McFarland',
            'McKittrick',
            'Mettler',
            'Mexican Colony',
            'Mojave',
            'Mountain Meadows',
            'Mountain Mesa',
            'North Edwards',
            'Oildale',
            'Old River',
            'Old Stine',
            'Olde Stockdale',
            'Onyx',
            'Pine Mountain Club',
            'Potomac Park',
            'Pumpkin Center',
            'Randsburg',
            'Rexland Acres',
            'Ridgecrest',
            'Ridgecrest Heights',
            'Rivergrove',
            'Rosamond',
            'Rosedale',
            'Shafter',
            'Smith Corner',
            'South Taft',
            'Squirrel Mountain Valley',
            'Stallion Springs',
            'Stebbins',
            'Taft',
            'Taft Heights',
            'Tarina',
            'Tehachapi',
            'Tupman',
            'Valley Acres',
            'Wasco',
            'Weedpatch',
            'Weldon',
            'Wofford Heights',
            'Woody',
            'Acton',
            'Agoura Hills',
            'Agua Dulce',
            'Alhambra',
            'Alondra Park',
            'Altadena',
            'Arcadia',
            'Artesia',
            'Avalon',
            'Avocado Heights',
            'Azusa',
            'Baldwin Park',
            'Bell',
            'Bell Gardens',
            'Bellflower',
            'Beverly Hills',
            'Bradbury',
            'Burbank',
            'Calabasas',
            'Carson',
            'Castaic',
            'Cerritos',
            'Charter Oak',
            'Citrus',
            'Claremont',
            'Commerce',
            'Compton',
            'Covina',
            'Cudahy',
            'Culver City',
            'Del Aire',
            'Desert View Highlands',
            'Diamond Bar',
            'Downey',
            'Duarte',
            'East Los Angeles',
            'East Pasadena',
            'East Rancho Dominguez',
            'East San Gabriel',
            'East Whittier',
            'El Monte',
            'El Segundo',
            'Elizabeth Lake',
            'Florence-Graham',
            'Gardena',
            'Glendale',
            'Glendora',
            'Green Valley',
            'Hacienda Heights',
            'Hasley Canyon',
            'Hawaiian Gardens',
            'Hawthorne',
            'Hermosa Beach',
            'Hidden Hills',
            'Huntington Park',
            'Industry',
            'Inglewood',
            'Irwindale',
            'La Cañada Flintridge',
            'La Crescenta-Montrose',
            'La Habra Heights',
            'La Mirada',
            'La Puente',
            'La Verne',
            'Ladera Heights',
            'Lake Hughes',
            'Lake Los Angeles',
            'Lakewood',
            'Lancaster',
            'Lawndale',
            'Lennox',
            'Leona Valley',
            'Littlerock',
            'Lomita',
            'Long Beach',
            'Los Angeles',
            'Lynwood',
            'Malibu',
            'Manhattan Beach',
            'Marina del Rey',
            'Mayflower Village',
            'Maywood',
            'Monrovia',
            'Montclair',
            'Montebello',
            'Monterey Park',
            'North El Monte',
            'Norwalk',
            'Palmdale',
            'Palos Verdes Estates',
            'Paramount',
            'Pasadena',
            'Pepperdine University',
            'Pico Rivera',
            'Pomona',
            'Quartz Hill',
            'Rancho Palos Verdes',
            'Redondo Beach',
            'Rolling Hills',
            'Rolling Hills Estates',
            'Rose Hills',
            'Rosemead',
            'Rowland Heights',
            'San Dimas',
            'San Fernando',
            'San Gabriel',
            'San Marino',
            'San Pasqual',
            'Santa Clarita',
            'Santa Fe Springs',
            'Santa Monica',
            'Sierra Madre',
            'Signal Hill',
            'South El Monte',
            'South Gate',
            'South Monrovia Island',
            'South Pasadena',
            'South San Gabriel',
            'South San Jose Hills',
            'South Whittier',
            'Stevenson Ranch',
            'Sun Village',
            'Temple City',
            'Topanga',
            'Torrance',
            'Val Verde',
            'Valinda',
            'Vernon',
            'View Park-Windsor Hills',
            'Vincent',
            'Walnut',
            'Walnut Park',
            'West Athens',
            'West Carson',
            'West Covina',
            'West Hollywood',
            'West Puente Valley',
            'West Rancho Dominguez',
            'West Whittier-Los Nietos',
            'Westlake Village',
            'Westmont',
            'Whittier',
            'Willowbrook',
            'Aliso Viejo',
            'Anaheim',
            'Brea',
            'Buena Park',
            'Chino Hills',
            'Costa Mesa',
            'Coto de Caza',
            'Cypress',
            'Dana Point',
            'Fountain Valley',
            'Fullerton',
            'Garden Grove',
            'Huntington Beach',
            'Irvine',
            'La Habra',
            'La Mirada',
            'La Palma',
            'Ladera Ranch',
            'Laguna Beach',
            'Laguna Hills',
            'Laguna Niguel',
            'Laguna Woods',
            'Lake Forest',
            'Las Flores',
            'Long Beach',
            'Los Alamitos',
            'Midway City',
            'Mission Viejo',
            'Modjeska',
            'Newport Beach',
            'North Tustin',
            'Orange',
            'Placentia',
            'Rancho Mission Viejo',
            'Rancho Santa Margarita',
            'Rossmoor',
            'San Clemente',
            'San Juan Capistrano',
            'Santa Ana',
            'Seal Beach',
            'Silverado',
            'Stanton',
            'Trabuco Canyon',
            'Tustin',
            'Villa Park',
            'Westminster',
            'Williams Canyon',
            'Yorba Linda',
            'Aguanga',
            'Anza',
            'Banning',
            'Beaumont',
            'Bermuda Dunes',
            'Blythe',
            'Cabazon',
            'Calimesa',
            'Canyon Lake',
            'Cathedral City',
            'Cherry Valley',
            'Coachella',
            'Colton',
            'Corona',
            'Coronita',
            'Desert Center',
            'Desert Edge',
            'Desert Hot Springs',
            'Desert Palms',
            'East Hemet',
            'Eastvale',
            'El Cerrito',
            'El Sobrante',
            'Fontana',
            'French Valley',
            'Garnet',
            'Good Hope',
            'Green Acres',
            'Hemet',
            'Highgrove',
            'Home Gardens',
            'Homeland',
            'Idyllwild-Pine Cove',
            'Indian Wells',
            'Indio',
            'Indio Hills',
            'Jurupa Valley',
            'La Quinta',
            'Lake Elsinore',
            'Lake Mathews',
            'Lake Riverside',
            'Lakeland Village',
            'Lakeview',
            'March ARB',
            'Mead Valley',
            'Meadowbrook',
            'Mecca',
            'Menifee',
            'Mesa Verde',
            'Moreno Valley',
            'Mountain Center',
            'Murrieta',
            'Norco',
            'North Shore',
            'Nuevo',
            'Oasis',
            'Ontario',
            'Palm Desert',
            'Palm Springs',
            'Perris',
            'Rancho Mirage',
            'Redlands',
            'Ripley',
            'Riverside',
            'Romoland',
            'Sage',
            'San Jacinto',
            'Sky Valley',
            'Temecula',
            'Temescal Valley',
            'Thermal',
            'Thousand Palms',
            'Valle Vista',
            'Vista Santa Rosa',
            'Warm Springs',
            'Whitewater',
            'Wildomar',
            'Winchester',
            'Woodcrest',
            'Yucaipa',
            'Adelanto',
            'Apple Valley',
            'Baker',
            'Barstow',
            'Big Bear City',
            'Big Bear Lake',
            'Big River',
            'Bloomington',
            'Bluewater',
            'Chino',
            'Chino Hills',
            'Colton',
            'Crestline',
            'Fontana',
            'Grand Terrace',
            'Hesperia',
            'Highland',
            'Homestead Valley',
            'Joshua Tree',
            'Lake Arrowhead',
            'Lenwood',
            'Loma Linda',
            'Lucerne Valley',
            'Lytle Creek',
            'Mentone',
            'Montclair',
            'Morongo Valley',
            'Mountain View Acres',
            'Muscoy',
            'Needles',
            'Oak Glen',
            'Oak Hills',
            'Ontario',
            'Phelan',
            'Piñon Hills',
            'Pomona',
            'Rancho Cucamonga',
            'Redlands',
            'Rialto',
            'Running Springs',
            'San Antonio Heights',
            'San Bernardino',
            'Searles Valley',
            'Silver Lakes',
            'Spring Valley Lake',
            'Twentynine Palms',
            'Upland',
            'Victorville',
            'Wrightwood',
            'Yermo',
            'Yucaipa',
            'Yucca Valley',
            'Alpine',
            'Bonita',
            'Bonsall',
            'Borrego Springs',
            'Bostonia',
            'Boulevard',
            'Campo',
            'Carlsbad',
            'Casa de Oro-Mount Helix',
            'Chula Vista',
            'Coronado',
            'Crest',
            'Del Dios',
            'Del Mar',
            'Descanso',
            'El Cajon',
            'Elfin Forest',
            'Encinitas',
            'Escondido',
            'Eucalyptus Hills',
            'Fairbanks Ranch',
            'Fallbrook',
            'Granite Hills',
            'Harbison Canyon',
            'Harmony Grove',
            'Hidden Meadows',
            'Imperial Beach',
            'Jacumba',
            'Jamul',
            'Julian',
            'La Mesa',
            'La Presa',
            'Lake San Marcos',
            'Lakeside',
            'Lemon Grove',
            'Mount Laguna',
            'National City',
            'Oceanside',
            'Pala',
            'Pine Valley',
            'Potrero',
            'Poway',
            'Rainbow',
            'Ramona',
            'Rancho San Diego',
            'Rancho Santa Fe',
            'San Diego',
            'San Diego Country Estates',
            'San Marcos',
            'Santee',
            'Solana Beach',
            'Spring Valley',
            'Valley Center',
            'Vista',
            'Winter Gardens',
            'Bell Canyon',
            'Camarillo',
            'Casa Conejo',
            'Channel Islands Beach',
            'El Rio',
            'Fillmore',
            'Lake Sherwood',
            'Meiners Oaks',
            'Mira Monte',
            'Moorpark',
            'Oak Park',
            'Oak View',
            'Ojai',
            'Oxnard',
            'Piru',
            'Port Hueneme',
            'San Buenaventura (Ventura)',
            'Santa Paula',
            'Santa Rosa Valley',
            'Santa Susana',
            'Saticoy',
            'Simi Valley',
            'Somis',
            'Thousand Oaks',
          ],
        },
      }

      const response = await fetch('https://get.geojs.io/v1/ip/geo.json')
      this.userGeo = await response.json()
    },
  })

  // Return reference to the new personalizationViewModel store
  return Alpine.store('personalizationViewModel')
}

/**
 * ----------------------------------------------------------------
 * createExperimentationViewModel
 * ----------------------------------------------------------------
 * Creates and returns reference to an Alpine store for the experimentationViewModel
 * Contains data used to drive split tests within the user experience
 * Can be accessed in HTML via directive attribute values w/ `$store.experimentationViewModel`
 *
 * - activeExperimentVariations: Object, containing each active experiment as a key, and the active variation as the value
 * - setActiveExperimentVariation: Function, to set the active variation for a given experiment
 * - getActiveExperimentVariation: Function, to get the active variation for a given experiment
 * - init: Function, run automatically by Alpine as soon as the store is created, to initialize the values (including advanced logic)
 */
function createExperimentationViewModel() {
  Alpine.store('experimentationViewModel', {
    activeExperimentVariations: {},
    setActiveExperimentVariation(experiment, variation) {
      this.activeExperimentVariations[experiment] = variation
    },
    getActiveExperimentVariation(experiment) {
      return this.activeExperimentVariations[experiment]
    },
    clearActiveExperiment(experiment) {
      if (this.activeExperimentVariations[experiment]) {
        delete this.activeExperimentVariations[experiment]
      }
    },
    getFullStoryActiveExperimentVariationsEventPropertyValue() {
      // Convert the activeExperimentVariations object into a single array of strings,
      // concatenating the experiment name and variation name with a colon
      // e.g. ["experiment1:variation1", "experiment2:variation2"]
      return Object.entries(this.activeExperimentVariations).map(
        ([experiment, variation]) => `${experiment}:${variation}`,
      )
    },
    init() {
      this.activeExperimentVariations = {}
    },
  })

  // Return reference to the new experimentationViewModel store
  return Alpine.store('experimentationViewModel')
}

function createAduCalculatorViewModel() {
  Alpine.store('aduCalculatorViewModel', {
    homeValue: null,
    homeSize: null,
    aduCost: null,
    aduSize: null,
    result: null,
    init: function () {
      this.homeValue = this.formatInput('1000000')
      this.homeSize = this.formatInput('2000')
      this.aduCost = this.formatInput('250000')
      this.aduSize = this.formatInput('800')
      this.result = this.calculateResult()
    },
    handleInput: function (e) {
      e.target.value = this.formatInput(e.target.value)
      this.result = this.calculateResult()
    },
    handleSubmit: function (e) {
      e.preventDefault()
    },
    formatInput: function (inputValue) {
      const locale = 'en-US'
      let value = inputValue

      value = value.replace(/\D/g, '')

      value = new Intl.NumberFormat(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value)

      value = value !== '0' ? value : ''

      return value
    },
    calculateResult: function () {
      const homeValue = this.convertFieldValueToNumber(this.homeValue)
      const homeSize = this.convertFieldValueToNumber(this.homeSize)
      const aduCost = this.convertFieldValueToNumber(this.aduCost)
      const aduSize = this.convertFieldValueToNumber(this.aduSize)

      if (!homeValue || !homeSize || !aduSize) return '--'

      let result = (homeValue / homeSize) * aduSize - aduCost - 50000

      result = result < 10000 ? 10000 : Math.ceil(result / 10000) * 10000

      result = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(result)

      return result
    },
    convertFieldValueToNumber: function (fieldValue) {
      return Number(fieldValue.replace(/[^0-9.-]+/g, ''))
    },
  })

  // Return reference to the new aduCalculatorViewModel store
  return Alpine.store('aduCalculatorViewModel')
}

/**
 * ----------------------------------------------------------------
 * createFlowStateMachine
 * ----------------------------------------------------------------
 * Creates and returns reference to an Alpine store for the flowStateMachine
 * A finite state machine that defines which `states` are possible for the Get Offer UI Flow
 * And for every `state`, which `transitions` are possible _from_ that state — defined with:
 * - EVENT: Key for the `transition`
 * - target: String, matching the key for the `state` that should be set when the `transition` `EVENT` is triggered
 *
 * This state machine also defines a `transition` method which is used to call and process the transition events,
 * Returns the resulting `state` — to update the value for the `flowState` Alpine store that drives the main UI state
 * e.g. `$store.flowState.value = $store.flowStateMachine.transition($store.flowState.value, "EVENT")
 */
function createFlowStateMachine() {
  // Create transition definition objects for *shared* transition events / paths
  const submitAddressTransition = {
    SUBMIT_ADDRESS: {
      target: 'addressFormProcessing',
    },
  }
  const modalSubmitAddressTransition = {
    SUBMIT_ADDRESS: {
      target: 'modalAddressFormProcessing',
    },
  }
  const submitContactTransition = {
    SUBMIT_CONTACT: {
      target: 'contactFormProcessing',
    },
  }
  const exitTransition = {
    EXIT: {
      target: 'default',
    },
  }

  // Create state machine Alpine store
  Alpine.store('flowStateMachine', {
    defaultState: 'default',
    states: {
      default: {
        transitions: {
          ...submitAddressTransition,
          START_MODAL_FLOW: {
            target: 'modalAddressForm',
          },
        },
      },
      addressFormProcessing: {
        transitions: {
          SUCCESS: {
            target: 'contactForm',
          },
          SKIP_CONTACT: {
            target: 'estimateResults',
          },
          ERROR: {
            target: 'addressFormError',
          },
        },
      },
      addressFormError: {
        transitions: {
          ...submitAddressTransition,
        },
      },
      modalAddressForm: {
        transitions: {
          ...modalSubmitAddressTransition,
          ...exitTransition,
        },
      },
      modalAddressFormProcessing: {
        transitions: {
          SUCCESS: {
            target: 'contactForm',
          },
          SKIP_CONTACT: {
            target: 'estimateResults',
          },
          ERROR: {
            target: 'modalAddressFormError',
          },
          ...exitTransition,
        },
      },
      modalAddressFormError: {
        transitions: {
          ...modalSubmitAddressTransition,
          ...exitTransition,
        },
      },
      contactForm: {
        transitions: {
          ...submitContactTransition,
          ...exitTransition,
        },
      },
      contactFormProcessing: {
        transitions: {
          SUCCESS: {
            target: 'estimateResults',
          },
          ERROR: {
            target: 'contactFormError',
          },
          ...exitTransition,
        },
      },
      contactFormError: {
        transitions: {
          ...submitContactTransition,
          ...exitTransition,
        },
      },
      estimateResults: {
        transitions: {
          SCHEDULE: {
            target: 'scheduleConsultation',
          },
          REQUEST_COMMUNITY: {
            target: 'requestedCommunity',
          },
          ...exitTransition,
        },
      },
      scheduleConsultation: {
        transitions: {
          ...exitTransition,
        },
      },
      requestedCommunity: {
        transitions: {
          ...exitTransition,
        },
      },
    },
    // Method to trigger state transitions, given the current state, and a valid transition event
    // For a successful transition, returns the resulting state
    transition(currentState, event) {
      const currentStateDefinition = this.states[currentState]
      const destinationTransition = currentStateDefinition.transitions[event]

      if (!destinationTransition) {
        trackEvent('Invalid State Transition Triggered', $store, {
          current_state_str: currentState,
          event_str: event,
        })
        return currentState
      }

      const destinationState = destinationTransition.target
      return destinationState
    },
  })

  // Return reference to the new flowStateMachine store
  return Alpine.store('flowStateMachine')
}

/**
 * ----------------------------------------------------------------
 * createFlowState
 * ----------------------------------------------------------------
 * Creates and returns reference to an Alpine store for the main flowState
 * Used to drive the main UI state as users progress through the Get Offer flow
 * Can be accessed in HTML via directive attribute values w/ `$store.flowState`
 *
 * - value: String, for the current UI state that should be displayed, generally bound via `x-show`
 * - init: Function, run automatically by Alpine as soon as the store is created, to initialize the values (including advanced logic)
 */
function createFlowState() {
  Alpine.store('flowState', {
    value: '',
    init() {
      // FUTURE DEV: Update w/ logic to set initial UI state based on other sources (link params, etc.) here

      this.value = $store.flowStateMachine.defaultState
    },
  })

  // Return reference to the new flowState store
  return Alpine.store('flowState')
}

/**
 * ----------------------------------------------------------------
 * createModalHelpers
 * ----------------------------------------------------------------
 * Creates and returns reference to an Alpine store for modalHelpers
 * Which help control the UX for the modal-based implementation of the Get Offer flow
 * Centralizes some more complex expressions to make Webflow dev safer and more convenient
 * Can be accessed in HTML via directive attribute values w/ `$store.modalHelpers`
 *
 * - iOpen: Getter, that returns true if modal should be displayed based on current flowState, generally bound via `x-show`
 * - handleModalClose: Function, that triggers the flowStateMachine EXIT transition if called, bound UI events via `x-on:click` or `@click`
 */
function createModalHelpers() {
  Alpine.store('modalHelpers', {
    get isOpen() {
      return (
        $store.flowState.value == 'modalAddressForm' ||
        $store.flowState.value == 'modalAddressFormProcessing' ||
        $store.flowState.value == 'modalAddressFormError' ||
        $store.flowState.value == 'contactForm' ||
        $store.flowState.value == 'contactFormProcessing' ||
        $store.flowState.value == 'contactFormError' ||
        $store.flowState.value == 'estimateResults' ||
        $store.flowState.value == 'scheduleConsultation' ||
        $store.flowState.value == 'requestedCommunity'
      )
    },
    handleModalFlowStart(cta = null) {
      $store.flowState.value = $store.flowStateMachine.transition(
        $store.flowState.value,
        'START_MODAL_FLOW',
      )

      let eventProperties = {}
      if (cta) {
        eventProperties = {
          cta_str: cta,
        }
      }

      trackEvent('Modal Get Offer Flow Opened', $store, eventProperties)
    },
    handleModalClose() {
      // TODO: Move this logic into the flowStateMachine
      let proceedWithExit = true

      // If the user is on the contact form, and has entered any data,
      // confirm they want to exit before closing the modal
      if (
        $store.flowState.value == 'contactForm' &&
        $store.contactViewModel.hasAnyContactDetails
      ) {
        proceedWithExit = confirm(
          "Are you sure you want to stop before you've seen how much your extra lot space could be worth?",
        )
      }

      // If the user is on the contact form processing state,
      // prevent them from exiting until the processing is complete
      if ($store.flowState.value == 'contactFormProcessing') {
        proceedWithExit = false
      }

      if (proceedWithExit) {
        $store.flowState.value = $store.flowStateMachine.transition(
          $store.flowState.value,
          'EXIT',
        )

        trackEvent('Get Offer Modal Closed', $store)
      }
    },
  })

  // Return reference to the new modalHelpers store
  return Alpine.store('modalHelpers')
}

/**
 * ----------------------------------------------------------------
 * getBcPhoneNumberForCity
 * ----------------------------------------------------------------
 * Given a city and marketsData definition object, returns the appropriate BuildCasa phone number to display
 * Ideally, localized to the market, but defaults to a generic number if no market match
 */
function getBcPhoneNumberForCity(city, marketsData) {
  const defaultPhoneNumber = '(415) 941-5861'

  if (!city || typeof city !== 'string') return defaultPhoneNumber

  const market = getMarketForCity(city, marketsData)
  const marketSpecificPhoneNumber = getBcPhoneNumberForMarket(
    market,
    marketsData,
  )

  return marketSpecificPhoneNumber ?? defaultPhoneNumber
}

/**
 * ----------------------------------------------------------------
 * getMarketForCity
 * ----------------------------------------------------------------
 * Given a city and marketsData definition object, returns a matching BuildCasa 'market', if found
 */
function getMarketForCity(city, marketsData) {
  if (!city || typeof city !== 'string') return null

  for (const marketKey of Object.keys(marketsData)) {
    if (
      marketsData[marketKey].cities.filter(
        (c) => c.toLowerCase().trim() === city.toLowerCase().trim(),
      ).length > 0
    ) {
      return marketKey
    }
  }

  return null
}

/**
 * ----------------------------------------------------------------
 * getBcPhoneNumberForMarket
 * ----------------------------------------------------------------
 * Given a 'market' and marketsData definition object, returns a location-specific BuildCasa phone number to display, if found
 */
function getBcPhoneNumberForMarket(market, marketsData) {
  if (!market || typeof market !== 'string') return null

  for (const marketKey of Object.keys(marketsData)) {
    if (marketKey.toLowerCase().trim() === market.toLowerCase().trim()) {
      return marketsData[marketKey].bcPhoneNumber ?? null
    }
  }

  return null
}
