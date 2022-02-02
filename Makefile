install: 
	npm install

prettier:
	npx prettier --write ./src/ ./__tests__/

lint:
	npx eslint 

test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8

build:
	npm run build

start:
	npm run start