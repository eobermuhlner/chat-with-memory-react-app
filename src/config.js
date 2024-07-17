const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8081';

const config = {
    backend: {
        url: BACKEND_URL
    },
    api: {
        baseURL: `${BACKEND_URL}/api`
    },
    i18n: {
        fallbackLng: process.env.REACT_APP_I18N_FALLBACK_LNG || 'en',
        debug: process.env.REACT_APP_I18N_DEBUG === 'true',
        backend: {
            loadPath: `${BACKEND_URL}/api/translations?lng={{lng}}`
        },
        detection: {
            order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
            caches: ['localStorage', 'cookie']
        },
        react: {
            useSuspense: true
        }
    }
};

export default config;
