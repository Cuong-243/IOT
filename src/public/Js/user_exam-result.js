document.addEventListener("DOMContentLoaded", function () {
    fetch(window.location.href,{
            method : 'POST'
    })
            .then(function(response){
                response.json().then(element => {
                    displayExam(element.anwsers , element.bai_thi)
                })
            })
            .catch(function(err){
                console.log('err lay data exams')
            })
})

function displayExam(index , baithi){
    document.getElementById("username_exam_result").textContent ="Hello "+ window.location.href.split("/")[5].split("_")[1];

    baithi.forEach(element => {
        var newtr = document.createElement("tr")
        var numRows = document.getElementById("exam_start_dethi").rows.length;
        newtr.innerHTML = 
            `<td>
                <span style="font-weight: bold;">Câu ${numRows+1}:</span>
                ${element.Question}
                <br>
                A. <input type="radio" id="c${numRows+1}_A" name="c${numRows+1}" class="dapan_chon"> ${element.A}
                <br>
                B. <input type="radio" id="c${numRows+1}_B" name="c${numRows+1}" class="dapan_chon"> ${element.B}
                <br>
                C. <input type="radio" id="c${numRows+1}_C" name="c${numRows+1}" class="dapan_chon"> ${element.C}
                <br>
                D. <input type="radio" id="c${numRows+1}_D" name="c${numRows+1}" class="dapan_chon"> ${element.D}
            </td>`
        document.getElementById("exam_start_dethi").appendChild(newtr)
        document.getElementById(`c${numRows+1}_${element.Answer}`).classList.toggle("dapan_1")
    });

    var dap_an_1 = document.getElementsByClassName("dapan_1")
    var dapan_chon = document.getElementsByClassName("dapan_chon")

    for(var i = 0;i < dap_an_1.length ;i++){
        dap_an_1[i].type = "checkbox"
        dap_an_1[i].checked = true
    }
    // console.log(index[0].anwsers)
    // console.log(typeof(index[0].anwsers ))

    document.getElementById("diem_exam_result").textContent ="Kết quả bài thi "+ index[0].result;
    for(var i = 0;i < index[0].anwsers.length ;i++){
        if(index[0].anwsers[i] == "A"){
            dapan_chon[i*4].checked = true
        }else if(index[0].anwsers[i] == "B"){
            dapan_chon[i*4+1].checked = true
        }else if(index[0].anwsers[i] == "C"){
            dapan_chon[i*4+2].checked = true
        }else if(index[0].anwsers[i] == "D"){
            dapan_chon[i*4+3].checked = true
        }
    }
}

document.getElementById("button_xem_chi_tiet").addEventListener("click",function(){
    window.location.href = "http://localhost:3000/Exams_UserAcount/ResultPage"
})
