import streamlit as st
from streamlit_calendar import calendar
from utils.helpers import load_tasks, add_task, delete_task, get_upcoming_tasks
import datetime

st.set_page_config(page_title="Task Scheduler", layout="wide")

# Sidebar
st.sidebar.title("Task Scheduler")
tab = st.sidebar.radio("Navigation", ["📅 Calendar", "➕ Add Task", "🔔 Upcoming Reminders", "🗑️ Delete Tasks"])

# Main
st.title("📚 Personal Task Scheduler")
st.markdown("---")

# 1. Calendar View
if tab == "📅 Calendar":
    st.subheader("📅 Calendar View")
    tasks = load_tasks()

    events = []

    for task in tasks:
        if "start" in task:
            start = task["start"]
        else:
            start = f"{task['date']}T{task['time']}"  # fallback for older tasks

        events.append({
            "title": task["title"],
            "start": start,
            "color": task.get("color", "#3A86FF"),  # default color if missing
            "extendedProps": task.get("extendedProps", {})  # default empty description
        })

    calendar_options = {
        "initialView": "dayGridMonth",
        "headerToolbar": {
            "left": "prev,next today",
            "center": "title",
            "right": "dayGridMonth,timeGridWeek,timeGridDay"
        },
        "themeSystem": "standard",
        "height": 700,
        "backgroundColor": "white",
        "dayMaxEvents": True,
        "eventColor": "#3A86FF",
        "eventTextColor": "white",
        "firstDay": 1
    }

    calendar(events=events, options=calendar_options)

# 2. Add Task View
elif tab == "➕ Add Task":
    st.subheader("➕ Add a New Task")
    with st.form("task_form"):
        title = st.text_input("Task Title")
        date = st.date_input("Task Date", datetime.date.today())
        time = st.time_input("Task Time", datetime.time(9, 0))
        reminder_date = st.date_input("Reminder Date", datetime.date.today())
        reminder_time = st.time_input("Reminder Time", datetime.time(8, 0))

        submitted = st.form_submit_button("Add Task")

        if submitted:
            reminder = f"{reminder_date}T{reminder_time}"
            add_task(title, date.isoformat(), time.strftime("%H:%M"), reminder)
            st.success(f"✅ Task '{title}' added successfully!")

# 3. Upcoming Reminders View
elif tab == "🔔 Upcoming Reminders":
    st.subheader("🔔 Your Upcoming Reminders")

    upcoming_tasks = get_upcoming_tasks()

    if upcoming_tasks:
        for task in upcoming_tasks:
            with st.container():
                st.markdown(f"""
                    <div style="background-color: #f0f2f6; padding: 15px; border-radius: 10px; margin-bottom: 10px;">
                        <h4 style="color: #333;">{task['title']}</h4>
                        <p>📅 {task['date']} 🕒 {task['time']}</p>
                        <p>⏰ Reminder set for {task['reminder']}</p>
                    </div>
                """, unsafe_allow_html=True)
    else:
        st.info("🎉 No upcoming reminders!")

# 4. Delete Task View
elif tab == "🗑️ Delete Tasks":
    st.subheader("🗑️ Delete Existing Tasks")
    tasks = load_tasks()

    if tasks:
        for idx, task in enumerate(tasks):
            col1, col2 = st.columns([5, 1])
            with col1:
                if "date" in task and "time" in task:
                    # Old tasks
                    st.write(f"**{task['title']}** — {task['date']} at {task['time']}")
                elif "start" in task:
                    # New tasks
                    date_part, time_part = task["start"].split("T")
                    time_part = time_part[:5]  # Keep only HH:MM
                    st.write(f"**{task['title']}** — {date_part} at {time_part}")
                else:
                    st.write(f"**{task['title']}**")

            with col2:
                if st.button("Delete", key=f"del_{idx}"):
                    delete_task(idx)
                    st.success(f"❌ Deleted task: {task['title']}")
                    st.rerun()

    else:
        st.info("📭 No tasks to delete.")