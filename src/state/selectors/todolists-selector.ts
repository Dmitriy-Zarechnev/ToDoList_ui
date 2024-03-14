import {AppRootStateType} from '../store'
import {ToDoListDomainType} from '../todolists-reducer'

export const toDoListsSelector = (state: AppRootStateType): Array<ToDoListDomainType> => {
    return state.todolists
}