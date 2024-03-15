import React, {useEffect, useState} from 'react'
import {tasksAPI} from '../api/tasks-api'


export default {
    title: 'Tasks-API'
}

const todolistId = 'dd26f2b6-8880-46ac-8a97-221a3b8f77c8'

export const GetTasks = () => {
    const [state, setState] = useState<any>(null)


    useEffect(() => {
        tasksAPI.getTasks(todolistId)
            .then(data => {
                setState(data)
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
        tasksAPI.updateTask(todolistId, taskId, {
            deadline: '',
            description: '',
            priority: 0,
            startDate: '',
            status: 0,
            title: 'Helloooooo'
        })
            .then(res => {
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

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