import type { PlaygroundDemo } from './types';

export const demos: PlaygroundDemo[] = [
	{
		id: 'othello',
		name: 'Othello, in Rust, in your browser',
		blurb:
			'An othello engine with an AI opponent, written in Rust in 2020 and compiled to WebAssembly. Playable exactly as it shipped back then.',
		src: '/othello-wasm/',
		poster: '/legacy/Card Image/othello.PNG',
		sourceUrl: 'https://github.com/thanadolps/othello-wasm',
		aspect: '4 / 3'
	},
	{
		id: 'malpi',
		name: 'MALPI',
		blurb:
			'An MNIST autoencoder running on TensorFlow.js. Slide along principal components of the latent space and watch digits melt into each other. From 2019, still going.',
		src: '/MALPI/index.html',
		poster: '/legacy/Card Image/MALPI.png',
		sourceUrl: 'https://github.com/thanadolps/thanadolps.github.io/tree/legacy',
		aspect: '4 / 3'
	}
];
