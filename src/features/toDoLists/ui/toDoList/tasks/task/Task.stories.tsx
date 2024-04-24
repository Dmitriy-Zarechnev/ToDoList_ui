import type {Meta, StoryObj} from '@storybook/react'
import {Task} from './Task'
import {TasksPriorities, TasksStatuses} from "common/api/enums"

const meta: Meta<typeof Task> = {
    title: 'TODOLISTS/Task',
    component: Task,

    tags: ['autodocs'],

    args: {
        task: {
            id: '12wsdewfijdei234asd3',
            title: 'JS',
            status: TasksStatuses.New,
            priority: TasksPriorities.Low,
            deadline: '',
            order: 0,
            startDate: '',
            description: 'Hello',
            addedDate: '',
            todoListId: 'TodolistId'
        }
    }
}

export default meta

type Story = StoryObj<typeof Task>;

export const TaskIsNotDoneStory: Story = {}

export const TaskIsDoneStory: Story = {
    args: {
        task: {
            id: '12wsdewfijdei2343',
            title: 'CSS',
            status: TasksStatuses.Completed,
            priority: TasksPriorities.Low,
            deadline: '',
            order: 0,
            startDate: '',
            description: 'Hello',
            addedDate: '',
            todoListId: 'TodolistId'
        }
    }
}
