(function(thisObj) {
//Main Window Group
var UI = new Window("palette", "Nro's [Linear Prop2Prop]", undefined); UI.orientation = "row"; UI.alignChildren = ["fill", "fill"]; UI.spacing = 10; UI.margins = 10;
var UIA = UI.add("panel",undefined,"Menu",{borderStyle:"black"}); UIA.orientation = "column"; UIA.alignChildren = "left"; UIA.spacing = 10; UIA.margins = 10; 
var UIB = UI.add("panel",undefined,"Options",{borderStyle:"black"}); UIB.orientation = "column"; UIB.alignChildren = "left"; UIA.spacing = 10; UIA.margins = 10; UIB.maximumSize = [0,0]; UIB.value = false
//Connect
var tWeld = UIA.add("statictext", undefined, "Instructions:\n 1. Select a property with at least TWO keyframes\n2. Hold Shift and select the controller property\n3. Press Connect", {multiline: true});
var bWeld = UIA.add("button", undefined, "Connect"); bWeld.size = [200,30]; 
bWeld.onClick = function() {app.beginUndoGroup("Connect Properties"); weld(); app.endUndoGroup();}; 
//
//Advanced Options
var bOpt = UIA.add("checkbox", undefined, "Advanced Options"); bOpt.value = false
bOpt.onClick = function() { UIB.visible = bOpt.value; UIB.maximumSize = [500,500]*Number(UIB.visible); UI.layout.layout(true)}
//isVector Option Group
var bIV = UIB.add("checkbox", undefined, "isVector (Separate XY Controller)"); bIV.value = false
var gIV = UIB.add("group"); gIV.orientation = "column"; gIV.alignChildren = "left"; gIV.spacing = 0; gIV.margins = 10; gIV.maximumSize.height = 0; gIV.visible = false; 
var tIV = gIV.add("statictext", undefined,"Instructions:\n>Do the same instructions but select two controllers for X and Y in that order",{multiline: true})
//if Controller is a Vector
var sCV = UIA.add("statictext", undefined,"For controller properties that are Vector type (e.g. Scale, Anchor Point)\n",{multiline: true})
var gCVA = UIA.add("panel",undefined,"Controller (1)",{borderStyle:"black"}); gCVA.orientation = "row"; gCVA.alignChildren = "left"; gCVA.spacing = 20; gCVA.margins = 10;
var bCVAX = gCVA.add("radiobutton",undefined,"Left (X)"); 
var bCVAY = gCVA.add("radiobutton",undefined,"Right (Y)"); bCVAX.value=true
var gCVB = UIA.add("panel",undefined,"Controller (2)",{borderStyle:"black"}); gCVB.orientation = "row"; gCVB.alignChildren = "left"; gCVB.spacing = 20; gCVB.margins = 10; gCVB.visible = false; gCVB.maximumSize.height = 0;
var bCVBX = gCVB.add("radiobutton",undefined,"Left (X)"); 
var bCVBY = gCVB.add("radiobutton",undefined,"Right (Y)"); bCVBX.value=true
bIV.onClick = function(){
    gIV.visible = bIV.value; gIV.maximumSize.height = 150*Number(gIV.visible); 
    gCVB.visible = bIV.value; gCVB.maximumSize.height = 150*Number(gCVB.visible); 
    UI.layout.layout(true)}
//ThisComp Option Group
var bTC = UIB.add("checkbox", undefined, "thisComp (Same Composition Layer)"); bTC.value = true
var gTC = UIB.add("panel",undefined,"",{borderStyle:"black"}); gTC.orientation = "column"; gTC.alignChildren = "left"; gTC.maximumSize.height = 0; gTC.visible = false; gTC.spacing = 0; gTC.margins = 10;
var sTCP = gTC.add("statictext", undefined,"Instructions:\n>Since you can't select two layers of different compositions at once, make a copy of the controller layer of that desired composition here and select the desired property.",{multiline: true})
var eTCP = gTC.add("edittext", undefined, "Composition"); eTCP.text="thisComp"; eTCP.size = [200,20]
bTC.onClick = function(){ gTC.visible = !bTC.value; gTC.maximumSize.height = 150*Number(gTC.visible); UI.layout.layout(true)}
//
//
//
//Functions
function weld() {
    var aI = app.project.activeItem;
    if (!(aI instanceof CompItem)) { alert("Please select a composition.");return;}
    var sP = aI.selectedProperties; var fP = [] //filtered
    for (var i = 0; i < sP.length; i++) {if (sP[i].propertyType === PropertyType.PROPERTY) {fP.push(sP[i]);}} //for puppet pins
    //
    if (fP.length < 2){alert("⚠ ERROR\n\nPlease select at least TWO properties");return}
    var targ = fP[0]; if (targ.numKeys < 2) { alert("Target needs at least 2 keyframes to calculate the offset.");return;}
    var k1 = targ.keyValue(1); var k2 = targ.keyValue(2); var offset = subtractValues(k2, k1); var base = k1;
    var aStr = (offset instanceof Array) ? "[" + offset.join(",") + "]" : offset;
    var bStr = (base instanceof Array) ? "[" + base.join(",") + "]" : base;
    //
    var exps = ""; var form = ""; var compPath = (bTC.value==false && eTCP.text!=="thisComp")? 'comp("'+eTCP.text+'")' : "thisComp"
    if (bIV.value == true)
        if (fP.length !==3){alert("⚠ ERROR\n\nisVector enabled, please select exactly THREE properties.");return;}
        else {
           var cx = fP[1]; var cxL = getLayerParent(cx); var cxP = getPropertyPath(cx);
           var cy = fP[2]; var cyL = getLayerParent(cy); var cyP = getPropertyPath(cy);
           var cz = (base.length > 2) ? ", b[2]" : "";
           var ex = "var cx = " + compPath + '.layer("' + cxL.name + '")' + cxP + ((cx.value instanceof Array) ? "[" + Number(bCVAY.value == true) + "];":";");
           var ey = "var cy = " + compPath + '.layer("' + cyL.name + '")' + cyP + ((cy.value instanceof Array) ? "[" + Number(bCVBY.value == true) + "];":";");
           exps = [ex,ey].join("\n");
           form = "[b[0] + (cx * 0.01 * a[0]), b[1] + (cy * 0.01 * a[1])" + cz + "]";
           alert("Connected: " + targ.name + " <== [" + cxL.name + "," + cyL.name + "]");
        }
    else {
        if (fP.length !== 2) {alert("⚠ ERROR\n\nPlease select exactly TWO properties.");return;}
        else {
            var cn = fP[1]; var cnL = getLayerParent(cn); var cnP = getPropertyPath(cn);
            var cz = (base.length > 2) ? ", b[2]" : "";
            exps = "var c = " + compPath + '.layer("' + cnL.name + '")' + cnP + ((cn.value instanceof Array && !(targ.value instanceof Array)) ? "[" + Number(bCVAY.value == true) + "];":";");

            form =  (cn.value instanceof Array && targ.value instanceof Array) ?"[b[0] + (c[0] * 0.01 * a[0]), b[1] + (c[1] * 0.01 * a[1])" + cz + "]" : "b + (c * 0.01 * a)"
            alert("Connected: " + targ.name + " <== " + cnL.name);
        }
    }
    //
    targ.expression = ["var a = " + aStr + ";","var b = " + bStr + ";",exps, form].join("\n");
    //
    delKeys(targ); 
    //
    
}
//
function getLayerParent(prop) {var curr = prop; while (curr.parentProperty !== null) { curr = curr.parentProperty; } return curr;}
//
function getPropertyPath(prop) {
    var parts = []; var cur = prop;
    while (cur !== null && !(cur.parentProperty instanceof Layer)) {
        parts.push(cur.name);
        if (cur.parentProperty.parentProperty === null) {  // Check if above is Layer
            var topGroupName = "";
            if (cur.matchName === "ADBE Transform Group") { topGroupName = ".transform";} 
            else if (cur.matchName === "ADBE Effect Simple Group") {topGroupName = ".effect";} 
            else {topGroupName = '("' + cur.name + '")';}
            var path = topGroupName; for (var i = parts.length - 2; i >= 0; i--) {path += '("' + parts[i] + '")';}
            return path;
        }
        cur = cur.parentProperty;
    }
    return "";
}
//
function subtractValues(v2, v1) {
    if (typeof v1 == "number") return v2 - v1; //Number
    var res = []; for (var i = 0; i < v1.length; i++) res.push(v2[i] - v1[i]); //Vector Type
    return res;
}
function delKeys(prop) {if (prop.numKeys > 0) {for (var i = prop.numKeys; i > 0; i--) {prop.removeKey(i);}}}
//UI Start
UI.center(); 
UI.show();
})(this);