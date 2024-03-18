import {AppRootStateType} from '../store'
import {RequestStatusType} from '../app-reducer'

export const appStatusSelector = (state: AppRootStateType): RequestStatusType => {
    return state.app.status
}