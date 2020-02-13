
export function createEvents(callback) {
    callback = callback ? callback : {};
    return new Events(callback);
}

class Events {

    constructor(linker) {
        this.linker = linker;
    }

    register = (eventName) => {
        this[eventName] = function () {
            if (typeof(this.linker[eventName]) !== 'function') return;
            this.linker[eventName](...arguments);
        }
    }
}

export function createMethods() {
    return new Methods();
}

class Methods {

    constructor() {
        this.handler = {};
    }

    register(methodName) {
        this.handler[methodName] = () => {};
        return { to: (func) => this.handler[methodName] = func };
    }

    link(linker) {
        const callback = {};
        Object.keys(linker).forEach(
            key => {
                callback[key] = (function () {
                    let res = linker[key](...arguments);
                    Object.keys(res).forEach(
                        methodName => this.handler[methodName](...res[methodName])
                    );
                }).bind(this);
            }
        );
        return callback;
    }
}

