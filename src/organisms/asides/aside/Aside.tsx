import React from 'react';

export interface AsideProps {
  children?: React.ReactNode;
}

export const Aside = ({children}: AsideProps): JSX.Element => {
  return (
    <div className={'u-padding--right u-spacing u-clear-fix'}>{children}</div>
  );
};
