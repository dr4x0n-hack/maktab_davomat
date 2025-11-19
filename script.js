// GitHub sozlamalari
const REPO = "USERNAME/REPO-NAME"; 
const TOKEN = "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";

const studentsFile = "data/students.json";
const attendanceFile = "data/attendance.json";

async function githubRead(path) {
  let r = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`);
  let d = await r.json();
  return JSON.parse(atob(d.content));
}

async function githubWrite(path, data) {
  let getFile = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`);
  let file = await getFile.json();

  await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
    method: "PUT",
    headers: {
      "Authorization": "Bearer " + TOKEN,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "Update " + path,
      content: btoa(JSON.stringify(data, null, 2)),
      sha: file.sha
    })
  });
}

function login() {
  let u = document.getElementById("user").value;
  let p = document.getElementById("pass").value;

  if (u === "50-maktab" && p === "8-sinf") {
    document.getElementById("panel").style.display = "block";
  } else {
    alert("Noto‘g‘ri kirish ma’lumotlari!");
  }
}

async function loadStudents() {
  let data = await githubRead(studentsFile);
  document.getElementById("allStudents").textContent = JSON.stringify(data, null, 2);

  let select = document.getElementById("studentList");
  select.innerHTML = "";
  data.forEach(s => {
    let opt = document.createElement("option");
    opt.textContent = s.name;
    select.appendChild(opt);
  });
}

async function addStudent() {
  let name = document.getElementById("newName").value;
  if (!name) return alert("Ism kiriting!");

  let list = await githubRead(studentsFile);
  list.push({ name });

  await githubWrite(studentsFile, list);
  alert("O‘quvchi qo‘shildi!");
  loadStudents();
}

async function saveAttendance() {
  let student = document.getElementById("studentList").value;
  let status = document.getElementById("status").value;

  let attend = await githubRead(attendanceFile);
  attend.push({
    student,
    status,
    time: new Date().toLocaleString("uz-UZ")
  });

  await githubWrite(attendanceFile, attend);

  alert("Davomat saqlandi!");
  loadAttendance();
}

async function loadAttendance() {
  let data = await githubRead(attendanceFile);
  document.getElementById("allAttendance").textContent = JSON.stringify(data, null, 2);
}

loadStudents();
loadAttendance();
