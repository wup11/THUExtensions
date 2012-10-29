// ==UserScript==
// @name            Deadlines 
// @author          Wu Peng
// @description     Get deadlines from THU Web Classroom 
// @include http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/MyCourse.jsp*
// ==/UserScript==
//

var sortby_date = function(a, b) {
    var date_a = a.due.split("-");
    var due_a = date_a[0]*10000 + date_a[1]*100 + date_a[2]*1;
    var date_b = b.due.split("-");
    var due_b = date_b[0]*10000 + date_b[1]*100 + date_b[2]*1;
    return due_a - due_b;
};

var courses = document.getElementsByTagName("tr");
var links = null;

for (var i = 0; i < courses.length; i++) {
    var course_link = courses[i].getElementsByTagName("a")[0];
    if (course_link == null) continue;
    if (course_link.search.match("course_id") == null) continue;
    var link = "http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/hom_wk_brw.jsp" + course_link.search;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.link = course_link;
    xmlhttp.onreadystatechange = function() {
        if (this.readyState==4 && this.status==200) {
            var text = this.responseText;
            var content = "";
            var s = document.createElement("courses");
            s.innerHTML = text;
            var assignments = new Array();
            var tr1 = s.getElementsByClassName("tr1");
            var tr2 = s.getElementsByClassName("tr2");
            for (var j = 0; j < tr1.length; j++) {
                var homework = new Object();
                homework.name = tr1.item(j).getElementsByTagName("a")[0].innerText;
                homework.link = tr1.item(j).getElementsByTagName("a")[0].href;
                homework.due = tr1.item(j).getElementsByTagName("td")[2].innerText;
                homework.submited = tr1.item(j).getElementsByTagName("td")[3].innerText.match("尚未提交") == null;
                homework.submitable = tr1.item(j).getElementsByTagName("input")[0].getAttribute("disabled") != "true";
                if ((! homework.submited) && homework.submitable)
                    assignments.push(homework);
            }
            for (var j = 0; j < tr2.length; j++) {
                var homework = new Object();
                homework.name = tr2.item(j).getElementsByTagName("a")[0].innerText;
                homework.link = tr2.item(j).getElementsByTagName("a")[0].href;
                homework.due = tr2.item(j).getElementsByTagName("td")[2].innerText;
                var submited = tr2.item(j).getElementsByTagName("td")[3].innerText.match("尚未提交") == null;
                var submitable = tr2.item(j).getElementsByTagName("input")[0].getAttribute("disabled") != "true";
                if ((! submited) && submitable) assignments.push(homework);
            }
            assignments.sort(sortby_date);
            for (var j = 0; j < assignments.length; j++) {
                if (j != 0) content += "<br />";
                content += ("<a href=\"" + assignments[j].link + "\">" + assignments[j].name + "</a> " + assignments[j].due + "截止");
            }
            if (assignments.length == 0) content = "No deadlines!!";
            var deadlines = document.createElement("div");
            deadlines.style.lineHeight = "1.2";
            deadlines.innerHTML = content;
            var list = this.link.parentNode.parentNode.getElementsByTagName("td")[1];
            if (list != null) list.appendChild(deadlines);
        }
    }
    xmlhttp.open("GET", link, true);
    xmlhttp.send(null);
}
