import React, {memo, useCallback, useEffect} from 'react'
import Grid from '@mui/material/Grid'
import {AddItemForm} from '../addItemForm/AddItemForm'
import Paper from '@mui/material/Paper'
import {ToDoList} from '../toDoList/ToDoList'
import {addTodoListsTC, getTodoListsTC} from '../../state/reducers/todolists-reducer'
import {useAppDispatch} from '../../state/store'
import {useSelector} from 'react-redux'
import {toDoListsSelector} from '../../state/selectors/todolists-selector'

export const ToDoLists = memo(({demo = false}:{demo: boolean}) => {

    // Получили tasks из state используя хук - useSelector и selector - toDoListsSelector
    const toDoLists = useSelector(toDoListsSelector)

    // useAppDispatch - это кастомный хук, который уже протипизирован и лежит в store
    const dispatch = useAppDispatch()

    // -------------- Получили ToDoLists с сервера после загрузки страницы ----------------
    useEffect(() => {
        if (!demo) {
            dispatch(getTodoListsTC())
        }
    }, [])


    // -------------- Добавить ToDoList ----------------
    const addToDoList = useCallback((title: string) => {
        dispatch(addTodoListsTC(title))
    }, [])

    return (
        <div>
            <Grid container>
                <AddItemForm addItem={addToDoList} itemType={'Todolist'}/>
            </Grid>

            <Grid container spacing={3}>

                {toDoLists.map(el => {

                    return <Grid item key={el.id}>
                        <Paper style={{padding: '10px'}}>
                            <ToDoList
                                key={el.id}
                                id={el.id}
                                title={el.title}
                                filter={el.filter}
                                entityStatus={el.entityStatus}
                                demo={demo}
                            />
                        </Paper>
                    </Grid>
                })}
            </Grid>
        </div>
    )
})

