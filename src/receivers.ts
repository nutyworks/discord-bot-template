export interface IReceiveResult {
    value: any,
    left: string,
}

export const receiveAll = (str: string): Promise<IReceiveResult> => {
    console.log(str);
    return Promise.resolve({
        value: str,
        left: '',
    });
};

export const receiveWord = (str: string): Promise<IReceiveResult> => {
    return Promise.resolve({
        value: str.split(' ')[0],
        left: str.split(' ').splice(1).join(' '),
    });
};

export const receiveInt = (str: string): Promise<IReceiveResult> => {
    const target = str.split(' ')[0]
    if (target.match(/^[+-]?[0-9]+$/)) {
        const num = parseInt(target);

        if (-1e24 <= num && num <= 1e24) {
            return Promise.resolve({
                value: parseInt(target),
                left: str.substr(target.length + ' '.length),
            });
        } else {
            return Promise.reject("integer out of range [-1e24, 1e24]");
        }
    } else {
        return Promise.reject("expected integer");
    }
};

export const receiveFloat = (str: string): Promise<IReceiveResult> => {
    const target = str.split(' ')[0]
    if (target.match(/^[+-]?[0-9]*.?[0-9]+$/)) {
        const num = parseFloat(target);

        if (-1e24 <= num && num <= 1e24) {
            return Promise.resolve({
                value: parseFloat(target),
                left: str.substr(target.length + ' '.length),
            });
        } else {
            return Promise.reject("float out of range [-1e24, 1e24]");
        }
    } else {
        return Promise.reject("expected float");
    }
};
