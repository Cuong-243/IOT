// Quay lại màn hình chính
var returnbutton = document.getElementById("returnButton");
returnbutton.onclick = function(){
    window.location.href = "http://localhost:3000/Exams_UserAcount";
}


document.getElementById("searchText").addEventListener("keypress",function(event){
    if (event.key === "Enter") {
        searchStudent()
    }
  })
function searchStudent() {
    var searchText = document.getElementById("searchText").value;
    document.getElementById("mainnnn").style.height = "90%"
    fetch(`http://localhost:3000/Exams_UserAcount/ResultPage/user_${searchText}`,{method : 'GET'})
        .then(function(response){
            response.json().then(function(response_1){ // response_1 là obj{thong_bao , exam_result}
                if(response_1.thong_bao === "Yes"){
                    var studentResultsDiv = document.getElementById("studentResults");
                    studentResultsDiv.innerHTML = "";
                    response_1.exam_result.forEach(exam => {
                        // Hiển thị kết quả
                            var examHTML = '<div class = "student-result">';
                            examHTML += '<h2>Bài thi: ' + exam.name + '</h2>';
                            examHTML += '<p>Điểm số: ' + exam.result + '</p>';
                            examHTML += '<p>Trạng thái: Hoàn thành </p>';
                            examHTML += '<p>Thời gian: ' + exam.date + '</p>';
                            examHTML += '</div>';
                            studentResultsDiv.innerHTML += examHTML;

                            // Hiển thị chi tiết bài thi hoặc ẩn bài thi
                            var detailButton = document.createElement("button");
                            detailButton.textContent = "Xem chi tiết bài thi";
                            studentResultsDiv.appendChild(detailButton);
                            detailButton.setAttribute("id",`${searchText}/${exam.id}`)
                            detailButton.setAttribute("class","xemchitiet_user_exam_result")             
                    });
                    var mang = document.querySelectorAll(".xemchitiet_user_exam_result")
                    mang.forEach(element => {
                        element.onclick = function(){
                            window.location.href = `http://localhost:3000/Exams_UserAcount/ResultPage/user_${element.id}`
                        }
                    });

                }else{
                    document.getElementById("studentResults").innerHTML += '<p>Không có dữ liệu sinh viên.</p>';
                }
            })
        })
        .catch(function(err){
            console.log(err)
        })
}

// Hiển thị báo cáo
function exportResults() {
    alert("No Export");
}