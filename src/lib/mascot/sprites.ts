/**
 * Hand-authored pixel art for Rev, the little terracotta crab.
 *
 * Each frame is a 16x14 grid of single characters:
 *   '.' empty      'B' shell body      'C' claw / deep outline
 *   'L' leg        'W' eye white       'z' sleep puff
 *
 * Colours are NOT baked in here — `cells()` returns a semantic cell `type` and
 * Rev.svelte maps type -> a CSS custom property (--mascot / --mascot-deep /
 * --paper-raised / --ink / --muted), so the crab recolours live with the theme.
 *
 * Eyes: the sprite only defines the eye WHITES (the sockets). The pupil is a
 * separate layer the renderer positions each frame for cursor tracking — see
 * EYE_L / EYE_R below, which give the centre cell of each socket. A pupil sits
 * there by default and shifts +/-1 cell toward the cursor, staying inside the
 * 3x3 white.
 */

export const GRID_W = 16;
export const GRID_H = 14;

export type FrameKey = 'walkA' | 'walkB' | 'stand' | 'blink' | 'sleep' | 'wave' | 'squash';
export type CellType = 'body' | 'claw' | 'leg' | 'eyeWhite' | 'z';

/** Centre cell of each eye white (grid coords) — the renderer anchors pupils here. */
export const EYE_L = { x: 4, y: 1 } as const;
export const EYE_R = { x: 11, y: 1 } as const;

// --- row primitives (each MUST be exactly 16 chars) ---
const EMPTY = '................';

// eyes open: two 3x3 whites (cols 3-5 and 10-12, rows 0-2)
const EW = '...WWW....WWW...';
// eyes shut: a deep lid line where the whites were (row 2 only)
const ECL = '...CCC....CCC...';
// a little "zz" puff up in the corner while asleep
const ZP = '.............zz.';

// shell + eye stalks (rows 3-9, constant across the standing/walking poses)
const ST = '....C......C....'; // stalks rising to the eyes (cols 4, 11)
const R4 = '...CCCCCCCCCC...'; // shell top rim
const R5 = '..CBBBBBBBBBBC..'; // shell, deep side rim
const R6 = 'CCBBBBBBBBBBBBCC'; // widest row + claws poking out the sides
const R7 = 'CCBBBBBBBBBBBBCC';
const R8 = '..CBBBBBBBBBBC..';
const R9 = '...CBBBBBBBBC...'; // shell underside

// legs (rows 10-11): 3 per side at cols 3,5,7 (left) and 8,10,12 (right)
const LEGS_STAND = '...L.L.LL.L.L...'; // all planted
const WA_UP = '.....L....L.....'; // middle legs lifted (cols 5, 10)
const WA_DN = '...L...LL...L...'; // outer legs planted (cols 3,7,8,12)

// wave pose: right claw raised high; the normal right claw is gone (arm is up)
const EWc = '...WWW....WWW.CC'; // raised claw tip alongside the eyes
const STw = '....C......C..C.'; // stalks + raised claw arm (col 14)
const R6r = 'CCBBBBBBBBBBBB..'; // right side claw removed
const R7r = 'CCBBBBBBBBBBBB..';

// squash pose: flattened & wider, legs tucked (for the hop take-off / landing)
const Q4 = '..CCCCCCCCCCCC..';
const Q5 = '.CBBBBBBBBBBBBC.';

export const frames: Record<FrameKey, string[]> = {
	// walk cycle: legs alternate lifted / planted
	walkA: [EW, EW, EW, ST, R4, R5, R6, R7, R8, R9, WA_UP, WA_DN, EMPTY, EMPTY],
	walkB: [EW, EW, EW, ST, R4, R5, R6, R7, R8, R9, WA_DN, WA_UP, EMPTY, EMPTY],
	// standing still, legs planted
	stand: [EW, EW, EW, ST, R4, R5, R6, R7, R8, R9, EMPTY, LEGS_STAND, EMPTY, EMPTY],
	// mid-blink (eyes shut)
	blink: [EMPTY, EMPTY, ECL, ST, R4, R5, R6, R7, R8, R9, EMPTY, LEGS_STAND, EMPTY, EMPTY],
	// asleep: eyes shut + a little "zz" puff
	sleep: [ZP, EMPTY, ECL, ST, R4, R5, R6, R7, R8, R9, EMPTY, LEGS_STAND, EMPTY, EMPTY],
	// one claw raised high in greeting
	wave: [EW, EWc, EWc, STw, R4, R5, R6r, R7r, R8, R9, EMPTY, LEGS_STAND, EMPTY, EMPTY],
	// squashed, wider, legs tucked (hop take-off / landing; airborne offset is the renderer's)
	squash: [EMPTY, EMPTY, EW, ST, Q4, Q5, R6, Q5, Q4, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY]
};

const CHAR_TO_TYPE: Record<string, CellType | undefined> = {
	B: 'body',
	C: 'claw',
	L: 'leg',
	W: 'eyeWhite',
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

/** True when a frame shows open eyes (so the renderer should draw pupils). */
export function eyesOpen(key: FrameKey): boolean {
	return key !== 'blink' && key !== 'sleep';
}
