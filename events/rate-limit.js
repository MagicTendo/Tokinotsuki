module.exports = {
    name: "rateLimit",
    async execute(info) {
        console.error(`🚧 Rate limit: ${info.method}, timeout of ${info.timeout}ms`);
    }
};