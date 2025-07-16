export function isValidLogin(email, password) {
    if (email === '' || password === '') {
        return false;
    }
    return true;
};

export function isPasswordsMatch(password, confirmPassword) {
    if (password !== confirmPassword) {
        return false;
    }
    return true;
};

export function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export function getPasswordStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

    const strengthLabels = ['Bardzo słabe', 'Słabe', 'Dobre', 'Silne', 'Bardzo silne'];
    const strengthColors = ['danger', 'warning', 'info', 'primary', 'success'];

    return {
        score,
        label: strengthLabels[score - 1] || 'Zbyt krótkie',
        color: strengthColors[score - 1] || 'danger',
        percentage: (score / 5) * 100
    };
};