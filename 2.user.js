// ==UserScript==
// @name            Deadlines 
// @author          Wu Peng
// @description     Get deadlines from THU Web Classroom 
// @include http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/MyCourse.jsp?language=cn
// ==/UserScript==
//

var sortby_date = function(a, b) {
    //a.due = "2012-09-12"
    var date_a = a.due.split("-");
    var due_a = date_a[0]*10000 + date_a[1]*100 + date_a[2]*1;
    var date_b = b.due.split("-");
    var due_b = date_b[0]*10000 + date_b[1]*100 + date_b[2]*1;
    return due_a - due_b;
};

function showToolTip(content, evt, toolTip) {
//    xPos = evt.clientX;
//    yPos = evt.clientY;
    xPos = 0;
    yPos = 400;
    toolTip.innerHTML = content;
    toolTip.style.top = parseInt(yPos)+2 + "px";
    toolTip.style.left = parseInt(xPos)+2 + "px";
    toolTip.style.visibility = "visible";
}

function hideToolTip(toolTip) {
    toolTip.style.visibility = "visible";
}


    var toolTip = document.createElement("div");
    toolTip.innerHTML = content;
    toolTip.style.position = "absolute";    
    toolTip.style.color = "#333";
    toolTip.style.border = "1px solid #CCC";
    toolTip.style.fontSize = "11px";
    toolTip.style.backgroundColor = "#fff";
    toolTip.style.visibility = "visible";
    var body = document.getElementsByTagName("body")[0];
    body.insertBefore(toolTip, body.getElementsByTagName("table")[0]);

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET","http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/MyCourse.jsp?language=cn",true);
    var courses = document.getElementsByTagName("a");
    var links = null;

    for (var i = 0; i < courses.length; i++){
        if (courses[i].search.match("course_id") != null) {
            var content = "";
            var link = "http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/hom_wk_brw.jsp" + courses[i].search;
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", link, false);
            xmlhttp.send(null);
            var text = xmlhttp.responseText;
            var s = document.createElement("courses");
            s.innerHTML = text;
            var assignments = new Array();
            var tr1 = s.getElementsByClassName("tr1");
            var tr2 = s.getElementsByClassName("tr2");
            for (var j = 0; j < tr1.length; j++) {
                var homework = new Object();
                homework.name = tr1.item(j).getElementsByTagName("a")[0].innerText;
                homework.due = tr1.item(j).getElementsByTagName("td")[2].innerText;
                homework.submited = tr1.item(j).getElementsByTagName("td")[3].innerText.match("尚未提交") == null;
                homework.submitable = tr1.item(j).getElementsByTagName("input")[0].getAttribute("disabled") != "true";
                if ((! homework.submited) && homework.submitable)
                    assignments.push(homework);
            }
            for (var j = 0; j < tr2.length; j++) {
                var homework = new Object();
                homework.name = tr2.item(j).getElementsByTagName("a")[0].innerText;
                homework.due = tr2.item(j).getElementsByTagName("td")[2].innerText;
                var submited = tr2.item(j).getElementsByTagName("td")[3].innerText.match("尚未提交") == null;
                var submitable = tr2.item(j).getElementsByTagName("input")[0].getAttribute("disabled") != "true";
                if ((! submited) && submitable) assignments.push(homework);
            }
            assignments.sort(sortby_date);
            for (var j = 0; j < assignments.length; j++) {
                if (j != 0) content += "<br />";
                content += (assignments[j].name + " " + assignments[j].due + "截止");
            }
            if (assignments.length == 0) content = "No deadlines!!";
            document.getElementsByTagName("a")[i].addEventListener('mouseover', showToolTip(content, event, toolTip), false);
            document.getElementsByTagName("a")[i].addEventListener('mouseout', alert(""), false);
        }
    }
