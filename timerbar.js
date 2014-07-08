var loadedcolor='blue' ;       // PROGRESS BAR COLOR
var unloadedcolor='lightgrey';     // COLOR OF UNLOADED AREA
var bordercolor='navy';            // COLOR OF THE BORDER
var barheight=30;                  // HEIGHT OF PROGRESS BAR IN PIXELS
var barwidth=400;                  // WIDTH OF THE BAR IN PIXELS
var waitTime=20;                   // NUMBER OF SECONDS FOR PROGRESSBAR
var clickCount = 0;

// THE FUNCTION BELOW CONTAINS THE ACTION(S) TAKEN ONCE BAR REACHES 100%.
// IF NO ACTION IS DESIRED, TAKE EVERYTHING OUT FROM BETWEEN THE CURLY BRACES ({})
// BUT LEAVE THE FUNCTION NAME AND CURLY BRACES IN PLACE.
// PRESENTLY, IT IS SET TO DO NOTHING, BUT CAN BE CHANGED EASILY.
// TO CAUSE A REDIRECT TO ANOTHER PAGE, INSERT THE FOLLOWING LINE:
// window.location="http://redirect_page.html";
// JUST CHANGE THE ACTUAL URL OF COURSE :)

var action=function()
{
    
    if (loaded == 200) {
        alert("Download Complete")    
    } else if(clickCount == 1) {
        alert("HEY! Stop that!");
        progressBarInit();
    } else if (clickCount == 2) {
        openTerminal();
        loaded = 0;
        progressBarInit();
    } else {
        progressBarInit();
    }
}

function openTerminal(){
    el = document.getElementById("terminal");
    el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";

    el2 = document.getElementById("command");
    el2.style.visibility = (el2.style.visibility == "visible") ? "hidden" : "visible";

    document.getElementById('txtBox').focus();
}

function incrementCount() {
    clickCount++;
    alert();
}

//*****************************************************//
//**********  DO NOT EDIT BEYOND THIS POINT  **********//
//*****************************************************//

var ns4=(document.layers)?true:false;
var ie4=(document.all)?true:false;
var blocksize=(barwidth-2)/waitTime/10;
var loaded=0;
var PBouter;
var PBdone;
var PBbckgnd;
var Pid=0;
var txt='';
if(ns4){
txt+='<table border=0 cellpadding=0 cellspacing=0><tr><td>hello world';
txt+='<ilayer name="PBouter" visibility="hide" height="'+barheight+'" width="'+barwidth+'" onmouseup="hidebar()" onclick="clickCount++"><p>hello world</p>';
txt+='<layer width="'+barwidth+'" height="'+barheight+'" bgcolor="'+bordercolor+'" top="0" left="0"><p>hello world</p></layer>';
txt+='<layer width="'+(barwidth-2)+'" height="'+(barheight-2)+'" bgcolor="'+unloadedcolor+'" top="1" left="1"><p>hello world</p></layer>';
txt+='<layer name="PBdone" width="'+(barwidth-2)+'" height="'+(barheight-2)+'" bgcolor="'+loadedcolor+'" top="1" left="1"><p>hello world</p></layer>';
txt+='</ilayer>';
txt+='</td></tr></table>';
}else{
txt+='<div id="PBouter" onmouseup="hidebar()" onclick="clickCount++" style="position:relative; visibility:hidden; background-color:'+bordercolor+'; width:'+barwidth+'px; height:'+barheight+'px;">';
txt+='<div style="position:absolute; top:1px; left:1px; width:'+(barwidth-2)+'px; height:'+(barheight-2)+'px; background-color:'+unloadedcolor+'; font-size:1px;"></div>';
txt+='<div id="PBdone" style="position:absolute; top:1px; left:1px; width:0px; height:'+(barheight-2)+'px; background-color:'+loadedcolor+'; font-size:1px;"></div>';
txt+='</div>';
}

document.write(txt);

function incrCount(){
window.status="Loading...";
loaded++;
if(loaded<0)loaded=0;
if(loaded>=waitTime*10){
clearInterval(Pid);
loaded=waitTime*10;
setTimeout('hidebar()',100);
}
resizeEl(PBdone, 0, blocksize*loaded, barheight-2, 0);
}

function hidebar(){
clearInterval(Pid);
window.status='';
//if(ns4)PBouter.visibility="hide";
//else PBouter.style.visibility="hidden";
action();
}

//THIS FUNCTION BY MIKE HALL OF BRAINJAR.COM
function findlayer(name,doc){
var i,layer;
for(i=0;i<doc.layers.length;i++){
layer=doc.layers[i];
if(layer.name==name)return layer;
if(layer.document.layers.length>0)
if((layer=findlayer(name,layer.document))!=null)
return layer;
}
return null;
}

function progressBarInit(){
PBouter=(ns4)?findlayer('PBouter',document):(ie4)?document.all['PBouter']:document.getElementById('PBouter');
PBdone=(ns4)?PBouter.document.layers['PBdone']:(ie4)?document.all['PBdone']:document.getElementById('PBdone');
resizeEl(PBdone,0,0,barheight-2,0);
if(ns4)PBouter.visibility="show";
else PBouter.style.visibility="visible";
Pid=setInterval('incrCount()',95);
}

function resizeEl(id,t,r,b,l){
if(ns4){
id.clip.left=l;
id.clip.top=t;
id.clip.right=r;
id.clip.bottom=b;
}else id.style.width=r+'px';
}

window.onload=progressBarInit;
