/**
 * All site content is typed data. Adding a project = one object here,
 * no component changes. See AGENTS.md for conventions.
 */

export interface ProjectLink {
	label: string;
	/** Absent url = intentional placeholder; `note` explains why. */
	url?: string;
	note?: string;
}

export interface Project {
	id: string;
	name: string;
	/** Mono titlebar text of the hover window, e.g. "anachronic.exe" */
	window: string;
	years: string;
	tagline: string;
	/** Paragraphs shown inside the hover window / mobile accordion. */
	description: string[];
	tech: string[];
	award?: string;
	links: ProjectLink[];
	/** Path under static/, e.g. "/projects/anachronic-cover.png" */
	image?: string;
	imageAlt?: string;
}

export interface PlaygroundDemo {
	id: string;
	name: string;
	blurb: string;
	/** Same-origin iframe src, loaded only after user clicks. */
	src: string;
	/** Facade image path under static/. */
	poster?: string;
	sourceUrl?: string;
	/** Approximate aspect ratio of the embed, e.g. "4 / 3". */
	aspect: string;
}

export interface CraftItem {
	name: string;
	blurb: string;
	lang: string;
	url?: string;
	note?: string;
}

export interface Award {
	year: string;
	title: string;
	detail: string;
	url?: string;
}

export interface ExperienceItem {
	period: string;
	org: string;
	role: string;
	detail: string;
	kind: 'work' | 'freelance' | 'education';
}
