
export const check = (req, res, next) => {
    console.log("Middleware is starting");

    res.on('finish', () => {
        console.log("Middleware is finished");
    })

    next();
}