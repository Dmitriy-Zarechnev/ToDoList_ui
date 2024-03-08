import type {Meta, StoryObj} from '@storybook/react'
import {action} from '@storybook/addon-actions'
import {Task} from './Task'


const meta: Meta<typeof Task> = {
    title: 'TODOLISTS/Task',
    component: Task,

    tags: ['autodocs'],

    args: {
        onChangeCheckBoxHandler: action('Status changed inside Task'),
        changeTaskTitle: action('Title changed inside Task'),
        onClickRemoveHandler: action('Remove Button clicked changed inside Task'),
        task: {id: '12wsdewfijdei', title: 'JS', isDone: false}
    }
}

export default meta
type Story = StoryObj<typeof Task>;


export const TaskIsNotDoneStory: Story = {}

export const TaskIsDoneStory: Story = {

    args: {
        task: {id: '12wsdewfijdei2343', title: 'CSS', isDone: true}
    }
}