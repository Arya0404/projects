import json
import os

TASKS_FILE = "tasks.json"

def load_tasks():
    if not os.path.exists(TASKS_FILE):
        return []
    with open(TASKS_FILE, "r") as f:
        return json.load(f)

def save_tasks(tasks):
    with open(TASKS_FILE, "w") as f:
        json.dump(tasks, f, indent=4)

def add_task(title, date, time, reminder):
    tasks = load_tasks()
    tasks.append({
        "title": title,
        "date": date,
        "time": time,
        "reminder": reminder
    })
    save_tasks(tasks)

def delete_task(task_index):
    tasks = load_tasks()
    if 0 <= task_index < len(tasks):
        tasks.pop(task_index)
        save_tasks(tasks)

def get_upcoming_tasks():
    import datetime
    tasks = load_tasks()
    now = datetime.datetime.now()
    upcoming = []
    for task in tasks:
        reminder_time = datetime.datetime.fromisoformat(task["reminder"])
        if reminder_time >= now:
            upcoming.append(task)
    upcoming.sort(key=lambda x: x["reminder"])
    return upcoming