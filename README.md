# parser

`parser` is a node project which will parse any files given a schema with which to define the data.

## Installation

Use the package manager [npm](https://nodejs.org/en/download/current/) to install `parser`. `parser` uses the latest experimental features of npm, but can also be run on the latest LTS version at the time of this writing (`v12.16.1`).

It's highly recommended to use a node management tool like [nvm](https://github.com/nvm-sh/nvm) to manage node versions among different projects.

```bash
nvm install 12.16.1 # or 13.10.1
nvm use 12.16.1
```

Inside the main directory

```bash
npm install
```

## Usage

```bash
$ ~/parser> node .
```

Will create an `export.txt` file inside of the `~/parser/exports` directory.

#### Schemas

Schemas should be defined and placed into a folder under `~/parser/schemas/[model]/model.json` and given a format like the following (person):

```json
{
    "fields": [
        { "firstName": { "type": "string" } },
        { "middleInitial": { "type": "string" } },
        { "lastName": { "type": "string" } },
        { "gender": { "type": "string" } },
        { "favoriteColor": { "type": "string" } },
        { "dob": { "type": "date" } }
    ],
    "sortDirections": [
        [
            { "field": "gender", "direction": "asc" },
            { "field": "lastName", "direction": "asc" }
        ],
        [
            { "field": "dob", "direction": "asc" },
            { "field": "lastName", "direction": "asc" }
        ],
        [{ "field": "lastName", "direction": "desc" }]
    ]
}
```

and then parsed using

```bash
$ ~/parser> node . --schema "person" --delim "|" parse
```

Each entry in `sortDirections[]` will create a chunk of sorted data inside of the `export.txt`.

### Experimental (WIP)

#### help

```
$ ~/parser> node . help

Usage: node . [options] <command>

where <command> is one of:

parse      parse given files inside of the ./examples dir
help       display full usage info

options:
   -d, --dir       specify directory of files to parse
   -f, --filetype  specify which filetypes to parse (txt if not provided)
   -h, --help      display full usage info
   -o, --output    specify where to save the output file (./exports if not provided)
   -x, --dry-run   display output without generating a file
```

#### --schema and --delim

```bash
$ ~/parser> node . --schema "person" --delim "|" parse
```

Where `person` is the [model] of data to parse (a `.json` object inside of `~/parser/schemas/[model].json` and `delim` is the delimeter of the file (default: `|`,`,`,``).

## Tests

All tests are written and run using [mocha](https://mochajs.org/).

`$ ~/parser> npm test`

### Notes

---

#### Why Node.js?

I just really like js. But I also wanted to learn more about `worker-threads` and async file processing. I normally would have used TypeScript, but I wasn't sure if that would have been accepted or if it was a little more "extra" than using normal build tools.

#### Why this design?

I wrote this app with the intention of creating a robust, scalable, configurable parsing applicaton with the intention of being run primarily on the command line. I wanted to write something that would take in some sort of model definition (like a `.json` schema) and parse data according to that model. Unfortunately, I ran out of time before I could make this fully functional in that way. I see this app more of something to be used in scripting, and way less like something to be using using...

```js
const parser = require('parser');
```

...though it could definitely be adapted to do so.

#### Why threads?

I just think they're nifty. Jokes aside, I wanted to be able to do the computational heavy requirement of potentially parsing and transforming `10+ GB` files, but I would have likely needed some way to chunk files into smaller files, and then perform some kind of merge sort. If we had lots of spare memory, it'd be good to use something like a fibb heap to keep insertion and removal of sorted data to O(1).
