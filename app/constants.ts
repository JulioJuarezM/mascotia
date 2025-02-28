interface Config {
    BASE_URL: string;
    API_VERSION: string;
}

export const API_ENDPOINTS = {
    PETS: 'mascotia/pets/user',
    USERS: 'mascotia/users',
} as const;

export const GlobalConfig = {
    BASE_URL: process.env.API_BASE_URL || 'http://localhost:89/api/v1',
};

// Agregar export default con todas las constantes
export default {
    API_ENDPOINTS,
    GlobalConfig,
};
