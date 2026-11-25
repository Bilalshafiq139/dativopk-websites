// All clinic content lives here. Change the name, phone, address, treatments and doctors in this one file.
export const CLINIC = {
  name: "Mehr Dental Studio",
  short: "Mehr",
  tagline: "Unhurried dentistry, done properly.",
  phone: "+92 300 1234567",
  whatsapp: "923001234567", // international format, no + or spaces
  email: "hello@mehrdental.pk",
  address: "24-C, Main Boulevard, Gulberg III, Lahore",
  mapQuery: "Gulberg III, Lahore",
  since: 2012,
  hours: [
    ["Monday to Friday", "10:00 to 20:00"],
    ["Saturday", "10:00 to 16:00"],
    ["Sunday", "Closed (emergencies on WhatsApp)"],
  ],
};

export const TREATMENTS = [
  {
    slug: "checkup-cleaning", name: "Check-up & cleaning", img: "assets/img/checkup.webp",
    line: "A thorough exam, digital X-rays when needed, and a gentle scale and polish.",
    from: 3500, duration: "45 min", visits: "1 visit",
    intro: "Most problems in the mouth are quiet until they are expensive. A check-up every six months catches decay, gum disease and worn fillings while they are still small, and the cleaning removes the hardened plaque that a toothbrush cannot reach.",
    forWho: ["Everyone, every six months", "Bleeding gums or bad breath", "Before any cosmetic treatment"],
    steps: [["Exam", "Teeth, gums, bite and soft tissue, with notes you can keep."], ["X-rays if needed", "Low-dose digital images, shown to you on screen."], ["Scale & polish", "Ultrasonic cleaning, then a polish and fluoride."], ["Your plan", "What is fine, what to watch, and what needs care, with prices."]],
    faq: [["Does scaling damage enamel?", "No. Ultrasonic scaling removes calculus, not enamel. Teeth can feel slightly sensitive for a day."], ["How often should I come?", "Every six months for most people. If you have gum disease we may suggest every three or four months."]],
  },
  {
    slug: "whitening", name: "Teeth whitening", img: "assets/img/incisor.webp",
    line: "In-clinic whitening with custom trays to keep the result at home.",
    from: 25000, duration: "90 min", visits: "1 to 2 visits",
    intro: "We whiten only after a check-up, because whitening over decay or leaking fillings causes pain and uneven colour. You get a shade reading before and after, so you see the real change, not a guess.",
    forWho: ["Yellowing from tea, coffee or smoking", "Before a wedding or event", "Healthy teeth without large fillings on the front"],
    steps: [["Shade & check", "We record your starting shade and protect your gums."], ["In-clinic session", "Three short applications of professional gel."], ["Home trays", "Custom trays and gel for top-ups."], ["Review", "A quick visit after two weeks to check the shade."]],
    faq: [["Will it make my teeth sensitive?", "Some sensitivity for 24 to 48 hours is common. We use a desensitising gel to keep it mild."], ["Does it whiten crowns or fillings?", "No. Only natural enamel changes colour, which is why we plan front fillings after whitening."]],
  },
  {
    slug: "clear-aligners", name: "Clear aligners", img: "assets/img/aligner.webp",
    line: "Nearly invisible trays that straighten teeth, planned on a 3D scan first.",
    from: 180000, duration: "6 to 18 months", visits: "Every 6 to 8 weeks",
    intro: "Aligners are a series of clear trays, each moving your teeth a fraction of a millimetre. We scan your teeth digitally, show you the planned end result before you commit, and only then order your trays.",
    forWho: ["Crowding or gaps", "Teeth that moved after braces", "Adults who do not want metal braces"],
    steps: [["Scan", "A digital 3D scan, no messy impressions."], ["Preview", "You see the planned movement and final smile on screen."], ["Trays", "A new set every one to two weeks, worn 22 hours a day."], ["Retainers", "Retainers at the end keep the result in place."]],
    faq: [["Can people see them?", "From a normal conversation distance, almost nobody notices them."], ["Can I eat with them?", "Take them out to eat and drink anything except water, then brush and put them back."]],
  },
  {
    slug: "implants", name: "Dental implants", img: "assets/img/implant.webp",
    line: "A titanium root and a natural-looking crown to replace a missing tooth.",
    from: 150000, duration: "3 to 6 months", visits: "3 to 4 visits",
    intro: "An implant replaces the root of a missing tooth with a small titanium post. Bone grows around it over a few months, and a crown is fixed on top. It does not need the neighbouring teeth to be cut, unlike a bridge.",
    forWho: ["One or more missing teeth", "Loose dentures", "Healthy gums and enough bone (we check with a scan)"],
    steps: [["Assessment", "A 3D scan to measure bone and plan the position."], ["Placement", "The implant is placed under local anaesthetic."], ["Healing", "Three months for the bone to bond with the implant."], ["Crown", "A custom crown matched to your other teeth."]],
    faq: [["Does it hurt?", "The placement is done under local anaesthetic. Most people take simple painkillers for a day or two."], ["How long does an implant last?", "With good cleaning and check-ups, many last for decades."]],
  },
  {
    slug: "root-canal", name: "Root canal treatment", img: "assets/img/canal.webp",
    line: "Saves an infected tooth by cleaning and sealing the inside.",
    from: 18000, duration: "60 to 90 min", visits: "1 to 2 visits",
    intro: "When decay reaches the nerve, the tooth aches and can become infected. A root canal removes the infected tissue, disinfects the canals and seals them, so you keep your own tooth instead of losing it.",
    forWho: ["Lingering pain with hot or cold", "Swelling or a gum boil", "A deep cavity or a cracked tooth"],
    steps: [["Numb & isolate", "Full local anaesthetic and a rubber dam to keep it clean."], ["Clean", "Rotary instruments clean and shape each canal."], ["Seal", "The canals are filled and sealed."], ["Protect", "Usually a crown afterwards so the tooth does not crack."]],
    faq: [["Is a root canal painful?", "It feels much like a filling. The pain people remember is usually the infection before treatment."], ["Do I need a crown after?", "Back teeth usually do, because a root-filled tooth becomes more brittle."]],
  },
  {
    slug: "veneers", name: "Veneers & smile design", img: "assets/img/arch.webp",
    line: "Thin porcelain shells that change shape and colour, previewed before we start.",
    from: 45000, duration: "2 to 3 weeks", visits: "2 to 3 visits",
    intro: "Veneers are thin porcelain shells bonded to the front of the teeth. We start with photos and a trial smile in your mouth, so you approve the shape and length before anything permanent is done.",
    forWho: ["Chipped or worn front teeth", "Gaps or uneven shapes", "Stains that whitening cannot fix"],
    steps: [["Design", "Photos, scan and a digital smile design."], ["Trial smile", "A temporary mock-up you can see and feel."], ["Preparation", "Minimal shaping of the enamel, often less than half a millimetre."], ["Fitting", "Veneers are bonded and polished."]],
    faq: [["Do veneers look fake?", "Not when they are designed for your face. That is why we do the trial smile first."], ["How long do they last?", "Porcelain veneers typically last 10 to 15 years with care."]],
  },
];

