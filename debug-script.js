// Debug script to inject into the page
(function() {
    // Capture console errors
    const errors = [];
    const originalError = console.error;
    console.error = function(...args) {
        errors.push(args.join(' '));
        originalError.apply(console, args);
    };
    
    // Wait a bit for the app to load
    setTimeout(() => {
        // Check Zustand store
        const stores = window.__zustand?.stores;
        if (stores && stores.length > 0) {
            const nutritionStore = stores[0]?.getState?.();
            console.log('Nutrition Store State:', {
                gameState: nutritionStore?.gameState,
                missions: nutritionStore?.missions,
                isLoading: nutritionStore?.isLoading,
                error: nutritionStore?.error
            });
        }
        
        // Check for any errors
        if (errors.length > 0) {
            console.log('Captured Errors:', errors);
        }
        
        // Try to manually fetch missions
        fetch('http://localhost:8000/api/missions/morning/1')
            .then(r => r.json())
            .then(data => console.log('Direct API test:', data))
            .catch(e => console.log('Direct API error:', e));
            
    }, 2000);
})();
