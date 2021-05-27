.PHONY: all test clean

all: bin/srt-shift

clean:
	rm -rf bin/
	rm -rf dist/
	rm -rf .test/

dist/index.js:
	npx ncc build src/cli.js -o dist/

bin/srt-shift: dist/index.js
	mkdir -p bin/
	cp dist/index.js bin/srt-shift
	chmod +x bin/srt-shift

test: bin/srt-shift
	./test.sh
