// Sample leads for the admin panel. Used by the API (Docker) and by demo mode. Names and numbers are placeholders.
export const LEAD_STATUSES = ["new", "contacted", "viewing booked", "offer made", "closed", "lost"];
export const MSG_STATUSES = ["new", "replied", "closed"];
export const SUB_STATUSES = ["new", "reviewing", "listed", "rejected"];

const day = 864e5;
const ago = (d, h = 12) => new Date(Date.now() - d * day - (24 - h) * 36e5).toISOString();
const ahead = (d) => new Date(Date.now() + d * day).toISOString().slice(0, 10);
const T = { noor: "Noor Villa", serenity: "Serenity House", margalla: "Margalla Retreat", palm: "Palm Court", seabreeze: "Sea Breeze Villa",
  lantern: "Lantern House", cube: "Stone Cube", pearl: "White Pearl", skyline: "Skyline Apartment", "arz-heights": "Arz Heights", "mm-plaza": "MM Alam Commercial", "blue-avenue": "Blue Avenue Office" };
let n = 3100;
const lead = (d, listing, name, phone, kind, status, extra = {}) => ({ id: "AE-" + n--, createdAt: ago(d, extra.h || 12), listing, listingTitle: T[listing], name, phone,
  email: name.split(" ")[0].toLowerCase() + "@example.com", kind, date: extra.date || "", time: extra.time || "", message: extra.message || "", status, notes: extra.notes || "", agent: extra.agent || "" });

export function makeSeed() {
  const leads = [
    lead(0, "noor", "Kamran Javed", "0300 4455112", "Viewing", "new", { h: 15, date: ahead(2), time: "4:00 pm", message: "Overseas buyer, visiting Lahore next week." }),
    lead(0, "arz-heights", "Maria Saleem", "0321 7788123", "Installment plan", "new", { h: 11, message: "Please share the payment plan for a 2-bed unit." }),
    lead(1, "margalla", "Brig. (R) Asad Ali", "0333 1200456", "Viewing", "viewing booked", { date: ahead(1), time: "11:00 am", agent: "Usman Tariq" }),
    lead(1, "skyline", "Zainab Hussain", "0345 9087654", "Rent enquiry", "contacted", { message: "Need it from 1st of next month for one year." }),
    lead(2, "palm", "Rizwan Ahmed", "0301 5566778", "Viewing", "offer made", { notes: "Offered 5.9 Crore, owner wants 6.1." }),
    lead(3, "serenity", "Nadia Farooq", "0322 3344556", "Price question", "contacted"),
    lead(4, "mm-plaza", "Tariq Holdings", "0300 1122990", "Commercial", "viewing booked", { date: ahead(4), time: "3:00 pm", agent: "Ahmed Khan" }),
    lead(6, "lantern", "Sheraz Malik", "0331 6677889", "Viewing", "closed", { notes: "Sold at 10.8 Crore. Transfer done." }),
    lead(8, "pearl", "Amna Qureshi", "0302 8899001", "Viewing", "closed", { notes: "Token paid." }),
    lead(11, "cube", "Hassan Raza", "0315 4433221", "Viewing", "lost", { notes: "Bought elsewhere." }),
    lead(15, "seabreeze", "Saima Khalid", "0345 2211334", "Viewing", "closed"),
    lead(19, "blue-avenue", "Nexa Solutions", "0333 9988776", "Commercial", "closed", { notes: "3-year lease signed." }),
  ];
  const messages = [
    { id: "m3", createdAt: ago(0, 10), name: "Bilal H.", email: "bilal@example.com", phone: "0300 1110022", topic: "Selling my property", message: "I want to sell my 1 kanal house in DHA Phase 4. What is your commission?", status: "new" },
    { id: "m2", createdAt: ago(2), name: "Sara K.", email: "sara@example.com", phone: "", topic: "Investment", message: "What is the minimum amount to invest in the farmhouse offer?", status: "replied" },
    { id: "m1", createdAt: ago(7), name: "Omer P.", email: "omer@example.com", phone: "", topic: "General", message: "Do you deal in Multan?", status: "closed" },
  ];
  const submissions = [
    { id: "s2", createdAt: ago(1), name: "Ali Raza", phone: "0300 5554433", email: "ali@example.com", city: "Lahore", area: "Johar Town", type: "House", purpose: "Sell", size: "10 Marla", price: 42000000, details: "Brand new, double storey, near Emporium Mall.", status: "new" },
    { id: "s1", createdAt: ago(5), name: "Fatima N.", email: "fatima@example.com", phone: "0321 6665544", city: "Islamabad", area: "G-11", type: "Apartment", purpose: "Rent out", size: "1,600 sq ft", price: 150000, details: "Third floor, furnished.", status: "reviewing" },
  ];
  return { leads, messages, submissions, listings: {} };
}
