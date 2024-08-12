init:
	docker compose run --rm cdktf npm install

dev:
	docker compose run --rm cdktf bash

test:
	docker compose run --rm cdktf npm run test
