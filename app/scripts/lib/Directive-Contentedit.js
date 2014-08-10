var app = angular.module('contentEdit', []);

app.directive('editor', ['$document', function($document) { return {
  restrict: 'AE',
  require: '?ngModel',
  templateUrl: 'scripts/tpl/editor.html',
  scope:{
    editContent:'=content',
    editAble:'=editable'
  },
  transclude:true,
  link: function(scope, element, attrs,ngModel) {
    scope.pen = {
      actions:{
        h2:function(){
          $document[0].execCommand('formatblock',false,'h2');
        },
        h3:function(){
          $document[0].execCommand('formatblock',false,'h3');
        },
        p:function(){
          $document[0].execCommand('formatblock',false,'p');
        }
      } 
    }    
  }
}}]);

app.directive('isedit',['$timeout',function($timeout){return{
  restrict:'AE',
  require: '?ngModel',
  link:function(scope,element,attrs,ngModel){
          // don't do anything unless this is actually bound to a model
      if (!ngModel) {
        return
      }
/*
      // options
      var opts = {}
      angular.forEach([
        'stripBr',
        'noLineBreaks',
        'selectNonEditable',
        'moveCaretToEndOnChange',
      ], function(opt) {
        var o = attrs[opt]
        opts[opt] = o && o !== 'false'
      })
*/

      // view -> model
      element.bind('input', function(e) {
        scope.$apply(function() {
          var html, html2, rerender
          html = element.html()
          rerender = false

/*          
          if (opts.stripBr) {
            html = html.replace(/<br>$/, '')
          }
          if (opts.noLineBreaks) {
            html2 = html.replace(/<div>/g, '').replace(/<br>/g, '').replace(/<\/div>/g, '')
            if (html2 !== html) {
              rerender = true
              html = html2
            }
          }
*/
          ngModel.$setViewValue(html)
          if (rerender) {
            ngModel.$render()
          }
          if (html === '') {
            // the cursor disappears if the contents is empty
            // so we need to refocus
            $timeout(function(){
              element[0].blur()
              element[0].focus()
            })
          }
        })
      })

      // model -> view
      var oldRender = ngModel.$render
      ngModel.$render = function() {
        var el, el2, range, sel
        if (!!oldRender) {
          oldRender()
        }
        element.html(ngModel.$viewValue || '')
/* 
        if (opts.moveCaretToEndOnChange) {
          el = element[0]
          range = document.createRange()
          sel = window.getSelection()
          if (el.childNodes.length > 0) {
            el2 = el.childNodes[el.childNodes.length - 1]
            range.setStartAfter(el2)
          } else {
            range.setStartAfter(el)
          }
          range.collapse(true)
          sel.removeAllRanges()
          sel.addRange(range)
        }
*/

      }
/*
      if (opts.selectNonEditable) {
        element.bind('click', function(e) {
          var range, sel, target
          target = e.toElement
          if (target !== this && angular.element(target).attr('contenteditable') === 'false') {
            range = document.createRange()
            sel = window.getSelection()
            range.setStartBefore(target)
            range.setEndAfter(target)
            sel.removeAllRanges()
            sel.addRange(range)
          }
        })
      }
*/
  }
}}]);
