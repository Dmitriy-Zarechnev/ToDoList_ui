import type {Meta} from '@storybook/react'
import App from './App'
import {ReduxStoreProviderDecorator} from './stories/decorators/ReduxStoreProviderDecorator'


const meta: Meta<typeof App> = {
    title: 'TODOLISTS/App',
    component: App,

    tags: ['autodocs'],
    decorators: [ReduxStoreProviderDecorator]
}

export default meta


export const AppStory = () => {
    return <App demo={true}/>
}