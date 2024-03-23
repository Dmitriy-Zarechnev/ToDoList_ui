import {AppRootStateType} from '../store'
import {TasksInitialStateType} from '../reducers/tasks-reducer'

export const tasksSelector = (state: AppRootStateType): TasksInitialStateType => {
    return state.tasks
}