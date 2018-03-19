install: install-deps

start:
	npm start

dev:
	npm run webpack -- --watch --env development

d:
	npm run webpack -- --env development

install-deps:
	npm install

build:
	rm -rf dist
	npm run webpack -- -p --env production

test:
	npm test

lint:
	npm run eslint src

publish:
	npm publish

.PHONY: test
