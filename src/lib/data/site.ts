export const site = {
	name: 'Thanadol Chitthamlerd',
	/** First name in Thai. Surname spelling unverified — do not add without checking with Thanadol. */
	nameThai: 'ธนดล',
	role: 'Software Engineer',
	company: 'SmarterTravel',
	location: 'Bangkok, Thailand',
	email: 'thanadolps@gmail.com',
	github: 'https://github.com/thanadolps',
	linkedin: 'https://www.linkedin.com/in/thanadol-chitthamlerd/',
	medium: 'https://medium.com/@thanadolps',
	resumePath: '/Resume_Thanadol_Chitthamlerd.pdf',
	legacySitePath: '/legacy/index.html',

	// <head> metadata
	title: 'Thanadol Chitthamlerd — Software Engineer',
	metaDescription:
		'Software engineer in Bangkok. Go and Rust on the backend, TypeScript and Svelte up front. Shipped hospital software solo and won a national game award.',
	url: 'https://thanadolps.github.io',

	hero: {
		kicker: 'Bangkok, Thailand · UTC+7',
		roleLine: 'Software engineer at SmarterTravel. Go and Rust on the backend, TypeScript and Svelte up front.',
		intro: [
			'I like software that holds up under inspection: schema-first APIs where the code cannot drift from the contract, tests that talk to a real database, small tools that earn their keep. Four years in a university game dev club left a mark too. One of those games took a national award.',
			'There is usually a half-finished Rust project open on my other monitor.'
		],
		/** One-line credibility strip under the intro — the three facts a 30-second skim should not miss. */
		proof: [
			'national champion, Game Talent Showcase 2023',
			'co-authored published ML research',
			'built a hospital triage system solo'
		]
	},

	sections: {
		projects: {
			title: 'Selected work',
			lede: 'Five projects. Open a name and it gets its own window.'
		},
		craft: {
			title: 'Craft shelf',
			lede: 'Smaller things, built mostly for myself.'
		},
		playground: {
			title: 'Playground',
			lede: 'Two experiments from my student years that run right here in the page.'
		},
		honors: { title: 'Papers & prizes' },
		experience: { title: 'Experience' },
		contact: { title: 'Contact' }
	},

	contact: {
		lede: 'Not job hunting at the moment, but my inbox is open. The fastest way to reach me is email.'
	},

	colophon:
		'Built with SvelteKit, set in Fraunces and IBM Plex. The crab in the corner is called Rev. No trackers.'
} as const;
