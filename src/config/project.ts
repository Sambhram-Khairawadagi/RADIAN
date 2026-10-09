export type FloorId = "B" | "G" | "1" | "2" | "3" | "4" | "5";
export const floors: {
  id: FloorId;
  name: string;
  planKey: "plan01" | "plan02" | null;
}[] = [
  { id: "B", name: "Basement", planKey: null },
  { id: "G", name: "Ground floor", planKey: null },
  { id: "1", name: "First floor", planKey: null },
  { id: "2", name: "Second floor", planKey: null },
  { id: "3", name: "Third floor", planKey: null },
  { id: "4", name: "Fourth floor", planKey: null },
  { id: "5", name: "Fifth floor", planKey: null },
];
export const navigation = [
  ["Overview", "overview"],
  ["Explore", "explore"],
  ["Interiors", "interiors"],
  ["Amenities", "amenities"],
  ["Location", "location"],
  ["Contact", "contact"],
] as const;
export const project = {
  name: "RADIAN",
  developer: "V Venturez",
  category: "Commercial / IT Park",
  location: "Bommasandra, Bengaluru",
  configuration: "B + G + 5",
  landArea: "1 acre",
  builtUpArea: "1,12,918 sq ft",
  totalUnits: 28,
  status: "Ongoing",
  indicativePrice: "₹12,000",
  parking: "30 vehicles",
  reraNumber: null as string | null,
  elevatorOwnerStatement: "2 elevators per floor",
  partnerRole: "Website design, maintenance & marketing",
  phone: "+91 89044 98459",
  phoneHref: "tel:+918904498459",
  email: "info@vventurez.com",
  office:
    "V VENTUREZ EL-DORADO, 121/17-3, 4th Floor, 7th Main Road, 9th Cross Road, 3rd Phase J.P. Nagar, Bengaluru – 560078",
  officialUrl: "https://vventurez.com/v-venturez-radian/",
  developerUrl: "https://vventurez.com/",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Bommasandra+Metro+Station+Bengaluru",
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=Bommasandra+Metro+Station+Bengaluru",
  verifiedOn: "2026-10-08",
  launchApproved: process.env.NEXT_PUBLIC_LAUNCH_APPROVED === "true",
  sequence: {
    desktopScrollVh: 400,
    mobileScrollVh: 220,
    desktopCache: 18,
    mobileCache: 12,
  },
  facts: {
    official: [
      "Name, developer, location, category, ongoing status",
      "Listed amenities",
      "Phone, email and office address",
    ],
    ownerProvided: [
      "Built-up area restored to 1,12,918 sq ft; total units: 28 (user confirmed)",
      "B+G+5 configuration",
      "1 acre land area",
      "₹12,000 per sq ft indicative price",
      "30-vehicle parking capacity",
      "RERA registered (number not supplied)",
    ],
    unresolved: [
      "RERA registration number and official verification",
      "Pricing basis, exclusions, taxes and final terms",
      "Total elevator count: owner says “2 elevators per floor”",
      "Floor-plan assignment, sizes, uses and availability",
      "Exact project map pin",
      "Imagery approval and differences between renderings and B+G+5 brief",
      "Consent/privacy wording, lead retention and enquiry delivery account",
    ],
  },
} as const;
export const amenities = [
  [
    "ShieldCheck",
    "24/7 security & CCTV",
    "Security and surveillance infrastructure.",
  ],
  ["Flame", "Fire compliance", "Fire safety provisions for the development."],
  ["ScanLine", "Access control", "Managed access to the workplace."],
  ["Leaf", "Green landscaping", "Green spaces within the development."],
  ["Zap", "100% power backup", "Backup power for business continuity."],
  [
    "PanelsTopLeft",
    "Flexible workspaces",
    "Spaces that adapt to working needs.",
  ],
  ["CarFront", "Parking facilities", "Owner-reported capacity of 30 vehicles."],
] as const;
