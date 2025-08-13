let user = { loggedIn: false, role: "beneficiary", card: "", name: "" };
const tasks = [
  { id: 1, name: "Deliver to R. Kumar, Village A" },
  { id: 2, name: "Deliver to Latha, Village B" }
];

// Role switching
document.getElementById("roleSelect").addEventListener("change", (e) => {
  user.role = e.target.value;
  resetUI();
});

// Simulated biometric login
document.getElementById("btnBiometric").addEventListener("click", () => {
  alert("Biometric scan simulated ✅");
  doLogin();
});

document.getElementById("btnSimulate").addEventListener("click", doLogin);

function doLogin() {
  const cardNo = document.getElementById("cardNo").value;
  if (!cardNo) return alert("Enter ID");
  user.loggedIn = true;
  user.card = cardNo;
  user.name = document.getElementById("name").value;
  document.getElementById("authStatus").textContent = `Logged in as ${
    user.name || user.card
  }`;
  if (user.role === "beneficiary") {
    document.getElementById("beneficiaryDashboard").style.display = "block";
    document.getElementById("rcard").textContent = user.card;
    document.getElementById("entitlement").textContent =
      "Wheat 5kg, Rice 3kg, Sugar 1kg";
    document.getElementById("interaction").style.display = "block";
  } else {
    document.getElementById("agentDashboard").style.display = "block";
    renderTasks();
  }
}

// Voice guide
document.getElementById("btnVoice").addEventListener("click", () => {
  const text =
    user.role === "beneficiary"
      ? "Welcome to RationRight. Use request delivery to get rations at your doorstep."
      : "Agent mode. Deliver items from the assigned list.";
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-IN";
  window.speechSynthesis.speak(speech);
});

// Request delivery
document.getElementById("requestBtn").addEventListener("click", () => {
  const qty = document.getElementById("pickupQty").value;
  saveHistory({ date: new Date().toLocaleString(), qty });
  alert("Delivery requested ✅");
});

// View history
document.getElementById("viewHistory").addEventListener("click", () => {
  const list = document.getElementById("historyList");
  const history = getHistory();
  list.innerHTML = history.length
    ? history.map((h) => `<li>${h.date} - ${h.qty}kg</li>`).join("")
    : "<li>No history</li>";
  document.getElementById("historySection").style.display = "block";
});

// Photo preview
document.getElementById("photo").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  document.getElementById(
    "previewBox"
  ).innerHTML = `<img src="${url}" style="max-width:100%">`;
});

// Confirm delivery
document.getElementById("confirmDelivery").addEventListener("click", () => {
  alert("Delivery confirmed ✅");
});

// Complaints
document.getElementById("sendComplaint").addEventListener("click", () => {
  const text = document.getElementById("complaint").value.trim();
  if (!text) return alert("Write complaint");
  saveComplaint({ date: new Date().toLocaleString(), text });
  alert("Complaint submitted ✅");
});

document.getElementById("viewComplaints").addEventListener("click", () => {
  const list = document.getElementById("complaintList");
  const complaints = getComplaints();
  list.innerHTML = complaints.length
    ? complaints.map((c) => `<li>${c.date} - ${c.text}</li>`).join("")
    : "<li>No complaints</li>";
  document.getElementById("complaintSection").style.display = "block";
});

// Agent tasks
function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = tasks.map((t) => `<li>${t.name}</li>`).join("");
}

document.getElementById("markDelivered").addEventListener("click", () => {
  if (tasks.length) {
    alert(`Marked "${tasks[0].name}" as delivered ✅`);
    tasks.shift();
    renderTasks();
  }
});

// Local storage simulation
function saveHistory(entry) {
  const history = getHistory();
  history.push(entry);
  localStorage.setItem("history", JSON.stringify(history));
}
function getHistory() {
  return JSON.parse(localStorage.getItem("history") || "[]");
}
function saveComplaint(entry) {
  const complaints = getComplaints();
  complaints.push(entry);
  localStorage.setItem("complaints", JSON.stringify(complaints));
}
function getComplaints() {
  return JSON.parse(localStorage.getItem("complaints") || "[]");
}

function resetUI() {
  document
    .querySelectorAll("section.card")
    .forEach((s) => (s.style.display = "none"));
  document.getElementById("loginSection").style.display = "block";
}
