/// Function to encode string to Base64 using UTF-8
function utf8_to_b64(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
}

// Function to decode Base64-encoded string using UTF-8
function b64_to_utf8(str) {
  return decodeURIComponent(escape(window.atob(str)));
}
// script.js
document.getElementById("addForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent default form submission

  // Get form data
  const formData = new FormData(this);

  // Convert form data to JSON object
  const jsonObject = {};
  formData.forEach((value, key) => {
      jsonObject[key] = value;
  });

  // Send data to GitHub API to update JSON file
  const accessToken = "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";
  const repoOwner = "Jacksthehusky";
  const repoName = "Maderij.github.io";
  const branchName = "main"; // Or your desired branch name
  const filePath = "data/files.json"; // Path to your JSON file in the repository

  fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`, {
      method: "GET",
      headers: {
          "Authorization": `token ${accessToken}`
      }
  })
  .then(response => response.json())
  .then(data => {
      const content = b64_to_utf8(data.content); // Decode base64-encoded content
      const jsonData = JSON.parse(content);
      
      // Append new data to JSON array
      jsonData.push(jsonObject);

      // Update JSON file in the repository
      fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`, {
          method: "PUT",
          headers: {
              "Authorization": `token ${accessToken}`,
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
              message: "Add new data",
              content: utf8_to_b64(JSON.stringify(jsonData)), // Encode content to base64
              branch: branchName,
              sha: data.sha
          })
      })
      .then(response => response.json())
      .then(data => {
          // Display success message
          document.getElementById("message").innerText = "Data added successfully!";
      })
      .catch(error => {
          console.error("Error updating file:", error);
          document.getElementById("message").innerText = "Failed to add data. Please try again later.";
      });
  })
  .catch(error => {
      console.error("Error fetching file:", error);
      document.getElementById("message").innerText = "Failed to fetch data. Please try again later.";
  });
});
