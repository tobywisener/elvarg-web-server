
export class RandomGen {
    private random:number = Math.random();

    public getRandom() {
        return this.random;
    }
    
    public getInclusive(min: number, max: number) {
        if (max < min) {
            max = min + 1;
        }
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    public getInclusiveRange(range: number) {
        return this.getInclusive(0, range);
    }
    
    public getInclusiveExcludes(min: number, max: number, exclude: number[]) {
        exclude.sort();
    
        let result;
        let index = exclude.indexOf(result);
        while (index !== -1) {
          result = this.getInclusive(min, max);
          index = exclude.indexOf(result);
        }
    
        return result;
    }
    
    public floatRandom(max: number) {
        if (max <= 0) {
            throw new Error("max must be greater than 0");
        }
        return Math.random() * max;
    }
    
    public randomIndex(array: any[]) {
        return Math.floor(Math.random() * array.length);
    }
    
    public randomArray<T>(array: T[]): T {
        return array[this.randomIndex(array)];
    }

    public shuffle<T>(array: T[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const index = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[index];
            array[index] = temp;
        }
        return array;
    }
    
    public success(value: number): boolean {
        return Math.random() <= value;
    }
}
