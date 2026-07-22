# Antigravity Prompt: Fix CORS Error in Discovery Portal

Copy and paste the following prompt directly into Antigravity:

> Please update the JavaScript submission handler in the `discovery.html` file to bypass the local CORS (Cross-Origin Resource Sharing) block.
> 
> **1. Update the Fetch Request:**
> Locate the `fetch(action, {...})` call inside the `<script>` block. Add `mode: 'no-cors'` to the request options.
> 
> **2. Update the Response Handling:**
> Because `no-cors` results in an opaque response, we can no longer parse the JSON response to check for `data.result === "success"`. Update the `.then()` block to assume success once the network request successfully fires.
> 
> Please replace the entire `<script>` block with the following updated code:
> 
> ```javascript
> <script>
> document.getElementById("discovery-form").addEventListener("submit", function(e) {
>   e.preventDefault(); 
>   
>   const form = e.target;
>   const data = new FormData(form);
>   const action = form.action;
>   
>   const submitBtn = form.querySelector('button[type="submit"]');
>   submitBtn.innerText = "Sending...";
>   submitBtn.disabled = true;
> 
>   fetch(action, {
>     method: 'POST',
>     body: data,
>     mode: 'no-cors' 
>   })
>   .then(() => {
>     form.style.display = "none";
>     document.getElementById("success-message").style.display = "block";
>   })
>   .catch(error => {
>     console.error('Error!', error.message);
>     submitBtn.innerText = "Error. Try Again.";
>     submitBtn.disabled = false;
>   });
> });
> </script>
> ```
> 
> Please output the fully updated `discovery.html` file.
