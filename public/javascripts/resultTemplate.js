(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['courseResult'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "                <a href=\"#\" class=\"result-value-audio\">Audio</a>\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "                <a href=\"#\" class=\"result-value-audio\"></a>\n";
},"5":function(container,depth0,helpers,partials,data) {
    return "                <a href=\"#\" class=\"result-value-video\">Video</a>\n";
},"7":function(container,depth0,helpers,partials,data) {
    return "                <a href=\"#\" class=\"result-value-\"></a>\n";
},"9":function(container,depth0,helpers,partials,data) {
    return "                <a href=\"#\" class=\"result-value-notes\">Notes</a>\n";
},"11":function(container,depth0,helpers,partials,data) {
    return "                <a href=\"#\" class=\"result-value-notes\"></a>\n";
},"13":function(container,depth0,helpers,partials,data) {
    return "                <a href=\"#\" class=\"result-value-textbook\">Textbook</a>\n";
},"15":function(container,depth0,helpers,partials,data) {
    return "                <a href=\"#\" class=\"result-value-textbook\"></a>\n";
},"17":function(container,depth0,helpers,partials,data) {
    return "                <a href=\"#\" class=\"result-value-exam\">Exam</a>\n";
},"19":function(container,depth0,helpers,partials,data) {
    return "                <a href=\"#\" class=\"result-value-exam\"></a>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"result\" data-title=\""
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "\" data-semester=\""
    + alias4(((helper = (helper = helpers.sem || (depth0 != null ? depth0.sem : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"sem","hash":{},"data":data}) : helper)))
    + "\" data-audio=\""
    + alias4(((helper = (helper = helpers.completeAudio || (depth0 != null ? depth0.completeAudio : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"completeAudio","hash":{},"data":data}) : helper)))
    + "\" data-video=\""
    + alias4(((helper = (helper = helpers.completeVideo || (depth0 != null ? depth0.completeVideo : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"completeVideo","hash":{},"data":data}) : helper)))
    + "\" data-notes=\""
    + alias4(((helper = (helper = helpers.completeLectures || (depth0 != null ? depth0.completeLectures : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"completeLectures","hash":{},"data":data}) : helper)))
    + "\" data-textbook=\""
    + alias4(((helper = (helper = helpers.onlineTextbooks || (depth0 != null ? depth0.onlineTextbooks : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"onlineTextbooks","hash":{},"data":data}) : helper)))
    + "\" data-exam=\""
    + alias4(((helper = (helper = helpers.exams || (depth0 != null ? depth0.exams : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"exams","hash":{},"data":data}) : helper)))
    + "\" data-url=\""
    + alias4(((helper = (helper = helpers.href || (depth0 != null ? depth0.href : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"href","hash":{},"data":data}) : helper)))
    + "\">\n    <div class=\"result-contents\">\n        <div class=\"result-info-container\">\n            <a href=\"#\" class=\"result-value-title\">"
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "</a> \n        </div>\n        <div class=\"result-info-container\">\n            <a href=\"#\" class=\"result-value-semester\">"
    + alias4(((helper = (helper = helpers.sem || (depth0 != null ? depth0.sem : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"sem","hash":{},"data":data}) : helper)))
    + "</a>\n        </div>\n        <div class=\"result-category-container\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.completeAudio : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"result-category-container\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.completeVideo : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.program(7, data, 0),"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"result-category-container\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.completeLectures : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.program(11, data, 0),"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"result-category-container\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.onlineTextbooks : depth0),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.program(15, data, 0),"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"result-category-container\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.exams : depth0),{"name":"if","hash":{},"fn":container.program(17, data, 0),"inverse":container.program(19, data, 0),"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"result-info-container\">\n            <a href=\"#\" class=\"result-value-url\">"
    + alias4(((helper = (helper = helpers.href || (depth0 != null ? depth0.href : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"href","hash":{},"data":data}) : helper)))
    + "</a>\n        </div>\n    </div>\n</div>";
},"useData":true});
})();