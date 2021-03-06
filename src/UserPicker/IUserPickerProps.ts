import { IUser } from "./UserPicker";

export interface IUserPickerProps {
  onSelect: (user?: IUser[] | null) => void;
  values?: number[];
  defaultValue?: number[];
  className?: string;
  users?: IUser[];
  searchUsers?: (filter: string) => Promise<IUser[]>;
  getUserById?: (id: number) => Promise<IUser>;
  itemLimit?: number;
  readOnly?: boolean;
  defaultValueIsUpdatable?: boolean;
  suggestionsHeaderText?: string;
}
