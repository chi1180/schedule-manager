
/* set header-link href */

const headerLink = document.getElementById("header-link");
const herePageLink = window.location.href;
headerLink.href = herePageLink;


/* todo applicaion */

const input = document.getElementById("input");
const form = document.getElementById("form");
const listContainer = document.getElementById("list-container");

const todos = JSON.parse(localStorage.getItem("todos"));

if (todos) {
    todos.forEach((todo) => {
        add(todo);
    });
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const todo = {
        text: input.value.trim(),
        line: false
    };
    add(todo);
});

function add(todo)
{
    if (todo.text) {
        const list = document.createElement("li");
        list.innerText = todo.text;
        list.classList.add("list");

        if (todo.line) {
            list.classList.add("line");
        }

        list.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            list.remove();
            saver();
        });

        list.addEventListener('click', () => {
            list.classList.toggle("line");
            saver();
        });

        listContainer.appendChild(list);
        input.value = "";
        saver();
    }
}

function saver()
{
    let todos = [];
    const lists = listContainer.querySelectorAll("li");

    lists.forEach((list) => {
        const todo = {
            text: list.innerText,
            line: list.classList.contains("line")
        };
        todos.push(todo);
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}



/* schedule calender application */

const days = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ];

const toData = new Date();
let toYear = toData.getFullYear();
let toMonth = toData.getMonth() + 1;
let toDate = toData.getDate();
let toDay = toData.getDay();

let firstDay = 0;
let lastDate = 0;

function getDates(year, month)
{
    firstDay = new Date(year, month - 1, 1).getDay();

    let nextYear = year;
    let nextMonth = month + 1;
    if (nextMonth === 13) {
        nextYear ++;
        nextMonth = 0
    } else {
        nextMonth ++;
    }
    lastDate = new Date(nextYear, nextMonth, 0).getDate();
}

function setStatubarDates()
{
    const statusDate = toYear + "_" + toMonth;
    document.getElementById("statusbar").innerText = statusDate;
}

const calender = document.getElementById("calender");
const columnCount = days.length;
const rowCount = 6;

function createCalender()
{
    removeCalender();

    let dateCount = 0;
    
    for (let r = 0; r < rowCount; r ++) {

        const week = document.createElement("div");
        week.classList.add("week");

        for (let c = 0; c < columnCount; c ++) {

            const dayBox = document.createElement("div");
            dayBox.classList.add("day-box");

            if (c >= firstDay && !r || r && dateCount < lastDate) {
                dateCount ++;

                const dateContainer = document.createElement("div");
                dateContainer.classList.add("date-container");
                dateContainer.innerText = dateCount;

                dayBox.appendChild(dateContainer);
                dayBox.classList.add("has-date-box");
                dayBox.key = dateCount;

                const isToday = dateCount === new Date().getDate() && toMonth === new Date().getMonth() + 1 && toYear === new Date().getFullYear();

                if (isToday) {
                    const lived_schedule_s = document.querySelector(".schedule-container").querySelectorAll("li");
                    lived_schedule_s.forEach(lived_schedule => lived_schedule.remove());
                    dayBox.classList.add("today");
                }

                dayBox.addEventListener('click', () => {
                    viewScheduleManager(dayBox.key);
                });

                const todaySchedule_s = JSON.parse(localStorage.getItem(toYear + "_" + toMonth + "_" + dateCount));
                if (todaySchedule_s !== null && todaySchedule_s) {
                    todaySchedule_s.forEach((schedule) => {
                        const scheduleText = document.createElement("div");
                        scheduleText.innerText = schedule.title;
                        dayBox.appendChild(scheduleText);

                        if (isToday) {
                            
                            createTodaySchedule(schedule.title, schedule.about, document.getElementById("schedule-container"));
                        }
                    });
                }
            }

            week.appendChild(dayBox);
        }
        calender.appendChild(week);
    }
}

function removeCalender()
{
    const week_s = calender.querySelectorAll(".week");
    week_s.forEach( week => week.remove() );
}

let selected_day = 0;

function viewScheduleManager(selec_day)
{
    setTimeout(() => {
        const body = document.querySelector("body");
        body.classList.toggle("body-back");
    
        if (document.querySelector(".schedule-manager")) {
            document.querySelector(".schedule-manager").remove();
        } else {
            const scheduleManager = document.createElement("div");
            scheduleManager.classList.add("schedule-manager");

            const title = document.createElement("div");
            title.innerText = "Schedule Manager at " + toYear + "_" + toMonth + "_" + (selected_day = selec_day);
            title.classList.add("schedule-manager-title");

            const exit_btn = document.createElement("div");
            exit_btn.classList.add("exit-btn");
            exit_btn.innerText = "X";

            exit_btn.addEventListener('click', () => {
                setTimeout(() => {
                    viewScheduleManager();
                    createCalender();
                }, 150);
            });

            const input_name = document.createElement("input");
            input_name.id = "inputName";
            input_name.classList.add("input-name");
            input_name.type = "text";
            input_name.outcomplete = "off";
            input_name.placeholder = "Enter your schedule title here"

            const input_about = document.createElement("textarea");
            input_about.id = "inputAbout";
            input_about.classList.add("input-about");
            input_about.placeholder = "Enter your schedule about here"

            const button = document.createElement("button");
            button.classList.add("schedule-btn");
            button.innerText = "Create Schedule";

            button.addEventListener('click', () => {
                setTimeout(() => {
                    saveSchedule();
                }, 150);
            });

            const createdScheduleTitle = document.createElement("div");
            createdScheduleTitle.classList.add("schedule-manager-title");
            createdScheduleTitle.innerText = "Created schedules";


            const createdSchedulescontainer = document.createElement("div");
            createdSchedulescontainer.id = "created_schedule_container";

            const todaySchedule_s = JSON.parse(localStorage.getItem(toYear + "_" + toMonth + "_" + selec_day));
            if (todaySchedule_s) {
                todaySchedule_s.forEach(schedule => createTodaySchedule(schedule.title, schedule.about, createdSchedulescontainer));
            }

            scheduleManager.appendChild(title);
            scheduleManager.appendChild(exit_btn);
            scheduleManager.appendChild(input_name);
            scheduleManager.appendChild(input_about);
            scheduleManager.appendChild(button);
            scheduleManager.appendChild(createdScheduleTitle);
            scheduleManager.appendChild(createdSchedulescontainer);

            body.appendChild(scheduleManager);
        }
    }, 250);
}

// when clicked body-back, hidden()
document.addEventListener('click', (e) => {
    if (e.target.classList.contains("body-back")) {
        viewScheduleManager();
        createCalender();
    }
});

// calender to operate
function chengeMonth(change_v)
{
    toMonth += change_v;

    if (toMonth === 13) {
        toMonth = 1;
        toYear ++;
    } else if (toMonth === 0) {
        toMonth = 12;
        toYear --;
    }
    init();
}



function init()
{
    getDates(toYear, toMonth, 0);
    setStatubarDates();
    createCalender();
}

init();


function saveSchedule(num)
{
    if ( ! num) {
        const input_name = document.getElementById("inputName");
        const input_about = document.getElementById("inputAbout");

        if (inputsCheck(input_name, input_about)) {
            createTodaySchedule(input_name.value.trim(), input_about.value.trim(), document.getElementById("created_schedule_container"));

            input_name.value = input_about.value = "";
        }
    } else if (num === 1) {
        viewScheduleManager();
        viewScheduleManager(selected_day);
    }

    let datas = [];
    let schedule_s = [];
    if (document.querySelector(".schedule-manager")) {
        schedule_s = document.querySelector(".schedule-manager").querySelectorAll("li");
    } else {
        schedule_s = document.getElementById("schedule-container").querySelectorAll("li");
    }
    
    schedule_s.forEach(schedule => {
        const data = {
            title: schedule.querySelector(".schedule-title").innerText,
            about: schedule.querySelector(".schedule-about").innerText
        };
        datas.push(data);
    });
    localStorage.setItem(toYear + "_" + toMonth + "_" + selected_day, JSON.stringify(datas));
}

function inputsCheck(inpu_1, inpu_2)
{
    const inputed = inpu_1.value.trim() && inpu_2.value.trim();

    if (inputed) {
        return true;
    } else {
        alert("Please enter about your shedule in all inputs.")
    }
}

function createTodaySchedule(title, about, master)
{
    const schedule = document.createElement("li");
    schedule.classList.add("sidebar-schedule");

    const scheduleTitle = document.createElement("div");
    scheduleTitle.classList.add("schedule-title");
    scheduleTitle.innerText = title;

    if (master.id === "created_schedule_container") {
        scheduleTitle.addEventListener('contextmenu', (e) => {
            e.preventDefault();

            const question = confirm("Are you want to remove this schedule?");
            if (question) {
                schedule.remove();
                saveSchedule(2);
                createCalender();
            }
        });
    }

    const scheduleAbout = document.createElement("div");
    scheduleAbout.classList.add("schedule-about");
    scheduleAbout.innerText = about;

    schedule.appendChild(scheduleTitle);
    schedule.appendChild(scheduleAbout);
    master.appendChild(schedule);
}

