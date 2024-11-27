
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('start').disabled = true;
    document.getElementById('end').disabled = true;
    flatpickr(".datetime-input", {
        enableTime: true,
        dateFormat: "d-m-Y",
        time_24hr: true
    });
});

class Question {
    constructor(content, a, b, c, d, answer) {
        this.content = content;
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.answer = answer;
    }
}

class Exam {
    constructor(name, subject, type, duration, startDate, endDate, listQuestion) {
        this.name = name;
        this.subject = subject;
        this.type = type;
        this.startDate = startDate;
        this.duration = duration;
        this.endDate = endDate;
        this.listQuestion = listQuestion;
    }
}

var listQuestion = [["Question","A","B","C","D","Answer"]];
function checkType() {
    var type = document.getElementById('type').value;
    if (type === 'Thời gian cụ thể') {
        document.getElementById('start').disabled = false;
        document.getElementById('end').disabled = false;
    } else {
        document.getElementById('start').disabled = true;
        document.getElementById('end').disabled = true;
    }
}

function addQuestion() {
    event.preventDefault();

    const questionIndex = document.querySelectorAll('.question-container').length + 1;
    const questionContainer = document.createElement('div');
    questionContainer.classList.add('question-container');
    questionContainer.innerHTML = `
        <div class="question-header">
            <div class="question-header-container">
                <span>Câu hỏi ${questionIndex}:</span>
                <i class="fa-solid fa-trash"></i>
            </div>
            <input type="text" class="question-input" placeholder="Nhập câu hỏi ...">
        </div>
        <div class="answer-options">
            <div class="form-answer-options">
                <label><input type="radio" name="answer${questionIndex}" value="A" id="radioA"> A</label>
                <input type="text" class="answer-option A" placeholder="Phương án A">
            </div>
            <div class="form-answer-options">
                <label><input type="radio" name="answer${questionIndex}" value="B" id="radioB"> B</label>
                <input type="text" class="answer-option B" placeholder="Phương án B">
            </div>
            <div class="form-answer-options">
                <label><input type="radio" name="answer${questionIndex}" value="C" id="radioC"> C</label>
                <input type="text" class="answer-option C" placeholder="Phương án C">
            </div>
            <div class="form-answer-options">
                <label><input type="radio" name="answer${questionIndex}" value="D" id="radioD"> D</label>
                <input type="text" class="answer-option D" placeholder="Phương án D">
            </div>
        </div>
    `;

    const deleteQuestion = questionContainer.querySelector('.fa-trash');
    deleteQuestion.addEventListener('click', function () {
        questionContainer.remove();
        updateQuestionNumbers();
    });

    document.getElementById('questionForm').appendChild(questionContainer);
}

function updateQuestionNumbers() {
    const allQuestions = document.querySelectorAll('.question-container');
    allQuestions.forEach((question, index) => {
        question.querySelector('.question-header span').textContent = `Câu hỏi ${index + 1}:`;
        question.querySelectorAll('input[type=radio]').forEach((radio) => {
            radio.name = `answer${index + 1}`;
        });
    });
}

function loadExcel() {
    event.preventDefault();
    // Xóa hết câu hỏi hiện tại
    const elements = document.querySelectorAll('.question-container');
    elements.forEach(function (element) {
        element.remove();
    });
    document.getElementById('upload').click();
};

document.getElementById('upload').addEventListener('change', handleFileSelect, false);

function handleFileSelect(event) {
    const reader = new FileReader();
    reader.onload = function (event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        // Chuyển sheet thành mảng JSON
        const questions = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        processQuestions(questions);
    };
    reader.readAsArrayBuffer(event.target.files[0]);
    event.target.value = '';
}

function processQuestions(questions) {
    questions.shift(); // Bỏ qua hàng đầu tiên
    questions.forEach((row) => {
        listQuestion.push(new Question(row[0], row[1], row[2], row[3], row[4], row[5]));
        addQuestion();
    });
    displayQuestions();
}

function displayQuestions() {
    const questionContainers = document.querySelectorAll('.question-container');
    for (var index = 0; index < questionContainers.length; index++) {
        const container = questionContainers[index];
        const question = listQuestion[index+1];
        container.querySelector('.question-input').value = question.content;
        container.querySelector('.A').value = question.a;
        container.querySelector('.B').value = question.b;
        container.querySelector('.C').value = question.c;
        container.querySelector('.D').value = question.d;
        container.querySelector(`#radio${question.answer}`).checked = true;
    }
}

document.getElementById('submitBtn').addEventListener('click', function (event) {
    //event.preventDefault();
    // Lấy dữ liệu từ form
    const name = document.getElementById('name').value;
    const subject = document.getElementById('subject').value;
    const type = document.getElementById('type').value;
    const duration = document.getElementById('duration').value;
    const startTime = document.getElementById('start').value.split('-').reverse().join('-');
    const endTime = document.getElementById('end').value.split('-').reverse().join('-');

    const questionContainers = document.querySelectorAll('.question-container');
    listQuestion = [["Question","A","B","C","D","Answer"]];
    for (var index = 0; index < questionContainers.length; index++) {
        const container = questionContainers[index];
        const content = container.querySelector('.question-input').value;
        const a = container.querySelector('.A').value;
        const b = container.querySelector('.B').value;
        const c = container.querySelector('.C').value;
        const d = container.querySelector('.D').value;
        let answer = '';
        if (container.querySelector('#radioA').checked) {
            answer = 'A';
        } else if (container.querySelector('#radioB').checked) {
            answer = 'B';
        } else if (container.querySelector('#radioC').checked) {
            answer = 'C';
        } else {
            answer = 'D';
        }
        listQuestion.push([content, a, b, c, d, answer]);
    }
    const newExam = new Exam(name, subject, type, duration, startTime, endTime, listQuestion);
    
    if(window.location.href == "http://localhost:3000/Exams_UserAcount/AddExam"){
        fetch("http://localhost:3000/Exams_UserAcount/AddExam",{
            method : 'POST',
            headers: {
                'Content-Type': 'application/json' // cho biết rằng nội dung của yêu cầu là một chuỗi JSON.
            },
            body: JSON.stringify({data1: newExam})
        })
                .then(function(response){
                console.log('ok add exams')
                })
                .catch(function(err){
                    console.log('err add exams')
                })
    }else{
        fetch(window.location.href,{
            method : 'POST',
            headers: {
                'Content-Type': 'application/json' // cho biết rằng nội dung của yêu cầu là một chuỗi JSON.
            },
            body: JSON.stringify({data1: newExam})
        })
                .then(function(response){
                console.log('ok edit exams')
                })
                .catch(function(err){
                    console.log('err edit exams')
                })
    }
    
    // Hiển thị thông báo đã hoàn thành
    displayNotification();
});

function displayNotification() {
    const backdrop = document.createElement('div');
    backdrop.className = 'backdrop';

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fa-solid fa-circle-check"></i>
        <span>Thành công!</span>
    `;

    document.body.appendChild(backdrop);
    document.body.appendChild(notification);
    setTimeout(function () {
        window.location.href = "http://localhost:3000/Exams_UserAcount";
    }, 2000);
}

function exit() {
    window.location.href = "http://localhost:3000/Exams_UserAcount";
}

