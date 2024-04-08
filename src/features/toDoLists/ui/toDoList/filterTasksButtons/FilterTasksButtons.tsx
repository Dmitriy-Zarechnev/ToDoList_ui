import React, {memo} from 'react'
import S from '../ToDoList.module.css'
import {FilterValuesType, toDoListsActions} from '../../../model/toDoLists/todolists-reducer'
import Button from '@mui/material/Button'
import {useActions} from '../../../../../utils/hooks/useActions'

type FilterTasksButtons = {
    filter: FilterValuesType
    toDoListID: string
}

export const FilterTasksButtons = memo((props: FilterTasksButtons) => {
    // Используя useAction получили callbacks в которые уже входит dispatch
    const {changeTodolistFilterAC} = useActions(toDoListsActions)


    // -------------- Фильтрация task ----------------
    const onClickBtnHandler = (value: FilterValuesType) => {
        changeTodolistFilterAC({toDoListID: props.toDoListID, filter: value})
    }


    // -------------- Button для filter ----------------
    const universalButton = (filter: FilterValuesType, color: 'secondary' | 'success' | 'primary', text: string) => {
        return <Button
            variant={props.filter === filter ? 'outlined' : 'contained'}
            onClick={() => onClickBtnHandler(filter)}
            color={color}
        >{text}</Button>
    }

    return (
        <div className={S.to_Do_List__btn_lists}>
            {universalButton('all', 'secondary', 'All')}
            {universalButton('active', 'primary', 'Active')}
            {universalButton('completed', 'success', 'Completed')}
        </div>
    )
})

