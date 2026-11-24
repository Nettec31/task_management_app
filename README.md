# Task Management App

This is a simple task manager built with HTML, CSS, and JavaScript. You can add tasks with a name, category, deadline, and status, change a task's status, filter tasks by status or category, and see past-due tasks marked as Overdue automatically. Tasks are saved in local storage so they stay on the page after a refresh.

## Reflection

One problem I ran into was comparing dates from the date input with today's date. At first, date comparisons were acting weird because of how JavaScript handles dates and time zones. I fixed it by formatting today's date as a `YYYY-MM-DD` string so it matches the date input directly. Another tricky part was keeping the screen updated and saving to local storage whenever I added a task, changed a status, or used a filter. Breaking the code into small functions for rendering, filtering, checking overdue dates, and saving helped keep things from getting messy. If I had more time, I would add a button to delete tasks, let users edit a task after making it, and add some basic colors to make different statuses easier to spot.