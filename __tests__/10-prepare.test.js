import '@testing-library/jest-dom';
import { screen, fireEvent, waitFor, getByRole } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import app from '../src/app.js';

// eslint-disable-next-line no-underscore-dangle
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFixture = (filename) => {
  const fixturePath = getFixturePath(filename);

  const rss = fs.readFileSync(fixturePath, 'utf-8');
  return rss;
};

const rssUrl = 'https://ru.hexlet.io/lessons.rss';
const index = path.join(__dirname, '..', '__fixtures__', 'index.html');
const initHtml = fs.readFileSync(index, 'utf-8');
const htmlUrl = 'https://ru.hexlet.io';

beforeEach(async () => {
  const initHtml = readFixture('index.html');
  document.body.innerHTML = initHtml;
  await app();

});

test('succesLoadUrl', async () => {
  fireEvent.input(screen.getByRole('textbox', { name: 'url' }), rssUrl);
  fireEvent.click(screen.getByRole('button', { name: 'add' }));
  
  await waitFor(() => expect(screen.findByText(/RSS успешно загружен/i)));
});

test('validation (unique)', async () => {
  fireEvent.input(screen.getByRole('textbox', { name: 'url' }), rssUrl);
  fireEvent.click(screen.getByRole('button', { name: 'add' }));
  
  await waitFor(() => expect(screen.findByText(/RSS успешно загружен/i)));

  fireEvent.input(screen.getByRole('textbox', { name: 'url' }), rssUrl);
  fireEvent.click(screen.getByRole('button', { name: 'add' }));
  
  await waitFor(() => expect(screen.findByText(/RSS уже существует/i)));
});

test('invalidUrl', async () => {
  fireEvent.input(screen.getByRole('textbox', { name: 'url' }), 'wrong');
  fireEvent.click(screen.getByRole('button', { name: 'add' }));
  
  await waitFor(() => expect(screen.findByText(/Ссылка должна быть валидным URL/i)));
});

test('handling non-rss url', async () => {
  fireEvent.input(screen.getByRole('textbox', { name: 'url' }), htmlUrl);
  fireEvent.click(screen.getByRole('button', { name: 'add' }));
  
  await waitFor(() => expect(screen.findByText(/Ресурс не содержит валидный RSS/i)));
});
