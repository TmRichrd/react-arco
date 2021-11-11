import { combineReducers } from 'redux';
import global, { GlobalState } from './global';
import searchTable, { SearchTableState } from '../pages/search-table/redux/reducer';
import stepForm, { StepFormState } from '../pages/step-form/redux/reducer';
import roles, { RolesState } from "../pages/setting-roles/redux/reducer"

export interface ReducerState {
  global: GlobalState;
  searchTable: SearchTableState;
  stepForm: StepFormState;
  roles: RolesState
}

export default combineReducers({
  global,
  searchTable,
  stepForm,
  roles
});
