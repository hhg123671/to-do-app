let allTasks = JSON.parse(localStorage.getItem('my_tasks_v2')) || [];
let appSettings = JSON.parse(localStorage.getItem('app_settings_v1')) || {
    lang: 'ar',
    saveMode: 'auto',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    colorTheme: 'default',
    uiStyle: 'default'
};

let editingTaskId = null;
let currentOpenedTaskId = null;
let pendingUploadedFiles = [];

const i18n = {
    ar: {
        dark_mode: "الوضع الداكن",
        colors: "🎨 الألوان",
        settings: "⚙️ الإعدادات",
        pending_tasks: "المهام المتبقية:",
        click_developer: "اضغط على العنوان لمعرفة المطور",
        add_new_task: "إضافة مهمة جديدة",
        save_changes: "حفظ التغييرات الآن",
        in_progress: "⏳ قيد الانتظار",
        completed: "✅ المكتملة",
        back_to_main: "➡️ العودة للقائمة الرئيسية",
        task_status: "حالة المهمة",
        attached_files: "الملفات المرفقة",
        edit_task: "تعديل",
        delete_task: "حذف",
        share_task: "مشاركة",
        toggle_status: "تغيير الحالة",
        app_settings: "⚙️ إعدادات التطبيق",
        ui_style: "🎨 نمط الواجهة (UI Style)",
        language: "🌐 لغة التطبيق",
        save_mode: "💾 وضع الحفظ (Save Mode)",
        auto_save: "حفظ تلقائي (Auto Save)",
        manual_save: "حفظ يدوي (Manual Save)",
        font_style: "🔤 نوع الخط (Font Style)",
        backup_restore: "📦 النسخ الاحتياطي والاستعادة",
        export_tasks: "📥 تصدير المهام",
        import_tasks: "📤 استيراد المهام",
        danger_zone: "⚠️ منطقة الخطر",
        delete_all: "🗑️ حذف جميع المهام",
        task_details: "تفاصيل المهمة",
        due_date: "تاريخ ووقت الاستحقاق (تذكير)",
        task_priority: "أولوية المهمة",
        priority_high: "🔴 عالي - أولوية عاجلة",
        priority_medium: "🟡 متوسط - أولوية عادية",
        priority_low: "🟢 منخفض - أولوية غير عاجلة",
        attach_files: "إرفاق ملفات متعددة",
        cancel: "إلغاء",
        save_task: "حفظ المهمة",
        task_completed: "✅ هذه المهمة مكتملة",
        task_pending: "⏳ قيد الانتظار",
        copied: "تم نسخ معلومات المهمة للحافظة!"
    },
    en: {
        dark_mode: "Dark Mode",
        colors: "🎨 Colors",
        settings: "⚙️ Settings",
        pending_tasks: "Pending Tasks:",
        click_developer: "Click title to show developer",
        add_new_task: "Add New Task",
        save_changes: "Save Changes Now",
        in_progress: "⏳ In Progress",
        completed: "✅ Completed",
        back_to_main: "➡️ Back to Main List",
        task_status: "Task Status",
        attached_files: "Attached Files",
        edit_task: "Edit",
        delete_task: "Delete",
        share_task: "Share",
        toggle_status: "Toggle Status",
        app_settings: "⚙️ App Settings",
        ui_style: "🎨 UI Style",
        language: "🌐 App Language",
        save_mode: "💾 Save Mode",
        auto_save: "Auto Save",
        manual_save: "Manual Save",
        font_style: "🔤 Font Style",
        backup_restore: "📦 Backup & Restore",
        export_tasks: "📥 Export Tasks",
        import_tasks: "📤 Import Tasks",
        danger_zone: "⚠️ Danger Zone",
        delete_all: "🗑️ Delete All Tasks",
        task_details: "Task Details",
        due_date: "Due Date & Time (Reminder)",
        task_priority: "Task Priority",
        priority_high: "🔴 High Priority",
        priority_medium: "🟡 Medium Priority",
        priority_low: "🟢 Low Priority",
        attach_files: "Attach Multiple Files",
        cancel: "Cancel",
        save_task: "Save Task",
        task_completed: "✅ Task Completed",
        task_pending: "⏳ Pending Task",
        copied: "Task details copied to clipboard!"
    }
};

const mainView = document.getElementById("main-view");
const detailView = document.getElementById("detail-view");
const settingsView = document.getElementById("settings-view");

const backToListBtn = document.getElementById("back-to-list-btn");
const backFromSettingsBtn = document.getElementById("back-from-settings-btn");
const settingsToggleBtn = document.getElementById("settings-toggle-btn");

const styleSelect = document.getElementById("style-select");
const languageSelect = document.getElementById("language-select");
const saveModeSelect = document.getElementById("save-mode-select");
const fontSelect = document.getElementById("font-select");
const manualSaveBtn = document.getElementById("manual-save-btn");

