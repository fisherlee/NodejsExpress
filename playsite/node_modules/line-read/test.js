var test = require('ava');
var readline = require('./index');

test('get from file \\n', function (t) {
    t.plan(1);
    var expected = ['line 0',
        'line 1',
        'line 2',
        'line 3',
        'line 4',
        'line 5',
        'line 6',
        'line 7',
        'line 8',
        'line 9'
    ];
    readline.readLineFromFile('./test_newline_n', '\n').join(function(xs) {
        t.same(xs, expected);
    });
});

test('get from file \\r\\n', function (t) {
    t.plan(1);
    var expected = ['line 0',
        'line 1',
        'line 2',
        'line 3',
        'line 4',
        'line 5',
        'line 6',
        'line 7',
        'line 8',
        'line 9'
    ];
    readline.readLineFromFile('./test_newline_rn', '\r\n').join(function(xs) {
        t.same(xs, expected);
    });
});
