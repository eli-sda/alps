import React from 'react';

import {FormLabel} from './FormLabel';
import {BaseInput} from './BaseInput';

export interface CheckboxProps {
  checked?: boolean;
  error?: string;
  id?: string;
  className?: string;
  label: string;
  labelOptional?: string;
  labelClass?: string;
  labelSpacing?: string;
  name: string;
  placeholder?: string;
  value?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

export const Checkbox = ({
  checked,
  className,
  label,
  labelOptional,
  labelClass,
  labelSpacing,
  ...props
}: CheckboxProps): JSX.Element => {
  return (
    <FormLabel
      className={className}
      labelClass={labelClass}
      error={props.error}
      htmlFor={props.id || props.name}
      position="bottom"
      text={label}
      textOptional={labelOptional}
      // spacing={labelSpacing}
    >
      <BaseInput checked={checked} type="checkbox" {...props} />
    </FormLabel>
  );
};