const paletteBtn = document.getElementById("palette-btn");
const paletteMenu = document.getElementById("palette-menu");
const colorDots = document.querySelectorAll(".color-dot");

const exportBtn = document.getElementById("export-btn");
const importFileInput = document.getElementById("import-file-input");
const clearAllBtn = document.getElementById("clear-all-btn");

const detailTaskText = document.getElementById("detail-task-text");
const detailDueDate = document.getElementById("detail-due-date");
const detailTaskPriority = document.getElementById("detail-task-priority");
const detailTaskStatus = document.getElementById("detail-task-status");
const detailAttachmentsContainer = document.getElementById("detail-attachments-container");

const detailToggleStatusBtn = document.getElementById("detail-toggle-status-btn");
const detailShareBtn = document.getElementById("detail-share-btn");
const detailEditBtn = document.getElementById("detail-edit-btn");
const detailDeleteBtn = document.getElementById("detail-delete-btn");

const tasksContainer = document.getElementById("tasks");
const completedContainer = document.getElementById("completed");
const pendingCount = document.getElementById("pending-count");

const modal = document.getElementById("task-modal");
const modalInput = document.getElementById("modal-input");
const modalDueDate = document.getElementById("modal-duedate");
const modalPriority = document.getElementById("modal-priority");
const modalFileInput = document.getElementById("modal-file");
const openModalBtn = document.getElementById("open-modal-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const saveTaskBtn = document.getElementById("save-task-btn");
const checkUpdateBtn = document.getElementById("check-update-btn");

function applySettings() {
    document.documentElement.lang = appSettings.lang;
    document.documentElement.dir = appSettings.lang === 'ar' ? 'rtl' : 'ltr';

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18n[appSettings.lang][key]) {
            el.textContent = i18n[appSettings.lang][key];
        }
    });

    document.body.style.fontFamily = appSettings.fontFamily;
    manualSaveBtn.style.display = appSettings.saveMode === 'manual' ? 'inline-flex' : 'none';

    // ⚡ Apply UI Style (HyperOS 3 or Default)
    if (appSettings.uiStyle === 'hyperos') {
        document.documentElement.setAttribute('data-ui-style', 'hyperos');
    } else {
        document.documentElement.removeAttribute('data-ui-style');
    }

    // 🎨 Apply Color Theme
    if (appSettings.colorTheme && appSettings.colorTheme !== 'default') {
        document.documentElement.setAttribute('data-theme', appSettings.colorTheme);
    } else {
        document.documentElement.removeAttribute('data-theme');
    }

    colorDots.forEach(dot => {
        if (dot.getAttribute('data-theme-value') === (appSettings.colorTheme || 'default')) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });

    styleSelect.value = appSettings.uiStyle || 'default';
    languageSelect.value = appSettings.lang;
    saveModeSelect.value = appSettings.saveMode;
    fontSelect.value = appSettings.fontFamily;

    localStorage.setItem('app_settings_v1', JSON.stringify(appSettings));
}

styleSelect.addEventListener('change', (e) => {
    appSettings.uiStyle = e.target.value;
    applySettings();
});

paletteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    paletteMenu.classList.toggle('show');
});

document.addEventListener('click', () => {
    paletteMenu.classList.remove('show');
});

colorDots.forEach(dot => {
    dot.addEventListener('click', (e) => {
        e.stopPropagation();
        appSettings.colorTheme = dot.getAttribute('data-theme-value');
        applySettings();
        paletteMenu.classList.remove('show');
    });
});

function updateState() {
    if (appSettings.saveMode === 'auto') {
        localStorage.setItem('my_tasks_v2', JSON.stringify(allTasks));
    }
    const pending = allTasks.filter(t => !t.isCompleted).length;
    pendingCount.textContent = pending;
}

manualSaveBtn.addEventListener('click', () => {
    localStorage.setItem('my_tasks_v2', JSON.stringify(allTasks));
    alert(appSettings.lang === 'ar' ? 'تم حفظ المهام بنجاح!' : 'Tasks saved successfully!');
});

languageSelect.addEventListener('change', (e) => { appSettings.lang = e.target.value; applySettings(); renderTasks(); });
saveModeSelect.addEventListener('change', (e) => { appSettings.saveMode = e.target.value; applySettings(); });
fontSelect.addEventListener('change', (e) => { appSettings.fontFamily = e.target.value; applySettings(); });

