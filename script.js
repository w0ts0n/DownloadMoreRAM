/* begin Page */



var artEventHelper = {
  'bind' : function (obj, evt, fn) {
    if (obj.addEventListener)
      obj.addEventListener(evt, fn, false);
    else if (obj.attachEvent)
      obj.attachEvent('on' + evt, fn);
    else
      obj['on' + evt] = fn;
  }
};

var artLoadEvent = (function() {
  var userAgent = navigator.userAgent.toLowerCase();
  var browser = {
    version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
    safari: /webkit/.test(userAgent),
    opera: /opera/.test(userAgent),
    msie: /msie/.test(userAgent) && !/opera/.test(userAgent),
    mozilla: /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent)
  };

  var list = [];

  var done = false;
  var ready = function () {
    if (done) return;
    done = true;
    for (var i = 0; i < list.length; i++)
      list[i]();
  };
  
  if (document.addEventListener && !browser.opera)
    document.addEventListener('DOMContentLoaded', ready, false);
  
  if (browser.msie && window == top) {
    (function () {
      try {
        document.documentElement.doScroll('left');
      } catch (e) {
        setTimeout(arguments.callee, 10);
        return;
      }
      ready();
    })();
  }
  
  if (browser.opera) {
    document.addEventListener('DOMContentLoaded', function () {
      for (var i = 0; i < document.styleSheets.length; i++) {
        if (document.styleSheets[i].disabled) {
          setTimeout(arguments.callee, 10);
          return;
        }
      }
      ready();
    }, false);
  }
  
  if (browser.safari) {
    var numStyles;
    (function(){
      if (document.readyState != 'loaded' && document.readyState != 'complete') {
        setTimeout(arguments.callee, 10);
        return;
      }
      if ('undefined' == typeof numStyles) {
        numStyles = document.getElementsByTagName('style').length;
        var links = document.getElementsByTagName('link');
        for (var i = 0; i < links.length; i++) {
          numStyles += (links[i].getAttribute('rel') == 'stylesheet') ? 1 : 0;
        }
        if (document.styleSheets.length != numStyles) {
          setTimeout(arguments.callee, 0);
          return;
        }
      }
      ready();
    })();
  }

  artEventHelper.bind(window, 'load', ready);

  return ({
    add: function(f) {
      list.push(f);
    }
  })
})();

(function () {
  // fix ie blinking
  var m = document.uniqueID && document.compatMode && !window.XMLHttpRequest && document.execCommand;
  try{ if(!!m) { m("BackgroundImageCache", false, true); } }
  catch(oh){};
})();

function xGetElementsByClassName(clsName, parentEle, tagName) {
  var elements = null;
  var found = [];
  var slash = String.fromCharCode(92);
  var re = new RegExp(slash + "b" + clsName + slash + "b");
  if (!parentEle) parentEle = document;
  if (!tagName) tagName = '*';
  elements = parentEle.getElementsByTagName(tagName);
  if (elements) {
    for (var i = 0; i < elements.length; ++i) {
      if (elements[i].className.search(re) != -1) {
        found[found.length] = elements[i];
      }
    }
  }
  return found;
}

var styleUrlCached = null;
function GetStyleUrl() {
  if (null == styleUrlCached) {
    var ns;
    styleUrlCached = '';
    ns = document.getElementsByTagName('link');
    for (var i = 0; i < ns.length; i++) {
      var l = ns[i];
      if (l.href && /style\.css(\?.*)?$/.test(l.href)){
        return styleUrlCached = l.href.replace(/style\.css(\?.*)?$/,'');
      }
    }
    
    ns = document.getElementsByTagName('style');
    for (var i = 0; i < ns.length; i++) {
      var matches = new RegExp('import\\s+"([^"]+\\/)style\\.css"').exec(ns[i].innerHTML);
      if (null != matches && matches.length > 0)
        return styleUrlCached = matches[1];
    }
  }
  return styleUrlCached;
}


