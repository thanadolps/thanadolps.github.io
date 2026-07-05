import type { CraftItem } from './types';

export const craft: CraftItem[] = [
	{
		name: 'snss',
		lang: 'Rust',
		blurb: 'Parser for Chrome’s SNSS session files, so closed tabs are never really gone.',
		url: 'https://github.com/thanadolps/snss'
	},
	{
		name: 'bitboard_xo',
		lang: 'Rust',
		blurb: 'Tic-tac-toe as a bitboard. The whole game state fits in 32 bits.',
		url: 'https://crates.io/crates/bitboard_xo'
	},
	{
		name: 'community-archiver',
		lang: 'Rust',
		blurb:
			'Scraper and archival pipeline for YouTube community posts, built in a hurry when a channel I followed was about to disappear.',
		url: 'https://github.com/thanadolps/community-archiver'
	},
	{
		name: 'lyricpcg',
		lang: 'Rust',
		blurb: 'Turns songs into Anki cards: lyrics, furigana, and clipped audio. Part of my Japanese study kit.',
		note: 'publishing soon'
	},
	{
		name: 'anki_utils',
		lang: 'Rust',
		blurb: 'CLI that enriches my Anki cards with dictionary entries, pronunciation audio, and spelling variants.',
		url: 'https://github.com/thanadolps/anki_utils'
	},
	{
		name: 'palette_100C',
		lang: 'Rust',
		blurb: 'Generates a color-training Anki deck with Okhsl color math, written straight into the collection database.',
		note: 'publishing soon'
	},
	{
		name: 'leetcode_scaffold',
		lang: 'Rust',
		blurb: 'Give it a LeetCode problem id, get a ready-to-run Rust package with the testcases wired up.',
		url: 'https://github.com/thanadolps/leetcode_scaffold'
	},
	{
		name: 'alt',
		lang: 'Rust',
		blurb: 'A small interpreted language, written to find out how languages work from the inside.',
		url: 'https://github.com/thanadolps/alt'
	},
	{
		name: 'raytracer',
		lang: 'Rust',
		blurb: 'The obligatory Rust raytracer. Spheres, shadows, and a weekend that disappeared.',
		url: 'https://github.com/thanadolps/raytracer'
	}
];
