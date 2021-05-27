.PHONY: all test clean install

all: bin/srt-shift

clean:
	rm -rf bin/
	rm -rf dist/
	rm -rf .test/

node_modules:
	npm install

dist/index.js: node_modules
	npx ncc build src/cli.js -o dist/

bin/srt-shift: dist/index.js
	mkdir -p bin/
	cp dist/index.js bin/srt-shift
	chmod +x bin/srt-shift

install:
	cp bin/srt-shift $(HOME)/bin

test: bin/srt-shift
	./test.sh
