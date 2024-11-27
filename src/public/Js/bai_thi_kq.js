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
document.getElementById("ten_user").textContent = getCookie("username");
// bài thi
document.addEventListener('DOMContentLoaded', function() {
    fetch(window.location.href,{
            method : 'POST'
    })
            .then(function(response){
                response.json().then(function(result){
                                    result.forEach(element => {
                                        var newtr = document.createElement("tr")
                                        var numRows = document.getElementById("exam_start_dethi").rows.length;
                                        newtr.innerHTML = 
                                            `<td>
                                                <span style="font-weight: bold;">Câu ${numRows+1}:</span>
                                                ${element.Question}
                                                <input type="checkbox" id="myCheckbox" onclick="highlightRow(this,'#eee8aa');">
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
                                    
                                })
                                .catch(function(err){
                                    console.log("err view de thi")
                                })
            })
            .catch(function(err){
                console.log('err lay data_exam_start')
            })
});

function highlightRow (element, color){
    var temporary;
    temporary=element;
    while (element.tagName.toUpperCase() != 'TR' && element != null)
        element = document.all ? element.parentElement : element.parentNode;
    if (element){ 
        if (temporary.checked)
            element.bgColor = color;
        else
            element.bgColor = '#ffffff'; 
    }
}

let count = 60 * window.location.href.split("/")[5];
let time_lam_bai = count;
const timer = setInterval(function() {
    count--;
    var nguyen = Math.floor(count / 60) 
    var du ;
    if(count%60  < 10){
        du = '0' + (count%60).toString()
    }else{
        du = (count%60).toString()
    }
    document.getElementById("timer").innerHTML = `${nguyen} : ${du}`;
    if (count === 0) {
        timeout();
    }
}, 1000);

function timeout(){
    document.getElementById("in").innerHTML="Nộp bài thành công!";
    clearInterval(timer);
    document.getElementById("timer").innerHTML="";
}
//ket qua
    var button_nop_bai = document.getElementById("button_nop_bai")
    var dap_an_1 = document.getElementsByClassName("dapan_1")
    var dap_an_chon = document.getElementsByClassName("dapan_chon") 
    var diem_bai_thi = document.getElementById("diem_bai_thi")
    var Hieu_bai_thi_html = document.getElementById("Hieu_bai_thi_html")
    var Trang_ket_qua_html = document.getElementById("Trang_ket_qua_html")

    var thoi_gian_lam_bai = document.getElementById("thoi_gian_lam_bai")
    var tong_so_cau = document.getElementById("tong_so_cau")
    var so_cau_dung = document.getElementById("so_cau_dung")
    var so_cau_sai = document.getElementById("so_cau_sai")
    var the_link_ket_qua = document.getElementById("the_link_ket_qua")
    var mang_tra_loi = []

    var so_cau_dung_1 = 0;
    var Answer_user = ""
    button_nop_bai.addEventListener("click",function(){
        for(var i = 0;i < dap_an_chon.length ;i++){
            if(Math.floor((i+1) / dap_an_1.length ) > Answer_user.length){
                Answer_user += "_";
            }
            if(dap_an_chon[i].checked){
                if((i+1) % 4 == 1){
                    Answer_user += "A";
                }else if((i+1) % 4 == 2){
                    Answer_user += "B";
                }else if((i+1) % 4 == 3){
                    Answer_user += "C";
                }else if((i+1) % 4 == 0){
                    Answer_user += "D";
                }
                if(dap_an_chon[i].classList.contains("dapan_1")){
                    so_cau_dung_1 +=1;
                }
            }
        }

        the_link_ket_qua.href = "/Css/ket_qua.css"
        diem_bai_thi.innerText =`${((so_cau_dung_1 / dap_an_1.length) * 10).toFixed(1)}`
        thoi_gian_lam_bai.innerText = `${Math.floor((time_lam_bai- count) /60)}p : ${(time_lam_bai - count)%60}s`
        tong_so_cau.innerText = `${dap_an_1.length}`
        so_cau_dung.innerText = `${so_cau_dung_1}`
        so_cau_sai.innerText = `${dap_an_1.length - so_cau_dung_1}`
        Hieu_bai_thi_html.style.display = "none"
        Trang_ket_qua_html.style.display = "block"   //hiện trang điểm
        const now = new Date();
        const day = now.getDate(); // Lấy ngày hiện tại (1-31)
        const month = now.getMonth() + 1; // Lấy tháng hiện tại (0-11, nên cộng thêm 1)
        const year = now.getFullYear(); // Lấy năm hiện tại (e.g., 2022)

        fetch(`http://localhost:3000/exams/answer_${window.location.href.substring(window.location.href.length-4,window.location.href.length)}`,{
            method : 'POST',
            headers: {
                'Content-Type': 'application/json' // cho biết rằng nội dung của yêu cầu là một chuỗi JSON.
            },
            body: JSON.stringify({diem: ((so_cau_dung_1 / dap_an_1.length) * 10).toFixed(1),
                                date: `${now.getDate()}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`,
                                Answers : Answer_user})
            })

    })

document.getElementById("checkbutton").addEventListener("click",function(){
    for(var i = 0;i < dap_an_1.length ;i++){
        dap_an_1[i].type = "checkbox"
        dap_an_1[i].checked = true
    }


    the_link_ket_qua.href = ""
    Hieu_bai_thi_html.style.display = "block"
    Trang_ket_qua_html.style.display = "none"
    button_nop_bai.style.display = "none"
    document.getElementById("button_xem_chi_tiet").style.display = "block"
})

document.getElementById("button_xem_chi_tiet").addEventListener("click",function(){
    window.location.href = "http://localhost:3000/exams"
})
document.getElementById("returnbutton").addEventListener("click",function(){
    window.location.href = "http://localhost:3000/exams"
})
   
    