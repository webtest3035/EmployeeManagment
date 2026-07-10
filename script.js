const employeeUrl = "https://employeemanagment-9gm5.onrender.com/employees";
const nameInput = document.getElementById("employeeName");
const departmentInput = document.getElementById("emplyeeDepartment");
const salaryInput = document.getElementById("employeesalary");
const joiningDatInpute = document.getElementById("employeeJoiningDate");
const birthDateInput = document.getElementById("employeeBirthDate");
const addEmployee = document.getElementById("addEmployee");
const updateEmployee = document.getElementById("updateEmployee");
const table = document.getElementById("table");
const employeeSearchInputSubmit = document.getElementById("employeeSearchInputSubmit");
const DepartmentInputSubmit = document.getElementById("DepartmentInputSubmit");
const filterButton = document.getElementById("filterButton");
const pagination = document.getElementById("pagination");

let currentPage = 1;
let itemsPerPage = 10;
let allEmployee = 0;

let filters = {
    sort: ""
};

let names = {
    find: ""
};

let departments = {
    find: ""
};

displayEmployeeData();

async function displayEmployeeData() {

    let url = `${employeeUrl}?_page=${currentPage}&_per_page=${itemsPerPage}`;

    if (filters.sort) {
        url += `&_sort=${filters.sort}`;
    }

    if (names.find) {
        url += `&name=${names.find}`;
    }

    if (departments.find) {
        url += `&department=${departments.find}`;
    }



    try {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Response Is Not Ok !");
        }

        let result = await response.json();

        let employee = result.data;
        allEmployee = result.items;

        if (employee.length === 0) {
            alert("Not Found !");
            return;
        }

        getTabelData(employee);
        createPagination();

    }

    catch (error) {
        console.error("Could Not Fetch Data:", error);
    }

}

addEmployee.addEventListener("click", async () => {

    let name = nameInput.value;
    let department = departmentInput.value;
    let salary = Number(salaryInput.value);
    let joiningDate = joiningDatInpute.value;
    let birthDate = birthDateInput.value;

    if (!isFormVaild(name, salary, joiningDate, birthDate)) {
        return;
    }

    name = capitalizeInput(name);

    let employeeDetails = {
        name,
        department,
        salary,
        joiningDate,
        birthDate
    };

    try {

        let response = await fetch(employeeUrl, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(employeeDetails)
        });

        if (!response.ok) {
            throw new Error("Request failed");
        }

        let data = await response.json();

        await displayEmployeeData();

        clearForm();

        alert(`${name} IS Added !`);
    }

    catch (error) {
        console.error("Could Not Add Data:", error);
    }

});

table.addEventListener("click", (event) => {

    if (event.target.classList.contains("deleteEmployee")) {
        deleteEmployee(event.target.dataset.id);
    }

    if (event.target.classList.contains("editEmployee")) {
        editEmployee(event.target.dataset.id);
    }

});

async function deleteEmployee(id) {

    let confirmDelete = confirm("Are you sure you want to delete ?");

    if (!confirmDelete) {
        return;
    }

    try {
        await fetch(`${employeeUrl}/${id}`, {
            method: "DELETE",
        });

        await displayEmployeeData();
        pageChange();
    }

    catch (error) {
        console.error("Could Not Delete Data:", error);
    }
}

let editId = null;

async function editEmployee(id) {

    pageChange();

    try {

        let response = await fetch(`${employeeUrl}/${id}`);

        if (!response.ok) {
            throw new Error("Response Is Not Ok !");
        }

        let data = await response.json();

        editId = id

        document.getElementById("employeeName").value = data.name;
        document.getElementById("emplyeeDepartment").value = data.department;
        document.getElementById("employeesalary").value = data.salary;
        document.getElementById("employeeJoiningDate").value = data.joiningDate;
        document.getElementById("employeeBirthDate").value = data.birthDate;
        document.getElementById("addEmployee").style.display = "none";
        document.getElementById("updateEmployee").style.display = "inline-block";

    }

    catch (error) {
        console.error("Could Not Edit Data:", error);
    }

}

