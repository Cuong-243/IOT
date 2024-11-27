class Exam {
    constructor(id, name, type, creationDate, duration, endDate) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.creationDate = new Date(creationDate);
        this.duration = duration;
        this.endDate = new Date(endDate);
    }
}
var examsList = [
    // new Exam("0001", "Luyện tập", "Truy cập tự do", "2024-07-22", 60, "2024-07-29"),
    // new Exam("0002", "Giữa kỳ", "Yêu cầu thời gian", "2024-07-22", 90, "2024-07-29"),
    // new Exam("0003", "Cuối kỳ", "Yêu cầu thời gian", "2024-07-22", 80, "2024-07-29"),
    // new Exam("0004", "Luyện tập", "Truy cập tự do", "2024-07-22", 30, "2024-07-29")
]

function formatDate(date) {
    let day = date.getDate();
    let month = date.getMonth() + 1; // getMonth() trả về giá trị từ 0 (tháng 1) đến 11 (tháng 12)
    let year = date.getFullYear();

    // Thêm số 0 vào trước nếu ngày hoặc tháng nhỏ hơn 10
    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;

    return day + '/' + month + '/' + year;
}

function clearTable() {
    var table = document.getElementById("examsTable");
    var rowCount = table.rows.length;

    for (var i = rowCount - 1; i > 0; i--) {
        table.deleteRow(i);
    }
}

function displayExams(list) {
    clearTable();
    var table = document.getElementById("examsTable");
    var tbody = table.getElementsByTagName("tbody")[0];
    list.forEach((exam) => {
        var row = tbody.insertRow();

        var number = row.insertCell(0);
        number.innerHTML = table.rows.length - 1;

        var id = row.insertCell(1);
        id.className = "cell-id";
        id.textContent = exam.id;
        id.onclick = function () {
            window.location.href = `http://localhost:3000/exams/${exam.id}/${exam.duration}`;
        };

        var name = row.insertCell(2);
        name.className = "cell-name";
        name.textContent = exam.name;
        name.onclick = function () {
            window.location.href = `http://localhost:3000/exams/${exam.id}/${exam.duration}`;
        };

        var type = row.insertCell(3);
        type.textContent = exam.type;

        var creationDate = row.insertCell(4);
        if(exam.creationDate == "Invalid Date"){
            creationDate.textContent = "";
          }else{
            creationDate.textContent = formatDate(exam.creationDate);
          }

        var duration = row.insertCell(5);
        duration.textContent = exam.duration + " phút";

        var endDate = row.insertCell(6);
        if(exam.endDate == "Invalid Date"){
            endDate.textContent = "";
          }else{
            endDate.textContent = formatDate(exam.endDate);
          }
    });
}

function removeAccents(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

function searchExams() {
    var input = removeAccents(document.getElementById("search-box").value.toLowerCase());
    var result = [];
    examsList.forEach((exam) => {
        if (removeAccents(exam.name.toLowerCase()).indexOf(input) > -1) {
            result.push(exam);

        } else if (removeAccents(exam.type.toLowerCase()).indexOf(input) > -1) {
            result.push(exam);
        }
    });
    displayExams(result);
}
function logout(){
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

document.addEventListener("DOMContentLoaded", function () {
    if(getCookie("username") != ""){
        document.getElementById("login_chualogin").style.display = "none";
        document.getElementById("profile").style.display = "block";
        document.getElementById("profile").innerText = `Hello ${getCookie("username")}`
    }
    fetch('http://localhost:3000/exams',{
            method : 'POST',
            headers: {
                    'Content-Type': 'application/json' // cho biết rằng nội dung của yêu cầu là một chuỗi JSON.
            },
            body: JSON.stringify({data1: "lay data exams"})
    })
            .then(function(response){
                response.json().then((result) => { // response là 1 promise neen muốn truy cập phải dùng .then
                                result.forEach(function(index){
                                    examsList.push(new Exam(index.id,index.name,index.type,index.creationDate,index.duration,index.endDate))
                                })
                                displayExams(examsList);
                                })
            })
            .catch(function(err){
                console.log('err lay data exams')
            })
    
});

document.getElementById('search-box').addEventListener('keypress', function (event) {
    if (event.key === "Enter") {
        searchExams();
    }
});

document.getElementById('search-icon').addEventListener('click', function () {
    searchExams();
});

function toggleFilterMenu(element) {
    const menu = document.getElementById(element.id + "-menu");
    menu.classList.toggle("active");
}

function filter(element) {
    toggleFilterMenu(element);
    var elementId = element.id + "-menu";
    var checkboxes = document.querySelectorAll(`#${elementId} .checkbox-option input[type="checkbox"]`);
    var selectedOptions = [];

    checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            checkbox.checked = false;
            selectedOptions.push(checkbox.name);
        }
    });

    var result = [];

    if (element.id === "filter-name") {
        for (var i = 0; i < examsList.length; i++) {
            var exam = examsList[i];
            for (var j = 0; j < selectedOptions.length; j++) {
                option = selectedOptions[j];
                if (option === exam.name) {
                    result.push(exam);
                    break;
                }
            }
        }
    } else {
        for (var i = 0; i < examsList.length; i++) {
            var exam = examsList[i];
            for (var j = 0; j < selectedOptions.length; j++) {
                option = selectedOptions[j];
                if (option === exam.type) {
                    result.push(exam);
                    break;
                }
            }
        }
    }
    displayExams(result);
}