export const DOCTORS = [
  { slug: "ayesha", name: "Dr. Ayesha Malik", initials: "AM", role: "Lead dentist & founder", focus: "Cosmetic dentistry, veneers", creds: "BDS (KEMU), MSc Aesthetic Dentistry (London)", years: 14, note: "Started the studio in 2012 with two chairs and a rule: nobody leaves without understanding their own X-ray." },
  { slug: "hamza", name: "Dr. Hamza Qureshi", initials: "HQ", role: "Implant surgeon", focus: "Implants, extractions", creds: "BDS, FCPS Oral Surgery", years: 11, note: "Plans every implant on a 3D scan first, and shows you the plan before booking surgery." },
  { slug: "sana", name: "Dr. Sana Javed", initials: "SJ", role: "Orthodontist", focus: "Clear aligners, braces", creds: "BDS, MOrth (RCSEd)", years: 9, note: "Treats adults and teenagers, and keeps a calm, quiet room for nervous patients." },
];

export const REVIEWS = [
  { q: "I had avoided the dentist for eight years. Dr. Ayesha explained every step first, and the price on paper was the price I paid.", who: "Fatima R.", what: "Check-up & fillings" },
  { q: "My root canal felt like a normal filling. I was nervous walking in and relaxed walking out. The staff is so kind.", who: "Usman T.", what: "Root canal" },
  { q: "Seeing the 3D plan before my implant made all the difference. I knew exactly what would happen and when.", who: "Imran S.", what: "Dental implant" },
  { q: "Nobody at work noticed my aligners. Ten months later my teeth are straight and I smile in photos again.", who: "Hira K.", what: "Clear aligners" },
  { q: "They were so patient with my six-year-old. She actually asks when her next visit is.", who: "Sadia M.", what: "Kids dentistry" },
  { q: "Came in with sudden tooth pain on a Saturday and was seen within the hour. Very grateful.", who: "Ahmed N.", what: "Emergency visit" },
];

