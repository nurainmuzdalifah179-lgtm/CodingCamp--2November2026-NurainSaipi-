# Requirements Document

## Introduction

The Productivity Dashboard is a browser-based web application that helps users manage their daily focus and quick navigation. It runs entirely in the browser with no backend server, storing all user data client-side using the browser Local Storage API. The dashboard is built with HTML, CSS, and vanilla JavaScript (no frameworks) and works in modern browsers (Chrome, Firefox, Edge, Safari). It can be used as a standalone web app or packaged as a browser extension.

The Minimum Viable Product (MVP) provides four widgets: a Greeting widget that shows the current time, date, and a time-of-day greeting; a Focus Timer that runs a 25-minute countdown with start, stop, and reset controls; a To-Do List that lets users add, edit, complete, and delete tasks persisted in Local Storage; and Quick Links that lets users add clickable buttons to favorite websites persisted in Local Storage.

Beyond the MVP, the Dashboard includes optional challenge features: a Light/Dark Mode toggle that switches the visual theme and persists the preference, a Custom Greeting Name that personalizes the greeting and persists the name, and Duplicate Task Prevention that rejects case-insensitive duplicate tasks when adding or editing.

## Glossary

- **Dashboard**: The overall productivity dashboard web application composed of the widgets defined in this document.
- **Greeting_Widget**: The component that displays the current time, current date, and a time-of-day greeting.
- **Focus_Timer**: The countdown timer component that runs a 25-minute focus session.
- **Task_List**: The to-do list component that stores tasks and their completion status.
- **Quick_Links_Widget**: The component that renders clickable buttons opening favorite websites.
- **Storage_Manager**: The module responsible for serializing data to and loading data from Local Storage as JSON.
- **Local Storage**: The browser Web Storage API that persists key-value data client-side across browser sessions.
- **Task**: A single to-do item with a unique identifier, text content, and a completion status.
- **Link**: A single quick link record with a name and a URL.
- **Theme**: The visual appearance mode of the Dashboard, either "light" or "dark".
- **Theme_Toggle**: The component that switches the Dashboard Theme between light and dark and persists the selected Theme to Local Storage.
- **Custom_Name**: A user-defined name that the Greeting_Widget appends to the time-of-day greeting.
- **Custom_Name_Input**: The component that lets a user enter and persist a Custom_Name to Local Storage.

## Requirements

### Requirement 1: Greeting Display

**User Story:** As a user, I want to see the current time, date, and a time-of-day greeting, so that I receive a personalized welcome when I open the Dashboard.

#### Acceptance Criteria

1. THE Greeting_Widget SHALL display the current local time, including hours, minutes, and seconds, and update the displayed time once per second.
2. THE Greeting_Widget SHALL display the current local date, including day, month, and year.
3. WHILE the current local hour is within the inclusive range of 5 to 11, THE Greeting_Widget SHALL display "Good morning".
4. WHILE the current local hour is within the inclusive range of 12 to 16, THE Greeting_Widget SHALL display "Good afternoon".
5. WHILE the current local hour is within the inclusive range of 17 to 20, THE Greeting_Widget SHALL display "Good evening".
6. WHILE the current local hour is within the inclusive range of 21 to 23 or 0 to 4, THE Greeting_Widget SHALL display "Good night".

### Requirement 2: Focus Timer

**User Story:** As a user, I want a 25-minute focus timer with start, stop, and reset controls, so that I can run timed work sessions.

#### Acceptance Criteria

1. THE Focus_Timer SHALL initialize the displayed countdown to 25 minutes and 0 seconds, showing remaining time in minutes and seconds.
2. WHEN the Start button is clicked, THE Focus_Timer SHALL begin counting down from the currently displayed remaining duration, decrementing the display by 1 second at 1-second intervals.
3. WHEN the Stop button is clicked, THE Focus_Timer SHALL pause the countdown and retain the remaining duration on the display.
4. WHEN the Reset button is clicked, THE Focus_Timer SHALL stop the countdown and restore the displayed duration to 25 minutes and 0 seconds.
5. WHEN the countdown reaches zero, THE Focus_Timer SHALL stop counting and display a visible message on the Dashboard indicating that the focus session is complete.
6. IF the Start button is clicked while the countdown is already in progress, THEN THE Focus_Timer SHALL continue the countdown without restarting.

### Requirement 3: To-Do List Management

