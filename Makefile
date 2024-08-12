init:
	docker-compose run --rm cdktf npm install

unit-test:
	docker-compose run --rm cdktf npm test
