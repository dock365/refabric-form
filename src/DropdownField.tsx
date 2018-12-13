import * as React from 'react';
import { Dropdown, IDropdown, DropdownMenuItemType, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { IFieldRenderProps } from "@dock365/reform";
import ErrorHandlerHOC from './ErrorHandlerHOC';

type propsOverride = {
  onChange: (value?: string | number) => void;
  value: string | number;
};

const DropdownField: React.SFC<IFieldRenderProps & propsOverride> = (props) => (
  <Dropdown
    label={props.label}
    selectedKey={props.value}
    placeHolder={props.placeholder}
    onChanged={(option?: IDropdownOption, index?: number) => props.onChange && props.onChange(option && option.key)}
    {...props.customProps}
  />
);

export default ErrorHandlerHOC(DropdownField);
