/**
 * Hand-authored pixel art for Rev, the othello disc.
 *
 * Each frame is a 14x14 grid of single characters:
 *   '.' empty      'o' disc body      '#' disc ring/outline
 *   'e' eye        'f' foot           'z' sleep puff
 *
 * Colours are NOT baked in here — `cells()` returns a semantic cell `type` and
 * Rev.svelte maps type + disc colour (+ theme) to a fill via CSS, so the sprite
 * recolours live when the disc flips black<->white or the theme changes.
 */

export const GRID = 14;

export type FrameKey = 'walkA' | 'walkB' | 'stand' | 'blink' | 'sleep' | 'squash';
export type CellType = 'body' | 'ring' | 'eye' | 'foot' | 'z';

// eyes-open middle row / eyes-closed middle row
const EYES = '#ooeooooooeoo#';
const SHUT = '#oooooooooooo#';

// shared disc silhouette (rows 0-11), feet appended per frame
const DISC: string[] = [
	'..............',
	'....######....',
	'..##oooooo##..',
	'.#oooooooooo#.',
	'.#oooooooooo#.',
	'#oooooooooooo#',
	EYES,
	'#oooooooooooo#',
	'#oooooooooooo#',
	'.#oooooooooo#.',
	'.#oooooooooo#.',
	'..##oooooo##..'
];

const FEET_UP = '...ff....ff...'; // both feet planted (row 12)
const FOOT_L = '...ff.........'; // left foot stepped down (row 13)
const FOOT_R = '.........ff...'; // right foot stepped down (row 13)
const EMPTY = '..............';

function withMiddle(mid: string): string[] {
	const rows = DISC.slice();
	rows[6] = mid;
	return rows;
}

export const frames: Record<FrameKey, string[]> = {
	// walk cycle: feet alternate stepping down
	walkA: [...withMiddle(EYES), FEET_UP, FOOT_L],
	walkB: [...withMiddle(EYES), FEET_UP, FOOT_R],
	// standing still
	stand: [...withMiddle(EYES), FEET_UP, EMPTY],
	// mid-blink (eyes shut)
	blink: [...withMiddle(SHUT), FEET_UP, EMPTY],
	// asleep: eyes shut + a little "zz" puff up top
	sleep: (() => {
		const rows = withMiddle(SHUT);
		rows[0] = '...........zz.';
		return [...rows, FEET_UP, EMPTY];
	})(),
	// squashed landing frame for the hop (disc nudged down, flattened base)
	squash: [
		EMPTY,
		EMPTY,
		'....######....',
		'..##oooooo##..',
		'.#oooooooooo#.',
		'.#oooooooooo#.',
		EYES,
		'#oooooooooooo#',
		'#oooooooooooo#',
		'.#oooooooooo#.',
		'..##oooooo##..',
		'...oooooooo...',
		FEET_UP,
		EMPTY
	]
};

const CHAR_TO_TYPE: Record<string, CellType | undefined> = {
	o: 'body',
	'#': 'ring',
	e: 'eye',
	f: 'foot',
	z: 'z'
};

export interface Cell {
	x: number;
	y: number;
	type: CellType;
}

/** Flatten a frame into drawable 1x1 cells (empty cells omitted). */
export function cells(frame: string[]): Cell[] {
	const out: Cell[] = [];
	for (let y = 0; y < frame.length; y++) {
		const row = frame[y];
		for (let x = 0; x < row.length; x++) {
			const type = CHAR_TO_TYPE[row[x]];
			if (type) out.push({ x, y, type });
		}
	}
	return out;
}
