const pendingListElement = document.querySelector('.main__pending');
const completedListElement = document.querySelector('.main__completed');

const taskSettingsElement = document.querySelector('.task__settings');
const newTaskButtonElement = document.querySelector('.main__heading-btn')

const taskFormCancelButtonElement = document.querySelector('.task__form-cancel')
const taskFormSaveButtonElement = document.querySelector('.task__form-save')

newTaskButtonElement.addEventListener('click', () => {
    taskSettingsElement.classList.toggle('task__settings-active')
})

taskFormCancelButtonElement.addEventListener('click', (event) => {
    event.preventDefault()
    taskSettingsElement.classList.toggle('task__settings-active', false)
})

taskFormSaveButtonElement.addEventListener('click', (event) => addNewTask(event))
const loadTasks = () => {
    const tasks = localStorage.getItem('tasks')
    pendingListElement.innerHTML = ''
    completedListElement.innerHTML = ''
    const tasksObject = JSON.parse(tasks)
    Object.entries(tasksObject).forEach(([key, value]) => {
        const targetElement = value.completed ? completedListElement : pendingListElement
        targetElement.insertAdjacentHTML('beforeend', `
            <li class="main__task" id="task-${value.id}" data-id=${value.id}>
                <div class="main__task-details">
                    <div class="main__task-icon">
                        <img src="img/task.svg" alt="" class="task-icon">
                    </div>
                    <div class="main__task-information">
                        <p class="main__task-title">${value.title}</p>
                        <p class="main__task-date">Due: ${value.date}</p>
                    </div>
                </div>
                <button class="trash-button" aria-label="Удалить">
                    <img src="img/trash_bin.svg" alt="" class="trash-button">
                </button>
                <input type="checkbox" class="main__task-btn" name="isCompleted" id="isCompleted" ${value.completed ? 'checked' : ''}>
            </li>
        `)
    })
}
const addNewTask = (event) => {
    event.preventDefault()
    const tasks = localStorage.getItem('tasks')
    const tasksObject = JSON.parse(tasks)
    const lastTask = Object.entries(tasksObject).length >= 1 ? Object.entries(tasksObject).at(-1)[1].id : 0
    const { taskTitle, taskDate } = event.target.form
    tasksObject[`task_${lastTask + 1}`] = {
        id: lastTask + 1,
        title: taskTitle.value,
        date: taskDate.value,
        completed: false,
    }

    localStorage.setItem('tasks', JSON.stringify(tasksObject))
    taskSettingsElement.classList.toggle('task__settings-active', false)
    loadTasks()
}
const removeTask = (parentElement) => {
    if (confirm('Are you sure?')) {
        const taskId = parentElement.dataset.id
        const tasks = localStorage.getItem('tasks')
        const tasksObject = JSON.parse(tasks)
        delete tasksObject[`task_${taskId}`]
        localStorage.setItem('tasks', JSON.stringify(tasksObject))
        location.reload()
    }
}
const changeTaskState = (parentElement, state = false) => {
    const taskId = parentElement.dataset.id
    const tasks = localStorage.getItem('tasks')
    const tasksObject = JSON.parse(tasks)
    tasksObject[`task_${taskId}`].completed = state
    localStorage.setItem('tasks', JSON.stringify(tasksObject))
    location.reload()
}

document.querySelector('.main__body').addEventListener('click', (event) => {
    if (event.target.classList.contains('trash-button')) {
        removeTask(event.target.closest('.main__task'))
    }
})

document.querySelector('.main__body').addEventListener('change', (event) => {
    console.log(event.target)
    if (event.target.classList.contains('main__task-btn')) {
        changeTaskState(event.target.closest('.main__task'), event.target.checked)
    }
})

loadTasks()