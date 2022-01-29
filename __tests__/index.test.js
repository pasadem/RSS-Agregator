import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// eslint-disable-next-line no-underscore-dangle
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(__filename);
const getFixturePath = (filename) => path.resolve(__dirname, '__fixtures__', filename);
const readFixture = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');
