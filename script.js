// App State Variables
let allTasks = JSON.parse(localStorage.getItem('my_tasks_v2')) || [];
let editingTaskId = null;
let pendingUploadedFiles = [];

// DOM Elements
const tasksContainer = document.getElementById("tasks");
const completedContainer = document.getElementById("completed");
const title = document.getElementById("title");
const pendingCount = document.getElementById("pending-count");

// Modal DOM Elements
const modal = document.getElementById("task-modal");
const modalInput = document.getElementById("modal-input");
const modalPriority = document.getElementById("modal-priority");
const modalFileInput = document.getElementById("modal-file");
const openModalBtn = document.getElementById("open-modal-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const saveTaskBtn = document.getElementById("save-task-btn");
const modalHeading = document.getElementById("modal-heading");

// Theme Elements
const paletteBtn = document.getElementById("palette-btn");
const paletteMenu = document.getElementById("palette-menu");
const colorDots = document.querySelectorAll(".color-dot");

// Author Toggle
if (title) {
    title.addEventListener("click", () => {
        title.textContent = title.textContent === "by Hamza Mohamed" ? "To Do List 📝" : "by Hamza Mohamed";
    });
}

// Local Storage & Stats Handler
function updateState() {
    localStorage.setItem('my_tasks_v2', JSON.stringify(allTasks));
    const pending = allTasks.filter(t => !t.isCompleted).length;
    pendingCount.textContent = pending;
}

function getPriorityBadge(priority) {
    switch(priority) {
        case 'high': return `<span class="priority-badge priority-high">🔴 عالي</span>`;
        case 'low': return `<span class="priority-badge priority-low">🟢 منخفض</span>`;
        default: return `<span class="priority-badge priority-medium">🟡 متوسط</span>`;
    }
}

function getExtensionBadge(fileName) {
    const ext = fileName.split('.').pop().toLowerCase();
    return `<span class="file-icon-badge">${ext}</span>`;
}

function buildAttachmentsHtml(filesArray, taskId) {
    if (!filesArray || filesArray.length === 0) return '';

    const itemsHtml = filesArray.map((file, index) => `
            <div class="attachment-item">
                <div style="display:flex; align-items:center; gap:8px; overflow:hidden;">
                    ${getExtensionBadge(file.name)}
                    <span class="attachment-name" title="${escapeHtml(file.name)}">${escapeHtml(file.name)}</span>
                </div>
                <div class="attachment-actions">
                    <a href="${file.url}" download="${file.name}" class="btn-attachment-action" title="تحميل الملف">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    </a>
                    <button class="btn-attachment-action delete-file" data-task-id="${taskId}" data-file-index="${index}" title="حذف الملف">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
            </div>
        `).join('');

    return `<div class="attachments-list">${itemsHtml}</div>`;
}

// Render Single Task Card Element
function createCardElement(taskObj) {
    const card = document.createElement('div');
    card.className = `card ${taskObj.isCompleted ? 'completed' : ''}`;
    const checkboxId = `cb-${taskObj.id}`;

    card.innerHTML = `
            <div class="card-header-info">
                ${getPriorityBadge(taskObj.priority || 'medium')}
            </div>
            <div class="card-body">
                <div class="checkbox-container">
                  <div class="checkbox-wrapper">
                    <input class="checkbox" id="${checkboxId}" type="checkbox" ${taskObj.isCompleted ? 'checked' : ''} />
                    <label class="checkbox-label" for="${checkboxId}">
                      <div class="checkbox-flip">
                        <div class="checkbox-front"><svg fill="white" height="18" width="18" viewBox="0 0 24 24"><path d="M19 13H12V19H11V13H5V12H11V6H12V12H19V13Z"></path></svg></div>
                        <div class="checkbox-back"><svg fill="white" height="18" width="18" viewBox="0 0 24 24"><path d="M9 19l-7-7 1.41-1.41L9 16.17l11.29-11.3L22 6l-13 13z"></path></svg></div>
                      </div>
                    </label>
                  </div>
                </div>
                <p class="card-text">${escapeHtml(taskObj.text)}</p>
            </div>

            ${buildAttachmentsHtml(taskObj.files, taskObj.id)}

            <div class="card-footer">
                <button class="btn-icon edit" title="تعديل"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                <button class="btn-icon delete" title="حذف"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
            </div>
        `;

    // Task Status Listener
    card.querySelector('.checkbox').addEventListener('change', (e) => {
        setTimeout(() => {
            taskObj.isCompleted = e.target.checked;
            updateState();
            renderTasks();
        }, 250);
    });

    // Delete File Attachment Listener
    card.querySelectorAll('.delete-file').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.currentTarget.getAttribute('data-file-index');
            taskObj.files.splice(index, 1);
            updateState();
            renderTasks();
        });
    });

    // Delete Task
    card.querySelector('.btn-icon.delete').addEventListener('click', () => {
        allTasks = allTasks.filter(t => t.id !== taskObj.id);
        updateState();
        renderTasks();
    });

    // Edit Task
    card.querySelector('.btn-icon.edit').addEventListener('click', () => {
        editingTaskId = taskObj.id;
        modalInput.value = taskObj.text;
        modalPriority.value = taskObj.priority || 'medium';
        pendingUploadedFiles = taskObj.files || [];
        modalHeading.textContent = "تعديل المهمة";
        openModal();
    });

    return card;
}

