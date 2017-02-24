var Lazy = require('lazy');
var fs = require('fs');

var _matchSepartor = function(separatorBytes, chunk, index) {
    var len = chunk.length;
    var targetLen = index + separatorBytes.length;
    if (targetLen > len) return false;

    for (var i = index; i < targetLen; i++) {
        if (chunk[i] != separatorBytes[i - index]) return false;
    };

    return true;
};

var readLine = function(inputStream, separator) {
    separator = separator || '\n';
    var separatorBytes = [];
    for (var i = 0, l = separator.length; i < l; i++) {
        separatorBytes.push(separator.charCodeAt(i));
    }

    var lazy = new Lazy(inputStream);
    lazy.__defineGetter__('smartLines', function() {
        return this.bucket([], function(chunkArray, chunk) {
            var lastNewLineIndex = 0;
            if (typeof chunk === 'string') chunk = new Buffer(chunk);
            if (chunk) {
                for (var i = 0; i < chunk.length; i++) {
                    if (i < lastNewLineIndex) {
                        continue;
                    } else if (_matchSepartor(separatorBytes, chunk, i)) {
                        // If we have content from the current chunk to append to our buffers, do it.
                        if (i > 0) {
                            chunkArray.push(chunk.slice(lastNewLineIndex, i));
                        }

                        // Wrap all our buffers and emit it.
                        this(Buffer.concat(chunkArray));
                        chunkArray = [];
                        lastNewLineIndex = i + separatorBytes.length;
                    }
                }
            }

            if (lastNewLineIndex > 0) {
                // New line found in the chunk, push the remaining part of the buffer.
                if (lastNewLineIndex < chunk.length) {
                    chunkArray.push(chunk.slice(lastNewLineIndex));
                }
            } else {
                // No new line found, push the whole buffer.
                if (chunk && chunk.length) {
                    chunkArray.push(chunk);
                }
            }
            return chunkArray;
        });
    }.bind(lazy));

    return lazy.smartLines.map(function(x) {
        return x.toString();
    });
};

var readLineFromFile = function (fileName, separator) {
    return readLine(fs.createReadStream(fileName), separator);
};

exports.readLine = readLine;
exports.readLineFromFile = readLineFromFile;
