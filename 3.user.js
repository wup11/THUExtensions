// ==UserScript==
// @name            Submit Button 
// @author          Wu Peng
// @description     Show submit button on homework detail page on THU Web Classroom 
// @include         http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/hom_wk_detail.jsp*
// ==/UserScript==
//

var url = document.URL;
var s = document.createElement("a");
s.href = url;
var submit = document.createElement("button");
submit.innerText = "提交作业";
submit.style.width = "100px";
submit.setAttribute("onclick", "javascript:window.location.href='hom_wk_submit.jsp" + s.search + "';");
var back_button = document.getElementsByTagName("input")[0];
back_button.parentNode.insertBefore(submit, back_button);
