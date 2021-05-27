srt-shift
=========
Shift srt subtitle files by milliseconds.

## Motivation
Sometimes subtitles do not match with a video and are  either slightly behind or ahead by a couple hundred milliseconds. You can use this command line tool, `srt-shift` to add or subtract milliseconds to all the subtitles and fix the offset. Also I wanted to create a nodejs program without publishing to the npm registry. So experimenting with `ncc` and Makefile for building up the program.

An example subtitle file looks like below.
```text
1
00:02:22,415 --> 00:02:24,747
Hello, Mrs.
MacGruder. Hello, Miss Daniels.

2
00:02:24,817 --> 00:02:27,945
Have you ever seen so many
gulls? What do you suppose it is?

3
00:02:28,020 --> 00:02:32,013
There must be a storm at sea.
That can drive them inland, you know.
```
`srt-shift` shifts all the timestamps by a specified amount of milliseconds. so 
```shell
srt-shift -i sample.srt -o shifted.srt -s +1234
```
Would shift all timestamps by 1234 milliseconds forward and save into a new file called `shifted.srt`.

## Test
Uses a makefile to run some basic tests.
```shell
make test
```

## Build Binary
Uses a makefile to install node_modules and "compile" a nodejs executable in `bin/srt-shift`.
```shell
make
```

## Install
This is not `npm install` -- this install will save the executable `bin/srt-shift` into your home `~/bin` directory if you have one.
```shell
make install
```

## Example Command Usage
```shell
# shift all subtitles in sample.srt by 4242 
# milliseconds forward and save into new file
# called shifted.srt
srt-shift -i sample.srt -o shifted.srt -s +4242
```

