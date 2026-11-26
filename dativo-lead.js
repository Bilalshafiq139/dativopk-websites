/* DATIVOPK demo sites: every WhatsApp link or button goes to DATIVOPK (0371)
   with a message that marks the person as a website-services client, not a student.
   Sara looks for the words "Website enquiry" to handle these chats. */
(function () {
  var NUM = "923717767520";
  var NAMES = {
    "academy": "Nexora Academy",
    "excel-course": "Gridline Excel & Data Analytics",
    "dentist": "Mehr Dental Studio",
    "restaurant": "Ember & Oak Steakhouse",
    "wedding-photographer": "Dastaan Studio (wedding photographer)",
    "photographer": "Zoya Malik Studio (photographer)",
    "data-analyst": "Hamza Qureshi (data analyst portfolio)",
    "furniture-store": "Lakri & Co. (furniture online store)",
    "handbag-store": "Zarine (luxury handbag store)",
    "matcha-brand": "Koya Matcha Bar (matcha cafe and brand website)",
    "real-estate": "Arz Estate (real estate agency website)",
    "salon": "Zeenat Salon & Studio (salon and bridal studio website)",
    "router-ups": "Jugnu Power (online store for WiFi router UPS)"
  };
  var slug = (location.pathname.split("/").filter(Boolean)[0] || "").toLowerCase();
  var name = NAMES[slug] || "demo";
  var MSG = "Hello DATIVOPK! Website enquiry: I saw your " + name +
    " demo website (projects.dativopk.com/" + slug + ") and I'm interested in getting a website made for my business.";

  function fix(u) {
    u = String(u || "");
    if (!/(wa\.me|whatsapp\.com)/i.test(u)) return u;
    return "https://wa.me/" + NUM + "?text=" + encodeURIComponent(MSG);
  }
  function onLink(e) {
    var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
    if (a) { var n = fix(a.href); if (n !== a.href) a.href = n; }
  }
  // click, middle-click, long-press / right-click "open in new tab", and touch: the link is fixed before it opens
  ["pointerdown", "touchstart", "click", "auxclick", "contextmenu"].forEach(function (t) {
    document.addEventListener(t, onLink, { capture: true, passive: true });
  });
  var open = window.open;
  window.open = function (u) { var args = [].slice.call(arguments); args[0] = fix(u); return open.apply(window, args); };
})();
