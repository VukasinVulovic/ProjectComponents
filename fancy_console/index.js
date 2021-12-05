const readline = require('readline');
const Audio = require('node-aplay');
const c = console;

const parseTextDecoration = text => {
    const reps = {
        '</>': '\x1b[0m',
        '<b>': '\x1b[1m',
        '<dim>': '\x1b[2m',
        '<u>': '\x1b[4m',
        '<blink>': '\x1b[5m',
        '<black>': '\x1b[30m',
        '<red>': '\x1b[31m',
        '<green>': '\x1b[32m',
        '<yellow>': '\x1b[33m',
        '<blue>': '\x1b[34m',
        '<magenta>': '\x1b[35m',
        '<cyan>': '\x1b[36m',
        '<white>': '\x1b[37m',
        '<background="black">': '\x1b[40m',
        '<background="red">': '\x1b[41m',
        '<background="green">': '\x1b[42m',
        '<background="yellow">': '\x1b[43m',
        '<background="blue">': '\x1b[44m',
        '<background="magenta">': '\x1b[45m',
        '<background="cyan">': '\x1b[46m',
        '<background="white">': '\x1b[47m'
    }
    for(const r in reps)
        text = (text || '').replace(new RegExp(r, 'gi'), reps[r]);
    return `\x1b[0m\x1b[37m${text}\x1b[0m\x1b[37m`;
}

const term = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    historySize: 1000
});

module.exports = {
    parse: parseTextDecoration,
    log: e => c.log(typeof e === 'string' ? parseTextDecoration(e) : e),
    table: e => c.table(e),
    error: e => c.log(typeof e === 'string' ? parseTextDecoration(e) : e),
    info: e => c.log(typeof e === 'string' ? parseTextDecoration(e) : e),
    clear: () => c.clear,
    input: async(q) => {
        return new Promise((resolve, reject) => {
            term.question(parseTextDecoration(`${q} `), e => {
                resolve(e);
            });
        });
    },
    inputCommand: (user, path) => this.input(`<b><green>${user || require('os').userInfo().username}<white></>:<b><blue>${path || process.cwd()}</><white>$`),
    print: async(e, speed) => {
        return new Promise((resolve, reject) => {
            const chars = e.split('');
            setInterval((function() {
                let audio = { stop: () => void(0) }
                let i = 0;
                return function() {
                    if(i++ > chars.length-2) {
                        process.stdout.write('\n')
                        clearInterval(this);
                        resolve(0);
                        return;
                    }
                    audio.stop();
                    process.stdout.clearLine();
                    process.stdout.cursorTo(0);
                    process.stdout.write(parseTextDecoration(`${e.slice(0, i)}${chars[i]}`));
                    audio = new Audio(`${__dirname}/assets/sfx/text/click.wav`);
                    audio.play();
                }
            }()), speed || 100);
        });
    },
    ProgressBar: class {
        constructor() {
            this.sound = true;
            this.audio = new Audio(`${__dirname}/assets/sfx/load/finish.wav`);
            this.progress = 0;
            this.label = '';
            this.bar_char = '█';
            this.bar_start = this.label.length;
            this.audio.on('complete', () => this.audio.stopped = true);
            this.draw();
        }

        draw() {
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            process.stdout.write(parseTextDecoration(`${this.label} `));
            process.stdout.cursorTo(this.bar_start);
            process.stdout.write('|');
            process.stdout.cursorTo(101 + this.bar_start);
            process.stdout.write('|');
            process.stdout.write(`${this.progress}%`);
            process.stdout.cursorTo(1 + this.bar_start);
            for(let i = 0; i < this.progress; i++)
                process.stdout.write(parseTextDecoration(this.bar_char));
        }
        
        update(progress, label) {
            this.label = label || this.label;
            this.bar_start = this.label.length;
            this.progress = progress;
            this.draw();
        }

        finish() {
            process.stdout.write('\n');
            this.audio.play();
        }
    }
}