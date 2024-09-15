document.getElementById("fetchStatus").addEventListener("click", () => {
  const userInput = document.getElementById("input").value.trim(); // Get Codeforces handle
  const fromDateInput = document.getElementById("fromDate").value; // Get From Date
  const toDateInput = document.getElementById("toDate").value; // Get To Date

  // Validate user input
  if (userInput.length < 3 || userInput.length > 24) {
    alert("Please enter a valid Codeforces handle (3 to 24 characters).");
    return;
  }

  // Validate date input
  if (!fromDateInput || !toDateInput) {
    alert("Please provide both from and to dates.");
    return;
  }

  const fromDate = new Date(fromDateInput).getTime() / 1000; // Convert from date to UNIX timestamp
  const toDate = new Date(toDateInput).getTime() / 1000; // Convert to date to UNIX timestamp

  // Fetch user status from Codeforces API
  fetch(`https://codeforces.com/api/user.status?handle=${userInput}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "OK") {
        const okResults = data.result.filter(
          (item) =>
            item.verdict === "OK" &&
            item.creationTimeSeconds >= fromDate &&
            item.creationTimeSeconds <= toDate
        );

        // Get all problem names
        const allProblems = okResults.map((item) => item.problem.name);

        // Display the results on the webpage
        const resultsDiv = document.getElementById("results");
        resultsDiv.innerHTML = `
          <h2>Problems Solved Between ${fromDateInput} and ${toDateInput}:</h2>
          <ul>
            ${allProblems.map((problem) => `<li>${problem}</li>`).join("")}
          </ul>
          <p>Total Problems: ${allProblems.length}</p>
        `;
      } else {
        console.error("API Error:", data.comment);
        const resultsDiv = document.getElementById("results");
        resultsDiv.innerHTML = `<p>Error fetching data: ${data.comment}</p>`;
      }
    })
    .catch((error) => {
      console.error("Network error:", error);
      const resultsDiv = document.getElementById("results");
      resultsDiv.innerHTML = `<p>Network error: ${error.message}</p>`;
    });
});
