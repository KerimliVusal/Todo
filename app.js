document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("task");
    const addBtn = document.getElementById("add");
    const taskList = document.getElementById("task-list");
    const apiUrl = "https://jsonplaceholder.typicode.com/todos";
    const tasks = [];
    function renderTasks() {
        taskList.innerHTML = "";
        tasks.forEach((task, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
            <span class="buttons" title="${task.title}">${task.title.length > 30 ? `${task.title.slice(0, 30)}...` : task.title}</span>
            <button class="delete" data-id="${task.id}">Delete</button>
                <button class="update" data-id="${task.id}">Update</button>
            `;
            taskList.appendChild(li);
        });
    }
    function fetchTasks() {
        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                tasks.length = 0; // Clear existing tasks
                tasks.push(...data.slice(0, 3)); // Simulate fetching the first 10 tasks
                renderTasks();
            });
    }
    function deleteTask(taskId) {
        fetch(`${apiUrl}/${taskId}`, {
            method: "DELETE",
        })
            .then(() => {
                const index = tasks.findIndex((task) => task.id === Number(taskId));
                if (index !== -1) {
                    tasks.splice(index, 1);
                    renderTasks();
                }
            })
            .catch((error) => console.error("Error deleting task:", error));
    }

    function updateTask(taskId, updatedTitle) {
        fetch(`${apiUrl}/${taskId}`, {
            method: "PUT",
            body: JSON.stringify({
                title: updatedTitle,
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
            .then(() => {
                const task = tasks.find(({id}) => id === Number(taskId));
                if (task) {
                    // Task with a matching ID was found
                     task.title = updatedTitle;
                    renderTasks();
                } else {
                    console.log("Task not found with ID:", taskId);
                }})
            .catch((error) => console.error("Error updating task:", error));
    }

    addBtn.addEventListener("click", function () {
        const newTaskTitle = taskInput.value.trim();
        if (newTaskTitle !== "") {
            fetch(apiUrl, {
                method: "POST",
                body: JSON.stringify({
                    title: newTaskTitle,
                    userId: 1, // Assign a user ID (1 in this example)
                    completed: false, // Mark the task as incomplete
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    tasks.unshift(data); // Add the new task at the beginning
                    taskInput.value = "";
                    renderTasks();
                })
                .catch((error) => console.error("Error adding task:", error));
        }
    });

    taskList.addEventListener("click", function (event) {
        if (event.target.classList.contains("delete")) {
            const taskId = event.target.getAttribute("data-id");
            deleteTask(taskId);
        } else if (event.target.classList.contains("update")) {
            const taskId = event.target.getAttribute("data-id");
            //  const updatedTitle = tasks.find((task) => task.id === Number(taskId)).title
            const updatedTitle = prompt("Update todo:", tasks.find((task) => task.id === Number(taskId)).title);
            if (taskId !== null) {
                updateTask(taskId, updatedTitle);
            }
        }
    });
    fetchTasks(); // Fetch tasks on page load

});