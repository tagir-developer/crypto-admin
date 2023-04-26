export type TypeSelectTagRenderOptions = { value: string }[];

export type TypeGetConvertedChosenOptions = (number | string | null)[];

type RawValueType = string | number;
type Key = string | number;
interface LabelValueType {
  key?: Key;
  value?: RawValueType;
  label?: React.ReactNode;
  isCacheable?: boolean;
}
type DefaultValueType =
  | RawValueType
  | RawValueType[]
  | LabelValueType
  | LabelValueType[];

export type CustomTagProps = {
  label: React.ReactNode;
  value: DefaultValueType;
  disabled: boolean;
  onClose: (event?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  closable: boolean;
};
