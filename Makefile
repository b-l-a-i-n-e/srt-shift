.PHONY: test

test:
	mkdir .test
	./srt-shift -i sample.srt -o .test/sample-shifted.srt -s +120
	./srt-shift -i .test/sample-shifted.srt -o .test/sample-shifted-back.srt -s -120
	diff sample.srt .test/sample-shifted-back.srt
	rm -rf .test
