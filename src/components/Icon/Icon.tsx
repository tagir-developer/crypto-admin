/* eslint-disable react/no-danger */
import React, { forwardRef, memo } from 'react';

type Props = {
  /** Additional class. */
  className?: string;
  /** OnClick method. */
  onClick?: () => void;
  /** Icon path. */
  path: string;
  /** Icon ref. */
  ref?: React.RefObject<SVGSVGElement>;
  /** Tab order between controls by pressing 'Tab'. */
  tabIndex?: number;
  /** Icon title. */
  title?: string;
  /** Attribute defines the position and dimension. */
  viewBox: string;
};

const Icon = forwardRef<SVGSVGElement, Props>(function Icon(props, ref) {
  return (
    <svg
      className={props.className}
      ref={ref}
      role="img"
      tabIndex={props.tabIndex}
      viewBox={props.viewBox}
      onClick={props.onClick}
    >
      {props.title && <title>{props.title}</title>}
      <g dangerouslySetInnerHTML={{ __html: props.path }} />
    </svg>
  );
});

Icon.displayName = 'Icon';

export default memo(Icon);
