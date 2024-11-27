
var Dang_ky = document.getElementById("Dang_ky")
var Dang_nhap = document.getElementById("Dang_nhap")

var div_1 = document.getElementById("div_1")
var div_2 = document.getElementById("div_2")

function setCookie(cname, cvalue, exhour) {
  const d = new Date();
  d.setTime(d.getTime() + (exhour*60*60*1000));// miligiay
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

Dang_ky.addEventListener("click",function(){
  thong_bao_signin.innerText = ""
  if(div_1.style.display == "none"){
    div_1.style.display = "block"
  }else{
    div_1.style.display = "none"
  }

  if(div_2.style.display == "block"){
    div_2.style.display = "none"
  }else{
    div_2.style.display = "block"
  }
})

Dang_nhap.addEventListener("click",function(){
  thong_bao_login.innerText = ""
  if(div_1.style.display == "block"){
    div_1.style.display = "none"
  }else{
    div_1.style.display = "block"
  }

  if(div_2.style.display == "none"){
    div_2.style.display = "block"
  }else{
    div_2.style.display = "none"
  }
})

class NguoiDung{
  constructor(Tk, Mk) {
    this.Tk = Tk;
    this.Mk = Mk;
  }
}

class Admin{
  constructor(Tk, Mk) {
    this.Tk = Tk;
    this.Mk = Mk;
  }
}

const admin1 = new Admin("Cuong243", 123456789);
const admin2 = new Admin("Cuong243", 123456789);
const admin3 = new Admin("Cuong243", 123456789);
const admin4 = new Admin("Cuong243", 123456789);
var mangAdmin = [admin1 ,admin2,admin3,admin4 ]

const nguoi1 = new NguoiDung("Cuong217", 123456789);
const nguoi2 = new NguoiDung("Cuong217", 123456789);
const nguoi3 = new NguoiDung("Cuong217", 123456789);
const nguoi4 = new NguoiDung("Cuong217", 123456789);
var mangNguoiDung = [nguoi1 , nguoi2 , nguoi3 ,nguoi4]

var Dang_nhap_1 = document.getElementById("Dang_nhap_1")
var Tk_dang_nhap = document.getElementById("Tk_dang_nhap")
var Mk_dang_nhap = document.getElementById("Mk_dang_nhap")
var Dang_ky_1 = document.getElementById("Dang_ky_1")
var thong_bao_login = document.getElementById("thong_bao_login")
function login___(){
  fetch('http://localhost:3000/login',{
            method : 'POST',
            headers: {
                    'Content-Type': 'application/json' // cho biết rằng nội dung của yêu cầu là một chuỗi JSON.
            },
            body: JSON.stringify({data1: Tk_dang_nhap.value,
                                  data2: Mk_dang_nhap.value})
  })
            .then(function(response){
                console.log("ok gui tkmk cho back end")
                return response.json()
            })
            .then(function(response){
              if(response.thong_bao == "username ok"){
                setCookie("token",response.token,response.expiresIn)
                setCookie("username",response.username,response.expiresIn)
                window.location.href = "http://localhost:3000/exams"
              }else if(response.thong_bao == "admin ok"){
                setCookie("token",response.token,response.expiresIn)
                setCookie("username",response.username,response.expiresIn)
                window.location.href = "http://localhost:3000/Exams_UserAcount"
              }else{
                thong_bao_login.innerText = response.thong_bao
              }
            })
            .catch(function(err){
                console.log('err gui tkmk cho back end')
            })
}
Dang_nhap_1.addEventListener("click",function(){
  login___()
})

var Tk_dang_ky = document.getElementById("Tk_dang_ky")
var Email_dang_ky = document.getElementById("Email_dang_ky")
var Mk_dang_ky = document.getElementById("Mk_dang_ky")
var Mk_dang_ky_xac_nhan = document.getElementById("Mk_dang_ky_xac_nhan")
var thong_bao_signin = document.getElementById("thong_bao_signin")

function sigin__(){
  if(Tk_dang_ky.value.length < 8){
    thong_bao_signin.innerText = "Username không đủ 8 ký tự"
  }else if( Mk_dang_ky.value.length < 8 ){
    thong_bao_signin.innerText = "Độ dài password không đủ 8 ký tự"
  }else if(Mk_dang_ky.value != Mk_dang_ky_xac_nhan.value){
    thong_bao_signin.innerText = "Password không khớp"
  }else{
    fetch('http://localhost:3000/login/sigin',{
            method : 'POST',
            headers: {
                    'Content-Type': 'application/json' // cho biết rằng nội dung của yêu cầu là một chuỗi JSON.
            },
            body: JSON.stringify({data1: Tk_dang_ky.value,
                                  data2: Email_dang_ky.value,
                                  data3: Mk_dang_ky.value})
    })
            .then(function(response){
                console.log("ok gui tkmk cho back end")
                return response.json()
            })
            .then(function(response){
              if(response.thong_bao == "ok"){
                setCookie("token",response.token,response.expiresIn)
                setCookie("username",response.username,response.expiresIn)
                window.location.href = "http://localhost:3000/exams"
              }else{
                thong_bao_signin.innerText = response
              }
            })
            .catch(function(err){
                console.log('err gui tkmk cho back end')
            })
  }
}
Dang_ky_1.addEventListener("click",function(){
  sigin__()
})

document.getElementById("form_dang_nhap").addEventListener("keypress",function(event){
  if (event.key === "Enter") {
   login___()
  }
})
document.getElementById("Tk_dang_ky").addEventListener("keypress",function(event){
  if (event.key === "Enter") {
   sigin__()
  }
})
document.getElementById("Email_dang_ky").addEventListener("keypress",function(event){
  if (event.key === "Enter") {
   sigin__()
  }
})
document.getElementById("Mk_dang_ky").addEventListener("keypress",function(event){
  if (event.key === "Enter") {
   sigin__()
  }
})
document.getElementById("Mk_dang_ky_xac_nhan").addEventListener("keypress",function(event){
  if (event.key === "Enter") {
   sigin__()
  }
})