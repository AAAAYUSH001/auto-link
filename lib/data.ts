export type Car = {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  km: number;
  fuel: "Petrol" | "Diesel" | "CNG" | "Electric";
  transmission: "Manual" | "Automatic";
  ownership: string;
  body: string;
  city: string;
  color: string;
  insurance: string;
  image: string;
  video: string;
  views: number;
  valueScore: number;
  negotiable: boolean;
  featured: boolean;
  description: string;
  badges: string[];
};

export const cars: Car[] = [
  {
    id: "creta-2020-ranchi",
    title: "Hyundai Creta SX 2020",
    brand: "Hyundai",
    model: "Creta SX",
    year: 2020,
    price: 975000,
    km: 42000,
    fuel: "Diesel",
    transmission: "Manual",
    ownership: "First owner",
    body: "SUV",
    city: "Ranchi",
    color: "Polar White",
    insurance: "Valid till Sep 2026",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1400&q=85",
    video: "Walkaround ready",
    views: 2840,
    valueScore: 94,
    negotiable: true,
    featured: true,
    description:
      "A clean family SUV with verified documents, strong diesel torque, fresh detailing, and a transparent negotiation path through Auto Link.",
    badges: ["RC Verified", "Insurance Checked", "Service History"]
  },
  {
    id: "baleno-2021-ranchi",
    title: "Maruti Baleno Zeta 2021",
    brand: "Maruti",
    model: "Baleno Zeta",
    year: 2021,
    price: 615000,
    km: 31000,
    fuel: "Petrol",
    transmission: "Manual",
    ownership: "First owner",
    body: "Hatchback",
    city: "Ranchi",
    color: "Nexa Blue",
    insurance: "Valid till Dec 2026",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1400&q=85",
    video: "Interior reel added",
    views: 1930,
    valueScore: 91,
    negotiable: true,
    featured: false,
    description:
      "Efficient city hatchback with low running cost, clean cabin, and verified ownership trail for buyers who want a smart daily car.",
    badges: ["RC Verified", "Loan Available"]
  },
  {
    id: "city-2019-ranchi",
    title: "Honda City VX CVT 2019",
    brand: "Honda",
    model: "City VX",
    year: 2019,
    price: 825000,
    km: 51000,
    fuel: "Petrol",
    transmission: "Automatic",
    ownership: "Second owner",
    body: "Sedan",
    city: "Ranchi",
    color: "Modern Steel",
    insurance: "Comprehensive active",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1400&q=85",
    video: "Test drive clip",
    views: 2465,
    valueScore: 89,
    negotiable: false,
    featured: true,
    description:
      "Smooth automatic sedan with premium cabin comfort, strong resale value, and verified paperwork for executive city use.",
    badges: ["Insurance Checked", "Ownership Verified"]
  },
  {
    id: "thar-2022-ranchi",
    title: "Mahindra Thar LX 2022",
    brand: "Mahindra",
    model: "Thar LX",
    year: 2022,
    price: 1425000,
    km: 19000,
    fuel: "Diesel",
    transmission: "Automatic",
    ownership: "First owner",
    body: "SUV",
    city: "Ranchi",
    color: "Napoli Black",
    insurance: "Zero dep active",
    image: "https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?auto=format&fit=crop&w=1400&q=85",
    video: "Off-road reel",
    views: 4180,
    valueScore: 96,
    negotiable: true,
    featured: true,
    description:
      "A high-demand lifestyle SUV with strong presence, automatic convenience, and premium listing support for fast closing.",
    badges: ["RC Verified", "Insurance Checked", "Fast Transfer"]
  }
];

export const wantedCars = [
  { id: 1, demand: "i20 under 6 lakh", budget: "₹6L", city: "Ranchi", matches: 4 },
  { id: 2, demand: "Automatic SUV for family", budget: "₹10L", city: "Bokaro", matches: 3 },
  { id: 3, demand: "First owner WagonR CNG", budget: "₹4.5L", city: "Hazaribagh", matches: 5 }
];

export const leads = [
  { name: "Ankit Kumar", intent: "Hot", car: "Hyundai Creta SX 2020", source: "WhatsApp", status: "Negotiating" },
  { name: "Priya Sinha", intent: "Warm", car: "Honda City VX CVT 2019", source: "Smart Search", status: "Follow-up" },
  { name: "Ravi Mehta", intent: "Hot", car: "Sell Car", source: "Seller Form", status: "Inspection" }
];

export const analytics = [
  { label: "Total Views", value: "42.8K", trend: "+18%" },
  { label: "WhatsApp Clicks", value: "1,284", trend: "+31%" },
  { label: "Conversion Rate", value: "12.6%", trend: "+4.2%" },
  { label: "Lead Sources", value: "7", trend: "Live" }
];
