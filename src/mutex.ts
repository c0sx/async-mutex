export type AsyncFunction<T> = (...args: any[]) => Promise<T>;

interface QueueItem {
    resolve: (fn: Releaser) => void;
}

type Releaser = () => void;

class Mutex {
    private _isLocked: boolean = false;
    private readonly _queue: QueueItem[] = [];

    public static get instance(): Mutex {
        if (!this._instance) {
            this._instance = new Mutex();
        }

        return this._instance;
    }

    private static _instance: Mutex;

    private constructor() {
        //
    }

    public async runExclusively<T>(fun: AsyncFunction<T>): Promise<T> {
        const release = await this.acquire();

        try {
            return await fun();
        } finally {
            release();
        }
    }

    private acquire(): Promise<Releaser> {
        const promise = new Promise<Releaser>(resolve => {
            this._queue.push({ resolve });
        });

        if (!this._isLocked) {
            this.dispatch();
        }

        return promise;
    }

    private dispatch() {
        const next = this._queue.shift();
        if (!next) {
            return;
        }

        const releaser: Releaser = () => {
            this._isLocked = false;
            this.dispatch();
        };

        this._isLocked = true;
        next.resolve(releaser);
    }
}

export function runExclusively<T>(fun: AsyncFunction<T>): Promise<T> {
    return Mutex.instance.runExclusively(fun);
}