export const STATS = [
  ["14", "+", "Years in Gulberg"],
  ["12K", "+", "Smiles treated"],
  ["98", "%", "Patient satisfaction"],
  ["4.9", "★", "Google rating"],
];

export const WHY = ["Gentle, anxiety-free care", "Modern digital technology", "Honest, written pricing", "Care for the whole family", "Evening slots and same-day emergencies", "Instalment plans for bigger treatments"];

export const OFFER = {
  price: 4500, regular: 7500,
  items: [["Complete dental exam", "Teeth, gums, bite and a mouth cancer screening."], ["Professional cleaning", "Gentle scale and polish to remove tartar and stains."], ["Digital X-rays", "Low-dose images, shown to you on screen."], ["Written treatment plan", "Your options and fixed prices, with no pressure."]],
  who: "New patients who have not visited us before, or anyone who has not seen a dentist in over a year.",
};

export const FAQ = [
  ["Is dental treatment painful?", "Most treatments are done with local anaesthetic, so you feel pressure but not pain. If you feel anything at all, raise your hand and we stop."],
  ["How often should I see a dentist?", "Every six months for most people. If you have gum problems we may suggest every three or four months."],
  ["Do you treat children?", "Yes. We see children from age three, in a calm room with extra time so their first visits are happy ones."],
  ["What does the new patient special include?", "A full exam, professional cleaning, digital X-rays and a written treatment plan, for PKR 4,500 instead of PKR 7,500."],
  ["Do you offer instalments?", "Yes. Aligners, implants and veneers can be paid in monthly instalments with no extra charge."],
  ["Where are you located, and what are your hours?", "24-C, Main Boulevard, Gulberg III, Lahore. Monday to Friday 10:00 to 20:00, Saturday 10:00 to 16:00."],
];

export const BLOG = [
  { slug: "how-often-dentist", tag: "Everyday care", date: "12 Nov 2026", read: "4 min read", title: "How often should you really visit the dentist?", text: "Twice a year is the rule of thumb, but your gums and history matter more. Here is how we decide.", img: "assets/img/brush.webp", link: "checkup-cleaning",
    body: [
      ["", "Most people have heard that you should see a dentist every six months. For many patients that is right, but it is a starting point, not a rule. The real answer depends on your gums, your history of cavities and how well you can keep plaque under control at home."],
      ["Who can wait longer", "If your gums are healthy, you have had no new cavities for several years and you do not smoke, a check-up every nine to twelve months can be enough. We will tell you honestly if that applies to you."],
      ["Who should come more often", "If your gums bleed when you brush, if you have had gum treatment, if you have diabetes or if you are pregnant, a visit every three to four months keeps small problems from becoming big ones."],
      ["What happens at a check-up", "We look at every tooth, check your gums with a gentle probe, screen for mouth cancer and take low-dose X-rays only when they are needed. Then we clean away the tartar that a toothbrush cannot remove."],
      ["The bottom line", "Regular visits are the cheapest dentistry there is. Catching a small cavity costs a filling; missing it can cost a root canal."],
    ] },
  { slug: "whitening-clinic-vs-home", tag: "Cosmetic", date: "3 Nov 2026", read: "5 min read", title: "Teeth whitening: in-clinic vs. home kits", text: "What actually changes the shade, what is safe for enamel, and how long the result lasts.", img: "assets/img/incisor.webp", link: "whitening",
    body: [
      ["", "Whitening works by letting a peroxide gel soak into the enamel and break down the stains inside it. The difference between methods is mostly the strength of the gel and how well it is kept on your teeth and off your gums."],
      ["In-clinic whitening", "We protect your gums first, then apply a professional gel in short sessions. You see a clear change in about ninety minutes, and we record your shade before and after."],
      ["Home kits from the shop", "Strips and pens use a much weaker gel and often do not fit your teeth, so results are patchy. Some charcoal products are abrasive and wear enamel away over time."],
      ["Custom home trays", "Trays made from a scan of your own teeth hold the gel evenly. They are the best way to top up your result for years."],
      ["How long it lasts", "Usually one to three years, depending on tea, coffee and smoking. A short top-up with your trays brings the shade back."],
    ] },
  { slug: "aligners-vs-braces", tag: "Aligners & braces", date: "21 Oct 2026", read: "6 min read", title: "Aligners or braces: which is right for you?", text: "Comfort, cost, speed and visibility compared, for teenagers and adults.", img: "assets/img/aligner.webp", link: "clear-aligners",
    body: [
      ["", "Both clear aligners and fixed braces straighten teeth well. The right choice depends on how complex your case is, your lifestyle and how disciplined you can be about wearing removable trays."],
      ["Visibility", "Aligners are nearly invisible at conversation distance. Ceramic braces are less visible than metal, but they are still noticeable."],
      ["Comfort and eating", "Aligners come out to eat, so there are no food rules. Braces mean avoiding hard and sticky food, and the wires can rub at first."],
      ["Discipline", "Aligners only work if you wear them twenty-two hours a day. Braces work all the time, which suits some teenagers better."],
      ["Cost", "In Lahore, aligners usually cost more than metal braces. We offer instalments for both, and we will show you both plans before you choose."],
    ] },
];

