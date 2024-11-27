var barColors = ["#55efc4", "#74b9ff", "#6c5ce7", "#fdcb6e", "#d63031", "#fd79a8", "#eccc68", "#8e44ad", "#ff4757", "#5352ed", "#7bed9f"];

function chart1(xValues, barColors, yValues) {
  new Chart("myChart", {
    type: "bar",
    data: {
      labels: xValues,
      datasets: [{
        backgroundColor: barColors,
        data: yValues
      }]
    },
    options: {
      legend: { display: false },
      title: {
        display: true,
        text: "Thống kê điểm số"
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
}

window.jsPDF = window.jspdf.jsPDF;
function pieChart(xValues,barColors,yValues){
  var ctx = document.getElementById("myPieChart").getContext("2d");
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: xValues,
      datasets: [{
        backgroundColor: barColors,
        data: yValues
      }]
    },
    options: {
      title: {
        display: true,
        text: 'Biểu đồ tròn'
      }
    }
  });
}

function quay_lai(){
  window.location.href = "http://localhost:3000/Exams_UserAcount"
}

var table_list = []
var data = []
var anwser = []
document.addEventListener("DOMContentLoaded", function () {
  fetch(window.location.href,{method : 'POST'})
    .then(function(response){
      response.json().then(element => {
        data = element.array
        table_list = element.array
        display_exams_data(data)
      })
    })
    .catch(function(err){console.log(err)})
})

document.getElementById('myInput').addEventListener('input', function() {
  const filter = this.value;
  const table = document.getElementById('myTable');
  const rows = document.querySelectorAll('#myTable tbody tr');
    const tbody = table.getElementsByTagName('tbody')[0];
  rows.forEach(row => {
    const cell = row.querySelector('td:first-child');
    if (cell) {
      const cellText = cell.textContent || cell.innerText;
      if (cellText.indexOf(filter) > -1) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    }
  });
});

document.getElementById('chon_ki_thi').addEventListener('change', function() {
  const filterValue = this.value;
  const rows = document.querySelectorAll('#myTable tbody tr');

  rows.forEach(row => {
    const cell = row.querySelector('td:nth-child(2)');
    if (cell) {
      const cellText = cell.textContent || cell.innerText;
      if (filterValue === "opt1" && cellText === "Giữa kỳ" || filterValue === "opt2" && cellText === "Cuối kỳ" || filterValue === "opt3" && cellText === "Luyện tập") {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    }
  });
});

function display_exams_data(array){
  array.forEach(element => {
    var table = document.getElementById("myTable")
    var tbody = table.getElementsByTagName('tbody')[0];
    var newtr = document.createElement("tr")
    newtr.innerHTML =`<td>${element.id}</td>
                      <td>${element.name}</td>
                      <td>${element.endDate}</td>
                      <td>${element.duration}</td>`
    newtr.setAttribute("id",`${element.id}`)
    newtr.setAttribute("class","data_thong_ke_table")
    tbody.appendChild(newtr)
  });
  var mang_table = document.getElementsByClassName("data_thong_ke_table")
  for(var i = 0;i<mang_table.length;i++){
    (function(index){
      mang_table[index].addEventListener("click",function(){
        // truy van lay ve kết quả của bài thi nay
        fetch(`http://localhost:3000/Exams_UserAcount/ThongKe/Exam_${mang_table[index].id}`,{method : 'POST'})
          .then(function(response){
            response.json().then(element => {
              anwser = element.array;
              check_data(anwser)
            })
          })
          .catch(function(err){console.log(err)})
      })
    })(i)
    
  }
}
function check_data(element){
  element.sort((a, b) => a.result - b.result);
  var dtb = 0;
  var so_lg_tham_gia = element.length;
  list_result={};

  
  element.forEach(function(index){
    if(index.result in list_result){
      list_result[index.result] += 1
    }else{
      list_result[index.result] = 1
    }
    dtb += parseFloat(index.result)
  })
  dtb /= so_lg_tham_gia
  if(element.length == 0){
    dtb = 0 ;
  }
  var mmm = []
  Object.values(list_result).forEach(element => {
    mmm.push(element);
  })
  chart1(Object.keys(list_result),barColors,mmm)
  pieChart(Object.keys(list_result),barColors,Object.values(list_result))
  
  const uniqueUserNames = new Set(element.map(item => item.username));
  const uniqueNameCount = uniqueUserNames.size;
  document.getElementById("gtsl").textContent = `${element.length} lượt`
  document.getElementById("gttl").textContent = `${(uniqueNameCount / 100)*100}%`
  document.getElementById("gtdtb").textContent = `${dtb.toFixed(2)}`
  document.getElementById("cards").style.display = "block"
}

