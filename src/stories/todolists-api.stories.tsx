import React, {useEffect, useState} from 'react'

import {todolistAPI} from '../api/todolist-api'

export default {
    title: 'Todolist-API'
}

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)

    useEffect(() => {
        todolistAPI.getTodolist()
            .then(res => {
                setState(res.data)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}

export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)

    useEffect(() => {
        todolistAPI.createTodolist('New Todolist - 5000')
            .then(res => {
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)

    const todolistId = '2279f6a4-e29c-4296-bb69-9a3468db549c'

    useEffect(() => {
        todolistAPI.updateTodolist(todolistId, 'Some new Title')
            .then(res => {
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)

    const todolistId = '3d487862-332a-4d60-a39d-d98aec1240f1'

    useEffect(() => {
        todolistAPI.deleteTodolist(todolistId)
            .then(res => {
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}