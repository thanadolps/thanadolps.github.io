import type { ExperienceItem } from './types';

export const experience: ExperienceItem[] = [
	{
		period: '2024 — now',
		org: 'SmarterTravel',
		role: 'Software Engineer',
		detail: 'Backend and data platform work: Go, SvelteKit, Snowflake, dbt, Kafka, Kubernetes.',
		kind: 'work'
	},
	{
		period: '2026',
		org: 'Freelance',
		role: 'Full-stack developer',
		detail: 'Solo delivery of Triage, a patient triage and records system for a Thai healthcare provider.',
		kind: 'freelance'
	},
	{
		period: '2023 — 2024',
		org: 'PTTEP',
		role: 'Backend Developer (contract)',
		detail: 'Go backend for the BIF environmental-DNA platform. Schema-first, tested against real Postgres.',
		kind: 'work'
	},
	{
		period: '2023',
		org: 'Chulalongkorn University',
		role: 'Teaching Assistant, Database Systems',
		detail: 'Taught, graded, and kept the lab running for the 2023 course.',
		kind: 'work'
	},
	{
		period: '2023',
		org: 'OxygenAI',
		role: 'Backend Developer (internship)',
		detail: 'Go + PocketBase backend for time-series dashboards. TimescaleDB, MessagePack, and WebSocket pushed query throughput up around fivefold.',
		kind: 'work'
	},
	{
		period: '2020 — 2024',
		org: 'Chulalongkorn University',
		role: 'B.E. Computer Engineering',
		detail: 'GPAX 3.87. Four years staffing the Games Research and Development club.',
		kind: 'education'
	}
];