**User Story:** As a user, I want to add, edit, complete, and delete tasks, so that I can track the things I need to do.

#### Acceptance Criteria

1. WHEN a user submits a new task with text of 1 to 200 characters, THE Task_List SHALL create a Task with a unique identifier, the submitted text, and a not-done completion status.
2. WHEN a user edits an existing Task with text of 1 to 200 characters, THE Task_List SHALL update the Task text and preserve the existing completion status.
3. WHEN a user toggles a Task, THE Task_List SHALL toggle the Task completion status and update the display so that completed Tasks are visually distinguishable from incomplete Tasks.
4. WHEN a user deletes a Task, THE Task_List SHALL remove that Task from the Task_List.
5. WHEN the Dashboard loads, THE Task_List SHALL load saved Tasks from Local Storage.
6. WHEN a Task is created, edited, toggled, or deleted, THE Task_List SHALL persist the updated Task list to Local Storage.
7. IF a user submits a new task with empty text, whitespace-only text, or text longer than 200 characters, THEN THE Task_List SHALL reject the task and display an error message indicating the invalid input.
8. IF a user edits an existing Task with empty text, whitespace-only text, or text longer than 200 characters, THEN THE Task_List SHALL reject the edit, preserve the existing Task text, and display an error message indicating the invalid input.
9. IF the Local Storage write operation fails when persisting the updated Task list, THEN THE Task_List SHALL retain the current Task display and indicate to the user that the Task list could not be saved.

### Requirement 4: Quick Links Management

**User Story:** As a user, I want clickable buttons that open my favorite websites, so that I can navigate to them quickly.

#### Acceptance Criteria

1. WHEN the Dashboard loads, THE Quick_Links_Widget SHALL load all saved Links from Local Storage and display one button for each saved Link.
2. WHEN a user adds a new Link with a name of 1 to 50 characters and a URL, and fewer than 20 Links are currently saved, THE Quick_Links_Widget SHALL create a button labeled with the Link name.
3. WHEN a user clicks a Link button, THE Quick_Links_Widget SHALL open the Link URL in a new browser tab.
4. WHEN a user deletes a Link, THE Quick_Links_Widget SHALL remove the corresponding button from the Quick_Links_Widget.
5. WHEN a Link is added or deleted, THE Quick_Links_Widget SHALL persist the updated Link list to Local Storage.
6. IF a user adds a Link with an empty name, an empty URL, a name longer than 50 characters, or the saved Link count has reached 20, THEN THE Quick_Links_Widget SHALL reject the Link, display an error message indicating the invalid input, and preserve all existing Links unchanged.
7. IF the Local Storage write operation fails when persisting the updated Link list, THEN THE Quick_Links_Widget SHALL display an error message indicating that the Link list could not be saved and retain the currently displayed Link buttons.

### Requirement 5: Data Persistence

**User Story:** As a user, I want my Tasks and Links to persist between browser sessions, so that I do not lose data when I close the browser.

#### Acceptance Criteria

1. WHEN the Dashboard loads, THE Storage_Manager SHALL load all saved Task and Link data from Local Storage so that the previously saved Tasks and Links are present in the Dashboard.
2. WHEN any Task or Link data changes, THE Storage_Manager SHALL serialize all current Task and Link data to Local Storage as JSON.
3. THE Storage_Manager SHALL preserve Task and Link data integrity such that serializing any set of Tasks and Links to Local Storage as JSON and subsequently loading them back reconstructs each Task and Link with field values identical to those that were saved.
4. IF Local Storage contains no saved Task and Link data, THEN THE Storage_Manager SHALL initialize the application with no Tasks and no Links.
5. IF Local Storage contains Task and Link data that cannot be parsed as valid JSON, THEN THE Storage_Manager SHALL initialize the application with no Tasks and no Links and indicate to the user that the saved data could not be loaded.
6. IF serializing Task and Link data to Local Storage fails because the storage quota is exceeded, THEN THE Storage_Manager SHALL retain the current application state without loss and indicate to the user that the data could not be saved.

### Requirement 6: Browser Compatibility

**User Story:** As a user, I want the Dashboard to work across modern browsers, so that I can use it regardless of my browser choice.

#### Acceptance Criteria

