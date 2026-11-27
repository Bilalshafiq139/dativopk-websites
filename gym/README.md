# Fajr Athletic Club · cinematic gym website (demo)

A strength and conditioning gym in Lahore, told like a short film. "Fajr Athletic Club" is a placeholder brand; prices are in PKR and names and numbers are samples.

## The film (home page)
Scroll plays one 5 am training session in seven chapters. The page opens on a black screen with a "05:00" clock and a typed line ("Lahore is asleep."). The letterbox bars then open into cinema bars, and each chapter crossfades a full-screen photo with a slow push-in. On screen are a chapter title, two subtitle lines, a REC timecode that runs from 05:02 to 06:30, a reel progress bar and film grain. It ends on "Your first chapter starts Monday." with the free-trial button.

After the film:
- the club statement and stats;
- the programs as a draggable film strip;
- the coaches as the "cast";
- member results as "reviews";
- the membership plans as cinema tickets;
- rolling end credits and a final call to action.

All photos come from one Pexels shoot of the same misty warehouse gym, so the story stays consistent.

## Pages
| Page | What it does |
|---|---|
| `index.html` | The film and the sections above |
| `programs.html` | Six programs, weekly timetable with day tabs and "try free" links |
| `coaches.html` | Six coaches |
| `membership.html` | Plans in PKR and a sign-up form (saved to the front desk) |
| `trial.html` | Free-trial booking: program, day (next 7 days), time from the timetable, name and goal |
| `contact.html` | Map, hours (incl. ladies-only), contact form |
| `admin.html` | Front desk: trials per day, trial-to-member rate, paying members, monthly income, trials, sign-ups and messages with statuses. Password `admin123` |

## Run with Docker
`docker compose up -d --build`, then open http://localhost:8095 (front desk at /admin.html). Without Docker the site runs in demo mode (browser storage).

## Edit
Chapters, programs, coaches, plans, timetable and stories are in `js/data.js`. Sample front-desk data: `js/seed-data.js`.
