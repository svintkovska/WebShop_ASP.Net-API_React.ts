const GOOGLE_CLIENT_ID: string = (process.env.REACT_APP_GOOGLE_CLIENT_ID as string);
const REMOTE_HOST_NAME: string  =process.env.REACT_APP_BASE_URL as string;
const NOVAPOSHTA_KEY: string  =process.env.REACT_APP_NOVAPOSHTA_KEY as string;

const APP_ENV = {
    GOOGLE_CLIENT_ID: GOOGLE_CLIENT_ID,
    REMOTE_HOST_NAME: REMOTE_HOST_NAME,
    IMAGE_PATH: `${REMOTE_HOST_NAME}images/`,
    NOVAPOSHTA_KEY: NOVAPOSHTA_KEY
};

export { APP_ENV };