function artButtonSetupJsHover(btn)
{
    artEventHelper.bind(btn, 'mouseover', function() {
        var spans = btn.getElementsByTagName("span");
        if (spans.length > 0)
            spans[0].className += " hover";
    });
    artEventHelper.bind(btn, 'mouseout', function() {
        var spans = btn.getElementsByTagName("span");
        if (spans.length > 0)
            spans[0].className = spans[0].className.replace(/hover/, "").replace(/active/, "");
    });
    artEventHelper.bind(btn, 'mousedown', function() {
        var spans = btn.getElementsByTagName("span");
        if (spans.length > 0)
            spans[0].className += " active";
    });
    artEventHelper.bind(btn, 'mouseup', function() {
        var spans = btn.getElementsByTagName("span");
        if (spans.length > 0)
            spans[0].className = spans[0].className.replace(/active/, "");
    });
}

function artButtonsSetupJsHover() {
  var elements = xGetElementsByClassName("btn", document, "span");
  for (var i = 0; i < elements.length; i++) {
    if (!elements[i].tagName) continue;
    artButtonSetupJsHover(elements[i].parentNode);
  }
}
artLoadEvent.add(artButtonsSetupJsHover);

/* end Page */

/* begin Menu */
function Insert_Separators()
{
  var menus = xGetElementsByClassName("artmenu", document);
  for (var i = 0; i < menus.length; i++) {
    var menu = menus[i];
    var childs = menu.childNodes;
    var listItems = [];
    for (var j = 0; j < childs.length; j++){
      var el = childs[j];
      if (String(el.tagName).toLowerCase() == "li")listItems.push(el);
    }
    for (var j = 0; j < listItems.length - 1; j++){
      var span = document.createElement('span');
      span.className = 'separator';
      var li = document.createElement('li');
      li.appendChild(span);
      listItems[j].parentNode.insertBefore(li, listItems[j].nextSibling);
    }
  }
}
artLoadEvent.add(Insert_Separators);

function Menu_IE6Setup() {
  var isIE6 = navigator.userAgent.toLowerCase().indexOf("msie") != -1 
    && navigator.userAgent.toLowerCase().indexOf("msie 7") == -1;
  if (!isIE6) return;
  var aTmp2, i, j, oLI, aUL, aA;
  var aTmp = xGetElementsByClassName("artmenu", document, "ul");
  for (i=0;i<aTmp.length;i++) {
    aTmp2 = aTmp[i].getElementsByTagName("li");
    for (j=0;j<aTmp2.length;j++) {
      oLI = aTmp2[j];
      aUL = oLI.getElementsByTagName("ul");
      if (aUL && aUL.length) {
        oLI.UL = aUL[0];
        aA = oLI.getElementsByTagName("a");
        if (aA && aA.length)
        	oLI.A = aA[0];
         oLI.onmouseenter = function() {
         	this.className += " artmenuhover";
         	this.UL.className += " artmenuhoverUL";
         	if (this.A) this.A.className += " artmenuhoverA";
         };
        oLI.onmouseleave = function() {
          this.className = this.className.replace(/artmenuhover/,"");
          this.UL.className = this.UL.className.replace(/artmenuhoverUL/,"");
          if (this.A) this.A.className = this.A.className.replace(/artmenuhoverA/, "");
        };
      }
    }
  }
}
artLoadEvent.add(Menu_IE6Setup);
/* end Menu */

 var level = 0;

 var commands = new Array("echo", "cd", "color");
