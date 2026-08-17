let hamza = document.getElementById("tit1")
let tit2 = document.getElementById("tit2")
hamza.addEventListener("click" , function (){
    hamza.style.display="none"
    tit2.style.display="block"
})

tit2.addEventListener("click" , function (){
    hamza.style.display="block"
    tit2.style.display="none"
})
// ==========================================
// 1. STATE MANAGEMENT
// ==========================================
let tasks = JSON.parse(localStorage.getItem('app_tasks')) || [];
let currentEditingTaskId = null;
let selectedTaskIdForDetail = null;

// ==========================================
// 2. DOM ELEMENTS
// ==========================================
const loaderOverlay = document.getElementById('loader-overlay');

const mainView = document.getElementById('main-view');
const detailView = document.getElementById('detail-view');
const settingsView = document.getElementById('settings-view');

const tasksContainer = document.getElementById('tasks');
const completedContainer = document.getElementById('completed');
const statsCount = document.getElementById('stats-count');

const taskModal = document.getElementById('task-modal');
const modalHeading = document.getElementById('modal-heading');
const modalInput = document.getElementById('modal-input');
const modalDueDate = document.getElementById('modal-duedate');
const modalPriority = document.getElementById('modal-priority');

const openModalBtn = document.getElementById('open-modal-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const saveTaskBtn = document.getElementById('save-task-btn');

const dynamicIsland = document.getElementById('dynamic-island');
const islandStatusText = document.getElementById('island-status-text');
const islandPendingCount = document.getElementById('island-pending-count');
const islandProgressText = document.getElementById('island-progress-text');
const islandDetailsText = document.getElementById('island-details-text');
const islandToolbarSlot = document.getElementById('island-toolbar-slot');

const appToolbar = document.getElementById('app-toolbar');
const styleSelect = document.getElementById('style-select');
const colorThemeSelect = document.getElementById('color-theme-select');
const toolbarPositionSelect = document.getElementById('toolbar-position-select');

// ==========================================
// 3. APPLICATION INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    renderTasks();
    setupEventListeners();

    // إخفاء شاشة التحميل المتوهجة بعد تجهيز كل العناصر
    setTimeout(() => {
        hideLoader();
    }, 700);
});

// ==========================================
// 4. LOADER CONTROLLER
// ==========================================
function showLoader(message = "جاري التحميل...") {
    const textEl = loaderOverlay.querySelector('.loader-text');
    if (textEl) textEl.innerText = message;
    loaderOverlay.classList.remove('hidden');
}

function hideLoader() {
    loaderOverlay.classList.add('hidden');
}

// ==========================================
// 5. SETTINGS & TOOLBAR CONTROLLER
// ==========================================
function loadSettings() {
    const savedStyle = localStorage.getItem('app_ui_style') || 'hyperos';
    document.documentElement.setAttribute('data-ui-style', savedStyle);
    if (styleSelect) styleSelect.value = savedStyle;

    const savedColor = localStorage.getItem('app_color_theme') || 'purple';
    document.documentElement.setAttribute('data-theme-color', savedColor);
    if (colorThemeSelect) colorThemeSelect.value = savedColor;

    const savedToolbarPos = localStorage.getItem('app_toolbar_pos') || 'bottom';
    applyToolbarPosition(savedToolbarPos);
    if (toolbarPositionSelect) toolbarPositionSelect.value = savedToolbarPos;
}

function applyToolbarPosition(pos) {
    appToolbar.className = 'glass-radio-group';

    if (pos === 'island') {
        appToolbar.classList.add('pos-island-style');
        islandToolbarSlot.appendChild(appToolbar);
    } else {
        appToolbar.classList.add(`pos-${pos}`);
        document.body.appendChild(appToolbar);
    }
}

// ==========================================
// 6. EVENT LISTENERS
// ==========================================
function setupEventListeners() {
    openModalBtn.addEventListener('click', () => openModal());
    closeModalBtn.addEventListener('click', closeModal);
    saveTaskBtn.addEventListener('click', handleSaveTask);

    dynamicIsland.addEventListener('click', (e) => {
        if (!e.target.closest('.glass-radio-group')) {
            dynamicIsland.classList.toggle('expanded');
        }
    });

    document.getElementById('tb-add-task').addEventListener('click', (e) => {
        e.stopPropagation();
        openModal();
    });

    document.getElementById('tb-theme-toggle').addEventListener('click', (e) => {
        e.stopPropagation();
        document.body.classList.toggle('light-mode');
    });

    document.getElementById('tb-settings').addEventListener('click', (e) => {
        e.stopPropagation();
        switchView(settingsView);
    });

    if (styleSelect) {
        styleSelect.addEventListener('change', (e) => {
            const val = e.target.value;
            document.documentElement.setAttribute('data-ui-style', val);
            localStorage.setItem('app_ui_style', val);
        });
    }

    if (colorThemeSelect) {
        colorThemeSelect.addEventListener('change', (e) => {
            const val = e.target.value;
            document.documentElement.setAttribute('data-theme-color', val);
            localStorage.setItem('app_color_theme', val);
        });
    }

    if (toolbarPositionSelect) {
        toolbarPositionSelect.addEventListener('change', (e) => {
            const val = e.target.value;
            applyToolbarPosition(val);
            localStorage.setItem('app_toolbar_pos', val);
        });
    }

    document.getElementById('back-to-list-btn').addEventListener('click', () => switchView(mainView));
    document.getElementById('back-from-settings-btn').addEventListener('click', () => {
        switchView(mainView);
        document.getElementById('tb-add-task-input').checked = true;
    });

    document.getElementById('detail-toggle-status-btn').addEventListener('click', () => {
        if (selectedTaskIdForDetail) {
            toggleTaskComplete(selectedTaskIdForDetail);
            openTaskDetails(selectedTaskIdForDetail);
        }
    });

    document.getElementById('detail-delete-btn').addEventListener('click', () => {
        if (selectedTaskIdForDetail) {
            deleteTask(selectedTaskIdForDetail);
            switchView(mainView);
        }
    });

    document.getElementById('detail-edit-btn').addEventListener('click', () => {
        if (selectedTaskIdForDetail) {
            const task = tasks.find(t => t.id === selectedTaskIdForDetail);
            if (task) openModal(task);
        }
    });
}

