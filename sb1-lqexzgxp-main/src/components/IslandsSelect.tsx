import React from 'react';
import { MultiSelect } from './MultiSelect';
import { useIslands } from '../hooks/useIslands';

interface IslandsSelectProps {
  atollIds?: number[];
  value: number[];
  onChange: (values: number[]) => void;
  language?: 'en' | 'dv';
  placeholder?: string;
  className?: string;
}

export const IslandsSelect: React.FC<IslandsSelectProps> = ({
  atollIds,
  value,
  onChange,
  language = 'dv',
  placeholder,
  className
}) => {
  const { islands, loading, error } = useIslands(atollIds);

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-[38px] bg-gray-200 rounded-lg w-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-red-500 text-sm ${className}`}>
        {language === 'dv' ? 'މައްސަލައެއް ދިމާވެއްޖެ' : 'Failed to load islands'}
      </div>
    );
  }

  // Filter and map islands to match MultiSelect option format
  const options = islands?.map(island => ({
    id: island.id,
    name: island.name,
    name_en: island.name_en,
    atoll: island.atoll
  })) || [];

  // Filter out any selected values that don't exist in options
  const validValues = value.filter(v => options.some(opt => opt.id === v));

  return (
    <MultiSelect
      options={options}
      value={validValues}
      onChange={onChange}
      language={language}
      placeholder={placeholder || (language === 'dv' ? 'ރަށްތައް އިޚްތިޔާރު ކުރައްވާ' : 'Select islands')}
      className={className}
    />
  );
};