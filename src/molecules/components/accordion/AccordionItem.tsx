import React, {useCallback, useRef, useEffect, useState} from 'react';

import './AccordionItem.scss';
import useToggle from '../../../helpers/useToggle';
import {IconWrap} from '../../../atoms/icons/IconWrap';
import {themeColorClass} from '../../../global/colors';

export interface AccordionItemProps {
  icon?: string;
  open?: boolean;
  children?: React.ReactNode;
  content?: React.ReactNode;
  heading: React.ReactNode;
  onChange?: (open: boolean) => void;
}

export const AccordionItem = ({
  children,
  content,
  icon,
  heading,
  open: initialOpen,
  onChange
}: AccordionItemProps): JSX.Element => {
  const {onToggle, openClass, open} = useToggle(initialOpen);

  const _onToggle = useCallback(() => {
    if (onChange) onChange(!open);

    onToggle();
  }, [onChange, onToggle, open]);

  // Dynamic height and margin animation for accordion content
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState('0px');
  const [marginTop, setMarginTop] = useState('1rem'); // Adjust to your open margin

  useEffect(() => {
    if (open && contentRef.current) {
      setMaxHeight(contentRef.current.scrollHeight + 'px');
      setMarginTop('1rem'); // Open state margin
    } else {
      setMaxHeight('0px');
      setMarginTop('0'); // Closed state margin
    }
  }, [open, content, children]);

  return (
    <div
      className={`c-accordion__item ${openClass} u-border--left u-padding--half--left u-spacing--half`}
    >
      <div
        className={`c-accordion__heading u-font--primary--m ${themeColorClass}--darker`}
        onClick={_onToggle}
        style={{userSelect: 'none'}}
      >
        <IconWrap
          className={'c-accordion__arrow u-space--half--right'}
          name={'arrow-bracket-right'}
          color={'darker'}
        />
        {typeof heading === 'string' ? <strong>{heading}</strong> : heading}
        {icon && (
          <IconWrap
            className={'u-space--half--left'}
            /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
            // @ts-ignore
            name={icon}
            size={'s'}
            color={'darker'}
          />
        )}
      </div>
      <div
        className="c-accordion__content u-padding--half--left"
        ref={contentRef}
        style={{
          maxHeight,
          marginTop,
          overflow: 'hidden',
          transition:
            'max-height 0.7s cubic-bezier(0.4,0,0.2,1), margin-top 0.7s cubic-bezier(0.4,0,0.2,1)'
        }}
      >
        {content || children}
      </div>
    </div>
  );
};
