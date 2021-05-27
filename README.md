srt-shift
=========
Shift srt subtitle files by milliseconds.

## Install
```shell
npm install
```

## Test
```shell
make test
```

## Build Binary
```shell
make
```
Creates binary in bin/ directory.

## Example 
```shell
# shift all subtitles in sample.srt by 4242 
# milliseconds forward and save into new file
# called shifted.srt
srt-shift -i sample.srt -o shifted.srt -s +4242
```

