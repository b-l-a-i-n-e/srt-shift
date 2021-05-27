#!/usr/bin/env bash

TIME=`date +%s`
TEST_DIR=.test/$TIME

mkdir -p $TEST_DIR

# shift forward
./bin/srt-shift -i sample.srt -o $TEST_DIR/sample-shifted.srt -s +120 > /dev/null
# shift back
./bin/srt-shift -i $TEST_DIR/sample-shifted.srt -o $TEST_DIR/sample-shifted-back.srt -s -120 > /dev/null
# original file and shifted file should be the same
diff sample.srt $TEST_DIR/sample-shifted-back.srt
