const [todoList, todoInput, todoDate, filterButton, clearAllButton] = 
    ['#todo-list', '#todo-input', '#todo-date', '.flex button:nth-child(1)', '.flex button:nth-child(2)']
    .map(selector => document.querySelector(selector));

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all'; 


const saveRender = () => {
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
};

const renderTodos = () => {
    const filtered = todos.filter(t => currentFilter === 'all' || t.completed === (currentFilter === 'completed'));
    
    if (!filtered.length) {
        todoList.innerHTML = `<li style="justify-content: center; border-left: none; background-color: #fff; box-shadow: none;">No ${currentFilter === 'all' ? '' : currentFilter} todos.</li>`;
        return;
    }

    todoList.innerHTML = filtered.map(t => {
        const dateText = t.dueDate ? `Due: ${t.dueDate}` : 'No due date';
        const icon = t.completed ? '&#10003;' : '&#9711;';

        return `
            <li class="${t.completed ? 'completed' : ''}" data-id="${t.id}">
                <div class="todo-content">
                    <span class="todo-text">${t.text}</span>
                    <span class="todo-date">${dateText}</span>
                </div>
                <div class="item-actions">
                    <button class="complete-btn" title="Toggle">${icon}</button>
                    <button class="delete-btn" title="Delete">&#10005;</button>
                </div>
            </li>
        `;
    }).join('');
};

window.addTodo = () => {
    const text = todoInput.value.trim();
    if (text) {
        todos.push({ id: Date.now(), text, dueDate: todoDate.value, completed: false });
        [todoInput.value, todoDate.value] = ['', '']; // Reset inputs
        saveRender();
    }
};

const handleListClick = (e) => {
    const li = e.target.closest('li[data-id]');
    if (!li) return;
    
    const id = parseInt(li.dataset.id);
    const index = todos.findIndex(t => t.id === id);

    if (e.target.classList.contains('complete-btn')) {
        todos[index].completed = !todos[index].completed;
        saveRender();
    } else if (e.target.classList.contains('delete-btn') && confirm('Delete this todo?')) {
        todos.splice(index, 1);
        saveRender();
    }
};

const toggleFilter = () => {
    const filters = ['all', 'active', 'completed'];
    let nextIndex = (filters.indexOf(currentFilter) + 1) % filters.length;
    currentFilter = filters[nextIndex];
    
    filterButton.textContent = `${currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1)} Todos`;

    filterButton.classList.add('active-filter');
    setTimeout(() => filterButton.classList.remove('active-filter'), 300);
    renderTodos();
};

const clearAllTodos = () => {
    if (confirm('Clear ALL todos?')) {
        todos = [];
        saveRender();
    }
};
document.addEventListener('DOMContentLoaded', renderTodos);
todoList.addEventListener('click', handleListClick);
filterButton.addEventListener('click', toggleFilter);
clearAllButton.addEventListener('click', clearAllTodos);

todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        window.addTodo();
    }
});