export const getAddressBackend = (path) => {
    const isLocal = import.meta.env.VITE_IS_LOCAL;
    let baseUrl;
    if (isLocal === 'true') {
        baseUrl = import.meta.env.VITE_BACKEND_URL;
    } else {
        baseUrl = '';
    }

    return `${baseUrl}${path}`;
};
