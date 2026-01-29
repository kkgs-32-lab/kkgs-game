(() => {
    const applyOverride = (sdk) => {
        if (!sdk) return;
        const commercialBreak = () => {
            console.log("広告をスキップしました");
            return Promise.resolve();
        };
        const rewardedBreak = () => {
            console.log("報酬広告をスキップしました");
            return Promise.resolve(true);
        };
        sdk.commercialBreak = commercialBreak;
        sdk.rewardedBreak = rewardedBreak;
        try {
            Object.defineProperty(sdk, "commercialBreak", {
                configurable: true,
                get() {
                    return commercialBreak;
                },
                set() { },
            });
            Object.defineProperty(sdk, "rewardedBreak", {
                configurable: true,
                get() {
                    return rewardedBreak;
                },
                set() { },
            });
        } catch (err) {
        }
    };

    let current = window.PokiSDK;
    applyOverride(current);

    try {
        Object.defineProperty(window, "PokiSDK", {
            configurable: true,
            get() {
                return current;
            },
            set(value) {
                current = value;
                applyOverride(current);
            },
        });
    } catch (err) {
        // Fallback for non-configurable PokiSDK: keep reapplying.
        setInterval(() => applyOverride(window.PokiSDK), 500);
    }
})();