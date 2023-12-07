// LanguageSelector.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import ukFlag from '../../assets/images/ukFlag.png'; 
import enFlag from '../../assets/images/enFlag.png'; 

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img
        src={i18n.language === 'uk' ? ukFlag : enFlag}
        alt={i18n.language === 'uk' ? 'UK Flag' : 'EN Flag'}
        style={{ width: '50px', marginRight: '8px' }}
      />
      <select
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
        style={{ padding: '5px' }}
      >
        <option value="en">EN</option>
        <option value="uk">UA</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