// Render All Tasks
function renderTasks() {
    tasksContainer.innerHTML = '';
    completedContainer.innerHTML = '';

    const priorityWeight = { high: 3, medium: 2, low: 1 };
    const sortedTasks = [...allTasks].sort((a, b) => priorityWeight[b.priority || 'medium'] - priorityWeight[a.priority || 'medium']);

    sortedTasks.forEach(task => {
        const cardEl = createCardElement(task);
        if (task.isCompleted) completedContainer.appendChild(cardEl);
        else tasksContainer.appendChild(cardEl);
    });

    updateState();
}

// File Input Upload Logic
modalFileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (evt) => {
            pendingUploadedFiles.push({
                name: file.name,
                url: evt.target.result
            });
        };
        reader.readAsDataURL(file);
    });
});

// Modal Control Logic
function openModal() { modal.style.display = 'flex'; modalInput.focus(); }
function closeModal() {
    renderTasks();
    modal.style.display = 'none';
    modalInput.value = '';
    modalPriority.value = 'medium';
    modalFileInput.value = '';
    pendingUploadedFiles = [];
    editingTaskId = null;
    modalHeading.textContent = "إضافة مهمة جديدة";

}
openModalBtn.addEventListener('click', openModal);

closeModalBtn.addEventListener('click', closeModal);

saveTaskBtn.addEventListener('click', () => {
    const val = modalInput.value.trim();
    if (!val) return;

    if (editingTaskId) {
        const task = allTasks.find(t => t.id === editingTaskId);
        if (task) {
            task.text = val;
            task.priority = modalPriority.value;
            task.files = pendingUploadedFiles;
        }
    } else {
        allTasks.push({
            id: Date.now(),
            text: val,
            priority: modalPriority.value,
            files: pendingUploadedFiles,
            isCompleted: false
        });
    }

    updateState();
    renderTasks();
    closeModal();
});
// Theme & Color Palette Menu Options
paletteBtn.addEventListener("click", (e) => { e.stopPropagation(); paletteMenu.classList.toggle("show"); });

document.addEventListener("click", () => paletteMenu.classList.remove("show"));
colorDots.forEach(dot => {
    dot.addEventListener("click", () => {
        const themeValue = dot.getAttribute("data-theme-value");
        colorDots.forEach(d => d.classList.remove("active"));
        dot.classList.add("active");

        if (themeValue === "default") document.documentElement.removeAttribute("data-theme");
        else document.documentElement.setAttribute("data-theme", themeValue);

        localStorage.setItem("selected_theme", themeValue);
    });

});
// Toggle Dark / Light Mode
const themeToggleBtn = document.getElementById("theme-toggle");

themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    const isLight = document.body.classList.contains("light-mode");
    document.getElementById("theme-icon").textContent = isLight ? "☀️" : "🌙";
    document.getElementById("theme-text").textContent = isLight ? "الوضع الفاتح" : "الوضع الداكن";
});
function escapeHtml(str) {
    return str.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));

}