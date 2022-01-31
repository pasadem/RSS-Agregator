import '@testing-library/jest-dom';
import { screen, fireEvent, waitFor } from '@testing-library/dom';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import app from '../src/app.js';

// eslint-disable-next-line no-underscore-dangle
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(__filename);
const getFixturePath = (filename) => path.resolve(__dirname, '__fixtures__', filename);
const readFixture = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

let elements;

beforeEach(() => {
  const initHtml = readFixture('index.html');
  document.body.innerHTML = initHtml;
  app();

  const elements = {
    form: screen.getByTestId('rss-form'),
    input: screen.getByTestId('input'),
    feedback: screen.getByTestId('feedback'),
  };
});

test('invalidUrl', async () => {
  fireEvent.input(elements.input, { target: { value: 'hskfh' } });
  fireEvent.form(elements.form);
  await waitFor(() => expect(screen.findByText('Ссылка должна быть валидным URL')));
});
