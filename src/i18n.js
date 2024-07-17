import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import config from './config';

i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(HttpApi)
    .init(config.i18n); // Use the imported configuration

export default i18n;
