export class Ids {
    ids: number[] = [];

    Ids(target: any, key: string) {
        let value: number[] = target[key];
        Object.defineProperty(target, key, {
            get: () => value,
            set: (newValue: number[]) => {
                value = newValue;
            }
        });
    }
}