import {AppRootStateType} from '../store'
import {TasksStateType} from '../reducers/tasks-reducer'

export const tasksSelector = (state: AppRootStateType): TasksStateType => {
    return state.tasks
}