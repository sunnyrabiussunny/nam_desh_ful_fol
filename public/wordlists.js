// ═══════════════════════════════════════════════════════════════════
//  NCFF BATTLE — Word Validation Lists
//  Bangla + English names, all spelling variants included
//  normalizeAnswer() is used for all lookups (fuzzy match)
// ═══════════════════════════════════════════════════════════════════

const WORD_LISTS = {

// ─── PERSON NAMES ───────────────────────────────────────────────
person: `Aabid Aabida Aadil Aadila Aamir Aamira Aarif Aarifa Aasim Aasima
Abanta Abar Abid Abida Abir Abira Abraham Adam Adib Adiba Adil Adila
Aditi Adnan Adrita Afrin Afroz Afsana Afsara Afsar Aftab Ahmad Ahmed
Aiman Ainun Aisha Aishe Ajit Akbar Akhi Akhtar Akib Akil Aklima Akram
Aktar Alam Alamin Alex Alice Alif Alim Alima Alina Aliya Aliyah Almas
Alok Altaf Alvin Amena Amina Aminah Aminul Amir Amira Amjad Amran
Amreen Amy Ana Anam Anamika Anamul Anika Anis Anisa Anisur Anjali
Anjum Ankan Anna Annar Annesha Anowar Anowara Antar Anthony Antora
Anupam Anurag Anwar Anwara Aparajita Aporajita Aparajit Aparajitha
Aporajitha Aparna Aporna Apporna Apurba Apurbo Aqib Arabi Arafat Arfa
Arif Arifa Arifin Arifur Ariful Arina Arjun Arnab Arnob Arpita Arfan
Arhan Ariana Armin Arnav Arpon Arshad Arshi Aruna Arup Asad Asadur
Asaduzzaman Asfia Ashik Ashika Ashique Ashraf Ashrafi Ashraful Asif
Asifa Asim Asima Asit Asma Asmaul Asraful Ataur Atia Atif Atika Atikur
Atiqur Avijit Avro Awlad Ayaan Ayesha Aysha Azad Azadul Azhar Azim
Azima Aziz Aziza Azizul Azizur Azmain Azmeri
Bablu Babor Babul Badal Bader Badhon Badrunnesa Bahar Baharul Baki
Bakul Barsha Barkat Bashar Bashir Bashira Basudev Benjamin Bibek
Bichitra Bijoy Bikash Bikram Bilal Bina Biplab Bipon Bipul Bishwajit
Bivas Bob Bobby Borsha Brishti Bruce
Champa Chandana Chandan Chanchal Charles Charlotte Chinmoy Christina
Christopher Cynthia
Daisy Danish Daud David Deepa Deepak Dewan Diana Dilnoza Dilruba Dipak
Dipu Disha Dolly Dulal Durjoy Dalia Daliya
Elena Emran Emrana Emma Enamul Enam Eshita Ethan Eva
Fahad Faham Fahim Fahima Fahmida Faisal Faria Farhan Farhana Farida
Faridun Farjana Faruk Farukh Farzana Farzin Fatema Fatima Fatin
Fatinah Fayzur Felix Feroza Foysal Fuad
Galib Gautam George Gias Giasuddin Grace Gulshan Gulnaz Gulzar Guri
Gourango
Habib Habiba Habibul Habibur Hafij Hafiza Hafizur Hakim Hamid Hamida
Hamidur Hanif Hanifa Hannah Hasan Hasanul Hasib Hasiba Hasibul Hasibur
Hasina Hasnain Helal Hena Henry Hira Hirok Hossain Hridoy Humaira
Humayun Husnara
Ibrahim Ifat Iffat Ifrad Iftekhar Iftekharur Ikbal Ikram Ila Ilias
Imon Imran Imrana Indira Iqbal Irfan Irfana Ismail Israt Ivan
Jabbar Jahangir Jahanara Jahid Jahida Jamal Jamil Jamila Jannat Jasim
Jasmine Jayed Jennifer Jessica Jibon Jisan Jishu John Jonathan Jonayed
Joseph Julie Juliet Junaed Junaid Justin
Kabir Kabira Kamal Kamala Kamrul Kamruzzaman Kaniz Karim Karima
Karishma Karnab Kartik Kate Kevin Khalid Khalida Khandaker Khurshid
Kiran Kohinoor Komal Kona Krishno Kumar Kumkum Kulsum
Laboni Labonno Laila Layla Likhon Lila Lily Lina Linda Lisa Liton Liza
Lovely Lucy Lutfar Lutfun Lutfor
Mahbub Mahbuba Mahbubul Mahbubur Mahfuz Mahfuza Mahfuzur Mahi Mahia
Mahim Mahira Mahjabeen Mahmud Mahmudul Mahrin Mamun Mamuna Manik Mannan
Mannanul Manzur Maria Mariam Marium Maruf Marufa Marufur Masud Masuda
Masudur Masuma Masum Mehdi Mehjabin Mehnaz Mehrab Mehreen Mehtab Meraj
Michael Mim Mina Minara Miraj Miru Mishu Mita Mitu Mizan Mizanur
Mobarok Mobarak Mohammad Mohammed Mohiuddin Mohua Moina Moin Moinul
Moinur Momtaz Monir Monira Moniruzzaman Monisha Monwar Moriam Mosaddek
Mosarraf Mosharaf Moshiur Mrinmoy Mubin Mujib Mukta Mumtaz Muna Munia
Munna Murad Musa Musaddiq Musarrat Musfiqa Mushfiq Mushfiqur Muslim
Mustak Mustafa Mustafizur Mustaqim Mymuna
Nabil Nabila Nadia Nadir Nafis Nafisa Nahid Nahida Naila Naim Naima
Naimul Naimur Najib Najma Naomi Nasim Nasima Nasir Nasira Nasrin
Nasrullah Natasha Nazim Nazima Nazimuddin Nazma Nazmul Nazmun Nazneen
Nazrul Nicholas Nicole Nila Niloy Nipa Nisha Nishad Nitu Noah Noman
Nomana Noor Noora Nur Nura Nurul Nurunnabi Nurunnesa Nusrat Nuzhat
Omar Orchi Ornob Oscar Osman Owais
Pabon Palash Panna Papon Parboti Parna Partha Parveen Parvez Parvin
Patrick Paul Pinky Polash Popy Pranto Priya Priyanko Pritam Priti
Priyanka Prodip Prokash Pronab Protik
Qasim Quader Quazi
Rafi Rafia Rafiq Rafiqul Rafiqur Rahel Rahim Rahima Rahimul Rahimur
Rahman Rahnuma Raju Rajib Rajiv Raka Rakib Rakibul Rakibur Ramim Rana
Rashed Rasheda Rashedur Rashid Rashida Ratna Rebecca Rehan Rezaul Rina
Rinku Ripa Ripon Ritu Riva Riyadh Robert Robin Rohit Roma Ronno Rony
Rosa Rotna Rubel Rubina Rumel Rumon Rupak Rupa Ryan
Sabbir Sabina Sabir Sadaf Sadat Saddam Sadekur Sadia Sadman Sadrul
Sahana Sahin Sajal Sajib Sakib Sakibul Sakibur Salam Saleha Saleh
Salim Salima Salma Salman Samin Samira Samir Samiul Samiur Samun
Sanjana Sanjida Sanjoy Sara Sarah Sarin Sarwar Sattar Shafiq Shafiqul
Shafiqur Shah Shahadot Shaheen Shahin Shahina Shahjalal Shahnaz Shakib
Shakila Shakil Shakur Shalini Shamim Shamima Sharif Sharifa Sharifur
Shawkat Shihab Shila Shirin Shoma Shopon Shoriful Shuvo Siham Sima
Sirajul Sirajum Sneha Sohan Sohana Sohel Solaiman Soma Sonu Sophie
Subarna Subir Suha Sujan Sumaiya Sumon Sumi Sumit Sumona Sunny Susan
Suvro Swapna Sweety
Tabassum Tahmid Tahmina Tamanna Tanim Tanvir Tanvira Tanzia Tara
Taskin Tasnim Tasmia Tawhid Tazim Tomal Touhid Toukir Trishna Trisha
Turjo Tushar
Ulfat Ullah Umar Umme Urmi Usha Usman
Vibha Victor Vikram Vivek
Wadud Wahab Wahid Wahida William
Yasin Yusuf Yasmin Yasmine Yeasin Yeasmin
Zafar Zahid Zahida Zahir Zahra Zaid Zaira Zaman Zamanul Zannat Zara
Zarin Zebun Zobair Zubair Zubaida Zunaid`.split(/\s+/).filter(Boolean),

// ─── COUNTRIES ──────────────────────────────────────────────────
country: `Afghanistan Albania Algeria Andorra Angola Argentina Armenia
Australia Austria Azerbaijan Afganistan Albenia Aljeria Anjentina
Arminia Ostrelia Ostria Bahamas Bahrain Bangladesh Barbados Belarus
Belgium Belize Benin Bhutan Bolivia Bosnia Botswana Brazil Brunei
Bulgaria Burkina Burundi Bangaldesh Banglades Belzium Braazil Brazill
Cambodia Cameroon Canada Chad Chile China Colombia Comoros Congo
Croatia Cuba Cyprus Czechia Denmark Djibouti Dominica Dinamark Ecuador
Egypt Eritrea Estonia Ethiopia Equador Ijypt Fiji Finland France
Finlan Fraance Frans Gabon Gambia Georgia Germany Ghana Greece Grenada
Guatemala Guinea Guyana Jermany Jarmany Germani Gorgia Greec Greese
Haiti Honduras Hungary Haity Hungari Hungery Iceland India Indonesia
Iran Iraq Ireland Israel Italy Aindia Indiya Indoneshia Eran Irak
Airland Isreal Israyel Itali Itly Jamaica Japan Jordan Jamaika Japon
Jaban Jordon Kazakhstan Kenya Kiribati Kosovo Kuwait Kyrgyzstan
Kazakstan Kenia Kuweit Kuwayt Laos Latvia Lebanon Lesotho Liberia
Libya Liechtenstein Lithuania Luxembourg Lebanan Libia Lybia Madagascar
Malawi Malaysia Maldives Mali Malta Mauritania Mauritius Mexico Moldova
Monaco Mongolia Montenegro Morocco Mozambique Myanmar Maldiv Maldibs
Meksiko Mehico Mongalia Morokko Morroco Birma Myanmer Namibia Nauru
Nepal Netherlands Nicaragua Niger Nigeria Norway Nepaal Holland
Natherlands Newzealand New Zealand NewZealand Nijeria Nijiria Norwe Norwey Oman Pakistan
Palau Palestine Panama Paraguay Peru Philippines Poland Portugal
Pakestan Pakiston Palestin Panema Filipines Phillipines Philipines Filipines Filipinos
Polaand Portugel Qatar Quatar Katar Romania Russia Rwanda Rumania
Rusia Rusiya Roosia Samoa Senegal Serbia Seychelles Singapore Slovakia
Slovenia Somalia Sweden Switzerland Syria Saodi Arabia Sowdi Arabia
Saudi Arabia SaudiArabia Singapur Singapure Srilanka SriLanka Sree Lanka Sri Lanka SriLanka Sudan
Suriname Sweeden Sweedan Swizerland Switzeland Siria Siriya Tajikistan
Tanzania Thailand Togo Tonga Tunisia Turkey Turkmenistan Tailand
Thiland Thyland Tunisiya Turki Turkiye Torkey Uganda Ukraine UAE UK
USA America Ukrain Venezuela Vietnam Wales Yemen Yemeen Yaman Zambia
Zimbabwe BosniaandHerzegovina BurkinaFaso SouthKorea SouthAfrica NorthKorea NorthMacedonia UnitedStates UnitedKingdom UnitedArabEmirates CostaRica NewZealand SaudiArabia SriLanka PapuaNewGuinea DominicanRepublic ElSalvador BosniaHerzegovina CentralAfricanRepublic EquatorialGuinea MarshallIslands EastTimor CaboVerde TimorLeste BurkinaFaso SierraLeone IvoryCoast TrinidadTobago SanMarino SaintLucia Spain Espain Espana`.split(/\s+/).filter(Boolean),

// ─── FLOWERS ────────────────────────────────────────────────────
flower: `Acacia Agapanthus Ageratum Allamanda Allium Aloe Alstroemeria
Amaranth Amaryllis Amarbel Anemone Anthurium Aparajita Aporajita
Aparajitha Aporajitha Aquilegia Aster Astilbe Azalea Azelia Azaelia
Begonia Beli Belly Bellflower Bokul Bocul Bokol Bougainvillea
Bougainvillia Bouganvillea Buddleia Buttercup Cactus Camellia Chamomile
Carnation Catmint Celosia Chrysanthemum Clematis Clover Columbine
Coreopsis Cornflower Cosmos Crocus Cyclamen Daffodil Dahlia Daisy
Delphinium Dianthus Digitalis Dopaati Dopatee Duranta Echinacea
Elderflower Euphorbia Forsythia Foxglove Freesia Fuchsia Gardenia
Gazania Geranium Gerbera Gladiolus Gloxinia Golap Golaap Goldenrod
Hasnahena Hasnuhena Heather Heliconia Heliotrope Hibiscus Hollyhock
Honeysuckle Hyacinth Hydrangea Impatiens Iris Jasmine Jasmyn Jessamine
Joba Jonquil Kalanchoe Kaner Kanar Lantana Larkspur Lavender Lavendur
Lilac Lily Lisianthus Lobelia Lotus Lote Magnolia Marigold Maryigold
Merigold Marygold Mimosa Morning Glory Myosotis Narcissus Nasturtium
Nayantara Noyontara Noyantara Nerium Nigella Oleander Orchid Orquid
Orkid Palash Polash Palas Pansy Peony Periwinkle Petunia Petuniya
Phlox Plumeria Poppy Portulaca Primrose Ranunculus Rhododendron Rose
Roze Roz Saffron Salvia Shefali Shephali Seuli Shiuli Shioli
Snapdragon Snowdrop Statice Sunflower Sweet Pea Tagar Tigridia Tulip
Ursinia Verbena Veronica Violet Viola Wallflower Wisteria Wistaria
Xeranthemum Yarrow Zinnia Zinia Zephyranthes MorningGlory Bird of Paradise Queen Anne Lace Sweet William Forget Me Not Baby Breath Black Eyed Susan Bleeding Heart Crown Flower Cactus Flower`.split(/\s+/).filter(Boolean),

// ─── FRUITS ─────────────────────────────────────────────────────
fruit: `Aam Am Aaam Acai Acerola Ackee Ambarella Amla Amloki Amra Amro
Ananas Apple Apricot Aprikot Avocado Awla Banana Bananna Bel Berry
Blackberry Blackcurrant Blueberry Breadfruit Cantaloupe Carambola
Cherry Citron Clementine Coconut Custard Apple Damson Date Dates
Dragon Fruit Dragonfruit Durian Duku Elderberry Fig Feijoa Grape Grapes
Grapefruit Guava Peyara Payara Peyaara Golden Apple Gooseberry Honeydew
Hog Plum Ilama Jackfruit Kathal Katol Jambul Jamun Jujube Kiwi
Kiwifruit Kumquat Kamranga Kamrangaa Lemon Limon Lebu Leboo Lime
Lychee Litchi Lichi Lichu Longan Loquat Langsat Mango Mangu Mangoo
Mangosteen Melon Melan Mulberry Muskmelon Nectarine Orange Kamala
Komola Papaya Papaia Pepe Pepey Papita Passion Fruit Peach Pear
Pineapple Plum Alubokara Pomegranate Dalim Daleem Pomelo Batabi Quince
Rambutan Raspberry Redcurrant Sapodilla Safeda Sapota Starfruit
Strawberry Sugar Apple Sweetsop Tamarind Tetul Tetool Tangerine
Ugli Fruit Watermelon Tarbuz Tormuj Walnut Yuzu Zucchini`.split(/\s+/).filter(Boolean),
};

