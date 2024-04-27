export function request() {
    console.log("ROB WHAT")
    return {};
}

export function response(ctx) {
    console.log("ROB WHAT")

    throw new Error("STOP")
    return ctx.prev.result;
}
