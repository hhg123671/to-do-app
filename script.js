/* ==========================================
   1. VARIABLES & COLOR THEMES
   ========================================== */
:root {
    --primary: #8b5cf6;
    --primary-hover: #7c3aed;
    --primary-glow: rgba(139, 92, 246, 0.4);

    --bg-color: #0f172a;
    --surface-color: #1e293b;
    --card-bg: #334155;
    --card-border: #475569;
    --text-main: #f8fafc;
    --text-muted: #94a3b8;

    --danger: #ef4444;
    --warning: #f59e0b;
    --success: #10b981;

    --radius-lg: 20px;
    --radius-md: 12px;
    --shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* الألوان الرئيسية للمظهر */
html[data-theme-color="purple"] { --primary: #8b5cf6; --primary-hover: #7c3aed; --primary-glow: rgba(139, 92, 246, 0.4); }
html[data-theme-color="blue"] { --primary: #3b82f6; --primary-hover: #2563eb; --primary-glow: rgba(59, 130, 246, 0.4); }
html[data-theme-color="emerald"] { --primary: #10b981; --primary-hover: #059669; --primary-glow: rgba(16, 185, 129, 0.4); }
html[data-theme-color="orange"] { --primary: #f97316; --primary-hover: #ea580c; --primary-glow: rgba(249, 115, 22, 0.4); }

/* نمط HyperOS 3 */
html[data-ui-style="hyperos"] {
    --radius-lg: 24px;
    --radius-md: 16px;
    --bg-color: #080b11;
    --surface-color: rgba(26, 32, 44, 0.75);
    --card-bg: rgba(255, 255, 255, 0.05);
    --card-border: rgba(255, 255, 255, 0.12);
}

html[data-ui-style="hyperos"] body {
    background: radial-gradient(circle at top right, var(--primary-glow), #080b11 70%);
}

/* الوضع الفاتح Light Mode */
body.light-mode {
    --bg-color: #f1f5f9;
    --surface-color: #ffffff;
    --card-bg: #f8fafc;
    --card-border: #e2e8f0;
    --text-main: #0f172a;
    --text-muted: #64748b;
    --shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
}

/* ==========================================
   2. GLOBAL LAYOUT & TYPOGRAPHY
   ========================================== */
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
    background-color: var(--bg-color);
    color: var(--text-main);
    min-height: 100vh;
    padding: 2rem 1rem;
    font-family: 'Cairo', sans-serif;
    transition: var(--transition);
}

.container { max-width: 1000px; margin: 0 auto; }
.view { display: none; }
.view.active { display: block; animation: fadeIn 0.3s ease; }

header { text-align: center; margin-bottom: 2rem; }
.main-title {
    font-size: 2.2rem;
    font-weight: 800;
    color: var(--text-main);

}
.main-title1 { font-size: 2.2rem; display: none; font-weight: 800; color: var(--text-main); }
.name { font-size: 1.1rem; color: var(--primary); margin-top: 4px; font-weight: 700; transition: var(--transition); }
.author-subtitle { font-size: 0.9rem; color: var(--text-muted); margin-top: 2px; }

/* ==========================================
   3. GLOW LOADER OVERLAY (UIVERSE ADAPTED)
   ========================================== */
.loader-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: var(--bg-color);
    z-index: 99999;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 25px;
    transition: opacity 0.4s ease, visibility 0.4s ease;
}

.loader-overlay.hidden {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
}

.loader-text {
    font-size: 1rem;
    font-weight: 700;
    color: var(--text-main);
    letter-spacing: 0.5px;
    animation: pulseText 1.5s ease-in-out infinite alternate;
}

.glow-spinner {
    position: relative;
    border-radius: 50%;
    height: 96px;
    width: 96px;
    animation: rotate_3922 1.2s linear infinite;
    background-color: #9b59b6;
    background-image: linear-gradient(#9b59b6, #84cdfa, #5ad1cd);
}

.glow-spinner span {
    position: absolute;
    border-radius: 50%;
    height: 100%;
    width: 100%;
    background-color: #9b59b6;
    background-image: linear-gradient(#9b59b6, #84cdfa, #5ad1cd);
}

.glow-spinner span:nth-of-type(1) { filter: blur(5px); }
.glow-spinner span:nth-of-type(2) { filter: blur(10px); }
.glow-spinner span:nth-of-type(3) { filter: blur(25px); }
.glow-spinner span:nth-of-type(4) { filter: blur(50px); }

.glow-spinner::after {
    content: "";
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    background-color: var(--bg-color); /* تتكيف مع خلفية ثيم الموقع */
    border: solid 5px var(--bg-color);
    border-radius: 50%;
    transition: background-color 0.3s ease;
}

@keyframes rotate_3922 {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

@keyframes pulseText {
    from { opacity: 0.6; }
    to { opacity: 1; }
}

/* ==========================================
   4. BOARD & TASK CARDS
   ========================================== */
.actions-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }

.create-btn, .theme-toggle-btn, .back-btn {
    background: var(--primary);
    color: #fff;
    padding: 0.75rem 1.4rem;
    border-radius: var(--radius-md);
    border: 1px solid transparent;
    font-weight: 700;
    font-family: 'Cairo', sans-serif;
    cursor: pointer;
    transition: var(--transition);
}

.create-btn:hover { background: var(--primary-hover); transform: translateY(-2px); }
.back-btn, .theme-toggle-btn { background: var(--surface-color); border-color: var(--card-border); color: var(--text-main); }

.stats-badge { background: var(--surface-color); padding: 0.5rem 1rem; border-radius: 20px; border: 1px solid var(--card-border); font-size: 0.9rem; font-weight: 600; }
.stats-badge span { color: var(--primary); font-weight: 800; }

.board { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
.column { background: var(--surface-color); border: 1px solid var(--card-border); border-radius: var(--radius-lg); padding: 1.25rem; min-height: 400px; }
.column-header { border-bottom: 2px solid var(--card-border); padding-bottom: 0.75rem; margin-bottom: 1rem; }
.column-title { font-size: 1.1rem; font-weight: 700; }

.task-list { display: flex; flex-direction: column; gap: 0.8rem; }
.card { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: var(--radius-md); padding: 1rem; display: flex; flex-direction: column; gap: 0.6rem; cursor: pointer; transition: var(--transition); }
.card:hover { border-color: var(--primary); transform: translateY(-3px); box-shadow: 0 4px 15px var(--primary-glow); }

.card-header-info { display: flex; justify-content: space-between; align-items: center; }
.priority-badge { font-size: 0.75rem; font-weight: 700; padding: 2px 10px; border-radius: 12px; }
.priority-high { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
.priority-medium { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
.priority-low { background: rgba(16, 185, 129, 0.2); color: #10b981; }

.card-body { display: flex; align-items: center; gap: 10px; }
.card-text { flex: 1; font-size: 1rem; font-weight: 600; }
.completed .card-text { text-decoration: line-through; color: var(--text-muted); }

.card-footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed var(--card-border); padding-top: 0.5rem; }
.btn-icon { background: transparent; border: none; cursor: pointer; font-size: 1rem; padding: 4px; }

.detail-card, .settings-card { background: var(--surface-color); border: 1px solid var(--card-border); border-radius: var(--radius-lg); padding: 2rem; margin-top: 1rem; display: flex; flex-direction: column; gap: 1.5rem; }

/* ==========================================
   5. DYNAMIC ISLAND
   ========================================== */
.dynamic-island-container { position: fixed; top: 15px; left: 50%; transform: translateX(-50%); z-index: 9999; }
.dynamic-island { background: #000; color: #fff; border-radius: 25px; padding: 8px 18px; min-width: 240px; box-shadow: var(--shadow); transition: var(--transition); cursor: pointer; border: 1px solid transparent; }
.island-collapsed { display: flex; justify-content: space-between; align-items: center; gap: 12px; font-size: 0.9rem; font-weight: 600; }
.island-expanded { display: none; flex-direction: column; gap: 10px; }

.dynamic-island.expanded { width: 340px; border-radius: 24px; padding: 16px; background: #0a0d14; border-color: var(--primary); }
.dynamic-island.expanded .island-collapsed { display: none; }
.dynamic-island.expanded .island-expanded { display: flex; }

.expanded-header { display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 6px; font-weight: 700; }

/* ==========================================
   6. GLASS RADIO TOOLBAR SYSTEM
   ========================================== */
.glass-radio-group {
    --bg: rgba(255, 255, 255, 0.06);
    --text: var(--text-muted);

    display: flex;
    position: fixed;
    z-index: 9998;
    background: var(--bg);
    border-radius: 1.2rem;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid var(--card-border);
    box-shadow:
            inset 1px 1px 4px rgba(255, 255, 255, 0.2),
            inset -1px -1px 6px rgba(0, 0, 0, 0.3),
            0 8px 25px rgba(0, 0, 0, 0.35);
    overflow: hidden;
    width: fit-content;
    transition: var(--transition);
}

.glass-radio-group input { display: none; }

.glass-radio-group label {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 85px;
    font-size: 0.85rem;
    padding: 0.6rem 1.4rem;
    cursor: pointer;
    font-weight: 700;
    color: var(--text);
    position: relative;
    z-index: 2;
    transition: color 0.3s ease-in-out;
    user-select: none;
}

.glass-radio-group label small { font-size: 0.7rem; margin-top: 2px; font-weight: 600; }
.glass-radio-group label:hover { color: var(--text-main); }
.glass-radio-group input:checked + label { color: #ffffff; }

.glass-glider {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    width: calc(100% / 3);
    border-radius: 1.2rem;
    z-index: 1;
    background: linear-gradient(135deg, var(--primary-glow), var(--primary));
    box-shadow:
            0 0 18px var(--primary-glow),
            0 0 10px rgba(255, 255, 255, 0.4) inset;
    transition:
            transform 0.45s cubic-bezier(0.37, 1.95, 0.66, 0.56),
            background 0.4s ease-in-out,
            box-shadow 0.4s ease-in-out;
}

#tb-add-task-input:checked ~ .glass-glider { transform: translateX(0%); }
#tb-theme-input:checked ~ .glass-glider { transform: translateX(-100%); }
#tb-settings-input:checked ~ .glass-glider { transform: translateX(-200%); }

.glass-radio-group.pos-top { top: 20px; left: 50%; transform: translateX(-50%); }
.glass-radio-group.pos-bottom { bottom: 20px; left: 50%; transform: translateX(-50%); }
.glass-radio-group.pos-right { top: 50%; right: 20px; transform: translateY(-50%); flex-direction: column; }
.glass-radio-group.pos-left { top: 50%; left: 20px; transform: translateY(-50%); flex-direction: column; }

.glass-radio-group.pos-island-style {
    position: static;
    width: 100%;
    margin-top: 10px;
    box-shadow: none;
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
}

/* ==========================================
   7. MODAL & CHECKBOX
   ========================================== */
.modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); backdrop-filter: blur(6px); justify-content: center; align-items: center; z-index: 10000; }
.modal-content { background: var(--surface-color); border: 1px solid var(--card-border); padding: 2rem; border-radius: var(--radius-lg); width: 90%; max-width: 480px; display: flex; flex-direction: column; gap: 1rem; }
.form-group { display: flex; flex-direction: column; gap: 0.4rem; }
.form-label { font-size: 0.9rem; color: var(--text-muted); font-weight: 600; }
.modal-input, .modal-select { width: 100%; padding: 0.75rem; background: var(--card-bg); border: 1px solid var(--card-border); border-radius: var(--radius-md); color: var(--text-main); font-family: 'Cairo', sans-serif; font-size: 0.95rem; outline: none; transition: var(--transition); }
.modal-input:focus, .modal-select:focus { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-glow); }

.modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 1rem; }
.modal-btn { padding: 0.6rem 1.4rem; border-radius: var(--radius-md); border: none; font-weight: 700; font-family: 'Cairo', sans-serif; cursor: pointer; }
.modal-btn.save { background: var(--primary); color: #fff; }
.modal-btn.cancel { background: transparent; border: 1px solid var(--card-border); color: var(--text-muted); }

/* Checkbox */
.checkbox-wrapper input[type="checkbox"] { display: none; }
.checkbox-wrapper label {
    --size: 24px; position: relative; display: inline-block; width: var(--size); height: var(--size);
    background: var(--card-border); border-radius: 50%; cursor: pointer; transition: 0.2s;
}
.checkbox-wrapper input[type="checkbox"]:checked + label { background: var(--primary); }

@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
@media (max-width: 768px) { .board { grid-template-columns: 1fr; } }

/* ==========================================
   WEEKLY GRID STYLES
   ========================================== */
.weekly-header {
    text-align: center;
    margin-bottom: 1.5rem;
}

.weekly-grid {
    display: grid;
    grid-template-columns: repeat(7, minmax(130px, 1fr));
    gap: 12px;
    overflow-x: auto;
    padding-bottom: 1rem;
}

.day-column {
    background: var(--surface-color);
    border: 1px solid var(--card-border);
    border-radius: var(--radius-md);
    padding: 0.8rem;
    min-height: 320px;
    display: flex;
    flex-direction: column;
}

.day-title {
    font-weight: 800;
    text-align: center;
    padding-bottom: 0.5rem;
    margin-bottom: 0.8rem;
    border-bottom: 2px solid var(--primary);
    color: var(--primary);
    font-size: 0.95rem;
}

.day-tasks {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
}

/* بطاقة المهمة داخل الجدول */
.weekly-task-card {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: var(--radius-md);
    padding: 0.6rem;
    font-size: 0.85rem;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 4px;
    transition: var(--transition);
}

.weekly-task-card:hover {
    border-color: var(--primary);
    transform: translateY(-2px);
}

.weekly-tag {
    font-size: 0.65rem;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 6px;
    width: fit-content;
}

.tag-permanent { background: rgba(139, 92, 246, 0.2); color: #8b5cf6; }
.tag-timed { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }

/* تعديل عرض شريط الأدوات Glass Glider لاستيعاب 4 أزرار بدلاً من 3 */
.glass-glider {
    width: calc(100% / 4) !important;
}

#tb-add-task-input:checked ~ .glass-glider { transform: translateX(0%); }
#tb-weekly-input:checked ~ .glass-glider { transform: translateX(-100%); }
#tb-theme-input:checked ~ .glass-glider { transform: translateX(-200%); }
#tb-settings-input:checked ~ .glass-glider { transform: translateX(-300%); }

@media (max-width: 900px) {
    .weekly-grid {
        display: flex;
        flex-direction: column;
    }
    .day-column { min-height: auto; }
}

.main-title , .main-title1{
    cursor: pointer;
    margin-top: 35px;
}
