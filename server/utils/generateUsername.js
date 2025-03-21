exports.generateSuggestedUsernames = (baseUsername) => {
    const randomNumbers = () => Math.floor(100 + Math.random() * 900); // Random 3-digit number
    return [
        `${baseUsername}${randomNumbers()}`,
        `${baseUsername}_${randomNumbers()}`,
        `${baseUsername}.${randomNumbers()}`
    ];
};