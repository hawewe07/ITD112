export const logError = (error, context = "Unknown") => {
    console.error(`Error in ${context}:`, error);
    // Optionally, send logs to an external service
};