exportBtn.addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allTasks));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `todo_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
});

importFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
        try {
            allTasks = JSON.parse(evt.target.result);
            updateState();
            renderTasks();
            alert(appSettings.lang === 'ar' ? 'تم استيراد البيانات بنجاح!' : 'Data imported successfully!');
        } catch(err) {
            alert(appSettings.lang === 'ar' ? 'ملف غير صالح!' : 'Invalid file!');
        }
    };
    reader.readAsText(file);
});

clearAllBtn.addEventListener('click', () => {
    if (confirm(appSettings.lang === 'ar' ? 'هل أنت تأكد من حذف جميع المهام؟' : 'Are you sure you want to delete all tasks?')) {
        allTasks = [];
        updateState();
        renderTasks();
    }
});

function hideAllViews() {
    mainView.classList.remove("active");
    detailView.classList.remove("active");
    settingsView.classList.remove("active");
}

function showMainView() {
    hideAllViews();
    mainView.classList.add("active");
    currentOpenedTaskId = null;
    renderTasks();
}

function openTaskDetailView(taskId) {
    const task = allTasks.find(t => t.id === taskId);
    if (!task) return;

    currentOpenedTaskId = taskId;
    detailTaskText.textContent = task.text;
    detailTaskPriority.innerHTML = getPriorityBadge(task.priority || 'medium');

    detailDueDate.textContent = task.dueDate ? `⏰ ${new Date(task.dueDate).toLocaleString()}` : '';

    detailTaskStatus.innerHTML = task.isCompleted
        ? `<span style="color:var(--success)">${i18n[appSettings.lang].task_completed}</span>`
        : `<span style="color:var(--warning)">${i18n[appSettings.lang].task_pending}</span>`;

    detailAttachmentsContainer.innerHTML = '';
    if (task.files && task.files.length > 0) {
        task.files.forEach(file => {
            const card = document.createElement('div');
            card.className = 'detail-attachment-card';
            card.innerHTML = `<span class="detail-attachment-name">${escapeHtml(file.name)}</span> <a href="${file.url}" download="${file.name}">💾</a>`;
            detailAttachmentsContainer.appendChild(card);
        });
    }

    hideAllViews();
    detailView.classList.add("active");
}

detailToggleStatusBtn.addEventListener('click', () => {
    const task = allTasks.find(t => t.id === currentOpenedTaskId);
    if (task) {
        task.isCompleted = !task.isCompleted;
        updateState();
        openTaskDetailView(currentOpenedTaskId);
    }
});

detailShareBtn.addEventListener('click', () => {
    const task = allTasks.find(t => t.id === currentOpenedTaskId);
    if (task) {
        const textToCopy = `📌 Task: ${task.text}\nPriority: ${task.priority}\nStatus: ${task.isCompleted ? 'Completed' : 'Pending'}`;
        navigator.clipboard.writeText(textToCopy);
        alert(i18n[appSettings.lang].copied);
    }
});

detailEditBtn.addEventListener('click', () => {
    const task = allTasks.find(t => t.id === currentOpenedTaskId);
    if (task) {
        editingTaskId = task.id;
        modalInput.value = task.text;
        modalDueDate.value = task.dueDate || '';
        modalPriority.value = task.priority || 'medium';
        pendingUploadedFiles = task.files || [];
        openModal();
    }
});

detailDeleteBtn.addEventListener('click', () => {
    if (confirm("Delete this task?")) {
        allTasks = allTasks.filter(t => t.id !== currentOpenedTaskId);
        updateState();
        showMainView();
    }
});

backToListBtn.addEventListener("click", showMainView);
backFromSettingsBtn.addEventListener("click", showMainView);
settingsToggleBtn.addEventListener("click", () => { hideAllViews(); settingsView.classList.add("active"); });

function getPriorityBadge(priority) {
    if (priority === 'high') return `<span class="priority-badge priority-high">🔴 High</span>`;
    if (priority === 'low') return `<span class="priority-badge priority-low">🟢 Low</span>`;
    return `<span class="priority-badge priority-medium">🟡 Medium</span>`;
}

function createCardElement(taskObj) {
    const card = document.createElement('div');
    card.className = `card ${taskObj.isCompleted ? 'completed' : ''}`;

    let isOverdue = taskObj.dueDate && new Date(taskObj.dueDate) < new Date() && !taskObj.isCompleted;

    card.innerHTML = `
        <div class="card-header-info">
            ${getPriorityBadge(taskObj.priority || 'medium')}
            ${taskObj.dueDate ? `<span class="card-due-badge ${isOverdue ? 'due-overdue' : ''}">⏰ ${new Date(taskObj.dueDate).toLocaleDateString()}</span>` : ''}
        </div>
        <div class="card-body">
            <p class="card-text">${escapeHtml(taskObj.text)}</p>
        </div>
        <div class="card-footer">
            <span>📎 ${taskObj.files ? taskObj.files.length : 0}</span>
            <div class="card-footer-actions">
                <button class="btn-icon edit">✏️</button>
                <button class="btn-icon delete">🗑️</button>
            </div>
        </div>
    `;

    card.addEventListener('click', (e) => {
        if (e.target.closest('.card-footer-actions')) return;
        openTaskDetailView(taskObj.id);
    });

    card.querySelector('.btn-icon.delete').addEventListener('click', (e) => {
        e.stopPropagation();
        allTasks = allTasks.filter(t => t.id !== taskObj.id);
        updateState();
        renderTasks();
    });

    card.querySelector('.btn-icon.edit').addEventListener('click', (e) => {
        e.stopPropagation();
        editingTaskId = taskObj.id;
        modalInput.value = taskObj.text;
        modalDueDate.value = taskObj.dueDate || '';
        modalPriority.value = taskObj.priority || 'medium';
        pendingUploadedFiles = taskObj.files || [];
        openModal();
    });

    return card;
}

function renderTasks() {
    tasksContainer.innerHTML = '';
    completedContainer.innerHTML = '';
    allTasks.forEach(task => {
        const card = createCardElement(task);
        if (task.isCompleted) completedContainer.appendChild(card);
        else tasksContainer.appendChild(card);
    });
    updateState();
}

modalFileInput.addEventListener('change', (e) => {
    Array.from(e.target.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (evt) => pendingUploadedFiles.push({ name: file.name, url: evt.target.result });
        reader.readAsDataURL(file);
    });
});

function openModal() { modal.style.display = 'flex'; modalInput.focus(); }
function closeModal() {
    modal.style.display = 'none';
    modalInput.value = '';
    modalDueDate.value = '';
    pendingUploadedFiles = [];
    editingTaskId = null;
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
            task.dueDate = modalDueDate.value;
            task.priority = modalPriority.value;
            task.files = pendingUploadedFiles;
        }
    } else {
        allTasks.push({
            id: Date.now(),
            text: val,
            dueDate: modalDueDate.value,
            priority: modalPriority.value,
            files: pendingUploadedFiles,
            isCompleted: false
        });
    }

    updateState();
    renderTasks();
    closeModal();

    if (currentOpenedTaskId) openTaskDetailView(currentOpenedTaskId);
});

document.getElementById("theme-toggle").addEventListener("click", () => { document.body.classList.toggle("light-mode"); });

if (checkUpdateBtn) {
    checkUpdateBtn.addEventListener("click", () => {
        checkUpdateBtn.textContent = "⏳ جاري البحث...";
        checkUpdateBtn.style.opacity = "0.7";

        setTimeout(() => {
            checkUpdateBtn.textContent = "✅ لا توجد تحديثات جديدة";
            checkUpdateBtn.style.opacity = "1";

            setTimeout(() => {
                checkUpdateBtn.innerHTML = "<span>🔄</span> البحث عن تحديثات";
            }, 3000);
        }, 1500);
    });
}

function escapeHtml(str) {
    return str.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));
}

// 🏝️ DYNAMIC ISLAND LOGIC
const dynamicIsland = document.getElementById('dynamic-island');
const islandPendingCount = document.getElementById('island-pending-count');
const islandText = document.getElementById('island-text');
const islandIcon = document.getElementById('island-icon');
const islandDetailsText = document.getElementById('island-details-text');

let islandTimeout = null;

// التبديل بين التوسع والطي عند الضغط
dynamicIsland.addEventListener('click', () => {
    dynamicIsland.classList.toggle('expanded');
});

// دالة إرسال إشعار للجزيرة الديناميكية
function triggerIslandNotification(icon, message, details = "") {
    islandIcon.textContent = icon;
    islandText.innerHTML = message;
    if (details) islandDetailsText.textContent = details;

    dynamicIsland.classList.add('pulse');
    setTimeout(() => dynamicIsland.classList.remove('pulse'), 400);

    // إذا كانت غير مفتوحة، تظهر الرسالة مؤقتاً ثم تعود لعدد المهام
    clearTimeout(islandTimeout);
    islandTimeout = setTimeout(() => {
        const pending = allTasks.filter(t => !t.isCompleted).length;
        islandIcon.textContent = "📝";
        islandText.innerHTML = `المهام النشطة: <strong>${pending}</strong>`;
        islandDetailsText.textContent = `لديك ${pending} مهام تنتظر التنفيذ.`;
    }, 3500);
}

// تحديث دالة updateState لربط العداد بالجزيرة
const originalUpdateState = updateState;
updateState = function() {
    if (typeof originalUpdateState === 'function') originalUpdateState();
    const pending = allTasks.filter(t => !t.isCompleted).length;
    if (islandPendingCount) islandPendingCount.textContent = pending;
};

// إرسال إشعار عند حفظ مهمة جديدة
const originalSaveTask = saveTaskBtn.onclick;
saveTaskBtn.addEventListener('click', () => {
    const val = modalInput.value.trim();
    if (val) {
        triggerIslandNotification("✨", "تمت إضافة مهمة جديدة!", val);
    }
});

applySettings();
renderTasks();
