import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import {
  screen, fireEvent, waitFor,
} from '@testing-library/dom';
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

// const html = readFixture('index.html');
const rss1 = readFixture('rss1.xml');

// const proxyUrl = 'https://hexlet-allorigins.herokuapp.com';

// const rssUrl = 'https://ru.hexlet.io/lessons.rss';
const index = path.join('__fixtures__', 'index.html');
const initHtml = fs.readFileSync(index, 'utf-8');
// const htmlUrl = 'https://ru.hexlet.io/';

// const server = setupServer();

let elements;

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
  nock('https://allorigins.hexlet.app')
    .get('/get?disableCache=true&url=https://ru.hexlet.io/')
    .reply(200, { contents: 'wrong' }, { 'Access-Control-Allow-Origin': '*' });

  fireEvent.input(elements.input, {
    target: { value: 'https://ru.hexlet.io/' },
  });
  fireEvent.submit(elements.form);
  await waitFor(() => expect(screen.getByText(/Ресурс не содержит валидный RSS/i)));
});

test('valid Rss', async () => {
  nock('https://allorigins.hexlet.app')
    .get('/get?disableCache=true&url=https://ru.hexlet.io/lessons.rss')
    .reply(200, { contents: rss1 }, { 'Access-Control-Allow-Origin': '*' });

  fireEvent.input(elements.input, {
    target: { value: 'https://ru.hexlet.io/lessons.rss' },
  });
  fireEvent.submit(elements.form);
  await waitFor(() => expect(screen.getByText(/RSS успешно загружен/i)));
});

test('duplicate Rss', async () => {
  nock('https://allorigins.hexlet.app')
    .get('/get?disableCache=true&url=https://ru.hexlet.io/lessons.rss')
    .reply(200, { contents: rss1 }, { 'Access-Control-Allow-Origin': '*' });

  fireEvent.input(elements.input, {
    target: { value: 'https://ru.hexlet.io/lessons.rss' },
  });
  fireEvent.submit(elements.form);
  await waitFor(() => expect(screen.getByText(/RSS успешно загружен/i)));

  fireEvent.input(elements.input, {
    target: { value: 'https://ru.hexlet.io/lessons.rss' },
  });
  fireEvent.submit(elements.form);
  await waitFor(() => expect(screen.getByText(/RSS уже существует/i)));
});

test('network error', async () => {
  nock('https://allorigins.hexlet.app')
    .get('/get?disableCache=true&url=https://ru.hexlet.io/lessons.rss')
    .reply(500);

  fireEvent.input(elements.input, {
    target: { value: 'https://ru.hexlet.io/lessons.rss' },
  });
  fireEvent.submit(elements.form);
  await waitFor(() => expect(screen.getByText(/Ошибка сети/i)));
});

test('successful loading', async () => {
  nock('https://allorigins.hexlet.app')
    .get('/get?disableCache=true&url=https://ru.hexlet.io/lessons.rss')
    .reply(200, { contents: rss1 }, { 'Access-Control-Allow-Origin': '*' });

  expect(screen.getByRole('textbox', { name: 'url' })).not.toHaveAttribute('readonly');
  expect(screen.getByRole('button', { name: 'add' })).toBeEnabled();

  fireEvent.input(screen.getByRole('textbox', { name: 'url' }));
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

test('loading feeds', async () => {
  nock('https://allorigins.hexlet.app')
    .get('/get?disableCache=true&url=https://ru.hexlet.io/lessons.rss')
    .reply(200, { contents: rss1 }, { 'Access-Control-Allow-Origin': '*' });

  fireEvent.input(elements.input, {
    target: { value: 'https://ru.hexlet.io/lessons.rss' },
  });
  fireEvent.submit(elements.form);
  await waitFor(() => expect(screen.getByText(/Новые уроки на Хекслете/i)));
  await waitFor(() => expect(screen.getByText(/Практические уроки по программированию/i)));
});
