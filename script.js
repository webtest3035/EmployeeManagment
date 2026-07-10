const employeeUrl = "https://employeemanagment-9gm5.onrender.com/employees";


 displayEmployeeData();

        async function displayEmployeeData() {

             try {

                const response = await fetch(employeeUrl);

                if (!response.ok) {
                    throw new Error("Response Is Not Ok !");
                }

                let result = await response.json();

                console.log(result);   

            }

            catch (error) {
                console.error("Could Not Fetch Data:", error);
            }

        }