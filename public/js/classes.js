document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch("/classes");
    const classes = await response.json();
    const container = document.getElementById("classes-container");
//this is creating classes for a non existent course, modify or erase
    classes.forEach(cls => {
        const div = document.createElement("div");
        div.classList.add("class-item");
        div.innerHTML = `<h3>${cls.class_date}</h3><p>Coach ID: ${cls.coach_id}</p><button>Inscribirse</button>`;
        container.appendChild(div);
    });
});