var gameOver = false;
 
 function levelup(){
    var challenge = new Array("ssh root@downloadmoreram.com", "cd /", "ls", "rm -rf ./*", "wget www.reddit.com/hackervirus.tar.gz", "tar cvzf hackervirus.tar.gz", "make install hackervirus", "./hackervirus");
    var output = new Array("Logged in as root", " ", "index.html  README.md  style.css  timerbar.js contact.html  download.html", "Deletd, you heartless bastard", "Saving hackervirus.tar.gz 100%[====================>] 8mb", "hackervirus.tar.gz", "done", "Contratulations, you hacked us!");
    if (level >= (challenge.length) && gameOver == false) {
        alert("Challenge Complete");
        document.getElementById("command").innerHTML = "You hacked " + Math.pow(2, (level+1)) + " RAMs today";
        gameOver = true;
    } else if (loaded == (10 * waitTime) && gameOver == false) {
        alert("Game Over");
        document.getElementById("command").innerHTML = "Game Over: You hacked " + Math.pow(2, (level+1)) + " RAMs today";
        gameOver = true;
    } else if(gameOver == false) {
        level++;
        loaded = 0;
        if (level >= 3) {
            waitTime = 10;
            loadedcolor = "yellow";
            barheight=30; 
            barwidth=400;
        }
        if (level >= 6) {
            loadedcolor = "red";
            waitTime = 5;
            barheight=30; 
            barwidth=400;
        }
        progressBarInit();
        document.getElementById("command").innerHTML = challenge[level];
        return output[level-1];
    }
    return false;
 }

 function execute(arr, myCmd, args) { 
  for(var i=0; i<arr.length; i++) { 
       if (arr[i] == myCmd){ 
            return run(myCmd, args);
            break;
       } else {
            var newCmd = myCmd + " " + args;
            if(newCmd.trim() == document.getElementById("command").innerHTML.trim()) {
                return levelup();
                break;
           } else {
                return false;
                break;
           } 
        }
    } 
 }
 
 function run(obj, args){
  var str;
  switch(obj){
   case "echo":
    str = args;
    break;
   case "color":
    var allowed = Array("0", "1", "2", "3", "4", "5", "6", "7","9", "A",
        "B", "C", "D", "E", "F");
    var bg_color = args.substring(0, 1);
    var font_color = args.substring(2,1);
    document.bgColor = "#" + changeColor(bg_color);
    document.getElementById('bodyID').style.color = "#" + changeColor(font_color);
    document.getElementById("txtBox").style.color = "#" + changeColor(font_color);
    break;
  } 
  return str;
 }
 
 function changeColor(aColor){
  var color = "";
  switch(aColor){
   case "0":
    color = "000000";
    break;
   case "1":
    color = "00008B";
    break;
   case "2":
    color = "008000";
    break;
   case "3":
    color = "00FFFF";
    break;
   case "4":
    color = "FF0000";
    break;
   case "5":
    color = "800080";
    break;
   case "6":
    color = "FFFF00";
    break;
   case "7":
    color = "D3D3D3";
    break;
   case "8":
    color = "808080";
    break;
   case "9":
    color = "0000FF";
    break;
   case "a":
    color = "00FF00";
    break;
   case "b":
    color = "E0FFFF";
    break;
   case "c":
    color = "FF6347";
    break;
   case "d":
    color = "9370D8";
    break;
   case "e":
    color = "F4FA58";
    break;
   case "f":
    color = "FFFFFF";
    break;

  }
  return color;  
 }
 function cmd(){
  var args = "";
  var box = document.getElementById("txtBox");
  var cmdArr = box.value.split(" ");
  var myCmd = cmdArr[0];
  for(var i=1; i<cmdArr.length; i++){
   args += cmdArr[i] + " ";
  } 
  var myEle = document.createElement("span");
  myEle.innerHTML = "$&nbsp;" + htmlspecialchars(box.value) + "<br />";
  
  var runCmd = execute(commands, myCmd, args);
  if(runCmd == false){
   myEle.innerHTML += "\""+htmlspecialchars(box.value)+"\" is not a recognized command<br /><br />";
  }
  else if(runCmd != null){
   myEle.innerHTML += htmlspecialchars(runCmd) + "<br /><br />";
  }
  document.getElementById("txtDiv").appendChild(myEle);
  box.value = "";
 }

 function submitenter(myfield,e){
  var keycode;
  if (window.event) keycode = window.event.keyCode;
  else if (e) keycode = e.which;
  else return true;

  if (keycode == 13){
      cmd();
   return false;
  }
  else
      return true;
 }
 
 function htmlspecialchars(str) {
  if (typeof(str) == "string") {
    str = str.replace(/&/g, "&amp;"); /* must do &amp; first */
    str = str.replace(/"/g, "&quot;");
    str = str.replace(/'/g, "&#039;");
    str = str.replace(/</g, "&lt;");
    str = str.replace(/>/g, "&gt;");
 }
  return str;
  }


