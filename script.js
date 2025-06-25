document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
    loadBanner();
});

function addTask(taskName = '', sessionCount = 1, completedSessions = []) {
    const taskBody = document.getElementById('task-body');
    const row = document.createElement('tr');
    const rowId = Date.now(); // Unique ID for each row
    
    // Task name cell
    const nameCell = document.createElement('td');
    nameCell.className = 'task-name';
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.value = taskName;
    nameInput.placeholder = 'Nhập nhiệm vụ';
    nameCell.appendChild(nameInput);
    
    // Session count cell
    const countCell = document.createElement('td');
    countCell.className = 'session-count';
    const countSelect = document.createElement('select');
    for (let i = 1; i <= 6; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        if (i === sessionCount) option.selected = true;
        countSelect.appendChild(option);
    }
    countSelect.addEventListener('change', checkCompletion);
    countCell.appendChild(countSelect);
    
    // Session checkboxes
    const checkboxCells = [];
    for (let i = 1; i <= 6; i++) {
        const cell = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'session-checkbox';
        checkbox.dataset.session = i;
        if (completedSessions.includes(i)) {
            checkbox.checked = true;
        }
        checkbox.addEventListener('change', checkCompletion);
        cell.appendChild(checkbox);
        checkboxCells.push(cell);
    }
    
    // Status cell
    const statusCell = document.createElement('td');
    statusCell.className = 'task-status';
    statusCell.textContent = completedSessions.length + '/' + sessionCount;
    
    // Delete button cell
    const deleteCell = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Xóa';
    deleteButton.addEventListener('click', function() {
        taskBody.removeChild(row);
        saveTasks();
    });
    deleteButton.style.backgroundColor = '#d10000';
    deleteButton.style.color = 'white';
    deleteButton.style.border = 'none';
    deleteButton.style.padding = '5px 10px';
    deleteButton.style.borderRadius = '3px';
    deleteButton.style.cursor = 'pointer';
    deleteCell.appendChild(deleteButton);
    
    // Build the row
    row.id = 'task-' + rowId;
    row.appendChild(nameCell);
    row.appendChild(countCell);
    checkboxCells.forEach(cell => row.appendChild(cell));
    row.appendChild(statusCell);
    row.appendChild(deleteCell);
    
    taskBody.appendChild(row);
    checkCompletion();
}

function checkCompletion() {
    let allCompleted = true;
    const rows = document.querySelectorAll('#task-body tr');
    
    rows.forEach(row => {
        const sessionCount = parseInt(row.querySelector('select').value);
        const checkboxes = row.querySelectorAll('.session-checkbox:checked');
        const statusCell = row.querySelector('.task-status');
        
        statusCell.textContent = checkboxes.length + '/' + sessionCount;
        
        if (checkboxes.length >= sessionCount) {
            row.style.backgroundColor = '#ffcccc';
        } else {
            row.style.backgroundColor = '';
            allCompleted = false;
        }
    });
    
    // Show motivation message if all tasks are completed
    const motivation = document.getElementById('motivation');
    if (allCompleted && rows.length > 0) {
        motivation.classList.remove('hidden');
    } else {
        motivation.classList.add('hidden');
    }
}

function saveTasks() {
    const tasks = [];
    const rows = document.querySelectorAll('#task-body tr');
    
    rows.forEach(row => {
        const taskName = row.querySelector('.task-name input').value;
        const sessionCount = parseInt(row.querySelector('.session-count select').value);
        const completedSessions = [];
        
        row.querySelectorAll('.session-checkbox:checked').forEach(checkbox => {
            completedSessions.push(parseInt(checkbox.dataset.session));
        });
        
        tasks.push({
            name: taskName,
            sessionCount: sessionCount,
            completedSessions: completedSessions
        });
    });
    
    localStorage.setItem('hustTasks', JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = localStorage.getItem('hustTasks');
    if (savedTasks) {
        const tasks = JSON.parse(savedTasks);
        tasks.forEach(task => {
            addTask(task.name, task.sessionCount, task.completedSessions);
        });
    } else {
        // Add a default empty task if no saved tasks
        addTask();
    }
}

function clearAll() {
    if (confirm('Bạn có chắc chắn muốn xóa tất cả nhiệm vụ không?')) {
        document.getElementById('task-body').innerHTML = '';
        localStorage.removeItem('hustTasks');
        document.getElementById('motivation').classList.add('hidden');
    }
}

function updateBanner() {
    const imageUrl = document.getElementById('image-url').value;
    if (imageUrl) {
        document.getElementById('banner-image').src = imageUrl;
        localStorage.setItem('hustBanner', imageUrl);
    }
}

function loadBanner() {
    const savedBanner = localStorage.getItem('hustBanner');
    if (savedBanner) {
        document.getElementById('banner-image').src = savedBanner;
        document.getElementById('image-url').value = savedBanner;
    }
}
