const prisma = require("./src/config/database");

async function main() {
  console.log("--- Updating Jama Masjid Features ---");
  const jamaFeatures = [
    {
      feature: "Complete history",
      description: `Commissioned in 1644 by the fifth Mughal Emperor Shah Jahan—the visionary patron behind the Taj Mahal and the Red Fort—the mosque was originally christened 'Masjid-i-Jahan-Numa' (meaning 'The Mosque Commanding a View of the World'). Shah Jahan envisioned it as the primary imperial congregational mosque for his new fortified capital, Shahjahanabad (now Old Delhi).

Construction commenced on 6 October 1650 and took six rigorous years to complete, being formally inaugurated on 23 July 1656 (corresponding to 10 Shawwal 1066 AH on the Islamic calendar). To inaugurate this magnificent monument, Shah Jahan sent an imperial invitation to Syed Abdul Ghafoor Shah Bukhari, a revered scholar and direct descendant of the Prophet from Bukhara (modern-day Uzbekistan), appointing him as the first hereditary 'Shahi Imam'.

Throughout its 370-year history, the mosque bore witness to pivotal moments in Indian history:
• 1857 Indian Uprising: Following the revolt, British colonial troops occupied the mosque, stationed soldiers in the courtyard, and actively considered demolishing it as retribution. Due to stiff resistance, it was spared and eventually returned to the Muslim community in 1862 under strict conditions.
• 1947 Partition of India: In October 1947, freedom fighter and India's first Education Minister Maulana Abul Kalam Azad stood atop the high pulpit of Jama Masjid and delivered an iconic speech that inspired and reassured millions of Indian Muslims to remain in secular India.
• Modern Era: Jama Masjid remains the spiritual heart of Old Delhi, hosting tens of thousands of worshippers during Eid prayers and Friday Jum'ah congregations.`,
    },
    {
      feature: "Construction details",
      description: `The grand construction of Jama Masjid was an extraordinary engineering and architectural feat of the 17th-century Mughal Empire:

• Elevation & Site: Built atop Bhojla Pahari, a natural red quartzite hillock located 500 meters west of the Red Fort. The mosque is elevated nearly 10 meters (30 feet) above street level on a massive stone plinth, making it visible across the historic walled city.
• Workforce & Supervision: Over 5,000 skilled stonecutters, masons, calligraphers, and laborers worked continuously for six years. The construction was overseen by Shah Jahan's Prime Minister (Wazir) Saadullah Khan and imperial superintendent Mullah Khalilullah.
• Construction Cost: The total cost incurred by the Mughal imperial treasury was approximately 1,000,000 (10 Lakh) silver rupees—an astronomical sum at the time.
• Materials: Premium deep-red sandstone quarried from Rupbas near Bharatpur, Rajasthan, coupled with immaculate white and black marble imported from Makrana for domes, arches, and ornamental inlays.
• Gates & Flights of Steps: The mosque is accessed by three colossal gateways approached by steep flights of red sandstone stairs:
  - Eastern Gate (Royal Gate): 35 wide stone steps, historically reserved exclusively for Emperor Shah Jahan and royal dignitaries.
  - Northern Gate: 39 steps leading towards the historic bazaar.
  - Southern Gate: 33 steps offering direct access towards the Urdu Bazaar and Chawri Bazar.
• Central Courtyard: Spanning over 9.5 acres (nearly 100 meters by 100 meters), the sandstone courtyard can accommodate over 25,000 worshippers simultaneously. In its center sits an open marble ablution reservoir (Hauz) measuring 15 x 11 meters with decorative fountains for ritual ablution (Wudu).`,
    },
    {
      feature: "Architectural style",
      description: `Jama Masjid represents the pinnacle of late Indo-Islamic Mughal architecture, celebrated for its monumental scale, pristine symmetry, and striking color contrast between ruby-red sandstone and white marble:

• Main Prayer Hall (Sanctuary): Measuring 61 meters long by 27 meters wide, the western facade features eleven grand cusped arches. The towering central archway (pishtaq) rises to an imposing height of 24 meters, framed by exquisite black and white marble arabesque carvings and Persian inscriptions set within white marble cartouches.
• The Three Domes: Crowned by three bulbous onion domes constructed of pure white marble inlaid with vertical black marble stripes. The central dome is the largest and highest, topped with gilded brass finials (kalash).
• The Twin Minarets: Two identical 40-meter-high (130-foot) minarets flank the prayer hall on the north and south. Constructed in five distinct tiers marked by projecting cantilevered balconies, each minaret features alternating vertical flutings of red sandstone and white marble. Inside, a tight 130-step spiral stone staircase leads to the topmost viewing balcony.
• Prayer Floor (Musalla): The interior floor is intricately paved in white and black marble marked out into 899 individual prayer spaces, each simulating an individual prayer rug measuring 3 feet by 1.5 feet.
• Mihrab & Minbar: The interior sanctuary features an exquisitely carved marble niche (mihrab) facing the holy city of Mecca, alongside an elevated pulpit (minbar) carved from a single solid block of marble, featuring four steps for the Imam to deliver sermons.`,
    },
    {
      feature: "Photography",
      description: `Jama Masjid is one of the most picturesque and photogenic heritage monuments in South Asia. Here are essential tips and guidelines for photography:

• Best Lighting & Timing:
  - Sunrise & Early Morning (7:00 AM – 9:00 AM): Soft golden light illuminates the east-facing red sandstone facade and white domes. Flocks of thousands of pigeons sweep across the open courtyard, creating dramatic motion captures.
  - Golden Hour (4:30 PM – Sunset): Dramatic silhouettes of the minarets and onion domes against Delhi's twilight sky, with warm reflections in the central marble ablution tank.
• Recommended Photo Spots:
  - Southern Minaret Climb: Climb the 130 narrow spiral steps of the southern minaret for an unmatched 360-degree panoramic view of Old Delhi's rooftops, winding alleyways, and the Red Fort.
  - Archway Frames: Stand beneath the colossal central pishtaq or side arches to frame the courtyard, minarets, and the Eastern Gate.
  - Water Reflections: Position low at the edge of the central marble pool (Hauz) for symmetric reflection shots of the main prayer hall domes.
• Rules, Fees & Etiquette:
  - Camera/Mobile Fee: A nominal photography fee (usually ₹300) is charged at the gates for cameras/video devices.
  - Drone photography is strictly prohibited by security and local police regulations.
  - Modest dress is mandatory: Arms, shoulders, and legs must be fully covered. Robes and lungis are provided for visitors at the entry gates.
  - Shoes must be removed before stepping onto the stone courtyard.
  - During prayer times (Namaz), non-Muslim tourists are requested to refrain from walking directly in front of worshippers or taking intrusive close-up photos.`,
    },
    {
      feature: "Interesting facts",
      description: `Fascinating historical facts about Delhi's Jama Masjid:

1. Ancient Sacred Relics: In the north-eastern gatehouse cabinet, the mosque preserves sacred Islamic relics of immense religious significance, including:
   - A rare manuscript of the Holy Qur'an handwritten on deer parchment (attributed to Caliph Ali).
   - A red hair from the beard of Prophet Muhammad preserved in a glass cylinder.
   - His sacred footprint (Qadam Sharif) cast in a block of marble.
   - The sandals worn by the Prophet.
2. 899 Inlaid Prayer Rugs: The floor of the main prayer hall is meticulously laid with white marble tiles bordered with black marble strips, creating exactly 899 individual prayer spaces (musalla).
3. The Longest Continuing Shahi Imam Lineage: For over 370 years across 14 generations, the leadership of Jama Masjid has remained with the direct descendants of Syed Abdul Ghafoor Shah Bukhari, who was appointed by Shah Jahan in 1656.
4. Earthquake Survival: In 1803 and 1956, moderate earthquakes shook Delhi, damaging parts of the southern minaret's cupola, which were subsequently restored while maintaining original Mughal craftsmanship.
5. Pigeons of the Courtyard: Tens of thousands of feral pigeons call the mosque their home. Grain is scattered daily by pilgrims in the courtyard as an act of charity (Sadaqah).`,
    },
    {
      feature: "Famous personalities",
      description: `Historic figures whose legacies are forever intertwined with Jama Masjid:

• Emperor Shah Jahan (1592–1666): The legendary Mughal Emperor whose passion for architecture gave birth to the mosque, financing its construction from imperial coffers.
• Syed Abdul Ghafoor Shah Bukhari: The first Shahi Imam of Jama Masjid, specially invited by Shah Jahan from the scholarly city of Bukhara (Uzbekistan) to inaugurate the shrine.
• Wazir Saadullah Khan (1591–1655): The Grand Vizier of the Mughal Empire who supervised the finances, logistics, and construction of both the Red Fort and Jama Masjid.
• Ustad Khalil & Mullah Khalilullah: The master architects who designed the complex structural blueprint combining red sandstone with interlocking marble arches.
• Maulana Abul Kalam Azad (1888–1958): Visionary Indian independence leader, scholar, and India's first Minister of Education, who delivered his historic 1947 post-partition address from the steps of Jama Masjid.
• Samuel Bourne & Felix Beato: Renowned 19th-century pioneer photographers who captured early albumen prints of the mosque after the 1857 war, which now reside in national archives and the British Library.`,
    },
  ];

  // Update Jama Masjid (placeId: 2)
  await prisma.placeFeature.deleteMany({ where: { placeId: 2 } });
  for (const f of jamaFeatures) {
    await prisma.placeFeature.create({
      data: {
        placeId: 2,
        feature: f.feature,
        description: f.description,
      },
    });
  }
  console.log(
    "✅ Jama Masjid features updated with complete detailed content.",
  );

  console.log("--- Updating Bangla Sahib Gurudwara Features ---");
  const banglaFeatures = [
    {
      feature: "Complete history",
      description: `Gurudwara Bangla Sahib is one of the most venerated and historically monumental Sikh shrines in Delhi, closely associated with the eighth Sikh Guru, Guru Har Krishan Sahib Ji:

• Origins as Jaisinghpura Palace: In the 17th century, the site was not a gurudwara, but a sprawling royal mansion and summer bungalow (called a 'bangla') belonging to Mirza Raja Jai Singh I of Amber (Jaipur), commander of Mughal forces under Emperor Aurangzeb.
• Guru Har Krishan's Visit (1664): In 1664, Guru Har Krishan Ji—revered as 'Bal Guru' (the Child Guru) who ascended the spiritual throne of Sikhism at the tender age of five—arrived in Delhi upon being summoned by Mughal Emperor Aurangzeb amidst religious court disputes. Raja Jai Singh respectfully hosted the young 8-year-old Guru at his palace.
• The Epidemic of Smallpox & Cholera: During the Guru's stay, Delhi was struck by a devastating and deadly epidemic of smallpox and cholera that claimed thousands of lives. Moved by immense compassion, the young Guru moved freely among the suffering population, distributing food, medicine, and water drawn from the freshwater well located in Raja Jai Singh's courtyard.
• The Miraculous Healing: According to tradition, people who drank and bathed in the blessed well water recovered from the deadly pestilence. However, while tirelessly nursing the sick day and night, the young Guru contracted smallpox himself. On 30 March 1664, at the age of just seven years and eight months, Guru Har Krishan Ji passed away (attained Joti Jot), leaving his famous final instruction 'Baba Bakale'—identifying the 9th Guru, Guru Tegh Bahadur, residing at the village of Bakala.
• Construction of the Memorial: To honor the Guru's supreme sacrifice, Raja Jai Singh converted the bungalow into a permanent memorial shrine and built a stone pond (Sarovar) over the sacred well.
• 1783 Rebuilding by General Baghel Singh: When Sikh general Sardar Baghel Singh entered Delhi in 1783, he traced the holy site and erected a formal Gurudwara structure. The grand marble complex seen today underwent major expansion during the 20th century under the Delhi Sikh Gurdwara Management Committee (DSGMC).`,
    },
    {
      feature: "Construction & Architecture details",
      description: `Gurudwara Bangla Sahib stands as a triumph of modern Sikh architecture, blending graceful traditional features with grand neoclassical white marble pavilions:

• The Golden Domes: The exterior is dominated by its resplendent central bulbous onion dome, completely gilded in pure 24-karat gold leaf, which glows brilliantly under both sunlight and night floodlights. Smaller gilded chatris (cupolas) accent the corners of the roofline.
• Pristine White Marble: The entire complex is constructed with gleaming white Makrana marble, adorned with intricate floral inlays (pietra dura), marble jali screens, and fluted columns.
• Nishan Sahib: Rising over 100 feet beside the main building is the sacred Sikh flagpole, draped in saffron fabric and surmounted by the Khanda (double-edged sword insignia).
• Main Diwan Hall (Sanctuary): A vast, air-conditioned hall covered with plush Persian carpets where the eternal living Guru, Sri Guru Granth Sahib Ji, is enthroned on a magnificent gilded gold and silver palanquin (Palki Sahib) under a royal canopy (Chanani). Devotional Gurbani hymns (Kirtan) are sung continuously by Ragis 24 hours a day.
• Additional Facilities: The sprawling campus includes an underground multi-level automated car parking, a secondary school, a modern diagnostic hospital, the Baba Baghel Singh Sikh Heritage Museum, a massive library of Sikh literature, and a Yatri Niwas (pilgrim guesthouse).`,
    },
    {
      feature: "Sacred Sarovar & Healing Waters",
      description: `The sacred water tank (Sarovar) of Bangla Sahib is celebrated worldwide as a sanctuary of spiritual peace and physical restoration:

• Origins of the Well: The Sarovar was built around the exact 17th-century freshwater well from which Guru Har Krishan Ji drew water to treat smallpox victims in 1664.
• Dimensions & Design: Measuring 225 feet by 235 feet, the rectangular water reservoir is framed by wide white marble colonnaded walkways (parikrama). Devotees perform circumambulation around the pool in prayer.
• Sacred Amrit: Devotees reverently refer to the tank water as 'Amrit' (holy nectar). Pilgrims take holy dips in the designated bathing ghats and collect the water in bottles from the dedicated 'Amrit Kund' distribution counter to take home for ailing friends and family.
• Aquatic Life: The crystal-clear waters of the Sarovar are home to hundreds of graceful, colorful koi and freshwater carp fish, which swim near the steps and are cared for by the gurudwara authorities.`,
    },
    {
      feature: "Community Kitchen (Langar Seva)",
      description: `The Langar at Bangla Sahib represents one of the largest and most inspiring humanitarian community kitchens on Earth:

• Egalitarian Philosophy: Established by Guru Nanak Dev Ji, the Langar embodies the bedrock Sikh principles of equality (Pangat), selfless service (Seva), and community sharing (Vand Chhako). Rich or poor, prince or pauper—every visitor sits together on the floor in long rows and partakes in the exact same simple, delicious vegetarian meal.
• Scale of Service:
  - 25,000 to 50,000+ free hot meals are prepared and served every single day, expanding to over 100,000 on gurpurabs and holidays.
  - The mega kitchen operates virtually non-stop, using giant copper and brass cauldrons (deg) that cook hundreds of kilograms of dal and kheer in single batches.
  - Modern automated roti-making machines roll, bake, and puff up to 4,000 fresh chapatis every hour.
• The Spirit of Seva: The kitchen and dining halls are maintained largely by dedicated volunteers (Sewadars) who chop mountains of vegetables, knead flour, serve food, and wash thousands of stainless-steel plates with smiles and devotional chanting.`,
    },
    {
      feature: "Photography & Visitor Guidelines",
      description: `Essential guidelines for visitors and photographers to Gurudwara Bangla Sahib:

• Universal Welcome & Timings: Open 24 hours a day, 365 days a year. People of all religions, ethnicities, and walks of life are warmly welcomed without distinction. Entry is completely free.
• Visitor Etiquette & Protocol:
  - Footwear: Shoes and socks must be deposited at the free footwear counter (Joda Ghar).
  - Foot Washing: Before entering, visitors must walk through shallow pools of running water to cleanse their feet.
  - Head Covering: Heads must remain covered at all times inside the premises. Triangular saffron and orange scarves (rumals) are provided free of charge in bins at the entry gates.
  - Tobacco, alcohol, and intoxicating substances are strictly prohibited.
• Photography Rules:
  - Inside Diwan Hall: Photography and videography are strictly forbidden inside the main sanctum to protect the sanctity and focus of devotees.
  - Outer Courtyard & Sarovar: Exterior photography is fully permitted and encouraged.
  - Best Time for Photos: Golden hour at sunset and late evening. At night, the illuminated golden dome reflects magnificently against the calm dark waters of the Sarovar, creating breathtaking photographic compositions.`,
    },
    {
      feature: "Interesting facts",
      description: `Remarkable facts about Gurudwara Bangla Sahib:

1. World's Most Affordable Diagnostic Centre: In 2021, the DSGMC established the Guru Harkrishan Diagnostic Centre on the premises, offering MRI and CT scans for just ₹50 to BPL patients (and heavily subsidized for others), equipped with cutting-edge 1.5 Tesla MRI machines.
2. 24/7 Gurbani Live Broadcast: The serene hymns sung in the sanctum are broadcast live worldwide across television networks and digital streaming platforms.
3. COVID-19 Food Relief: During the pandemic lockdowns in 2020-2021, Bangla Sahib prepared and distributed over 100,000 fresh hot food packets daily across Delhi hospitals, migrant clusters, and containment zones, earning global praise.
4. Museum of Sikh History: The basement houses the Baba Baghel Singh Sikh Heritage Museum, featuring life-size paintings, authentic relics, and multimedia exhibits narrating the lives of the Ten Gurus and Sikh generals.
5. Location Landmark: Positioned right at the roundabout connecting Baba Kharak Singh Marg and Ashoka Road, just 400 meters from Connaught Place and neighboring Raja Sawai Jai Singh's astronomical observatory, Jantar Mantar.`,
    },
    {
      feature: "Famous personalities",
      description: `Prominent historical figures connected to the legacy of Bangla Sahib:

• Guru Har Krishan Sahib Ji (1656–1664): The 8th Sikh Guru, remembered in daily Sikh Ardas as 'Sri Har Krishan Dhiyaiye Jis Dithe Sabh Dukh Jaye' ('Contemplate Guru Har Krishan, by whose sight all suffering vanishes'). His selfless sacrifice in healing Delhi's sick immortalized this sacred ground.
• Mirza Raja Jai Singh I of Amber (1611–1667): The Rajput king and senior Mughal commander who held high regard for the Sikh Gurus, hosted Guru Har Krishan in his private mansion, and dedicated the land as a perpetual sanctuary.
• Sardar Baghel Singh (1730–1802): The legendary leader of the Karor Singhia Misl who led the Sikh army into Delhi in 1783, established peace terms with the Mughal Emperor, and identified and constructed shrines at Bangla Sahib, Sis Ganj Sahib, Rakab Ganj Sahib, and Majnu Ka Tilla.
• Maharaja Ranjit Singh & Sikh Nobility: Who later patronized the gurudwara's upkeep and provided endowments in the 19th century.`,
    },
  ];

  // Update Bangla Sahib Gurudwara (placeId: 6)
  await prisma.placeFeature.deleteMany({ where: { placeId: 6 } });
  for (const f of banglaFeatures) {
    await prisma.placeFeature.create({
      data: {
        placeId: 6,
        feature: f.feature,
        description: f.description,
      },
    });
  }
  console.log(
    "Bangla Sahib Gurudwara features updated with complete detailed content.",
  );
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
