import { Checkbox } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { useOnClickOutside } from 'hooks/useOnClickOutside';
import React, { memo, useRef } from 'react';

import styles from 'components/TableFilters/TableFilters.module.scss';

const CheckboxGroup = Checkbox.Group;
interface IProps {
  allFilteredFieldsTitle: string[];
  checkedList: CheckboxValueType[];
  dropDownLinkRef: React.MutableRefObject<HTMLSpanElement | null>;
  setIsDropdownVisible: (value: React.SetStateAction<boolean>) => void;
  handleChangeCheckboxValue: (list: CheckboxValueType[]) => void;
}

export function DropDownOverlay({
  allFilteredFieldsTitle,
  checkedList,
  dropDownLinkRef,
  setIsDropdownVisible,
  handleChangeCheckboxValue,
}: IProps): JSX.Element {
  const divRef = useRef<HTMLDivElement | null>(null);

  useOnClickOutside(divRef, () => setIsDropdownVisible(false), dropDownLinkRef);

  return (
    <div ref={divRef}>
      <CheckboxGroup
        className={styles['table-filters__checkbox']}
        options={allFilteredFieldsTitle}
        value={checkedList}
        onChange={handleChangeCheckboxValue}
      />
    </div>
  );
}

export default memo(DropDownOverlay);
