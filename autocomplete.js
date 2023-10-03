var listMonHoc = [];
var listKhoa = [];
var listGiangVien = [];
var inputBox_tmp;
const resultsBox = $(".result-box")

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

    if(inputBox.val()==""){
        resultsBox.html("");
        resultsBox.css("height","0px");
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
    resultsBox.css("height","0px");
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
});