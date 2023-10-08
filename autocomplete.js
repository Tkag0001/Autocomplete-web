var listMonHoc = [];
var listKhoa = [];
var listGiangVien = [];
var listNhomLop = [];
var listHocKi = [];
var inputBox_tmp;
var dataNhomLop;
// var dataDiem;
const resultsBox = $(".result-box")

var result_filter = []
//Get data list of monHoc
fetch("https://long-lime-iguana-yoke.cyclic.cloud/monHoc")
    .then(res => {
        return res.json();
    })
    .then(data => {
        console.log(data);
        data.forEach(element => {
            listMonHoc.push(element["_id"] + "  " + element["ten"]);
        });
    })
    .catch(error => console.log(error));

//Get data list khoa
fetch("https://long-lime-iguana-yoke.cyclic.cloud/khoa")
    .then(res => {
        return res.json();
    })
    .then(data => {
        // console.log(data);
        data.forEach(element => {
            listKhoa.push(element["_id"] + "  " + element["ten"]);
        });
    })
    .catch(error => console.log(error));

//Get data list giang vien
fetch("https://long-lime-iguana-yoke.cyclic.cloud/giangvien")
    .then(res => {
        return res.json();
    })
    .then(data => {
        console.log(data);
        data.forEach(element => {
            listGiangVien.push(element["_id"] + "  " + element["ho"] + " " + element["ten"]);
        });
    })
    .catch(error => console.log(error));

//Get data list nhom lop and hocKi
fetch("https://long-lime-iguana-yoke.cyclic.cloud/nhomLop")
    .then(res => {
        return res.json();
    })
    .then(data => {
        console.log(data);
        dataNhomLop = data;
        data.forEach(element => {
            if (!listNhomLop.includes(element["maNhomLop"])) {
                listNhomLop.push(element["maNhomLop"])
            }
            if (!listHocKi.includes(element["hk"])) {
                listHocKi.push(element["hk"])
            }
        });
    })
    .catch(error => console.log(error));

function autoComplete(inputBox, availableKeywords) {
    inputBox_tmp = inputBox;
    let result = [];
    let input = inputBox.val();
    if (input.length) {
        result = availableKeywords.filter((keyword) => {
            return keyword.toLocaleLowerCase().includes(input.toLocaleLowerCase());
        });
        console.log(result)
    }
    // console.log(availableKeywords)
    display(result);

    if (inputBox.val() == "") {
        resultsBox.html("");
        resultsBox.css("height", "0px");
    }

}

function display(result) {
    const content = result.map((list) => {
        return "<li onclick = selectInput(this) >" + list + "</li>";
    });
    // console.log(content);
    if (content.length == 0) {
        content.push("<li>No result</li>")
    }
    if (content.length > 5) {
        resultsBox.css({
            "height": "360px",
            "overflow-y": "scroll"
        });
    }
    else {
        resultsBox.css({
            "height": "auto",
            "overflow-y": "auto"
        });
    }
    // console.log(content)
    resultsBox.html("<ul>" + content.join('') + "</ul>");
}

function selectInput(list) {
    inputBox_tmp.val(list.innerHTML);
    resultsBox.html("");
    resultsBox.css("height", "0px");
}

function alert_noResult() {
    alert("No reusult!")
}

function addAtribute(filter, listData, result_filter, n) {
    if (listData.includes(filter.val())) {
        result_filter.push(filter.val().substring(0, n));
    }
    else {
        result_filter.push("No_result");
    }
}

//Get data list diem
function getDiem(str) {
    let result = [];
    fetch(str)
        .then(res => {
            return res.json();
        })
        .then(data => {
            // console.log(data)
            // console.log(data["diem"])
            keys = Object.keys(data["diem"]);
            for (var i = 1; i < 12; i++) {
                console.log(data["diem"][keys[i]])
                result.push(data["diem"][keys[i]]);
            }

            // keys.forEach(k => result.push(data["diem"][k]))
            // console.log(result)
        })
        .catch(error => console.log(error));
    // console.log(result)
    return result;
}

function drawChartBar(ob,xArr, yArr, title) {
    let data = [{
        x: xArr,
        y: yArr,
        type: "bar"
    }];
    console.log(data)
    let layout = {title: title };
    console.log(layout)
    Plotly.newPlot(ob, data, layout);
}

$(document).ready(function () {
    console.log("test")
    $("#monHoc").keyup(function () {
        autoComplete($(this), listMonHoc)
    });
    $("#khoa").keyup(function () {
        autoComplete($(this), listKhoa);
    })
    $("#giangVien").keyup(function () {
        autoComplete($(this), listGiangVien);
    })
    $("#nhomLop").keyup(function () {
        autoComplete($(this), listNhomLop);
    })
    $("#hocKi").keyup(function () {
        autoComplete($(this), listHocKi);
    })
    $("#search_bt").click(function () {
        result_filter = [];
        addAtribute($("#monHoc"), listMonHoc, result_filter, 8);
        addAtribute($("#giangVien"), listGiangVien, result_filter, 5);
        addAtribute($("#nhomLop"), listNhomLop, result_filter, 6);
        addAtribute($("#hocKi"), listHocKi, result_filter, 5)

        console.log(result_filter);

        let strFilter = result_filter.join('_');
        console.log(strFilter);
        try {
            diem = getDiem("https://long-lime-iguana-yoke.cyclic.cloud/nhomLop/" + strFilter);
            console.log(diem)

            xArr = []
            yArr = diem
            for (var i = 0; i <= 10; i++) {
                xArr.push(i);
            }

            // data = [{
            //     x:xArr,
            //     y:yArr,
            //     type:"bar"
            //   }];

            drawChartBar("chart",xArr,yArr,strFilter);

        }
        catch (error) {
            console.log(error)
        }
    })
});