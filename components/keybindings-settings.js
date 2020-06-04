import*as utils from"../modules/utils.js";import*as hotkeys from"../modules/hotkeys.js";import{Component}from"./component.js";import{keybindings,getKeybindings as reloadKeybindings}from"../modules/userSettings.js";import actions from"../modules/userActions.js";import{exportPlainTextFile}from"../modules/exporter.js";class KeybindingsSettings extends Component{constructor(){super(document.getElementById("keybindings")),this.attachListeners()}show(){generateKeybindingsSettings(keybindings,actions),super.show()}attachListeners(){document.getElementById("btn-keymap-reset").addEventListener("click",resetKeymap),document.getElementById("btn-export-keymap").addEventListener("click",exportKeymap),document.getElementById("btn-import-keymap").addEventListener("click",()=>{document.getElementById("hidden-keymapinput").click()}),document.getElementById("hidden-keymapinput").addEventListener("change",getKeymapFile)}}let singleton=new KeybindingsSettings;export default singleton;function generateKeybindingsSettings(e,t){let n=document.getElementById("keybindings-inputs");n.innerHTML="";for(let s in t){let i=document.createElement("label");i.setAttribute("for","set-"+s),i.textContent=t[s].label,n.appendChild(i);let o=document.createElement("input");o.setAttribute("type","text"),o.setAttribute("id","set-"+s),o.classList.add("keybinding-inputbox"),o.setAttribute("readonly",!0),o.value=e[s]||"",o.addEventListener("keydown",e=>{"Tab"!==e.key&&e.preventDefault()}),o.addEventListener("keyup",n=>{registerKeybinding(n,t,s,e)}),n.appendChild(o),n.appendChild(document.createElement("br"))}}function registerKeybinding(e,t,n,s){if("Tab"!==e.key&&(e.preventDefault(),e.keyCode>=65&&e.keyCode<=90||e.keyCode>=48&&e.keyCode<=57||e.keyCode>=96&&e.keyCode<=114||e.keyCode>=116&&e.keyCode<=123||e.keyCode>=186&&e.keyCode<=192||e.keyCode>=219&&e.keyCode<=222||32===e.keyCode||13===e.keyCode)){var i=[];if(e.ctrlKey&&i.push("mod"),e.metaKey&&i.push("mod"),e.shiftKey&&i.push("shift"),e.altKey&&i.push("alt"),e.keyCode>=96&&e.keyCode<=111)i.push(e.code);else switch(e.keyCode){case 13:i.push("enter");break;case 32:i.push("space");break;case 186:i.push(";");break;case 187:i.push("=");break;case 188:i.push(",");break;case 189:i.push("-");break;case 190:i.push(".");break;case 191:i.push("/");break;case 192:i.push("`");break;case 219:i.push("[");break;case 220:i.push("\\");break;case 221:i.push("]");break;case 222:i.push("'");break;default:i.push(e.key.toLowerCase())}i=i.join("+");for(let e in s)if(s[e]===i){s[e]="",document.getElementById("set-"+e).value="",hotkeys.unbindHotkey(i);break}let o=e.target.value;o&&hotkeys.unbindHotkey(o),e.target.value=i,s[n]=i,hotkeys.bindShortcut(i,t[n].handler),e.target.blur(),localStorage.setItem("keymap",JSON.stringify(s))}}function getKeymapFile(e){let t=e.target.files[0];if(!t.name.match(/\.json$/i))return void utils.showWarning(t.name+" is not a json file.");let n=new FileReader;n.onload=function(e){let t=JSON.parse(e.target.result);keybindings=cleanKeymap(t),hotkeys.resetHotkeys(),hotkeys.registerHotkeys(keybindings,actions),generateKeybindingsSettings(keybindings,actions),localStorage.setItem("keymap",JSON.stringify(keybindings))},n.readAsText(t),document.getElementById("hidden-keymapinput").value=""}function cleanKeymap(e){for(let t in e)actions.hasOwnProperty(t)||delete e[t];return e}function resetKeymap(){localStorage.removeItem("keymap"),keybindings=reloadKeybindings(),hotkeys.resetHotkeys(),hotkeys.registerHotkeys(keybindings,actions),generateKeybindingsSettings(keybindings,actions)}function exportKeymap(){exportPlainTextFile(JSON.stringify(keybindings),".json","papereditKeymap")}