1. WHEN the Dashboard is opened in any of the two most recent stable major versions of Chrome, Firefox, Edge, or Safari, THE Dashboard SHALL display layout elements without overlap or visual truncation, keep interactive controls operable in response to user input, and produce no uncaught JavaScript errors in the browser console.
2. THE Dashboard SHALL operate without a backend server and without any external JavaScript framework.
3. IF the Dashboard is opened in a browser that does not support HTML5, CSS3, or ES6 JavaScript, THEN THE Dashboard SHALL display a message indicating that the browser is not supported.

### Requirement 7: Performance

**User Story:** As a user, I want a fast and responsive Dashboard, so that I can work without lag.

#### Acceptance Criteria

1. WHEN the Dashboard loads, THE Dashboard SHALL display visible content for its primary interface elements within 1 second, where the measurement starts from the initiation of page navigation.
2. WHEN a user interacts with any widget, THE Dashboard SHALL produce a visible change in the affected widget within 100 milliseconds.

### Requirement 8: Visual Design

**User Story:** As a user, I want a clean and readable interface, so that I can use the Dashboard comfortably.

#### Acceptance Criteria

1. THE Dashboard SHALL display each widget title at a larger font size than its corresponding body content.
2. THE Dashboard SHALL present the Greeting_Widget, Focus_Timer, Task_List, and Quick_Links_Widget as the core functional widgets, and SHALL allow additional controls such as the Theme_Toggle and Custom_Name_Input for extended features.
3. THE Dashboard SHALL maintain a minimum contrast ratio of 4.5:1 between text and background across all widgets.

### Requirement 9: Project Structure

**User Story:** As a developer, I want a simple and consistent project structure, so that the code is easy to read and maintain.

#### Acceptance Criteria

1. THE Dashboard SHALL include exactly one CSS file located in the css/ directory.
2. THE Dashboard SHALL include exactly one JavaScript file located in the js/ directory.
3. THE Dashboard SHALL use vanilla JavaScript with no external framework references present in the JavaScript file or HTML file.
4. THE Dashboard SHALL include exactly one HTML file as the entry point in the root directory.

### Requirement 10: Light/Dark Mode Toggle

**User Story:** As a user, I want to switch between light and dark themes, so that I can choose a comfortable visual mode.

#### Acceptance Criteria

1. THE Theme_Toggle SHALL display a control that switches the Dashboard Theme between "light" and "dark".
2. WHEN the Theme_Toggle is activated, THE Dashboard SHALL apply the selected Theme to all widgets immediately.
3. WHEN the Theme_Toggle is activated, THE Theme_Toggle SHALL persist the selected Theme to Local Storage.
4. WHEN the Dashboard loads, THE Theme_Toggle SHALL load the saved Theme from Local Storage and apply it to all widgets.
5. IF no saved Theme exists in Local Storage when the Dashboard loads, THEN THE Theme_Toggle SHALL apply the "light" Theme.

### Requirement 11: Custom Greeting Name

**User Story:** As a user, I want to set a custom name shown in my greeting, so that the greeting feels personalized.

#### Acceptance Criteria

1. THE Custom_Name_Input SHALL display a control that lets a user enter a Custom_Name.
2. WHEN a user submits a Custom_Name of 1 to 50 characters, THE Greeting_Widget SHALL append the Custom_Name to the current time-of-day greeting, producing text such as "Good morning, [name]".
3. WHEN a user submits a Custom_Name of 1 to 50 characters, THE Custom_Name_Input SHALL persist the Custom_Name to Local Storage.
4. WHEN the Dashboard loads, THE Custom_Name_Input SHALL load the saved Custom_Name from Local Storage, and THE Greeting_Widget SHALL display it as part of the greeting.
5. IF no saved Custom_Name exists in Local Storage when the Dashboard loads, THEN THE Greeting_Widget SHALL display the time-of-day greeting without a Custom_Name.
6. IF a user submits a Custom_Name with empty text, whitespace-only text, or text longer than 50 characters, THEN THE Custom_Name_Input SHALL reject the Custom_Name and display an error message indicating the invalid input.

### Requirement 12: Duplicate Task Prevention

**User Story:** As a user, I want to prevent duplicate tasks, so that my task list stays clean and uncluttered.

#### Acceptance Criteria

1. WHEN a user submits a new Task with text that matches an existing Task text using case-insensitive comparison, THE Task_List SHALL reject the Task and display an error message indicating a duplicate task.
2. WHEN a user edits an existing Task with text that matches another existing Task text using case-insensitive comparison, THE Task_List SHALL reject the edit, preserve the existing Task text, and display an error message indicating a duplicate task.
