/**
 * Prisma seed — development/demo data for Delhi Tourism Platform.
 * Run with: npm run seed
 */

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Delhi Tourism database...");

  // ─── Admin ───────────────────────────────────────────────────────────────

  const passwordHash = await bcrypt.hash("Admin@123", 12);

  const superAdmin = await prisma.admin.upsert({
    where: { email: "admin@delhitourism.dev" },
    update: {},
    create: {
      name: "Super Admin",
      email: "admin@delhitourism.dev",
      passwordHash,
      role: "SUPER_ADMIN",
      isActive: true,
    },
  });
  console.log(`✅ Admin created: ${superAdmin.email}`);

  // ─── Categories ──────────────────────────────────────────────────────────

  const categoriesData = [
    {
      name: "Spiritual Circuits",
      slug: "spiritual-circuits",
      shortDescription:
        "Explore Delhi's sacred places and spiritual traditions.",
      description:
        "Delhi is home to a remarkable diversity of sacred sites — mosques, temples, gurudwaras, churches, and more. These spiritual circuits take you through centuries of religious history and living faith traditions.",
      displayOrder: 1,
      isFeatured: true,
    },
    {
      name: "Heritage Circuits",
      slug: "heritage-circuits",
      shortDescription:
        "Walk through the layers of Delhi's magnificent heritage.",
      description:
        "From Mughal forts to colonial landmarks, Delhi's heritage is layered across millennia. These circuits guide you through the historical heart of the city.",
      displayOrder: 2,
      isFeatured: true,
    },
    {
      name: "Cultural Experiences",
      slug: "cultural-experiences",
      shortDescription: "Discover the living culture of Delhi.",
      description:
        "Delhi's culture is alive in its arts, festivals, crafts, and everyday rhythms. Explore the city through its vibrant cultural experiences.",
      displayOrder: 3,
      isFeatured: true,
    },
    {
      name: "Museums & Galleries",
      slug: "museums-galleries",
      shortDescription:
        "Explore Delhi's world-class museums and art galleries.",
      description:
        "Delhi houses some of India's most significant museums and galleries, from ancient artefacts to modern art collections.",
      displayOrder: 4,
      isFeatured: false,
    },
    {
      name: "Food & Culinary",
      slug: "food-culinary",
      shortDescription: "Taste the flavours of Delhi's legendary food culture.",
      description:
        "Delhi's food scene is legendary — from street food in Chandni Chowk to fine dining in Lutyens' Delhi.",
      displayOrder: 5,
      isFeatured: false,
    },
    {
      name: "Markets & Shopping",
      slug: "markets-shopping",
      shortDescription: "Shop in Delhi's iconic markets and bazaars.",
      description:
        "From the bustling Sarojini Nagar to the craft bazaars of Dilli Haat, Delhi offers extraordinary shopping experiences.",
      displayOrder: 6,
      isFeatured: false,
    },
    {
      name: "Parks & Gardens",
      slug: "parks-gardens",
      shortDescription: "Discover Delhi's green spaces and peaceful gardens.",
      description:
        "Delhi's parks and gardens offer tranquil retreats within the urban landscape — from Mughal gardens to modern ecological parks.",
      displayOrder: 7,
      isFeatured: false,
    },
    {
      name: "Arts & Entertainment",
      slug: "arts-entertainment",
      shortDescription:
        "Experience Delhi's thriving arts and entertainment scene.",
      description:
        "Delhi is a hub of performing arts, theatre, music, and contemporary culture.",
      displayOrder: 8,
      isFeatured: false,
    },
    {
      name: "Monuments",
      slug: "monuments",
      shortDescription:
        "Visit Delhi's iconic monuments and architectural marvels.",
      description:
        "Delhi's skyline is defined by monuments that span millennia — from Qutb Minar to India Gate.",
      displayOrder: 9,
      isFeatured: true,
    },
    {
      name: "Festivals & Events",
      slug: "festivals-events",
      shortDescription: "Celebrate Delhi's vibrant festivals and events.",
      description:
        "Delhi celebrates every season with a rich calendar of festivals, fairs, and cultural events.",
      displayOrder: 10,
      isFeatured: false,
    },
    {
      name: "Family & Kids",
      slug: "family-kids",
      shortDescription: "Explore Delhi's family-friendly attractions.",
      description:
        "Delhi has much to offer families — interactive museums, parks, theme attractions, and cultural experiences for all ages.",
      displayOrder: 11,
      isFeatured: false,
    },
    {
      name: "Day Trips",
      slug: "day-trips",
      shortDescription: "Discover destinations within easy reach of Delhi.",
      description:
        "Beyond Delhi, a world of heritage and nature awaits — Agra, Jaipur, Mathura, and more are within a day's reach.",
      displayOrder: 12,
      isFeatured: false,
    },
  ];

  const categories = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categories[cat.slug] = created;
    console.log(`✅ Category: ${created.name}`);
  }

  // ─── Circuits ─────────────────────────────────────────────────────────────

  const circuitsData = [
    {
      categoryId: categories["spiritual-circuits"].id,
      name: "Delhi's Sacred Harmony",
      slug: "delhis-sacred-harmony",
      tagline:
        "Explore Delhi through its diverse spiritual traditions and sacred landmarks.",
      shortDescription:
        "A journey through Delhi's mosques, temples, gurudwaras, and churches.",
      description:
        "Delhi's spiritual landscape is one of its most profound offerings. From the soaring minarets of Jama Masjid to the golden dome of Bangla Sahib Gurudwara, from ancient Hindu temples to centuries-old Jain shrines, this circuit reveals the city's remarkable religious diversity and its culture of coexistence.",
      duration: "1 full day",
      bestTime: "October to March",
      displayOrder: 1,
      isFeatured: true,
    },
    {
      categoryId: categories["heritage-circuits"].id,
      name: "Echoes of Delhi",
      slug: "echoes-of-delhi",
      tagline:
        "Travel through the many lives of a city that has been capital for centuries.",
      shortDescription:
        "A heritage circuit through the oldest layers of Delhi's history.",
      description:
        "Delhi has been a city of kings, emperors, and conquerors. Each left their mark — in forts, tombs, mosques, and gardens. This circuit takes you through the archaeological remains of early Delhi, the Tughlaq cities, and the grandeur of Shahjahanabad.",
      duration: "1 full day",
      bestTime: "October to February",
      displayOrder: 2,
      isFeatured: true,
    },
    {
      categoryId: categories["heritage-circuits"].id,
      name: "The Heritage of Delhi",
      slug: "the-heritage-of-delhi",
      tagline:
        "Discover the Mughal and colonial heritage that shaped modern Delhi.",
      shortDescription:
        "From Red Fort to Rashtrapati Bhavan — the story of Delhi's grandest era.",
      description:
        "From the Red Fort and Humayun's Tomb to the colonial boulevards of Lutyens' Delhi, this circuit explores the most iconic chapters of Delhi's architectural and political history.",
      duration: "2 days",
      bestTime: "September to March",
      displayOrder: 3,
      isFeatured: true,
    },
    {
      categoryId: categories["cultural-experiences"].id,
      name: "The Soul of Delhi",
      slug: "the-soul-of-delhi",
      tagline:
        "Experience the living culture, art, and everyday spirit of Delhi.",
      shortDescription:
        "A cultural circuit through Delhi's neighbourhoods, markets, and arts.",
      description:
        "Beyond monuments, Delhi lives in its neighbourhoods — in the spice markets of Chandni Chowk, the art galleries of Lodhi Colony, the craft bazaars of Dilli Haat, and the performances of the India Habitat Centre. This circuit reveals the soul of a city that never stops creating.",
      duration: "1-2 days",
      bestTime: "Year-round",
      displayOrder: 1,
      isFeatured: true,
    },
  ];

  const circuits = {};
  for (const circuit of circuitsData) {
    const created = await prisma.circuit.upsert({
      where: { slug: circuit.slug },
      update: {},
      create: circuit,
    });
    circuits[circuit.slug] = created;
    console.log(`✅ Circuit: ${created.name}`);
  }

  // ─── Places ───────────────────────────────────────────────────────────────

  const placesData = [
    {
      name: "Red Fort",
      slug: "red-fort",
      shortDescription:
        "The magnificent Mughal citadel that served as the main residence of the emperors of the Mughal dynasty.",
      description:
        "Red Fort, or Lal Qila, was built by Mughal Emperor Shah Jahan in 1639 and served as the main residence of the Mughal emperors for nearly 200 years. The fort complex houses numerous palaces, audience halls, and gardens, all enclosed within massive red sandstone walls.",
      historicalInformation:
        "Constructed between 1638 and 1648, Red Fort was the seat of Mughal power for nearly two centuries. It was here that the last Mughal emperor Bahadur Shah Zafar was captured by the British in 1857. India's Prime Minister hoists the national flag here every Independence Day on 15 August.",
      address: "Netaji Subhash Marg, Lal Qila, Chandni Chowk, New Delhi",
      locality: "Chandni Chowk",
      latitude: 28.6562,
      longitude: 77.241,
      openingTime: "09:30",
      closingTime: "16:30",
      openDays: "Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday",
      ticketInformation: "Indians: ₹35 | Foreigners: ₹500 | Closed on Mondays",
      website: "https://asi.nic.in",
      coverImage: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80",
      imageUrl: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80",
      icon: "fort",
      isFeatured: true,
    },
    {
      name: "Jama Masjid",
      slug: "jama-masjid",
      shortDescription:
        "India's largest mosque, built by Emperor Shah Jahan, standing at the heart of Old Delhi.",
      description:
        "Jama Masjid is India's largest mosque and one of the most magnificent examples of Mughal architecture. Built by Emperor Shah Jahan between 1644 and 1656, the mosque can accommodate over 25,000 worshippers in its courtyard.",
      historicalInformation:
        "The mosque was built to be the principal mosque of Shah Jahan's new capital Shahjahanabad. Its construction took 12 years and employed over 5,000 workers. The mosque holds relics of the Prophet Muhammad in its north tower.",
      address: "Jama Masjid, Chandni Chowk, New Delhi",
      locality: "Chandni Chowk",
      latitude: 28.6507,
      longitude: 77.2334,
      openingTime: "07:00",
      closingTime: "20:00",
      openDays: "Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday",
      ticketInformation: "Free entry | Camera fee: ₹300",
      coverImage: "https://images.unsplash.com/photo-1597040663342-45b6af3d91a5?auto=format&fit=crop&w=800&q=80",
      imageUrl: "https://images.unsplash.com/photo-1597040663342-45b6af3d91a5?auto=format&fit=crop&w=800&q=80",
      icon: "mosque",
      isFeatured: true,
    },
    {
      name: "Humayun's Tomb",
      slug: "humayuns-tomb",
      shortDescription:
        "The magnificent tomb of Mughal Emperor Humayun, a UNESCO World Heritage Site and precursor to the Taj Mahal.",
      description:
        "Humayun's Tomb was built in 1572 AD by Hamida Banu Begum, the wife of Emperor Humayun. It was the first garden-tomb on the Indian subcontinent and is considered a precursor to the Taj Mahal. The tomb complex is a UNESCO World Heritage Site.",
      historicalInformation:
        "Built nine years after Humayun's death, the tomb was designed by the Persian architect Mirak Mirza Ghiyas. The double-domed structure marked a turning point in Mughal architecture and influenced generations of subsequent Mughal buildings.",
      address: "Mathura Road, Opposite Dargah Nizamuddin, New Delhi",
      locality: "Nizamuddin",
      latitude: 28.5933,
      longitude: 77.2507,
      openingTime: "06:00",
      closingTime: "18:00",
      openDays: "Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday",
      ticketInformation: "Indians: ₹40 | Foreigners: ₹600",
      website: "https://asi.nic.in",
      coverImage: "https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=800&q=80",
      imageUrl: "https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=800&q=80",
      icon: "landmark",
      isFeatured: true,
    },
    {
      name: "Qutb Minar",
      slug: "qutb-minar",
      shortDescription:
        "A UNESCO World Heritage Site — the tallest brick minaret in the world, built in the 12th century.",
      description:
        "Qutb Minar, a UNESCO World Heritage Site, is a 73-metre-tall minaret built in 1193 by Qutb-ud-din Aibak to mark the beginning of Muslim rule in India. The minaret is surrounded by several historically significant monuments that together form the Qutb complex.",
      historicalInformation:
        "The Qutb Minar was built to call the faithful to prayer and to celebrate the victory of Islam in India. Its construction took several generations of rulers. The complex also contains the famous Iron Pillar of Delhi, a 7-metre column of pure iron that has stood for over 1,600 years without rusting.",
      address: "Mehrauli, New Delhi",
      locality: "Mehrauli",
      latitude: 28.5244,
      longitude: 77.1855,
      openingTime: "07:00",
      closingTime: "17:00",
      openDays: "Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday",
      ticketInformation: "Indians: ₹40 | Foreigners: ₹600",
      website: "https://asi.nic.in",
      coverImage: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
      imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
      icon: "monument",
      isFeatured: true,
    },
    {
      name: "India Gate",
      slug: "india-gate",
      shortDescription:
        "A war memorial dedicated to the soldiers of the British Indian Army who died in World War I.",
      description:
        "India Gate is a war memorial located on the Rajpath (now Kartavya Path) in New Delhi. Designed by Sir Edwin Lutyens, the 42-metre-tall arch commemorates the 70,000 soldiers of the British Indian Army who died in World War I.",
      historicalInformation:
        "Completed in 1931, India Gate bears the names of over 13,000 soldiers who died in the North-West Frontier operations. The Amar Jawan Jyoti, the eternal flame beneath it, was added in 1972 to honour soldiers of the 1971 Indo-Pakistani War.",
      address: "Kartavya Path, New Delhi",
      locality: "Central Delhi",
      latitude: 28.6129,
      longitude: 77.2295,
      openingTime: "00:00",
      closingTime: "23:59",
      openDays: "Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday",
      ticketInformation: "Free entry",
      coverImage: "https://images.unsplash.com/photo-1592635196078-9fe3d54f2377?auto=format&fit=crop&w=800&q=80",
      imageUrl: "https://images.unsplash.com/photo-1592635196078-9fe3d54f2377?auto=format&fit=crop&w=800&q=80",
      icon: "arch",
      isFeatured: true,
    },
    {
      name: "Bangla Sahib Gurudwara",
      slug: "bangla-sahib-gurudwara",
      shortDescription:
        "One of Delhi's most prominent Sikh gurudwaras, known for its golden dome and spiritual calm.",
      description:
        "Gurudwara Bangla Sahib is the most prominent Sikh gurudwara in Delhi. Originally a bungalow of Raja Jai Singh, it is associated with the eighth Sikh Guru, Guru Har Krishan, who stayed here in 1664. The gurudwara is known for its golden dome, large sarovar (holy tank), and the langar (free community kitchen) that serves thousands daily.",
      historicalInformation:
        "In 1664, Guru Har Krishan stayed at this site during a smallpox epidemic and provided relief to the afflicted. The sarovar water is believed to have healing properties. The current structure was built in the 18th century.",
      address: "Ashoka Road, Connaught Place, New Delhi",
      locality: "Connaught Place",
      latitude: 28.6268,
      longitude: 77.2092,
      openingTime: "04:00",
      closingTime: "23:00",
      openDays: "Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday",
      ticketInformation: "Free entry | Head covering required",
      coverImage: "https://images.unsplash.com/photo-1608958435020-e8a7109ba809?auto=format&fit=crop&w=800&q=80",
      imageUrl: "https://images.unsplash.com/photo-1608958435020-e8a7109ba809?auto=format&fit=crop&w=800&q=80",
      icon: "temple",
      isFeatured: true,
    },
    {
      name: "Chandni Chowk",
      slug: "chandni-chowk",
      shortDescription:
        "Old Delhi's legendary market street — one of the oldest and busiest markets in India.",
      description:
        "Chandni Chowk is one of the oldest and busiest markets in India, established in the 17th century by Mughal Emperor Shah Jahan. The market is divided into several lanes, each specialising in different goods — spices, textiles, jewellery, electronics, books, and food.",
      historicalInformation:
        "Chandni Chowk was designed by Princess Jahanara, Shah Jahan's daughter, and was once a grand boulevard with a canal running through its centre. The name means 'moonlit crossroads' or 'silver street', reflecting its original splendour.",
      address: "Chandni Chowk, Old Delhi, New Delhi",
      locality: "Chandni Chowk",
      latitude: 28.6562,
      longitude: 77.23,
      openingTime: "09:00",
      closingTime: "20:00",
      openDays: "Monday, Tuesday, Wednesday, Thursday, Friday, Saturday",
      ticketInformation: "Free entry | Closed on Sundays",
      coverImage: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80",
      imageUrl: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80",
      icon: "shopping-bag",
      isFeatured: false,
    },
    {
      name: "Lotus Temple",
      slug: "lotus-temple",
      shortDescription:
        "A Bahá'í House of Worship renowned for its flower-like architecture, open to people of all faiths.",
      description:
        "The Lotus Temple, completed in 1986, is a Bahá'í House of Worship notable for its flowerlike shape. Open to all people, regardless of religion, the temple has become one of Delhi's most visited landmarks and has won numerous architectural awards.",
      historicalInformation:
        "Designed by architect Fariborz Sahba, the Lotus Temple consists of 27 free-standing marble-clad petals arranged in clusters of three. It is one of the last major Bahá'í Houses of Worship to be constructed.",
      address: "Lotus Temple Road, Bahapur, New Delhi",
      locality: "Bahapur",
      latitude: 28.5535,
      longitude: 77.2588,
      openingTime: "09:00",
      closingTime: "17:30",
      openDays: "Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday",
      ticketInformation: "Free entry | Closed on Mondays",
      coverImage: "https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=800&q=80",
      imageUrl: "https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=800&q=80",
      icon: "flower",
      isFeatured: false,
    },
  ];

  const places = {};
  for (const placeData of placesData) {
    const created = await prisma.place.upsert({
      where: { slug: placeData.slug },
      update: {
        coverImage: placeData.coverImage,
        imageUrl: placeData.imageUrl,
        icon: placeData.icon,
        openDays: placeData.openDays,
        openingTime: placeData.openingTime,
        closingTime: placeData.closingTime,
        ticketInformation: placeData.ticketInformation,
        shortDescription: placeData.shortDescription,
        description: placeData.description,
        address: placeData.address,
        locality: placeData.locality,
      },
      create: placeData,
    });
    places[placeData.slug] = created;
    console.log(`✅ Place: ${created.name}`);
  }

  // ─── Place → Category relations ───────────────────────────────────────────

  const placeCategoryLinks = [
    { placeSlug: "red-fort", categorySlug: "heritage-circuits" },
    { placeSlug: "red-fort", categorySlug: "monuments" },
    { placeSlug: "jama-masjid", categorySlug: "spiritual-circuits" },
    { placeSlug: "jama-masjid", categorySlug: "heritage-circuits" },
    { placeSlug: "humayuns-tomb", categorySlug: "heritage-circuits" },
    { placeSlug: "humayuns-tomb", categorySlug: "monuments" },
    { placeSlug: "qutb-minar", categorySlug: "heritage-circuits" },
    { placeSlug: "qutb-minar", categorySlug: "monuments" },
    { placeSlug: "india-gate", categorySlug: "monuments" },
    { placeSlug: "bangla-sahib-gurudwara", categorySlug: "spiritual-circuits" },
    { placeSlug: "chandni-chowk", categorySlug: "markets-shopping" },
    { placeSlug: "chandni-chowk", categorySlug: "food-culinary" },
    { placeSlug: "chandni-chowk", categorySlug: "cultural-experiences" },
    { placeSlug: "lotus-temple", categorySlug: "spiritual-circuits" },
    { placeSlug: "lotus-temple", categorySlug: "monuments" },
  ];

  for (const link of placeCategoryLinks) {
    const place = places[link.placeSlug];
    const category = categories[link.categorySlug];
    if (!place || !category) {
      continue;
    }
    await prisma.placeCategory.upsert({
      where: {
        placeId_categoryId: { placeId: place.id, categoryId: category.id },
      },
      update: {},
      create: { placeId: place.id, categoryId: category.id },
    });
  }
  console.log("✅ Place-Category links created.");

  // ─── Circuit ↔ Place relations ────────────────────────────────────────────

  const circuitPlaceLinks = [
    {
      circuitSlug: "delhis-sacred-harmony",
      placeSlug: "jama-masjid",
      sequence: 1,
    },
    {
      circuitSlug: "delhis-sacred-harmony",
      placeSlug: "bangla-sahib-gurudwara",
      sequence: 2,
    },
    {
      circuitSlug: "delhis-sacred-harmony",
      placeSlug: "lotus-temple",
      sequence: 3,
    },
    { circuitSlug: "echoes-of-delhi", placeSlug: "qutb-minar", sequence: 1 },
    { circuitSlug: "echoes-of-delhi", placeSlug: "red-fort", sequence: 2 },
    { circuitSlug: "echoes-of-delhi", placeSlug: "jama-masjid", sequence: 3 },
    {
      circuitSlug: "the-heritage-of-delhi",
      placeSlug: "red-fort",
      sequence: 1,
    },
    {
      circuitSlug: "the-heritage-of-delhi",
      placeSlug: "humayuns-tomb",
      sequence: 2,
    },
    {
      circuitSlug: "the-heritage-of-delhi",
      placeSlug: "india-gate",
      sequence: 3,
    },
    {
      circuitSlug: "the-soul-of-delhi",
      placeSlug: "chandni-chowk",
      sequence: 1,
    },
    { circuitSlug: "the-soul-of-delhi", placeSlug: "india-gate", sequence: 2 },
  ];

  for (const link of circuitPlaceLinks) {
    const circuit = circuits[link.circuitSlug];
    const place = places[link.placeSlug];
    if (!circuit || !place) {
      continue;
    }
    await prisma.circuitPlace.upsert({
      where: {
        circuitId_placeId: { circuitId: circuit.id, placeId: place.id },
      },
      update: { sequence: link.sequence },
      create: {
        circuitId: circuit.id,
        placeId: place.id,
        sequence: link.sequence,
      },
    });
  }
  console.log("✅ Circuit-Place links created.");

  // ─── Place Features ───────────────────────────────────────────────────────

  const placeFeatures = [
    {
      placeSlug: "red-fort",
      features: [
        "Historical",
        "Architectural",
        "Photography",
        "Family Friendly",
      ],
    },
    {
      placeSlug: "jama-masjid",
      features: ["Spiritual", "Historical", "Architectural", "Photography"],
    },
    {
      placeSlug: "humayuns-tomb",
      features: [
        "Historical",
        "Architectural",
        "Photography",
        "Family Friendly",
      ],
    },
    {
      placeSlug: "qutb-minar",
      features: [
        "Historical",
        "Architectural",
        "Photography",
        "Family Friendly",
      ],
    },
    {
      placeSlug: "india-gate",
      features: ["Historical", "Photography", "Family Friendly", "Food Nearby"],
    },
    {
      placeSlug: "bangla-sahib-gurudwara",
      features: ["Spiritual", "Family Friendly", "Food Nearby"],
    },
    {
      placeSlug: "chandni-chowk",
      features: ["Food Nearby", "Shopping Nearby", "Historical", "Cultural"],
    },
    {
      placeSlug: "lotus-temple",
      features: [
        "Spiritual",
        "Architectural",
        "Photography",
        "Family Friendly",
      ],
    },
  ];

  for (const { placeSlug, features } of placeFeatures) {
    const place = places[placeSlug];
    if (!place) {
      continue;
    }
    // Remove existing features and recreate
    await prisma.placeFeature.deleteMany({ where: { placeId: place.id } });
    await prisma.placeFeature.createMany({
      data: features.map((f) =>
        typeof f === "string"
          ? { placeId: place.id, feature: f }
          : { placeId: place.id, feature: f.feature, description: f.description || null }
      ),
    });
  }
  console.log("✅ Place features created.");

  // ─── Itinerary ────────────────────────────────────────────────────────────

  const itinerary = await prisma.itinerary.upsert({
    where: { slug: "classic-delhi-2-days" },
    update: {},
    create: {
      title: "Classic Delhi in 2 Days",
      slug: "classic-delhi-2-days",
      description:
        "A carefully curated 2-day itinerary covering the essential highlights of Old and New Delhi — monuments, markets, spirituality, and culture.",
      duration: "2 days",
      isFeatured: true,
    },
  });
  console.log(`✅ Itinerary: ${itinerary.title}`);

  const itineraryStops = [
    {
      itineraryId: itinerary.id,
      placeId: places["red-fort"].id,
      day: 1,
      sequence: 1,
      estimatedDuration: "2 hours",
      notes: "Arrive early to avoid crowds.",
    },
    {
      itineraryId: itinerary.id,
      placeId: places["jama-masjid"].id,
      day: 1,
      sequence: 2,
      estimatedDuration: "1 hour",
      notes: "Walking distance from Red Fort.",
    },
    {
      itineraryId: itinerary.id,
      placeId: places["chandni-chowk"].id,
      day: 1,
      sequence: 3,
      estimatedDuration: "2 hours",
      notes: "Explore the spice market and try street food.",
    },
    {
      itineraryId: itinerary.id,
      placeId: places["humayuns-tomb"].id,
      day: 2,
      sequence: 1,
      estimatedDuration: "1.5 hours",
      notes: "Best visited in the morning light.",
    },
    {
      itineraryId: itinerary.id,
      placeId: places["india-gate"].id,
      day: 2,
      sequence: 2,
      estimatedDuration: "1 hour",
      notes: "Great for an evening visit.",
    },
    {
      itineraryId: itinerary.id,
      placeId: places["bangla-sahib-gurudwara"].id,
      day: 2,
      sequence: 3,
      estimatedDuration: "45 mins",
      notes: "Experience the langar (community meal).",
    },
  ];

  for (const stop of itineraryStops) {
    await prisma.itineraryStop.create({ data: stop }).catch(() => {
      // skip if already exists
    });
  }
  console.log("✅ Itinerary stops created.");

  // ─── Events ───────────────────────────────────────────────────────────────

  const eventsData = [
    {
      title: "Delhi International Arts Festival",
      slug: "delhi-international-arts-festival-2026",
      description:
        "An annual celebration of the performing and visual arts, featuring artists from across India and the world. Includes music, dance, theatre, and visual arts exhibitions.",
      startDate: new Date("2026-11-15"),
      endDate: new Date("2026-11-25"),
      venue: "India Habitat Centre",
      address: "Lodhi Road, New Delhi",
      category: "Arts & Culture",
      isFeatured: true,
    },
    {
      title: "Qutb Festival",
      slug: "qutb-festival-2026",
      description:
        "A classical music and dance festival held against the backdrop of the Qutb Minar complex. One of Delhi's most beloved cultural events.",
      startDate: new Date("2026-10-30"),
      endDate: new Date("2026-11-02"),
      venue: "Qutb Minar Complex",
      address: "Mehrauli, New Delhi",
      category: "Music & Dance",
      isFeatured: true,
    },
  ];

  for (const eventData of eventsData) {
    await prisma.event.upsert({
      where: { slug: eventData.slug },
      update: {},
      create: eventData,
    });
    console.log(`✅ Event: ${eventData.title}`);
  }

  // ─── Banners ─────────────────────────────────────────────────────────────

  const bannersData = [
    {
      title: "Experience Dilwalon Ki Dilli",
      subtitle:
        "Explore iconic monuments, heritage trails, and living traditions across Delhi",
      imageUrl:
        "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1600&q=80",
      linkUrl: "/circuits",
      displayOrder: 1,
      theme: "LIGHT",
      isActive: true,
    },
    {
      title: "Spiritual Sanctuaries of Delhi",
      subtitle:
        "Discover peace, architectural grandeur, and sacred harmony across timeless sites",
      imageUrl:
        "https://images.unsplash.com/photo-1597040663342-45b6af3d91a5?auto=format&fit=crop&w=1600&q=80",
      linkUrl: "/categories/spiritual-circuits",
      displayOrder: 2,
      theme: "LIGHT",
      isActive: true,
    },
    {
      title: "Culinary & Cultural Journeys",
      subtitle:
        "Savor legendary street foods and royal flavors from Chandni Chowk to Dilli Haat",
      imageUrl:
        "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1600&q=80",
      linkUrl: "/categories/food-culinary",
      displayOrder: 3,
      theme: "LIGHT",
      isActive: true,
    },
  ];

  for (const banner of bannersData) {
    const existing = await prisma.banner.findFirst({
      where: { title: banner.title },
    });
    if (!existing) {
      await prisma.banner.create({ data: banner });
      console.log(`✅ Banner: ${banner.title}`);
    }
  }

  // ─── Galleries ─────────────────────────────────────────────────────────────

  const galleriesData = [
    // Red Fort
    {
      entityType: "place",
      placeSlug: "red-fort",
      imageUrl:
        "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80",
      title: "Lahori Gate Entrance",
      altText: "Iconic red sandstone walls and Lahori Gate of Red Fort",
      displayOrder: 1,
    },
    {
      entityType: "place",
      placeSlug: "red-fort",
      imageUrl:
        "https://images.unsplash.com/photo-1592635196078-9fe3d54f2377?auto=format&fit=crop&w=1200&q=80",
      title: "Diwan-i-Aam (Hall of Public Audience)",
      altText: "Pillared marble hall Diwan-i-Aam inside Red Fort",
      displayOrder: 2,
    },
    {
      entityType: "place",
      placeSlug: "red-fort",
      imageUrl:
        "https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=1200&q=80",
      title: "Red Fort Ramparts and Minarets",
      altText: "Architectural detail of Red Fort ramparts",
      displayOrder: 3,
    },

    // Jama Masjid
    {
      entityType: "place",
      placeSlug: "jama-masjid",
      imageUrl:
        "https://images.unsplash.com/photo-1597040663342-45b6af3d91a5?auto=format&fit=crop&w=1200&q=80",
      title: "Courtyard & Central Dome",
      altText: "Expansive courtyard and marble domes of Jama Masjid",
      displayOrder: 1,
    },
    {
      entityType: "place",
      placeSlug: "jama-masjid",
      imageUrl:
        "https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=1200&q=80",
      title: "Minaret at Dusk",
      altText: "Minarets of Jama Masjid overlooking Old Delhi",
      displayOrder: 2,
    },
    {
      entityType: "place",
      placeSlug: "jama-masjid",
      imageUrl:
        "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=80",
      title: "Arched Sandstone Corridors",
      altText: "Grand sandstone arches along the courtyard perimeter",
      displayOrder: 3,
    },

    // Humayun's Tomb
    {
      entityType: "place",
      placeSlug: "humayuns-tomb",
      imageUrl:
        "https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=1200&q=80",
      title: "Garden Tomb Facade",
      altText: "Symmetrical front facade of Humayun's Tomb",
      displayOrder: 1,
    },
    {
      entityType: "place",
      placeSlug: "humayuns-tomb",
      imageUrl:
        "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80",
      title: "Persian Double Dome",
      altText: "Marble double dome set against the sky",
      displayOrder: 2,
    },
    {
      entityType: "place",
      placeSlug: "humayuns-tomb",
      imageUrl:
        "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80",
      title: "Charbagh Gardens & Water Channels",
      altText: "Geometric Mughal Charbagh garden setting",
      displayOrder: 3,
    },

    // Qutb Minar
    {
      entityType: "place",
      placeSlug: "qutb-minar",
      imageUrl:
        "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80",
      title: "73m Victory Minaret",
      altText: "Full view of the towering 12th century brick minaret",
      displayOrder: 1,
    },
    {
      entityType: "place",
      placeSlug: "qutb-minar",
      imageUrl:
        "https://images.unsplash.com/photo-1592635196078-9fe3d54f2377?auto=format&fit=crop&w=1200&q=80",
      title: "Quwwat-ul-Islam Mosque Complex",
      altText: "Carved stone colonnades and Iron Pillar courtyard",
      displayOrder: 2,
    },
    {
      entityType: "place",
      placeSlug: "qutb-minar",
      imageUrl:
        "https://images.unsplash.com/photo-1597040663342-45b6af3d91a5?auto=format&fit=crop&w=1200&q=80",
      title: "Alai Darwaza Gateway",
      altText: "Intricately carved sandstone and white marble gateway",
      displayOrder: 3,
    },

    // India Gate
    {
      entityType: "place",
      placeSlug: "india-gate",
      imageUrl:
        "https://images.unsplash.com/photo-1592635196078-9fe3d54f2377?auto=format&fit=crop&w=1200&q=80",
      title: "Memorial Archway",
      altText: "Full architectural view of India Gate memorial arch",
      displayOrder: 1,
    },
    {
      entityType: "place",
      placeSlug: "india-gate",
      imageUrl:
        "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80",
      title: "Kartavya Path Gardens",
      altText: "Lush boulevards and fountains surrounding India Gate",
      displayOrder: 2,
    },
    {
      entityType: "place",
      placeSlug: "india-gate",
      imageUrl:
        "https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=1200&q=80",
      title: "Evening Lights",
      altText: "India Gate illuminated in evening twilight",
      displayOrder: 3,
    },

    // Bangla Sahib Gurudwara
    {
      entityType: "place",
      placeSlug: "bangla-sahib-gurudwara",
      imageUrl:
        "https://images.unsplash.com/photo-1608958435020-e8a7109ba809?auto=format&fit=crop&w=1200&q=80",
      title: "Golden Dome & Sacred Sarovar",
      altText: "Golden dome reflected in the holy sarovar water",
      displayOrder: 1,
    },
    {
      entityType: "place",
      placeSlug: "bangla-sahib-gurudwara",
      imageUrl:
        "https://images.unsplash.com/photo-1597040663342-45b6af3d91a5?auto=format&fit=crop&w=1200&q=80",
      title: "Marble Parikrama",
      altText: "Serene marble walkway surrounding the main sanctuary",
      displayOrder: 2,
    },
    {
      entityType: "place",
      placeSlug: "bangla-sahib-gurudwara",
      imageUrl:
        "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80",
      title: "Night Illumination",
      altText: "Gurudwara Bangla Sahib glowing with devotional lights",
      displayOrder: 3,
    },

    // Chandni Chowk
    {
      entityType: "place",
      placeSlug: "chandni-chowk",
      imageUrl:
        "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=80",
      title: "Old Delhi Bazaar Streets",
      altText: "Bustling lanes and heritage facades of Chandni Chowk",
      displayOrder: 1,
    },
    {
      entityType: "place",
      placeSlug: "chandni-chowk",
      imageUrl:
        "https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=1200&q=80",
      title: "Khari Baoli Spice Market",
      altText: "Sacks of vibrant Indian spices in historic market",
      displayOrder: 2,
    },
    {
      entityType: "place",
      placeSlug: "chandni-chowk",
      imageUrl:
        "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80",
      title: "Heritage Pedestrian Boulevard",
      altText: "Red sandstone pedestrian walkway in Chandni Chowk",
      displayOrder: 3,
    },

    // Lotus Temple
    {
      entityType: "place",
      placeSlug: "lotus-temple",
      imageUrl:
        "https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=1200&q=80",
      title: "Marble Petal Architecture",
      altText: "White marble petal structures resembling a blooming lotus",
      displayOrder: 1,
    },
    {
      entityType: "place",
      placeSlug: "lotus-temple",
      imageUrl:
        "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80",
      title: "Surrounding Ponds & Gardens",
      altText: "Turquoise water ponds and landscaped flowerbeds",
      displayOrder: 2,
    },
    {
      entityType: "place",
      placeSlug: "lotus-temple",
      imageUrl:
        "https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=1200&q=80",
      title: "Lotus Temple Aerial Perspective",
      altText: "Full overhead view of the lotus petals and prayer grounds",
      displayOrder: 3,
    },
  ];

  await prisma.gallery.deleteMany({});
  for (const g of galleriesData) {
    const place = places[g.placeSlug];
    if (place) {
      await prisma.gallery.create({
        data: {
          entityType: "place",
          entityId: place.id,
          placeId: place.id,
          imageUrl: g.imageUrl,
          title: g.title,
          altText: g.altText,
          displayOrder: g.displayOrder,
        },
      });
    }
  }
  console.log("✅ Gallery images seeded successfully.");

  console.log("\n🎉 Database seeded successfully!");
  console.log("─────────────────────────────────");
  console.log("Admin login: admin@delhitourism.dev / Admin@123");
  console.log("─────────────────────────────────");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
