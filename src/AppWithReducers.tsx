import './App.css'



export type FilterValuesType = 'all' | 'active' | 'completed'
/*
export type ToDoListType = {
    id: string,
    title: string,
    filter: FilterValuesType
}

export type TasksStateType = {
    [key: string]: TasksType[]
}


function AppWithReducers() {

    // -------------- Initial state ----------------
    let toDoListID1 = v1()
    let toDoListID2 = v1()

    let [toDoLists, dispatchToDoLists] = useReducer(todolistsReducer,
        [
            {id: toDoListID1, title: 'What to learn', filter: 'all'},
            {id: toDoListID2, title: 'What to read', filter: 'all'}
        ]
    )

    let [tasks, dispatchTasks] = useReducer(tasksReducer, {
        [toDoListID1]: [
            {id: v1(), title: 'HTML&CSS', isDone: true},
            {id: v1(), title: 'JS', isDone: true},
            {id: v1(), title: 'ReactJS', isDone: false},
            {id: v1(), title: 'Rest API', isDone: false},
            {id: v1(), title: 'GraphL', isDone: false}
        ],
        [toDoListID2]: [
            {id: v1(), title: 'Black Tower', isDone: true},
            {id: v1(), title: 'Son of Sparta', isDone: false},
            {id: v1(), title: 'Games of Thrones', isDone: true},
            {id: v1(), title: 'Dune', isDone: true},
            {id: v1(), title: 'Forbidden West', isDone: false}
        ]
    })

    // -------------- Удаление task ----------------
    function removeTask(toDoListID: string, id: string) {
        dispatchTasks(removeTaskAC(toDoListID, id))
    }

    // -------------- Добавление task ----------------
    function addTask(toDoListID: string, title: string) {
        dispatchTasks(addTaskAC(toDoListID, title))
    }

    // -------------- Меняем checkbox ----------------
    function changeCheckBoxStatus(toDoListID: string, id: string, isDone: boolean) {
        dispatchTasks(changeTaskStatusAC(toDoListID, id, isDone))
    }

    // -------------- Меняем taskTitle ----------------
    function changeTaskTitle(toDoListID: string, id: string, newTitle: string) {
        dispatchTasks(changeTaskTitleAC(toDoListID, id, newTitle))
    }

    // ***********************************************************************************

    // -------------- Фильтрация task ----------------
    function changeFilter(todolistId: string, value: FilterValuesType) {
        dispatchToDoLists(changeTodolistFilterAC(todolistId, value))
    }

    // -------------- Меняем toDoListTitle ----------------
    function changeToDoListTitle(toDoListID: string, newTitle: string) {
        dispatchToDoLists(changeTodolistTitleAC(toDoListID, newTitle))
    }

    // -------------- Удалить ToDoList ----------------
    function removeToDoList(id: string) {
        const action = removeTodolistAC(id)
        dispatchToDoLists(action)
        dispatchTasks(action)
        // setToDoLists(toDoLists.filter(el => el.id !== id))
        // delete tasks[id]
        // setTasks({...tasks})
    }

    // -------------- Добавить ToDoList ----------------
    function addToDoList(title: string) {
        const newToDoListId = v1()
        const action = addTodolistAC(title, newToDoListId)
        dispatchToDoLists(action)
        dispatchTasks(action)
        // setToDoLists([{id: newToDoListId, title, filter: 'all'}, ...toDoLists])
        // setTasks({...tasks, [newToDoListId]: []})
    }

    return (
        <div className="App">

            <AppBar position="static">
                <Toolbar variant="dense">
                    <IconButton edge="start" color="inherit" aria-label="menu" sx={{mr: 2}}>
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" color="inherit" component="div">
                        TodoList
                    </Typography>
                    <Button color={'inherit'}>Login</Button>
                </Toolbar>
            </AppBar>

            <Container fixed>
                <Grid container>
                    <AddItemForm addItem={addToDoList} itemType={'Todolist'}/>
                </Grid>

                <Grid container spacing={3}>

                    {toDoLists.map(el => {
                        let allToDoListTasks = tasks[el.id]
                        let tasksForToDoList = allToDoListTasks

                        if (el.filter === 'active') {
                            tasksForToDoList = allToDoListTasks.filter((task) => !task.isDone)
                        }

                        if (el.filter === 'completed') {
                            tasksForToDoList = allToDoListTasks.filter((task) => task.isDone)
                        }

                        return <Grid item>
                            <Paper style={{padding: '10px'}}>
                                <ToDoList
                                    key={el.id}
                                    id={el.id}
                                    title={el.title}
                                    tasks={tasksForToDoList}
                                    removeTask={removeTask}
                                    changeFilter={changeFilter}
                                    addTask={addTask}
                                    changeCheckBoxStatus={changeCheckBoxStatus}
                                    filter={el.filter}
                                    removeToDoList={removeToDoList}
                                    changeTaskTitle={changeTaskTitle}
                                    changeToDoListTitle={changeToDoListTitle}
                                />
                            </Paper>
                        </Grid>
                    })
                    }
                </Grid>
            </Container>


        </div>
    )
}

export default AppWithReducers

 */
