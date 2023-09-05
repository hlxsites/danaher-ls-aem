// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './lib-franklin.js';

// Accessibe code for footer accessible options
import { accessible } from './lib-accessibe.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here
accessible()