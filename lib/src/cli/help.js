printHelp = () => {
    process.stdout.write(
        [
            '\nUsage: node . [options] <command>',
            '',
            'where <command> is one of:',
            '',
            'parse      parse given files inside of the ./examples dir',
            'help       display full usage info',
            '',
            'options:',
            '   -d, --dir       specify directory of files to parse',
            '   -f, --filetype  specify which filetypes to parse (txt if not provided)',
            '   -h, --help      display full usage info',
            '   -o, --output    specify where to save the output file (./output if not provided)',
            '   -x, --dry-run   display output without generating a file',
            ''
        ].join('\n')
    );
};

module.exports = printHelp;
