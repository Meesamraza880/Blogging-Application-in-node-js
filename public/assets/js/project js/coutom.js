const successMessage = document.querySelector("#success-message");
const errorMessage = document.querySelector("#error-message");

// Set a timeout to hide the div after 10 seconds
setTimeout(() => {
  if (successMessage) {
    successMessage.classList.add("d-none");
  }
}, 2000);
setTimeout(() => {
  if (errorMessage) {
    errorMessage.classList.add("d-none");
  }
}, 2000);

function EditPost(id, role_id) {
  const title = document.getElementById("title-" + id);
  const desc = document.getElementById("desc-" + id);
  let is_approved = document.getElementById("is_approved-" + id);
  if (is_approved.innerHTML.trim() == "NO") {
    is_approved = false;
  } else {
    is_approved = true;
  }
  document.getElementById("edit_post_title").value = title.innerHTML.trim();
  document.getElementById("edit_post_desc").value = desc.innerHTML.trim();
  document.getElementById("edit_post_id").value = id;

  if (role_id == 1) {
    document.getElementById("edit_post_isApproved").value = is_approved;
  }
}
