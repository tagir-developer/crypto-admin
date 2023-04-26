import { FormInstance } from 'antd/es/form/Form';
import { ISelectOption } from 'common/interfaces';

import { TypeUseFormTable } from './hooks.interfaces';

export function useFormTableItem<T extends { id: string; name: string }>(
  form: FormInstance,
  formFieldName: string,
): TypeUseFormTable<T> {
  const getSelectOptions = (
    items: T[] | undefined,
    selectedItems: T[] | undefined,
  ): ISelectOption[] => {
    if (items && selectedItems) {
      const selectedItemsIds = selectedItems.map((item) => item.id);

      return items.map((item) => {
        return {
          value: item.id,
          label: item.name,
          disabled: selectedItemsIds.includes(item.id),
        };
      });
    }

    return [];
  };

  const selectItemHandler = (
    items: T[] | undefined,
    itemId: string | null,
  ): void => {
    if (items) {
      const item = items?.find((item) => item.id === itemId);

      const prevItems: T[] | undefined = form.getFieldValue(formFieldName);

      if (!item || !prevItems) return;

      form.setFieldValue(formFieldName, [...prevItems, item]);
    }
  };

  const handleDeleteItem = (item: T): void => {
    const prevItems: T[] | undefined = form.getFieldValue(formFieldName);

    if (!prevItems) return;

    form.setFieldValue(
      formFieldName,
      prevItems.filter((i) => i.id !== item.id),
    );
  };

  return { getSelectOptions, selectItemHandler, handleDeleteItem };
}
