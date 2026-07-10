const employeeUrl = "https://employeemanagment-9gm5.onrender.com/employees";
const nameInput = document.getElementById("employeeName");
const departmentInput = document.getElementById("emplyeeDepartment");
const salaryInput = document.getElementById("employeesalary");
const joiningDatInpute = document.getElementById("employeeJoiningDate");
const birthDateInput = document.getElementById("employeeBirthDate");
const addEmployee = document.getElementById("addEmployee");
const updateEmployee = document.getElementById("updateEmployee");


displayEmployeeData();

async function displayEmployeeData() {

    try {

        const response = await fetch(employeeUrl);

        if (!response.ok) {
            throw new Error("Response Is Not Ok !");
        }

        let result = await response.json();

        getTabelData(result);

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


function getTabelData(data) {


    let rows = data.map((input, index) => `

                <tr> 
                     <td>${index + 1}</td>        
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

}