// ─── Validation function ──────────────────────────────────────────
// normalizeAnswer must already be defined (from game.html)
// Returns true if answer is in the word list for the category
window.WORD_LISTS = WORD_LISTS;

window.isValidAnswer = function(answer, categoryId, letter) {
  if (!answer || answer.trim().length < 2) return false;
  const norm = normalizeAnswer(answer);

  // Must start with the round letter
  if (!norm.startsWith(letter.toLowerCase())) return false;

  // Map category id to list key
  // Default categories: person, country, flower, fruit
  // Custom categories: always allow (no list to check against)
  const listKey = categoryId === 'person'  ? 'person'  :
                  categoryId === 'country' ? 'country' :
                  categoryId === 'flower'  ? 'flower'  :
                  categoryId === 'fruit'   ? 'fruit'   : null;

  if (!listKey) return true; // custom category — no validation

  const list = WORD_LISTS[listKey];
  // Also try matching with spaces removed (handles "Sri Lanka" → "srilanka")
  return list.some(w => {
    const wn = normalizeAnswer(w);
    return wn === norm || wn === norm.replace(/\s+/g,'') || wn.replace(/\s+/g,'') === norm.replace(/\s+/g,'');
  });
};

console.log('[WordLists] Loaded —',
  Object.entries(WORD_LISTS).map(([k,v]) => `${k}:${v.length}`).join(' '));
