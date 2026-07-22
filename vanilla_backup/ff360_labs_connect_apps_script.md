# Antigravity Prompt: Connect Discovery Portal to Google Apps Script

Copy and paste the following prompt directly into Antigravity:

> Please update the `discovery.html` file to connect the client intake form directly to the new Google Apps Script backend.
> 
> **1. Form Tag Update:**
> Locate the main `<form>` wrapper and update its attributes to use the provided Web App URL:
> ```html
> <form id="discovery-form" action="https://script.google.com/macros/s/AKfycbw--UMsLREhksh2NW-WOqNl5UAft7E_uiEJcPm6MDpONgBFpCURi_teJvbPqrlsBYcDHQ/exec" method="POST">
> ```
> 
> **2. Success Message Element:**
> Add a hidden success message `div` inside the main card container, so it can be displayed when the form submission completes:
> ```html
> <div id="success-message" style="display: none; text-align: center; padding: 2rem; color: var(--gold);">
>   <h3>Project Request Received</h3>
>   <p>Thank you! We will review your details and be in touch shortly.</p>
> </div>
> ```
> 
> **3. JavaScript Submission Handler:**
> In the `<script>` section of `discovery.html`, append the following vanilla JavaScript event listener to intercept the submit event, send the data via a fetch request, and handle the UI state (e.g., showing a "Sending..." button state and the success message):
> ```javascript
> document.getElementById("discovery-form").addEventListener("submit", function(e) {
>   e.preventDefault(); 
>   
>   const form = e.target;
>   const data = new FormData(form);
>   const action = form.action;
>   
>   const submitBtn = form.querySelector('button[type="submit"]');
>   const originalText = submitBtn.innerText;
>   submitBtn.innerText = "Sending...";
>   submitBtn.disabled = true;
> 
>   fetch(action, {
>     method: 'POST',
>     body: data,
>   })
>   .then(response => response.json())
>   .then(data => {
>     if (data.result === "success") {
>       form.style.display = "none";
>       document.getElementById("success-message").style.display = "block";
>     } else {
>       submitBtn.innerText = "Error. Try Again.";
>       submitBtn.disabled = false;
>     }
>   })
>   .catch(error => {
>     console.error('Error!', error.message);
>     submitBtn.innerText = "Error. Try Again.";
>     submitBtn.disabled = false;
>   });
> });
> ```
> 
> **4. Field Mapping Verification:**
> Ensure that the `name` attributes on the input fields correctly map to the Apps Script variables (e.g., `name="business_name"`, `name="email"`, `name="budget"`, `name="project_purpose"`). 
> 
> Please output the fully updated `discovery.html` file.
