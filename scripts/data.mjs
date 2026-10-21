import { readFileSync } from 'node:fs';
import { parse } from 'yaml';

const load = name => parse(readFileSync(new URL('../data/' + name, import.meta.url), 'utf8'));
export const { links, locales } = load('content.yaml');
export const publications = load('publications.yaml');
