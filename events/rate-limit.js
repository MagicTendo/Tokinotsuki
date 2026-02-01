module.exports = {
    name: "rateLimit",
    async execute(info) {
        console.log(`Rate limit : type - ${info.method} | timeout - ${info.timeout} ms`);
    }
};