export default function(func, timeout = 0) {
    if(typeof func !== "function") {
        throw new TypeError("A func argument must be a function.");
    }
    let isPaused = false, params, context;
    function pulse() {
        if(isPaused) {
            params = arguments;
            context = this;
            return;
        }
        func.apply(this, arguments);
        isPaused = true;
        setTimeout(() => {
            isPaused = false;
            if(params) {
                pulse.apply(context, params);
                context = params = null;
            }
        }, timeout);
    };
    return pulse;
};