// All restaurant content lives here. Change the name, phone, address, menu and events in this one file.
export const SITE = {
  name: "Ember & Oak",
  full: "Ember & Oak Steakhouse",
  tagline: "A premium and authentic steakhouse",
  phone: "+92 300 1234567",
  whatsapp: "923001234567", // international format, no + or spaces
  email: "table@emberandoak.pk",
  address: "18-B, MM Alam Road, Gulberg III, Lahore",
  mapQuery: "MM Alam Road, Gulberg III, Lahore",
  since: 2016,
  hours: [
    ["Monday to Thursday", "12:30 pm to 11:30 pm"],
    ["Friday", "2:00 pm to 12:00 am"],
    ["Saturday and Sunday", "12:30 pm to 12:00 am"],
  ],
  // reservation slots shown on the booking form
  slots: ["13:00", "13:30", "14:00", "14:30", "15:00", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30"],
  areas: ["Main dining hall", "Grill counter", "Terrace", "Private room"],
  tablesPerSlot: 6, // how many bookings one time slot can take before it shows as full
};

const I = (n) => `assets/img/${n}.webp`;

export const CATEGORIES = [
  { slug: "starters", name: "Starters", script: "Appetizer", img: I("tartare"), line: "Small plates to open the table while the grill warms up." },
  { slug: "steaks", name: "Steaks from the grill", script: "Main Course", img: I("tomahawk"), line: "Grass-fed and grain-finished beef, aged in house and cooked over charcoal and oak." },
  { slug: "grill", name: "From the grill", script: "Char & Smoke", img: I("skewers"), line: "Lamb, chicken and fish from the same fire, for the table that wants a little of everything." },
  { slug: "sides", name: "Sides & salads", script: "Side Dish", img: I("salad-dark"), line: "Fresh, sharp and buttery sides to sit next to your steak." },
  { slug: "desserts", name: "Desserts", script: "Dessert", img: I("lava-cake"), line: "Finish your evening with something warm, something cold, or both." },
  { slug: "drinks", name: "Drinks", script: "Bar", img: I("mocktail"), line: "Signature mocktails, fresh juices and slow coffee." },
];

// Every dish has its own page: dish.html?d=<slug>
export const DISHES = [
  // starters
  { slug: "beef-tartare", cat: "starters", name: "Hand-cut beef tartare", price: 2450, img: I("tartare"), line: "Tenderloin, capers, shallot, cured yolk, toasted sourdough.", story: "We cut the tenderloin by hand minutes before it reaches you, so it keeps its texture. Dressed lightly with Dijon, capers and shallot, and finished with a yolk cured for two days in salt and sugar.", tags: ["Chef's pick"], weight: "120 g", pair: "Smoked lemonade" },
  { slug: "bruschetta", cat: "starters", name: "Tomato & basil bruschetta", price: 1350, img: I("bruschetta"), line: "Grilled sourdough, vine tomatoes, basil, aged balsamic.", story: "Thick slices of our sourdough are charred over the grill, rubbed with garlic and topped with chopped vine tomatoes, torn basil and a few drops of twelve-year balsamic.", tags: ["Vegetarian"], weight: "4 pieces", pair: "Basil & lime cooler" },
  { slug: "steak-bites", cat: "starters", name: "Peppercorn steak bites", price: 2150, img: I("steak-veg"), line: "Seared sirloin, roasted peppers, rosemary, pan juices.", story: "Bite-sized sirloin, seared hard in a cast-iron pan with roasted peppers and onions, then basted with rosemary butter. Made to share while you decide on the main event.", tags: ["Sharing"], weight: "220 g", pair: "Pomegranate fizz" },

  // steaks
  { slug: "tomahawk", cat: "steaks", name: "Tomahawk for two", price: 14500, img: I("tomahawk"), line: "1.2 kg bone-in ribeye, 28-day dry aged, carved at the table.", story: "Our showpiece. A long-bone ribeye dry-aged for 28 days in our glass ageing room, cooked slowly over oak and finished on the hottest part of the grill. Carved at your table and served with two sides and two sauces.", tags: ["For two", "Dry aged"], weight: "1.2 kg", pair: "Smoked lemonade" },
  { slug: "ribeye", cat: "steaks", name: "Ribeye", price: 7950, img: I("sliced-steak"), line: "350 g, rich marbling, cooked over charcoal, garlic and herb butter.", story: "The steak lovers' steak. Ribeye has the most marbling of any cut, which melts as it cooks and keeps the meat juicy and full of flavour. We recommend medium rare.", tags: ["Most loved"], weight: "350 g", pair: "Pomegranate fizz" },
  { slug: "tbone", cat: "steaks", name: "T-bone", price: 8950, img: I("tbone"), line: "500 g, strip and tenderloin on one bone, sea salt and rosemary.", story: "Two steaks in one: the firm, beefy strip on one side of the bone and the soft tenderloin on the other. Seasoned with nothing more than flaky salt, cracked pepper and rosemary.", tags: ["Bone-in"], weight: "500 g", pair: "Basil & lime cooler" },
  { slug: "steak-frites", cat: "steaks", name: "Steak frites", price: 5450, img: I("steak-frites"), line: "Flat iron steak, hand-cut fries, peppercorn sauce.", story: "A brasserie classic done properly. Flat iron steak, sliced and served with fries cut in house and twice cooked, with a creamy green peppercorn sauce on the side.", tags: ["Classic"], weight: "250 g", pair: "Smoked lemonade" },
  { slug: "tenderloin", cat: "steaks", name: "Tenderloin fillet", price: 8450, img: I("sliced-pan"), line: "250 g centre-cut fillet, the most tender cut, red wine jus.", story: "Lean, buttery and so tender it barely needs a knife. Cut from the centre of the fillet, seared in the pan and rested, then sliced and served with a red wine jus.", tags: ["Lean"], weight: "250 g", pair: "Berry hibiscus iced tea" },

  // grill
  { slug: "mixed-grill", cat: "grill", name: "Ember mixed grill", price: 6950, img: I("skewers"), line: "Beef seekh, chicken tikka, lamb chops, fries and grilled tomatoes.", story: "A platter for people who cannot pick. Beef seekh, chicken tikka and lamb chops from our charcoal grill, with fries, grilled tomatoes, mint raita and our house chilli sauce.", tags: ["Sharing", "Local favourite"], weight: "For 2", pair: "Mint lemonade" },
  { slug: "bbq-ribs", cat: "grill", name: "Smoked beef short ribs", price: 6250, img: I("ribs"), line: "Twelve hours in the smoker, sticky tamarind glaze, pickles.", story: "Beef short ribs smoked low and slow over oak for twelve hours until they pull apart, then glazed with our tamarind and black pepper sauce and served with quick pickles.", tags: ["Slow cooked"], weight: "600 g", pair: "Pomegranate fizz" },
  { slug: "grilled-salmon", cat: "grill", name: "Grilled salmon", price: 5850, img: I("salmon"), line: "Norwegian salmon, crisp skin, lime, sauteed greens.", story: "For the table that wants something lighter. Norwegian salmon grilled skin-side down until crisp, served with sauteed greens, lime and a light lemon butter.", tags: ["Lighter"], weight: "220 g", pair: "Basil & lime cooler" },
  { slug: "wagyu-burger", cat: "grill", name: "Wagyu smash burger", price: 3450, img: I("burger"), line: "Double wagyu patty, aged cheddar, pickles, brioche, fries.", story: "Two thin wagyu patties smashed on the plancha for a deep crust, with aged cheddar, house pickles and burger sauce in a toasted brioche bun.", tags: ["Lunch favourite"], weight: "2 x 90 g", pair: "Smoked lemonade" },

  // sides
  { slug: "garden-salad", cat: "sides", name: "Ember garden salad", price: 1250, img: I("salad-dark"), line: "Crisp leaves, olives, feta, pickled onion, herb vinaigrette.", story: "A sharp, fresh salad that cuts through a rich steak. Mixed leaves, olives, feta, pickled red onion and a mustard and herb vinaigrette.", tags: ["Vegetarian"], weight: "Serves 1-2", pair: "" },
  { slug: "chicken-avocado-salad", cat: "sides", name: "Grilled chicken & avocado salad", price: 1950, img: I("salad-bowl"), line: "Char-grilled chicken, avocado, cherry tomatoes, citrus.", story: "A full meal in a bowl: char-grilled chicken breast over leaves with avocado, cherry tomatoes, sweet apple and a citrus yoghurt dressing.", tags: ["High protein"], weight: "Serves 1", pair: "" },
  { slug: "salmon-greens", cat: "sides", name: "Seared salmon on greens", price: 2650, img: I("salmon-plate"), line: "Half portion of salmon, warm greens, salsa verde.", story: "A smaller plate of our grilled salmon on warm greens and a bright salsa verde. Good as a side to share, or as a light main.", tags: ["Lighter"], weight: "120 g", pair: "" },

  // desserts
  { slug: "lava-cake", cat: "desserts", name: "Molten chocolate cake", price: 1450, img: I("lava-cake"), line: "Dark chocolate, soft centre, cherry, icing sugar.", story: "Baked to order, so give us twelve minutes. Dark chocolate sponge with a soft, flowing centre, served with a cherry and a dusting of icing sugar.", tags: ["Baked to order"], weight: "1 cake", pair: "Double espresso" },
  { slug: "berry-cake", cat: "desserts", name: "Raspberry layer cake", price: 1250, img: I("berry-cake"), line: "Vanilla sponge, raspberry cream, fresh berries.", story: "Light vanilla sponge layered with raspberry cream and topped with fresh berries. Not too sweet, which is what you want after a steak.", tags: ["Light"], weight: "1 slice", pair: "Berry hibiscus iced tea" },
  { slug: "mousse", cat: "desserts", name: "Chocolate mousse dome", price: 1350, img: I("mousse"), line: "Milk and dark chocolate mousse, berries, crumble.", story: "Two layers of chocolate mousse on a crisp crumble base, topped with berries.", tags: [], weight: "1 dome", pair: "Cappuccino" },
  { slug: "sundae", cat: "desserts", name: "Salted caramel sundae", price: 1150, img: I("sundae"), line: "Vanilla bean ice cream, warm caramel, chocolate, wafer.", story: "Vanilla bean ice cream with warm salted caramel poured at the table, chocolate sauce and a rolled wafer.", tags: ["Kids love it"], weight: "2 scoops", pair: "" },

  // drinks
  { slug: "smoked-lemonade", cat: "drinks", name: "Smoked lemonade", price: 850, img: I("mocktail"), line: "Fresh lemon, oak-smoked syrup, soda, big ice.", story: "Our signature. Fresh lemon juice and a syrup infused with oak smoke from our own grill, topped with soda over one big clear ice cube.", tags: ["Signature"], weight: "350 ml", pair: "" },
];

// Drinks are listed on the menu page (no photo, no detail page)
export const DRINKS = [
  ["Pomegranate fizz", "Pomegranate, rose, lime, sparkling water", 750],
  ["Mint lemonade", "Fresh mint, lemon, crushed ice", 550],
  ["Basil & lime cooler", "Thai basil, lime, cucumber, tonic", 750],
  ["Berry hibiscus iced tea", "Hibiscus, mixed berries, honey", 650],
  ["Double espresso", "Single-origin beans, roasted in Lahore", 550],
  ["Cappuccino", "Whole milk or oat milk", 750],
];

export const EVENTS = [
  { slug: "bbq-night", title: "Friday BBQ Night", date: "Every Friday", time: "8:00 pm onwards", type: "Live grill", img: I("grill-fire"), line: "Open-fire grill on the terrace, live acoustic music and a set BBQ menu for Rs 6,500 per person." },
  { slug: "steak-masterclass", title: "Steak Masterclass", date: "Saturday, 13 December", time: "4:00 pm to 6:30 pm", type: "Workshop", img: I("cuts-tools"), line: "Our head chef shows you how to choose, season, cook and rest the perfect steak. Includes tasting and dinner. 12 seats." },
  { slug: "family-brunch", title: "Sunday Family Brunch", date: "Every Sunday", time: "12:30 pm to 4:00 pm", type: "Family", img: I("table-spread"), line: "Brunch platters, the grill going all afternoon and a kids' corner, so the grown-ups can finish their coffee." },
  { slug: "new-year", title: "New Year's Eve Dinner", date: "Wednesday, 31 December", time: "8:00 pm to 1:00 am", type: "Celebration", img: I("toast"), line: "A six-course tasting menu, live band and a countdown on the terrace. Booking with advance only." },
];

export const TEAM = [
  { name: "Chef Kamran Aziz", role: "Head chef & pitmaster", img: I("chef-flame"), line: "Trained in London and Buenos Aires, Kamran has spent fifteen years cooking over fire." },
  { name: "Ahmed Rafiq", role: "Sous chef & pastry", img: I("chef-plating"), line: "Ahmed runs the pass every night and makes every dessert in house, from the sponge to the ice cream." },
];

export const REVIEWS = [
  ["The tomahawk is worth every rupee. Carved at the table, perfectly medium rare, and the service was calm and warm.", "Hira A.", "Google review"],
  ["Finally a steakhouse in Lahore that understands resting meat. The ribeye was the best I have had in Pakistan.", "Usman K.", "Google review"],
  ["We booked the private room for my father's 60th. They handled everything, even a custom dessert with his name.", "Maryam S.", "Private dining"],
];

export const FAQ = [
  ["Is all your meat halal?", "Yes. All our beef, lamb and chicken are halal certified, and we can show certificates at the front desk."],
  ["Do I need to book a table?", "Weekends and evenings fill up, so we recommend booking. Walk-ins are welcome when tables are free."],
  ["Is there a dress code?", "Smart casual. No shorts at dinner on Friday and Saturday."],
  ["Do you have parking?", "Yes, valet parking is free for diners at the front entrance."],
  ["Can you host private events?", "Our private room seats up to 22 guests. See the Events page or WhatsApp us for menus and prices."],
];

export const DONENESS = [
  ["Rare", "49°C", "Cool red centre, very soft", "#8e1d24"],
  ["Medium rare", "54°C", "Warm red centre, our recommendation", "#b2323a"],
  ["Medium", "60°C", "Pink centre, a little firmer", "#c9605a"],
  ["Medium well", "65°C", "Light pink, mostly firm", "#b88470"],
  ["Well done", "71°C", "No pink, firm throughout", "#7a5a4a"],
];

export const CUTS = [
  { name: "Ribeye", note: "Most marbled, richest flavour", best: "Medium rare" },
  { name: "Tenderloin", note: "Leanest and most tender", best: "Rare to medium rare" },
  { name: "Striploin", note: "Firm bite, beefy flavour", best: "Medium rare" },
  { name: "T-bone", note: "Strip and fillet on one bone", best: "Medium rare" },
  { name: "Tomahawk", note: "Long-bone ribeye, for sharing", best: "Medium rare" },
  { name: "Flat iron", note: "Great value, tender if sliced well", best: "Medium" },
];

export const GALLERY = [
  ["interior", "Our main dining hall"], ["grill-steaks", "Steaks on the charcoal grill"], ["tomahawk", "Tomahawk, carved at the table"],
  ["bar-warm", "The bar at night"], ["chef-flame", "The open kitchen"], ["cuts-lineup", "Cuts from our ageing room"],
  ["dining-friends", "Friday nights"], ["lava-cake", "Molten chocolate cake"], ["fine-table", "Dinner service"],
  ["grill-smoke", "Oak and charcoal"], ["skewers", "Ember mixed grill"], ["interior-2", "Upstairs lounge"],
];

export const rs = (n) => "Rs " + Number(n).toLocaleString("en-PK");
