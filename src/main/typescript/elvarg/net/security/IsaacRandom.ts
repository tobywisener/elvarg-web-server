export class IsaacRandom {
    private static readonly GOLDEN_RATIO: number = 0x9e3779b9;
    private static readonly LOG_SIZE: number = 8;
    private static readonly SIZE: number = 1 << IsaacRandom.LOG_SIZE;
    private static MASK: number = IsaacRandom.SIZE - 1 << 2;
    private readonly results: number[] = new Array(IsaacRandom.SIZE);
    private readonly state: number[] = new Array(IsaacRandom.SIZE);
    private count: number = IsaacRandom.SIZE;
    private accumulator: number;
    private last: number;
    private counter: number;

    public constructor(seed: number[]) {
        let length = Math.min(seed.length, this.results.length);
        this.results.splice(0, length, ...seed);
        this.init();
    }

    private isaac() {
        let i: number, j: number, x: number, y: number;
        this.last += ++this.counter;
        for (i = 0, j = IsaacRandom.SIZE / 2; i < IsaacRandom.SIZE / 2;) {
            x = this.state[i];
            this.accumulator ^= this.accumulator << 13;
            this.accumulator += this.state[j++];
            this.state[i] = y = this.state[(x & IsaacRandom.MASK) >> 2] + this.accumulator + this.last;
            this.results[i++] = this.last = this.state[(y >> IsaacRandom.LOG_SIZE & IsaacRandom.MASK) >> 2] + x;

            x = this.state[i];
            this.accumulator ^= this.accumulator >>> 6;
            this.accumulator += this.state[j++];
            this.state[i] = y = this.state[(x & IsaacRandom.MASK) >> 2] + this.accumulator + this.last;
            this.results[i++] = this.last = this.state[(y >> IsaacRandom.LOG_SIZE & IsaacRandom.MASK) >> 2] + x;

            x = this.state[i];
            this.accumulator ^= this.accumulator << 2;
            this.accumulator += this.state[j++];
            this.state[i] = y = this.state[(x & IsaacRandom.MASK) >> 2] + this.accumulator + this.last;
            this.results[i++] = this.last = this.state[(y >> IsaacRandom.LOG_SIZE & IsaacRandom.MASK) >> 2] + x;

            x = this.state[i];
            this.accumulator ^= this.accumulator >>> 16;
            this.accumulator += this.state[j++];
            this.state[i] = y = this.state[(x & IsaacRandom.MASK) >> 2] + this.accumulator + this.last;
            this.results[i++] = this.last = this.state[(y >> IsaacRandom.LOG_SIZE & IsaacRandom.MASK) >> 2] + x;
        }

        for (let j = 0; j < IsaacRandom.SIZE / 2;) {
            let x = this.state[i];
            this.accumulator ^= this.accumulator << 13;
            this.accumulator += this.state[j++];
            this.state[i] = y = this.state[(x & IsaacRandom.MASK) >> 2] + this.accumulator + this.last;
            this.results[i++] = this.last = this.state[(y >> IsaacRandom.LOG_SIZE & IsaacRandom.MASK) >> 2] + x;

            x = this.state[i];
            this.accumulator ^= this.accumulator >>> 6;
            this.accumulator += this.state[j++];
            this.state[i] = y = this.state[(x & IsaacRandom.MASK) >> 2] + this.accumulator + this.last;
            this.results[i++] = this.last = this.state[(y >> IsaacRandom.LOG_SIZE & IsaacRandom.MASK) >> 2] + x;

            x = this.state[i];
            this.accumulator ^= this.accumulator << 2;
            this.accumulator += this.state[j++];
            this.state[i] = y = this.state[(x & IsaacRandom.MASK) >> 2] + this.accumulator + this.last;
            this.results[i++] = this.last = this.state[(y >> IsaacRandom.LOG_SIZE & IsaacRandom.MASK) >> 2] + x;

            x = this.state[i];
            this.accumulator ^= this.accumulator >>> 16;
            this.accumulator += this.state[j++];
            this.state[i] = y = this.state[(x & IsaacRandom.MASK) >> 2] + this.accumulator + this.last;
            this.results[i++] = this.last = this.state[(y >> IsaacRandom.LOG_SIZE & IsaacRandom.MASK) >> 2] + x;
        }
    }

    private init() {
        let i: number;
        let a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number;
        a = b = c = d = e = f = g = h = IsaacRandom.GOLDEN_RATIO;

        for (i = 0; i < 4; ++i) {
            a ^= b << 11;
            d += a;
            b += c;
            b ^= c >>> 2;
            e += b;
            c += d;
            c ^= d << 8;
            f += c;
            d += e;
            d ^= e >>> 16;
            g += d;
            e += f;
            e ^= f << 10;
            h += e;
            f += g;
            f ^= g >>> 4;
            a += f;
            g += h;
            g ^= h << 8;
            b += g;
            h += a;
            h ^= a >>> 9;
            c += h;
            a += b;
        }

        for (i = 0; i < IsaacRandom.SIZE; i += 8) { /* fill in mem[] with messy stuff */
            a += this.results[i];
            b += this.results[i + 1];
            c += this.results[i + 2];
            d += this.results[i + 3];
            e += this.results[i + 4];
            f += this.results[i + 5];
            g += this.results[i + 6];
            h += this.results[i + 7];

            a ^= b << 11;
            d += a;
            b += c;
            b ^= c >>> 2;
            e += b;
            c += d;
            c ^= d << 8;
            f += c;
            d += e;
            d ^= e >>> 16;
            g += d;
            e += f;
            e ^= f << 10;
            h += e;
            f += g;
            f ^= g >>> 4;
            a += f;
            g += h;
            g ^= h << 8;
            b += g;
            h += a;
            h ^= a >>> 9;
            c += h;
            a += b;
            this.state[i] = a;
            this.state[i + 1] = b;
            this.state[i + 2] = c;
            this.state[i + 3] = d;
            this.state[i + 4] = e;
            this.state[i + 5] = f;
            this.state[i + 6] = g;
            this.state[i + 7] = h;
        }

        for (i = 0; i < IsaacRandom.SIZE; i += 8) {
            a += this.state[i];
            b += this.state[i + 1];
            c += this.state[i + 2];
            d += this.state[i + 3];
            e += this.state[i + 4];
            f += this.state[i + 5];
            g += this.state[i + 6];
            h += this.state[i + 7];
            a ^= b << 11;
            d += a;
            b += c;
            b ^= c >>> 2;
            e += b;
            c += d;
            c ^= d << 8;
            f += c;
            d += e;
            d ^= e >>> 16;
            g += d;
            e += f;
            e ^= f << 10;
            h += e;
            f += g;
            f ^= g >>> 4;
            a += f;
            g += h;
            g ^= h << 8;
            b += g;
            h += a;
            h ^= a >>> 9;
            c += h;
            a += b;
            this.state[i] = a;
            this.state[i + 1] = b;
            this.state[i + 2] = c;
            this.state[i + 3] = d;
            this.state[i + 4] = e;
            this.state[i + 5] = f;
            this.state[i + 6] = g;
            this.state[i + 7] = h;
        }
        this.isaac();
    }

    public nextInt(): number {
        if (0 == this.count--) {
            this.isaac();
            this.count = IsaacRandom.SIZE - 1;
        }
        return this.results[this.count];
    }

}
