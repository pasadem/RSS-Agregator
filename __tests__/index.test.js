import '@testing-library/jest-dom';
import {
  screen, fireEvent, waitFor,
} from '@testing-library/dom';
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

const rss1 = readFixture('rss1.xml');

const rssUrl = 'https://ru.hexlet.io/lessons.rss';
// const index = path.join(__dirname, '..', '__fixtures__', 'index.html');
// const initHtml = fs.readFileSync(index, 'utf-8');
const htmlUrl = 'https://ru.hexlet.io';

beforeEach(async () => {
  const initHtml = readFixture('index.html');
  document.body.innerHTML = initHtml;

  await app();
});

test('succesLoadUrl', async () => {
  fireEvent.input(screen.getByRole('textbox', { name: 'url' }), rssUrl);
  fireEvent.click(screen.getByRole('button', { name: 'add' }));

  await waitFor(() => expect(screen.findByText(/RSS успешно загружен/i)
    .then(() => {})));
});

test('validation (unique)', async () => {
  fireEvent.input(screen.getByRole('textbox', { name: 'url' }), rssUrl);
  fireEvent.click(screen.getByRole('button', { name: 'add' }));

  await waitFor(() => expect(screen.findByText(/RSS успешно загружен/i)
    .then(() => {})));

  fireEvent.input(screen.getByRole('textbox', { name: 'url' }), rssUrl);
  fireEvent.click(screen.getByRole('button', { name: 'add' }));

  await waitFor(() => expect(screen.findByText(/RSS уже существует/i)
    .then(() => {})));
});

test('invalidUrl', async () => {
  fireEvent.input(screen.getByRole('textbox', { name: 'url' }), 'wrong');
  fireEvent.click(screen.getByRole('button', { name: 'add' }));

  await waitFor(() => expect(screen.findByText(/Ссылка должна быть валидным URL/i)
    .then(() => {})));
});

test('handling non-rss url', async () => {
  fireEvent.input(screen.getByRole('textbox', { name: 'url' }), htmlUrl);
  fireEvent.click(screen.getByRole('button', { name: 'add' }));

  await waitFor(() => expect(screen.findByText(/Ресурс не содержит валидный RSS/i)
    .then(() => {})));
});

test('handle failed loading', async () => {
  expect(screen.getByRole('textbox', { name: 'url' })).not.toHaveAttribute('readonly');
  expect(screen.getByRole('button', { name: 'add' })).toBeEnabled();

  fireEvent.input(screen.getByRole('textbox', { name: 'url' }), htmlUrl);
  fireEvent.click(screen.getByRole('button', { name: 'add' }));

  await waitFor(() => {
    expect(screen.getByRole('textbox', { name: 'url' })).toHaveAttribute('readonly');
  });
  expect(screen.getByRole('button', { name: 'add' })).toBeDisabled();

  await waitFor(() => {
    expect(screen.getByRole('textbox', { name: 'url' })).not.toHaveAttribute('readonly');
  });
  expect(screen.getByRole('button', { name: 'add' })).toBeEnabled();
});

test('feeds and posts', async () => {
  fireEvent.input(screen.getByRole('textbox', { name: 'url' }), rss1);
  fireEvent.click(screen.getByRole('button', { name: 'add' }));
    expect(await screen.findByText(/Новые уроки на Хекслете/i)).toBeInTheDocument();
    expect(await screen.findByText(/Практические уроки по программированию/i)).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: /Агрегация \/ Python: Деревья/i })).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: /Traversal \/ Python: Деревья/i })).toBeInTheDocument();
});