// ==========================================
// 7. CORE LOGIC
// ==========================================
function switchView(targetView) {
    [mainView, detailView, settingsView].forEach(v => v.classList.remove('active'));
    targetView.classList.add('active');
}

function saveToStorage() {
    localStorage.setItem('app_tasks', JSON.stringify(tasks));
    updateIslandAndStats();
}

function renderTasks() {
    tasksContainer.innerHTML = '';
    completedContainer.innerHTML = '';

    tasks.filter(t => !t.completed).forEach(t => tasksContainer.appendChild(createTaskElement(t)));
    tasks.filter(t => t.completed).forEach(t => completedContainer.appendChild(createTaskElement(t)));

    updateIslandAndStats();
}

function createTaskElement(task) {
    const card = document.createElement('div');
    card.className = `card ${task.completed ? 'completed' : ''}`;

    const priorityClass = `priority-${task.priority || 'medium'}`;
    const priorityText = task.priority === 'high' ? 'عالية' : task.priority === 'low' ? 'منخفضة' : 'متوسطة';

    card.innerHTML = `
        <div class="card-header-info">
            <span class="priority-badge ${priorityClass}">${priorityText}</span>
            ${task.dueDate ? `<span class="card-due-badge">📅 ${new Date(task.dueDate).toLocaleString('ar-EG')}</span>` : ''}
        </div>
        <div class="card-body">
            <div class="checkbox-wrapper" onclick="event.stopPropagation();">
                <input id="task-chk-${task.id}" type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTaskComplete('${task.id}')">
                <label for="task-chk-${task.id}"></label>
            </div>
            <span class="card-text">${escapeHtml(task.text)}</span>
        </div>
        <div class="card-footer">
            <span style="font-size:0.75rem; color:var(--text-muted);">عرض التفاصيل</span>
            <div class="card-footer-actions">
                <button class="btn-icon" onclick="event.stopPropagation(); openTaskDetails('${task.id}')">👁️</button>
                <button class="btn-icon" onclick="event.stopPropagation(); deleteTask('${task.id}')">🗑️</button>
            </div>
        </div>
    `;

    card.addEventListener('click', () => openTaskDetails(task.id));
    return card;
}

function handleSaveTask() {
    const text = modalInput.value.trim();
    if (!text) return alert('برجاء كتابة نص المهمة');

    if (currentEditingTaskId) {
        tasks = tasks.map(t => t.id === currentEditingTaskId ? {
            ...t, text, dueDate: modalDueDate.value, priority: modalPriority.value
        } : t);
    } else {
        tasks.push({
            id: Date.now().toString(),
            text,
            dueDate: modalDueDate.value,
            priority: modalPriority.value,
            completed: false,
            createdAt: new Date().toISOString()
        });
    }

    saveToStorage();
    renderTasks();
    closeModal();
}

function toggleTaskComplete(id) {
    tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveToStorage();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveToStorage();
    renderTasks();
}

function openTaskDetails(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    selectedTaskIdForDetail = task.id;
    document.getElementById('detail-task-text').innerText = task.text;
    document.getElementById('detail-due-date').innerText = task.dueDate
        ? `📅 ${new Date(task.dueDate).toLocaleString('ar-EG')}`
        : '📅 بدون تاريخ استحقاق';

    const statusBadge = document.getElementById('detail-task-status');
    statusBadge.innerText = task.completed ? '✅ مكتملة' : '⏳ قيد الانتظار';
    statusBadge.className = `priority-badge ${task.completed ? 'priority-low' : 'priority-medium'}`;

    switchView(detailView);
}

function openModal(task = null) {
    if (task) {
        currentEditingTaskId = task.id;
        modalHeading.innerText = 'تعديل المهمة';
        modalInput.value = task.text;
        modalDueDate.value = task.dueDate || '';
        modalPriority.value = task.priority || 'medium';
    } else {
        currentEditingTaskId = null;
        modalHeading.innerText = 'إضافة مهمة جديدة';
        modalInput.value = '';
        modalDueDate.value = '';
        modalPriority.value = 'medium';
    }
    taskModal.style.display = 'flex';
}

