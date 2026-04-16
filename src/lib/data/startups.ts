/* ─── Startup Data Model ─────────────────────────────────────────────── */

export interface Startup {
  id: string;
  name: string;
  sector: string;
  stage: "Active" | "Graduated" | "Alumni";
  cohortYear: string;
  description: string;
  founders: string;
  website?: string;
}

/* ─── Seed Data ──────────────────────────────────────────────────────── */

export const startupsData: Startup[] = [
  {
    id: "novabio-diagnostics",
    name: "NovaBio Diagnostics",
    sector: "Health-Tech",
    stage: "Active",
    cohortYear: "2024",
    description:
      "AI-powered rapid diagnostics platform that reduces disease detection time by 80% using edge-deployed ML models on low-cost lateral flow readers.",
    founders: "Arjun Mehta, Dr. Priya Chandra",
    website: "https://novabio.in",
  },
  {
    id: "aethon-robotics",
    name: "Aethon Robotics",
    sector: "Industry 4.0",
    stage: "Active",
    cohortYear: "2024",
    description:
      "Autonomous inspection drones for critical infrastructure — bridges, power lines, and oil pipelines — using computer vision and real-time anomaly detection.",
    founders: "Rahul Verma, Sneha Iyer",
    website: "https://aethonrobotics.io",
  },
  {
    id: "greenvolt-systems",
    name: "GreenVolt Systems",
    sector: "Clean-Tech & EV",
    stage: "Active",
    cohortYear: "2023",
    description:
      "Next-generation EV battery management systems optimised for Indian road conditions — extending battery life by 35% through adaptive thermal algorithms.",
    founders: "Vikram Nair",
    website: undefined,
  },
  {
    id: "neuralcore-ai",
    name: "NeuraCore AI",
    sector: "AI & Deep Tech",
    stage: "Graduated",
    cohortYear: "2023",
    description:
      "Edge-AI inference chips delivering LLM-class intelligence at milliwatt power budgets — purpose-built for IoT devices and embedded systems.",
    founders: "Dr. Siddharth Rao, Kavya Menon",
    website: "https://neuracoreai.com",
  },
  {
    id: "fabrisense-iot",
    name: "FabriSense IoT",
    sector: "Industry 4.0",
    stage: "Alumni",
    cohortYear: "2022",
    description:
      "Smart textile sensors enabling real-time worker safety monitoring on factory floors. Deployed across 12 manufacturing plants in UP and Haryana.",
    founders: "Ananya Singh, Rohan Dubey",
    website: "https://fabrisense.io",
  },
  {
    id: "immersavr",
    name: "ImmersaVR",
    sector: "AI & Deep Tech",
    stage: "Alumni",
    cohortYear: "2022",
    description:
      "Surgical training simulations using photorealistic mixed-reality environments. Partnered with 3 AIIMS hospitals for resident training programmes.",
    founders: "Dr. Aditya Kumar",
    website: "https://immersavr.health",
  },
  {
    id: "solargrids",
    name: "SolarGrids",
    sector: "Clean-Tech & EV",
    stage: "Alumni",
    cohortYear: "2022",
    description:
      "Distributed solar micro-grid platform for rural communities. Powers 120+ villages across Rajasthan and Uttar Pradesh with pay-as-you-go solar energy.",
    founders: "Tanya Kapoor, Manish Sharma",
    website: undefined,
  },
  {
    id: "medivault",
    name: "MediVault",
    sector: "Health-Tech",
    stage: "Active",
    cohortYear: "2024",
    description:
      "Blockchain-secured patient health records platform giving individuals sovereign control over their medical data across hospitals and clinics.",
    founders: "Ishaan Bose",
    website: "https://medivault.health",
  },
];

/* ─── Derived filter options (auto-generated from data) ─────────────── */

export const SECTORS = [
  "All Sectors",
  ...Array.from(new Set(startupsData.map((s) => s.sector))).sort(),
];

export const STAGES = ["All Stages", "Active", "Graduated", "Alumni"] as const;
