import i18n from 'i18next'; // Importa a instância principal do i18next (biblioteca de internacionalização)
import { initReactI18next } from 'react-i18next'; // Importa o plugin para integração do i18next com React
import LanguageDetector from 'i18next-browser-languagedetector'; // Importa o detector de idioma do navegador

import ptBR from './locales/pt-BR.json'; // Importa as traduções em português do Brasil
import en from './locales/en.json'; // Importa as traduções em inglês

i18n
  .use(LanguageDetector) // Usa o plugin para detectar automaticamente o idioma do usuário
  .use(initReactI18next) // Usa o plugin para conectar o i18next ao React
  .init({
    fallbackLng: 'en', // Define o idioma padrão caso o idioma detectado não esteja disponível
    debug: import.meta.env.DEV, // Ativa logs de debug apenas em ambiente de desenvolvimento
    
    resources: {
      'pt-BR': { translation: ptBR }, // Registra as traduções para português do Brasil
      'en': { translation: en },      // Registra as traduções para inglês
    },
    
    interpolation: {
      escapeValue: false, // Não escapa valores interpolados (necessário para React)
    },
    
    detection: {
      order: ['localStorage', 'navigator'], // Ordem de detecção: primeiro localStorage, depois navegador
      caches: ['localStorage'], // Salva o idioma selecionado no localStorage
    },
  });

export default i18n; // Exporta a instância configurada