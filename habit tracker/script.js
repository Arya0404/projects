document.addEventListener('DOMContentLoaded', () => {
    const habitForm = document.getElementById('habit-form');
    const habitNameInput = document.getElementById('habit-name');
    const reminderTimeInput = document.getElementById('reminder-time');
    const habitList = document.getElementById('habit-list');
    const habitHistory = document.getElementById('habit-history');
  
    // Load habits and history from localStorage
    const habits = JSON.parse(localStorage.getItem('habits')) || [];
    const history = JSON.parse(localStorage.getItem('history')) || [];
  
    // Update habit list and history on page load
    function updateUI() {
      habitList.innerHTML = habits.map((habit, index) => {
        return `<li>
          <span>${habit.name}</span> - <span>Reminder: ${habit.time}</span>
          <span>Streak: ${habit.streak} day(s)</span>
          <input type="checkbox" ${habit.completed ? 'checked' : ''} onclick="toggleCompletion(${index})" />
        </li>`;
      }).join('');
  
      // If history has more than 5 entries, show scrollbar
      habitHistory.innerHTML = history.length
        ? history.slice(-5).map(item => `<p>${item.date}: Completed "${item.habit}" with ${item.streak} streak day(s)</p>`).join('')
        : 'No activity yet.';
    }
  
    // Save data to localStorage
    function saveToLocalStorage() {
      localStorage.setItem('habits', JSON.stringify(habits));
      localStorage.setItem('history', JSON.stringify(history));
    }
  
    // Add a new habit
    habitForm.addEventListener('submit', (event) => {
      event.preventDefault();
      
      const habitName = habitNameInput.value.trim();
      const reminderTime = reminderTimeInput.value.trim();
  
      if (habitName && reminderTime) {
        const newHabit = { name: habitName, time: reminderTime, streak: 0, completed: false };
        habits.push(newHabit);
        habitNameInput.value = '';
        reminderTimeInput.value = '';
        
        // Save and update UI
        saveToLocalStorage();
        updateUI();
      }
    });
  
    // Toggle habit completion and increment streak
    window.toggleCompletion = (index) => {
      const habit = habits[index];
  
      // If the habit is not marked as completed, mark it and increment streak
      if (!habit.completed) {
        habit.streak++;  // Increment streak by 1
        habit.completed = true; // Mark it as completed (we'll keep it completed)
      } else {
        // If the habit is already completed, just increment the streak without resetting
        habit.streak++;
      }
  
      // Add to history if it gets completed for the day
      const currentDate = new Date().toLocaleDateString();
      history.push({ date: currentDate, habit: habit.name, streak: habit.streak });
  
      // Save and update UI
      saveToLocalStorage();
      updateUI();
    };
  
    // Clear all habits and history
    document.getElementById('clear-all-btn').addEventListener('click', () => {
      localStorage.removeItem('habits');
      localStorage.removeItem('history');
      
      habits.length = 0;
      history.length = 0;
  
      updateUI();
    });
  
    // Initial UI update
    updateUI();
  });
  // Function to clear both habits and history
document.getElementById('clear-all-btn').addEventListener('click', () => {
    // Clear habits and history from localStorage
    localStorage.removeItem('habits');
    localStorage.removeItem('history');
    
    // Reset the habits and history arrays in the app state
    habits.length = 0;
    history.length = 0;
  
    // Update UI to reflect the changes (showing no habits or history)
    updateUI();
  });
  