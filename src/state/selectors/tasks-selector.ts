import {AppRootStateType} from '../store'
import {TasksStateType} from '../tasks-reducer'

export const tasksSelector=(state: AppRootStateType): TasksStateType=>{
    return state.tasks
}