function closeModal() {
    taskModal.style.display = 'none';
}

function updateIslandAndStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    statsCount.innerText = `${completed}/${total}`;
    islandPendingCount.innerText = pending;
    islandProgressText.innerText = `${percent}%`;
    islandDetailsText.innerText = `لديك ${pending} مهام قيد الانتظار من أصل ${total}`;

    islandStatusText.innerText = (pending === 0 && total > 0)
        ? '🎉 أحسنت! أنجزت كافة المهام'
        : 'جميع المهام تسير بشكل ممتاز';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
}



// ==========================================
// UPDATE DOM ELEMENTS
// ==========================================
const weeklyView = document.getElementById('weekly-view');
const modalCategory = document.getElementById('modal-category');
const weeklyOptions = document.getElementById('weekly-options');
const modalScheduleType = document.getElementById('modal-schedule-type');
const timedRangeGroup = document.getElementById('timed-range-group');

// ==========================================
// EVENT LISTENERS UPDATES
// ==========================================
// إظهار/إخفاء حقول الجدول الأسبوعي حسب اختيار النوع
modalCategory.addEventListener('change', (e) => {
    if (e.target.value === 'weekly') {
        weeklyOptions.style.display = 'flex';
    } else {
        weeklyOptions.style.display = 'none';
    }
});

modalScheduleType.addEventListener('change', (e) => {
    if (e.target.value === 'timed') {
        timedRangeGroup.style.display = 'flex';
    } else {
        timedRangeGroup.style.display = 'none';
    }
});

// التنقل عبر شريط الأدوات للجدول الأسبوعي
document.getElementById('tb-weekly').addEventListener('click', (e) => {
    e.stopPropagation();
    switchView(weeklyView);
    renderWeeklySchedule();
});

// ==========================================
// RENDER WEEKLY SCHEDULE LOGIC
// ==========================================
function renderWeeklySchedule() {
    const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const todayStr = new Date().toISOString().split('T')[0];

    days.forEach(day => {
        const container = document.getElementById(`day-${day}`);
        container.innerHTML = '';

        // فلترة المهام الخاصة بهذا اليوم
        const dayTasks = tasks.filter(t => {
            if (t.category !== 'weekly' || t.day !== day) return false;

            // إذا كان الجدول دائم
            if (t.scheduleType === 'permanent') return true;

            // إذا كان الجدول محدد بوقت (تأكد أن تاريخ اليوم يقع بين بداية ونهاية الفترة)
            if (t.scheduleType === 'timed') {
                if (!t.startDate || !t.endDate) return true;
                return todayStr >= t.startDate && todayStr <= t.endDate;
            }

            return true;
        });

        dayTasks.forEach(task => {
            const card = document.createElement('div');
            card.className = 'weekly-task-card';

            const isPermanent = task.scheduleType === 'permanent';
            const tagClass = isPermanent ? 'tag-permanent' : 'tag-timed';
            const tagText = isPermanent ? '♾️ دائم' : '⏳ محدد بوقت';

            card.innerHTML = `
                <span class="weekly-tag ${tagClass}">${tagText}</span>
                <strong>${escapeHtml(task.text)}</strong>
                ${task.endDate ? `<small style="color:var(--text-muted)">حتى: ${task.endDate}</small>` : ''}
                <button class="btn-icon" style="position:absolute; top:4px; left:4px;" onclick="deleteTask('${task.id}')">🗑️</button>
            `;
            container.appendChild(card);
        });
    });
}

// ==========================================
// OVERRIDE SAVE TASK LOGIC
// ==========================================
function handleSaveTask() {
    const text = modalInput.value.trim();
    if (!text) return alert('برجاء كتابة نص المهمة');

    const category = modalCategory.value;
    const scheduleType = modalScheduleType.value;

    const newTask = {
        id: currentEditingTaskId || Date.now().toString(),
        text,
        category, // daily أو weekly
        priority: modalPriority.value,
        completed: false,
        createdAt: new Date().toISOString()
    };

    if (category === 'weekly') {
        newTask.day = document.getElementById('modal-day').value;
        newTask.scheduleType = scheduleType; // permanent أو timed

        if (scheduleType === 'timed') {
            newTask.startDate = document.getElementById('modal-start-date').value;
            newTask.endDate = document.getElementById('modal-end-date').value;
        }
    } else {
        newTask.dueDate = modalDueDate.value;
    }

    if (currentEditingTaskId) {
        tasks = tasks.map(t => t.id === currentEditingTaskId ? newTask : t);
    } else {
        tasks.push(newTask);
    }

    saveToStorage();
    renderTasks();
    renderWeeklySchedule();
    closeModal();
}

// تعديل دالة التنقل بين الواجهات لتشمل واجهة الجدول
function switchView(targetView) {
    [mainView, detailView, settingsView, weeklyView].forEach(v => {
        if(v) v.classList.remove('active');
    });
    targetView.classList.add('active');
}