export const FAQ_GROUPS = [
  ["Your first visit", [["What should I bring to my first visit?", "Your CNIC, a list of any medicines you take, and any old X-rays or reports you have. If you have dental insurance through work, bring the card."], ["How long does the first visit take?", "About forty minutes. Most of it is talking, examining and looking at your X-rays together."], ["Can I bring my child along?", "Of course. We have a small play corner, and children are welcome to sit with you."]]],
  ["Treatment and comfort", [["Is dental treatment painful?", "Most treatments are done with local anaesthetic, so you feel pressure but not pain. If you feel anything at all, raise your hand and we stop."], ["I am very nervous. Can you help?", "Yes. Tell us when you book. We give you longer appointments, explain each step before we do it, and agree on a stop signal."], ["Do you treat children?", "Yes, from age three, in a calm room with extra time so their first visits are happy ones."]]],
  ["Fees and payment", [["Do you give prices before treatment?", "Always. After your exam you get a written plan with a fixed fee for each option, and that is what you pay."], ["Do you offer instalments?", "Yes. Aligners, implants and veneers can be paid monthly with no extra charge."], ["Which payment methods do you accept?", "Cash, debit and credit cards, bank transfer, and JazzCash or Easypaisa."]]],
  ["Emergencies and hours", [["What counts as a dental emergency?", "Severe tooth pain, swelling in the face or gums, a knocked-out tooth, or bleeding that will not stop. Message us on WhatsApp right away."], ["Are you open on weekends?", "Saturday 10:00 to 16:00. On Sunday we are closed, but we answer WhatsApp for emergencies."], ["Where are you located?", "24-C, Main Boulevard, Gulberg III, Lahore, on the ground floor with parking at the front."]]],
];

export const RESULTS = [
  { before: "assets/img/before.webp", after: "assets/img/after.webp", title: "Whitening and a single implant", note: "Two whitening sessions, then one implant to close the gap. 4 months.", tag: "Cosmetic + implant" },
  { before: "assets/img/before2.webp", after: "assets/img/after.webp", title: "Crowded teeth straightened", note: "Clear aligners, 22 trays, worn for 11 months.", tag: "Clear aligners" },
];

export const TIMES = ["10:00", "10:45", "11:30", "12:15", "14:00", "14:45", "15:30", "16:15", "17:00", "17:45", "18:30", "19:15"];

export const pkr = (n) => "PKR " + Number(n).toLocaleString("en-PK");
export const waLink = (text = "") => `https://wa.me/${CLINIC.whatsapp}${text ? "?text=" + encodeURIComponent(text) : ""}`;
