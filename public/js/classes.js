document.addEventListener("DOMContentLoaded", () => {
    const calendarGrid = document.getElementById("calendar-grid");
    const calendarMonth = document.getElementById("calendar-month");
    const prevMonthBtn = document.getElementById("prev-month");
    const nextMonthBtn = document.getElementById("next-month");

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    // Sample data for visualization (replace with API data)
    const sampleClasses = [
        { id: 1, date: "2025-04-05", title: "Calistenia Básica" },
        { id: 2, date: "2025-04-10", title: "Entrenamiento Avanzado" },
        { id: 3, date: "2025-04-15", title: "Flexibilidad y Movilidad" },
        { id: 4, date: "2025-04-20", title: "Rutina Full Body" },
        { id: 5, date: "2025-04-25", title: "Ejercicios de Resistencia" },
    ];

    function loadCalendar() {
        calendarGrid.innerHTML = "";
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        calendarMonth.innerText = `${new Date(currentYear, currentMonth).toLocaleString("es-ES", { month: "long", year: "numeric" })}`;

        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement("div");
            emptyCell.classList.add("empty");
            calendarGrid.appendChild(emptyCell);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement("div");
            dayCell.classList.add("calendar-day");
            dayCell.innerText = day;

            const formattedDate = `${currentYear}-${(currentMonth + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
            const classesOnThisDay = sampleClasses.filter(cls => cls.date === formattedDate);

            if (classesOnThisDay.length > 0) {
                dayCell.classList.add("has-class");
                dayCell.addEventListener("click", () => showClassesForDay(classesOnThisDay));
            }

            calendarGrid.appendChild(dayCell);
        }
    }

    function showClassesForDay(classes) {
        let message = "Clases disponibles:\n";
        classes.forEach(cls => {
            message += `- ${cls.title}\n`;
        });
        alert(message);
    }

    prevMonthBtn.addEventListener("click", () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        loadCalendar();
    });

    nextMonthBtn.addEventListener("click", () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        loadCalendar();
    });

    loadCalendar();
});
