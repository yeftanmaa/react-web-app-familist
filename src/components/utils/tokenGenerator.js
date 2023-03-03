export function GenerateToken() {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';

    for (let i = 0; i < 7; i++) {
        const randomIndex = Math.floor(Math.random() * alphabet.length);
        token += alphabet[randomIndex];
    }

    return token;
}