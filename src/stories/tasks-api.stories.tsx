import React, {useEffect, useState} from 'react'
import {tasksAPI} from '../api/tasks-api'


export default {
    title: 'Tasks-API'
}

const todolistId = 'b68b2d9e-57a7-404f-b8f7-13ee694fde46'

export const GetTasks = () => {
    const [state, setState] = useState<any>(null)


    useEffect(() => {
        tasksAPI.getTasks(todolistId)
            .then(res => {
                setState(res.data)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}

export const CreateTask = () => {
    const [state, setState] = useState<any>(null)

    useEffect(() => {
        tasksAPI.createTask(todolistId, 'Hello - new task')
            .then(res => {
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const UpdateTaskTitle = () => {
    const [state, setState] = useState<any>(null)

    const taskId = '27db06a1-a845-4b2d-b08e-2011ff9285a0'

    useEffect(() => {
        tasksAPI.updateTaskTitle(todolistId, taskId, 'I am new Title')
            .then(res => {
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

/*
export const UpdateTaskCompleted = () => {
    const [state, setState] = useState<any>(null)

    const taskId = ''

    useEffect(() => {
        tasksAPI.updateTaskCompleted(todolistId, taskId, true)
            .then(res => {
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
*/

export const DeleteTask = () => {
    const [state, setState] = useState<any>(null)

    const taskId = '27db06a1-a845-4b2d-b08e-2011ff9285a0'

    useEffect(() => {
        tasksAPI.deleteTask(todolistId, taskId)
            .then(res => {
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}