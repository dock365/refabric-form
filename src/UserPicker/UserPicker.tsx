/* tslint:disable */
import * as React from 'react';
/* tslint:enable */
import { Promise } from 'es6-promise';
import { BaseComponent, assign } from 'office-ui-fabric-react/lib/Utilities';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';

import { IPersonaProps, Persona, IPersona } from 'office-ui-fabric-react/lib/Persona';
import {
  IBasePickerSuggestionsProps,
  NormalPeoplePicker,
  ValidationState,
} from 'office-ui-fabric-react/lib/Pickers';
import { IUserPickerProps } from './IUserPickerProps';
import { IUserPickerState } from './IUserPickerState';
// import { IUser, spSearchUsers, getUserById } from '../../../spAPIs/users';

export interface IUser {
  Title: string;
  Id: number;
  Email?: string;
  LoginName?: string;
  Designation?: string;
}

export class UserPicker extends React.Component<IUserPickerProps, IUserPickerState> {
  constructor() {
    super();

    this.state = {
      selectedUser: [],
    };
    this._onSelected = this._onSelected.bind(this);
    this._onChange = this._onChange.bind(this);
  }
  public componentDidMount() {
    if (this.props.values) {
      this._setSelectedUser(this.props.values);
    }
  }

  public componentDidUpdate(prevProps: IUserPickerProps) {
    if (this.props.values !== prevProps.values) {
      this._setSelectedUser(this.props.values);
    }
  }

  public render(): JSX.Element {
    const suggestionProps: IBasePickerSuggestionsProps = {
      suggestionsHeaderText: 'Suggested People',
      mostRecentlyUsedHeaderText: 'Suggested Contacts',
      noResultsFoundText: 'No results found',
      loadingText: 'Loading',
      showRemoveButtons: true,
      suggestionsAvailableAlertText: 'People Picker Suggestions available',
      suggestionsContainerAriaLabel: 'Suggested contacts',
    };

    return (
      <NormalPeoplePicker
        onResolveSuggestions={this._onFilterChanged}
        // onEmptyInputFocus={this._returnMostRecentlyUsed}
        // getTextFromItem={this._getTextFromItem}
        onChange={this._onChange}
        pickerSuggestionsProps={suggestionProps}
        // key={'normal'}
        // onRemoveSuggestion={this._onRemoveSuggestion}
        // onValidateInput={this._validateInput}
        // removeButtonAriaLabel={'Remove'}
        // inputProps={{
        //   onBlur: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onBlur called'),
        //   onFocus: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onFocus called'),
        //   'aria-label': 'People Picker'
        // }}
        // componentRef={this._resolveRef('_picker')}
        selectedItems={this.state.selectedUser}
        itemLimit={this.props.itemLimit}
        resolveDelay={500}
        onItemSelected={this._onSelected}
      // className={this.props.className ? this.props.className : styles.peoplePicker}
      />
    );
  }

  private _setSelectedUser(userIds?: number[] | IUser[]) {
    if (userIds && userIds.length >= 0) {
      // if (userIds) {
      for (const userId of userIds) {
        let selectedUser: IUser | null = null;
        if (this.props.users && this.props.users.length > 0) {
          for (const user of this.props.users) {
            if (user.Id === userId) {
              selectedUser = user;
              this.setState(prevState => ({
                selectedUser: [...prevState.selectedUser, this._transformToPersona(user)],
              }));
              break;
            }
          }
        }
        if (!selectedUser && this.props.getUserById) {
          this.props.getUserById(typeof userId === "object" ? userId.Id : userId)
            .then((user: IUser) => {
              this.setState(prevState => ({
                selectedUser: [...prevState.selectedUser, this._transformToPersona(user)],
              }));
            })
            .catch((err: any) => {
              // this.setState({ selectedUser: [] });
            });
        }
      }
    } else {
      // this.setState({ selectedUser: [] });
    }
  }

  private _onSelected(persona?: IPersona): any {

    // this.props.onSelect(person, this.props.field, this.props.taskId);
    this._setSelectedUser([this._transformFromPersona(persona)]);

    return persona;
  }

  private _onChange(personas?: IPersonaProps[]) {
    // const prevUser = this.state.selectedUser.length > 0 ? { ...this.state.selectedUser[0] } : {};
    if (personas && personas.length > 0) {
      const users = personas.map(persona => this._transformFromPersona(persona));
      // this._setSelectedUser(users);
      this.props.onSelect(users);
    } else {
      // this._setSelectedUser();
      this.props.onSelect(null);
    }
  }

  private _onFilterChanged = (
    filterText: string,
    currentPersonas?: IPersonaProps[],
    limitResults?: number,
  ): IPersonaProps[] | Promise<IPersonaProps[]> => {
    if (filterText) {
      //WARNING: Using ajax promise. didnt find any way to use redux.
      return new Promise((resolve, reject) => {
        if (this.props.users && this.props.users.length >= 0) {
          resolve(this.props.users
            .filter(user =>
              user.Title
                .toLowerCase()
                .indexOf(filterText.toLowerCase()) >= 0,
            )
            .map(user => this._transformToPersona(user)),
          );
        } else if (this.props.searchUsers) {
          this.props.searchUsers(filterText)
            .then((users: IUser[]) => {
              resolve(users.map(user => this._transformToPersona(user)));
            })
            .catch((err: any) => {
              reject(err);
            });
        }
      });
    } else {
      return [];
    }

  }

  private _transformToPersona(user: IUser): IPersonaProps & { Id: number } & any {
    return {
      primaryText: user.Title,
      Id: user.Id,
      ...user,
    };
  }

  private _transformFromPersona(user: IPersonaProps & { Id: number } & any): IUser {
    return {
      Id: user.Id,
      Designation: user.Designation,
      Email: user.Email,
      LoginName: user.LoginName,
      Title: user.Title,
    };
  }
}
