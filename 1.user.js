// ==UserScript==
// @name            WebClassroomTagEnabler
// @description     Hide an annoying table to show tags in course files
// @include http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/download.jsp*
// ==/UserScript==
document.getElementsByTagName("table")[1].style.display = 'none';
