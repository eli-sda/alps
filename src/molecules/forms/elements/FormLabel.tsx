import React from 'react';

import {ErrorMessage} from './ErrorMessage';

export interface FormLabelProps {
  children?: React.ReactNode;
  className?: string;
  labelClass?: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  text?: string;
  textOptional?: string;
  position?: 'top' | 'bottom';
  darkMode?: boolean;
  faIconClass?: string;
}

export const FormLabel = ({
  children: field,
  error,
  required = false,
  htmlFor,
  position = 'top',
  text,
  textOptional,
  className = 'c-form-group',
  labelClass = 'u-font--secondary--s',
  darkMode = false,
  faIconClass = ''
}: FormLabelProps): JSX.Element => {
  const fieldInTop = darkMode || position === 'bottom';

  if (!text) return field as JSX.Element;

  return (
    <div className={className}>
      {fieldInTop && field}
      <label htmlFor={htmlFor} className={labelClass}>
        {text}
        {faIconClass && (
          <i className={`${faIconClass} u-space--quarter--left`}></i>
        )}{' '}
        {required && <span className={'u-color--error'}>*</span>}
        {textOptional && (
          <span className={'u-font--secondary--xs u-theme--color--lighter'}>
            {textOptional}
          </span>
        )}
      </label>

      {!fieldInTop && field}

      {error && <ErrorMessage text={error} />}
    </div>
  );
};
