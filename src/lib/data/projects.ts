import type { Project } from './types';

export const projects: Project[] = [
	{
		id: 'anachronic',
		name: 'Anachronic',
		window: 'anachronic.exe',
		years: '2023',
		tagline: 'Puzzle platformer built around bending time. National champion.',
		description: [
			'A 2D puzzle platformer where the central trick is time: bend it to get past ruins that will not yield to jumping alone.',
			'It won Game Talent Showcase 2023 outright and picked up "Talent of the Year" and "Best of Technology" on the way. Built in Unity.'
		],
		tech: ['Unity', 'C#'],
		award: '1st place · Game Talent Showcase 2023 · Talent of the Year · Best of Technology',
		links: [{ label: 'Play on itch.io', url: 'https://yonderu.itch.io/anachronic' }],
		image: '/projects/anachronic-cover.png',
		imageAlt: 'Anachronic cover art: a character amid mystical ruins'
	},
	{
		id: 'pttep-edna',
		name: 'PTTEP-BIF eDNA backend',
		window: 'edna_backend.go',
		years: '2023–2024',
		tagline: 'Go backend for an environmental-DNA platform, delivered under contract to PTTEP.',
		description: [
			'PTTEP surveys marine biodiversity around its offshore platforms; this system stores and serves the environmental-DNA data behind that work.',
			'I designed it schema-first. The OpenAPI spec and SQL come first, oapi-codegen and sqlc generate the boundaries, so handwritten code cannot drift from the contract. Integration tests run against real Postgres in Testcontainers.',
			'Client image loads from MinIO were the slow spot. Just-in-time resizing fixed that instead of shipping full-size originals.'
		],
		tech: ['Go', 'PostgreSQL', 'OpenAPI', 'sqlc', 'MinIO', 'Testcontainers'],
		links: [{ label: 'Internal system', note: 'delivered May 2024, no public link' }]
	},
	{
		id: 'nameless-maid',
		name: 'The Nameless Maid',
		window: 'nameless_maid.exe',
		years: '2022',
		tagline: 'Pixel-art roguelite platformer, made with an 11-person team.',
		description: [
			'A roguelite platformer: 27 rooms, 3 bosses, one nameless maid. Built in Unity by an 11-person team from the Chula game dev club.',
			'It reached the final 30 at Game Talent Showcase 2022, and the playtest build is still up.'
		],
		tech: ['Unity', 'C#'],
		award: 'Top 30 finalist · Game Talent Showcase 2022',
		links: [{ label: 'Playtest on itch.io', url: 'https://yonderu.itch.io/the-nameless-maid-play-test' }],
		image: '/projects/nameless-maid-cover.png',
		imageAlt: 'The Nameless Maid cover art: pixel-art maid in a dark hallway'
	},
	{
		id: 'wigglepaw',
		name: 'WigglePaw',
		window: 'wigglepaw.tsx',
		years: '2023',
		tagline: 'Pet-sitting marketplace where the unglamorous parts got done properly.',
		description: [
			'A pet-sitting marketplace built with Next.js and tRPC for a software engineering course. My corner was the plumbing: Omise payments, Cloudflare R2 for object storage, docker-compose, CI, and the Cypress and Vitest suites that kept everyone honest.',
			'API docs generated straight from the tRPC router with trpc-panel.'
		],
		tech: ['Next.js', 'tRPC', 'TypeScript', 'Omise', 'Cloudflare R2', 'Cypress'],
		links: [
			{ label: 'Live demo', note: 'being brought back online' },
			{ label: 'Source', url: 'https://github.com/2110336-2565-2/sec33-group2-wigglepaw' }
		]
	},
	{
		id: 'triage',
		name: 'Triage',
		window: 'triage.svelte',
		years: '2026',
		tagline: 'Patient triage and records system for a Thai healthcare provider. Freelance, solo, end to end.',
		description: [
			'A patient triage and records system, delivered freelance to a Thai healthcare provider: requirements with the client, integration against their existing hospital information system (plus a mock of it for development), Docker packaging, documentation, handover.',
			'The hard part was not any single piece of tech. It was keeping scope honest and shipping something a small organization can actually run, on nights and weekends, while holding a full-time job.'
		],
		tech: ['SvelteKit', 'TypeScript', 'PostgreSQL', 'Docker'],
		links: [{ label: 'Private client work', note: 'no public link' }]
	}
];
