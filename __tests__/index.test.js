import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import {
  screen, fireEvent, waitFor,
} from '@testing-library/dom';
// import userEvent from '@testing-library/user-event';
// import { rest } from 'msw';
// import { setupServer } from 'msw/node';
import fs from 'fs';
import nock from 'nock';
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

const proxyUrl = 'https://hexlet-allorigins.herokuapp.com';

const rssUrl = 'https://ru.hexlet.io/lessons.rss';
const index = path.join('__fixtures__', 'index.html');
const initHtml = fs.readFileSync(index, 'utf-8');
const htmlUrl = 'https://ru.hexlet.io/';
let elements;
const nockHeaders = {
  'Access-Control-Allow-Origin': '*',
};

beforeEach(() => {
  document.body.innerHTML = initHtml;
  app();

  elements = {
    input: screen.getByTestId('input'),
    form: screen.getByTestId('rss-form'),
    feedback: screen.getByTestId('feedback'),
  };
});

test('invalid url', async () => {
  fireEvent.input(elements.input, { target: { value: 'wrong' } });
  fireEvent.submit(elements.form);
  await waitFor(() => expect(screen.getByText('Ссылка должна быть валидным URL')));
});

test('invalid Rss', async () => {
  nock('https://hexlet-allorigins.herokuapp.com')
    .get(`/get?disableCache=true&url=${htmlUrl}`)
    .reply(200, { contents: 'wrong' }, nockHeaders);

  fireEvent.input(elements.input, {
    target: { value: htmlUrl },
  });
  fireEvent.submit(elements.form);
  await waitFor(() => expect(screen.getByText('Ресурс не содержит валидный RSS')));
});
/* const server = setupServer(
  rest.get(corsProxyApi, (req, res, ctx) => res(ctx.json({ contents: rss1 }))),
);

beforeAll(() => {
  server.listen();
});

afterAll(() => {
  server.close();
});

beforeEach(async () => {
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
    .toBeInTheDocument()));
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
 */
