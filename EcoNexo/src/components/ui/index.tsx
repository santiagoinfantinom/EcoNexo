import React from 'react';
import { useGlobalConfig } from '@/hooks/useGlobalConfig';
import { ButtonVariant, CardVariant, InputVariant, TitleLevel } from '@/lib/component-config';

// Componente Base para Tarjetas
interface BaseCardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  className?: string;
  onClick?: () => void;
}

export function BaseCard({ children, variant = 'default', className = '', onClick }: BaseCardProps) {
  const { getCardClasses, combineClasses } = useGlobalConfig();
  
  const baseClasses = getCardClasses(variant);
  const combinedClasses = combineClasses(baseClasses, className);
  
  if (onClick) {
    return (
      <div className={`${combinedClasses} cursor-pointer`} onClick={onClick}>
        {children}
      </div>
    );
  }
  
  return (
    <div className={combinedClasses}>
      {children}
    </div>
  );
}

// Componente Base para Botones
interface BaseButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function BaseButton({ 
  children, 
  variant = 'primary', 
  onClick, 
  className = '', 
  disabled = false,
  type = 'button'
}: BaseButtonProps) {
  const { getButtonClasses, combineClasses } = useGlobalConfig();
  
  const baseClasses = getButtonClasses(variant);
  const combinedClasses = combineClasses(baseClasses, className);
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  return (
    <button 
      type={type}
      className={`px-4 py-2 rounded-lg text-sm font-medium ${combinedClasses} ${disabledClasses}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

// Componente Base para Inputs
interface BaseInputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'search';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export function BaseInput({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  className = '', 
  disabled = false,
  required = false
}: BaseInputProps) {
  const { getInputClasses, combineClasses } = useGlobalConfig();
  
  const baseClasses = getInputClasses('default');
  const combinedClasses = combineClasses(baseClasses, className);
  
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={combinedClasses}
      disabled={disabled}
      required={required}
    />
  );
}

// Componente Base para Select
interface BaseSelectProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

export function BaseSelect({ 
  value, 
  onChange, 
  className = '', 
  disabled = false,
  children
}: BaseSelectProps) {
  const { getInputClasses, combineClasses } = useGlobalConfig();
  
  const baseClasses = getInputClasses('select');
  const combinedClasses = combineClasses(baseClasses, className);
  
  return (
    <select
      value={value}
      onChange={onChange}
      className={combinedClasses}
      disabled={disabled}
    >
      {children}
    </select>
  );
}

// Componente Base para Etiquetas
interface BaseLabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  variant?: 'default' | 'checkbox';
  className?: string;
}

export function BaseLabel({ 
  children, 
  htmlFor, 
  variant = 'default', 
  className = '' 
}: BaseLabelProps) {
  const { getLabelClasses, combineClasses } = useGlobalConfig();
  
  const baseClasses = getLabelClasses(variant);
  const combinedClasses = combineClasses(baseClasses, className);
  
  return (
    <label htmlFor={htmlFor} className={combinedClasses}>
      {children}
    </label>
  );
}

// Componente Base para Títulos
interface BaseTitleProps {
  children: React.ReactNode;
  level?: TitleLevel;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4';
}

export function BaseTitle({ 
  children, 
  level = 'h2', 
  className = '', 
  as 
}: BaseTitleProps) {
  const { getTitleClasses, combineClasses } = useGlobalConfig();
  
  const baseClasses = getTitleClasses(level);
  const combinedClasses = combineClasses(baseClasses, className);
  const Tag = as || level;
  
  return (
    <Tag className={combinedClasses}>
      {children}
    </Tag>
  );
}

// Componente Base para Contenedores de Filtros
interface BaseFilterPanelProps {
  children: React.ReactNode;
  className?: string;
}

export function BaseFilterPanel({ children, className = '' }: BaseFilterPanelProps) {
  const { getFilterClasses, combineClasses } = useGlobalConfig();
  
  const baseClasses = getFilterClasses('panel');
  const combinedClasses = combineClasses(baseClasses, className);
  
  return (
    <div className={combinedClasses}>
      <div className={getFilterClasses('grid')}>
        {children}
      </div>
    </div>
  );
}

// Componente Base para Estados Vacíos
interface BaseEmptyStateProps {
  icon?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function BaseEmptyState({ 
  icon = '🔍', 
  title, 
  description, 
  action, 
  className = '' 
}: BaseEmptyStateProps) {
  const { getEmptyClasses, combineClasses } = useGlobalConfig();
  
  const containerClasses = getEmptyClasses('container');
  const iconClasses = getEmptyClasses('icon');
  const combinedClasses = combineClasses(containerClasses, className);
  
  return (
    <div className={combinedClasses}>
      {icon && <p className={iconClasses}>{icon}</p>}
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      {description && <p className="mb-4">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
}
