// Confirmed club-leader updates and Canvas announcements, reviewed November 7, 2026.
// Times are local to Fulshear (America/Chicago). Only confirmed dates are scheduled.
export interface ClubEvent {
  title: string;
  time: string;
  loc: string;
  type: string;
  desc: string;
  startDate?: string;
  endDate?: string;
  signupUrl?: string;
  sourceUrl?: string;
}

export const serviceHourLogUrl = "https://docs.google.com/forms/d/e/1FAIpQLSeZE9zNv9yGKKcc1cKnZn-IcJIapnr054bNA2uypLOM-uiduw/viewform?usp=header";

export const datedEvents: Record<string, ClubEvent[]> = {
  "2026-11-07": [
    {
      "title": "Kiwanis Club of Katy Chartering Ceremony",
      "time": "3:00–8:00 PM · choose a volunteer shift",
      "loc": "Fulshear High School · Library",
      "type": "Volunteer",
      "desc": "Help with setup (3–5 PM), guest check-in (5–6 PM), food service (6–7 PM), or cleanup (7–8 PM). Dress in business casual and reserve an available shift.",
      "signupUrl": "https://www.signupgenius.com/go/10C094DAAA723A7FDC52-67301945-kiwanis#/",
      "sourceUrl": "https://lcisd.instructure.com/courses/127230/discussion_topics/1043608"
    },
    {
      "title": "Public Speakers · Kiwanis Chartering Ceremony",
      "time": "5:30–6:30 PM",
      "loc": "Fulshear High School · Library",
      "type": "Community",
      "desc": "Student speakers are needed to recite the Pledge of Allegiance and read the invocation. Wear business casual. Contact Dr. Bradley-Bell through Canvas to volunteer.",
      "sourceUrl": "https://lcisd.instructure.com/courses/127230/discussion_topics/1043614"
    }
  ],
  "2026-11-10": [
    {
      "title": "Tapestry Event",
      "time": "5:30–8:30 PM",
      "loc": "Foster High School · 4400 FM 723 Rd, Richmond, TX 77406",
      "type": "Community",
      "desc": "Help run the Global Service table and an interactive service bingo activity at LCISD Tapestry. Wear a Key Club, Fulshear, or appropriate plain shirt. Bring water and a charged phone; arrange your own transportation.",
      "signupUrl": "https://www.signupgenius.com/go/10C094DAAA723A7FDC52-67133977-tapestry#/",
      "sourceUrl": "https://lcisd.instructure.com/courses/127230/pages/event-tapestry-event-at-foster-high-school-nov-10"
    }
  ],
  "2026-11-20": [
    {
      "title": "Key Leader Weekend Retreat",
      "endDate": "2026-11-22",
      "time": "November 20–22 · confirm bus schedule with advisor",
      "loc": "Down Home Ranch · 20250 FM 619, Elgin, TX 78621",
      "type": "Leadership",
      "desc": "Kiwanis service-leadership retreat for students ages 14–18. Cost: $75 per student or $50 per student facilitator. Bus transportation is provided. Lodging, meals, and activities are on site; bring twin bedding. Complete the interest form and confirm registration and departure details with Dr. Bradley-Bell.",
      "signupUrl": "https://forms.cloud.microsoft/r/9MBAWnBrkE",
      "sourceUrl": "https://lcisd.instructure.com/courses/127230/discussion_topics/1030898"
    }
  ],
  "2026-12-05": [
    {
      "title": "Elementary UIL",
      "time": "7:30 AM–2:00 PM",
      "loc": "Gene Tomas High School · 24945 Easton Ramsey Wy, Richmond, TX 77406",
      "type": "Service",
      "desc": "Help set up academic competitions and guide elementary students. Wear a Key Club, Fulshear, or appropriate plain shirt. Bring water and a charged phone; arrange your own transportation.",
      "signupUrl": "https://forms.cloud.microsoft/pages/responsepage.aspx?id=YLr5XW0hUkih1cpB5PakUla7vheHE11Mg0am2HL1vtNUOTJQTFVLRFVWOEVKVkRNNjVFTEU3SEsyMi4u&origin=QRCode&qrcodeorigin=presentation&route=shorturl",
      "sourceUrl": "https://lcisd.instructure.com/courses/127230/pages/event-elementary-uil-at-gene-tomas-high-school-dec-5"
    }
  ],
  "2026-12-08": [
    {
      "title": "Key Club General Meeting",
      "time": "4:00 PM",
      "loc": "Fulshear High School · Library",
      "type": "Meeting",
      "desc": "The next general meeting listed in the club leader’s website updates. Regular meetings are every other Tuesday at 4:00 PM in the library. Check Canvas for changes and later confirmed dates."
    }
  ]
};

export const recurringEvents: ClubEvent[] = [
  {
    "title": "Friends For Life",
    "time": "Year-round · shifts between 11:00 AM–4:00 PM · closed Tuesdays",
    "loc": "107 E 22nd St, Houston, TX 77008",
    "type": "Recurring",
    "desc": "Help care for dogs and cats through feeding, cleaning, and other tasks based on your volunteer level. Check available shifts before attending. A $15 volunteer shirt and closed-toe shoes are required; arrange your own transportation.",
    "signupUrl": "https://friends4life.org/volunteer/",
    "sourceUrl": "https://lcisd.instructure.com/courses/127230/pages/event-friends-for-life-throughout-the-year-6"
  },
  {
    "title": "Lunches of Love",
    "time": "Year-round · shifts between 9:00 AM–12:45 PM",
    "loc": "1416 Radio Lane, Rosenberg, TX 77471",
    "type": "Recurring",
    "desc": "Help prepare and pack lunches, work in the kitchen, or clean up. Reserve an available shift. Wear closed-toe shoes; no short shorts or tank tops. Bag decorating does not count toward the service cord. Arrange your own transportation.",
    "signupUrl": "https://signup.com/client/invitation2/secure/812345638389834044/false#/invitation",
    "sourceUrl": "https://lcisd.instructure.com/courses/127230/pages/event-lunches-of-love-throughout-the-year-23"
  },
  {
    "title": "Learn To Be · Online Tutoring",
    "time": "Ongoing · at least 6 months, twice per week",
    "loc": "Online",
    "type": "Recurring",
    "desc": "Provide free one-on-one tutoring to underserved students. Training resources are available. Apply through the Fulshear program and confirm your tutoring schedule and service-hour eligibility before starting.",
    "signupUrl": "https://www.learntobe.org/apply/hs-fulshear",
    "sourceUrl": "https://lcisd.instructure.com/courses/127230/discussion_topics/1044267"
  }
];

export function eventsForDate(year: number, month: number, day: number): ClubEvent[] {
  const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return Object.entries(datedEvents).flatMap(([start, events]) =>
    events.filter(event => start <= key && key <= (event.endDate ?? start)).map(event => ({ ...event, startDate: start }))
  );
}
