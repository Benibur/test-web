REPORTER = spec
UI = bdd
COMPILER = coffee:coffee-script/register

all: build

build:
	@./node_modules/coffee-script/bin/coffee \
		-c \
		-o lib src

clean:
	rm -rf lib
	mkdir lib

watch:
	@./node_modules/coffee-script/bin/coffee \
		-o lib \
		-cw src

test:
	@./node_modules/mocha/bin/mocha \
		--reporter $(REPORTER) \
		--compilers $(COMPILER) \
		--ui $(UI) \
		test/*.coffee

.PHONY: build clean watch test
