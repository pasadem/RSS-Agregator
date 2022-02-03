import '@testing-library/jest-dom';
import {
  screen, fireEvent, waitFor,
} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
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

const html = readFixture('index.html');
const rss1 = readFixture('rss1.xml');

const corsProxy = 'https://hexlet-allorigins.herokuapp.com';
const corsProxyApi = `${corsProxy}/get`;

const getResponseHandler = (url, data) => rest.get(corsProxyApi, (req, res, ctx) => {
  if (!req.url.searchParams.get('disableCache')) {
    console.error('Expect proxified url to have "disableCache" param');
    return res(ctx.status(500));
  }

  if (req.url.searchParams.get('url') !== url) {
    console.error('Expect proxified url to have "url" param with correct url');
    return res(ctx.status(500));
  }

  return res(
    ctx.status(200),
    ctx.json({ contents: data }),
  );
});

const server = setupServer();

beforeAll(() => {
  server.listen();
});

afterAll(() => {
  server.close();
});

const rssUrl = 'https://ru.hexlet.io/lessons.rss';
const index = path.join('__fixtures__', 'index.html');
const initHtml = fs.readFileSync(index, 'utf-8');
const htmlUrl = 'https://ru.hexlet.io';

beforeEach(async () => {
  // const initHtml = readFixture('index.html');
  document.body.innerHTML = initHtml;
  await app();
});

afterEach(() => {
  server.resetHandlers();
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
  const handler = getResponseHandler(htmlUrl, html);
  server.use(handler);
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
  const handler = getResponseHandler(rssUrl, rss1);
  server.use(handler);
  fireEvent.input(screen.getByRole('textbox', { name: 'url' }), rssUrl);
  fireEvent.click(screen.getByRole('button', { name: 'add' }));
  await waitFor(() => expect(screen.findByText(/Новые уроки на Хекслет/i)
    .then(() => {})));
  await waitFor(() => expect(screen.findByText(/Практические уроки по программированию/i)
    .then(() => {})));
  await waitFor(() => expect(screen.findByText(/Агрегация \/ Python: Деревья/i)
    .then(() => {})));
  await waitFor(() => expect(screen.findByText(/Traversal \/ Python: Деревья/i)
    .then(() => {})));
});