updateEmployee.addEventListener("click", async () => {

    let name = nameInput.value;
    let department = departmentInput.value;
    let salary = Number(salaryInput.value);
    let joiningDate = joiningDatInpute.value;
    let birthDate = birthDateInput.value;

    if (!isFormVaild(name, salary, joiningDate, birthDate)) {
        return;
    }

    name = capitalizeInput(name);

    let updatedEmployeeDetails = {
        name,
        department,
        salary,
        joiningDate,
        birthDate

    };

    try {
        await fetch(`${employeeUrl}/${editId}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(updatedEmployeeDetails)
        });

        await displayEmployeeData();

        clearForm();

        alert(`${name} is Updated !`);

        document.getElementById("addEmployee").style.display = "inline-block";
        document.getElementById("updateEmployee").style.display = "none";

    }

    catch (error) {
        console.error("Could Not Update Data:", error);
    }
});

employeeSearchInputSubmit.addEventListener("click", () => {

    let input = document.getElementById("employeeSearchInput").value;

    document.getElementById("employeeSearchInput").value = "";

    if (input == "" || !isNaN(input)) {
        alert("Invalid Search Input !");
        return;
    }

    input = capitalizeInput(input);

    names.find = input;

    currentPage = 1;

    displayEmployeeData();

});

DepartmentInputSubmit.addEventListener("click", () => {

    let input = document.getElementById("DepartmentInput").value;

    document.getElementById("DepartmentInput").selectedIndex = 0;

    departments.find = input;

    currentPage = 1;

    displayEmployeeData();

});

filterButton.addEventListener("click", (event) => {

    if (event.target.id === "sortEmployeeATOZ") {
        sortAToZ();
    }

    if (event.target.id === "sortEmployeeZTOA") {
        sortZToA();
    }

    if (event.target.id === "sortEmployeeSalaryHighToLow") {
        sortSalaryHighToLow();
    }

    if (event.target.id === "sortEmployeeSalaryLowToHigh") {
        sortSalaryLowToHigh();
    }

    if (event.target.id === "sortEmployeeJoiningfirstToLast") {
        sortJoiningfirstToLast();
    }

    if (event.target.id === "sortEmployeeJoiningLastToFirst") {
        sortJoiningLastToFirst();
    }

    if (event.target.id === "refresh") {
        refreshPage();
    }

});

function sortAToZ() {

    filters.sort = "name";

    currentPage = 1;

    displayEmployeeData();
}

function sortZToA() {

    filters.sort = "-name";

    currentPage = 1;

    displayEmployeeData();

}

function sortSalaryHighToLow() {

    filters.sort = "salary";

    currentPage = 1;

    displayEmployeeData();

}

function sortSalaryLowToHigh() {

    filters.sort = "-salary";

    currentPage = 1;

    displayEmployeeData();

}

function sortJoiningfirstToLast() {

    filters.sort = "joiningDate";

    currentPage = 1;

    displayEmployeeData();

}

function sortJoiningLastToFirst() {

    filters.sort = "-joiningDate";

    currentPage = 1;

    displayEmployeeData();
}

function getTabelData(data) {

    let startIndex = (currentPage - 1) * itemsPerPage;


    let rows = data.map((input, index) => `

                <tr> 
                     <td>${startIndex + index + 1}</td>        
                     <td>${input.id}</td>      
                     <td>${input.name}</td>      
                     <td>${input.department}</td>     
                     <td>${input.salary}</td>     
                     <td>${input.joiningDate}</td>     
                     <td>${input.birthDate}</td>     
                     <td>
                        <button class="editEmployee" data-id="${input.id}">Edit</button>
                        <button class="deleteEmployee" data-id="${input.id}">Delete</button>
                     </td>     
                </tr> `).join("");

    document.getElementById("employeeData").innerHTML = rows;
}

function createPagination() {

    let totalPages = Math.ceil(allEmployee / itemsPerPage);

    if (currentPage === 1) {

        document.getElementById("previousPage").style.display = "none";
    }
    else {
        document.getElementById("previousPage").style.display = "block";
    }

    if (currentPage === totalPages) {
        document.getElementById("nextPage").style.display = "none";
    }
    else {
        document.getElementById("nextPage").style.display = "block";
    }

}

pagination.addEventListener("click", (event) => {

    if (event.target.id === "previousPage") {
        previouse();
    }

    if (event.target.id === "nextPage") {
        next();
    }
})

function pageChange() {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

function next() {

    let totalPages = Math.ceil(allEmployee / itemsPerPage);

    if (currentPage < totalPages) {
        currentPage++;
        displayEmployeeData();
        clearForm();
        pageChange();
    }
}

function previouse() {

    if (currentPage > 1) {
        currentPage--;
        displayEmployeeData();
        clearForm()
        pageChange();
    }
}

function isFormVaild(name, salary, joiningDate, birthDate) {

    const regex = /^[A-Za-z ]+$/;

    name = name.trim();

    if (name === "" || !isNaN(name) || name === undefined || name === null || !regex.test(name)) {

        alert(`Invalid Employee Name !`);
        return false;
    }

    if (salary <= 0 || isNaN(salary)) {

        alert(`Invalid Employee Salary !`);
        return false;
    }

    if (!joiningDate) {

        alert(`Invalid Employee Joining Date !`);
        return false;
    }

    if (!birthDate) {

        alert(`Invalid Employee Birth Date !`);
        return false;
    }

    return true;

}

function capitalizeInput(input) {

    input = input.trim().split(" ");

    let capitalizedWords = [];

    for (let words of input) {
        capitalizedWords.push(words.charAt(0).toUpperCase() + words.slice(1).toLowerCase());
    }

    return capitalizedWords = capitalizedWords.join(" ");

}

function clearForm() {

    document.getElementById("employeeName").value = "";
    document.getElementById("emplyeeDepartment").selectedIndex = 0;
    document.getElementById("employeesalary").value = "";
    document.getElementById("employeeJoiningDate").value = "";
    document.getElementById("employeeBirthDate").value = "";
    editId = null;

}

function pageChange() {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

function refreshPage() {

    document.getElementById("employeeData").innerHTML = "";

    currentPage = 1;

    filters.sort = "";

    names.find = "";

    departments.find = "";

    displayEmployeeData();

}
