(()=>{"use strict";function e(){return new Promise(((e,t)=>{let n;if("indexedDB"in window){const o=indexedDB.open("budget",1);o.onerror=function(e){t(o.error)},o.onsuccess=function(t){n=o.result,e(n)},o.onupgradeneeded=function(e){const n=o.result;n.onerror=function(e){t(n.error)},n.createObjectStore("transactions",{autoIncrement:!0})}}else t(new Error("IndexedDB is not supported by this browser."))}))}function t(){return new Promise(((t,n)=>{e().then((e=>{if(e){const n=e.transaction(["transactions"],"readonly").objectStore("transactions").getAll();n.onsuccess=function(){t(n.result)}}})).catch((e=>{n(e)}))}))}function n(){t().then((t=>{t.length>0&&function(e){return fetch("/api/transaction/bulk",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)}).then((e=>e.json()))}(t).then((()=>{e().then((e=>{e&&e.transaction(["transactions"],"readwrite").objectStore("transactions").clear()})).catch((e=>{console.log(e)}))}))})).catch((e=>{console.log(e)}))}function o(e){let t=e.reduce(((e,t)=>e+parseInt(t.value)),0);document.querySelector("#total").textContent=t}function r(e){let t=document.querySelector("#tbody");t.innerHTML="",e.forEach((e=>{let n=document.createElement("tr");n.innerHTML=`\n      <td>${e.name}</td>\n      <td>${e.value}</td>\n    `,t.appendChild(n)}))}function a(e,t){let n=e.slice().reverse(),o=0,r=n.map((e=>{let t=new Date(e.date);return`${t.getMonth()+1}/${t.getDate()}/${t.getFullYear()}`})),a=n.map((e=>(o+=parseInt(e.value),o)));t&&t.destroy();let c=document.getElementById("myChart").getContext("2d");t=new Chart(c,{type:"line",data:{labels:r,datasets:[{label:"Total Over Time",fill:!0,backgroundColor:"#6666ff",data:a}]}})}let c,i=[];function s(t){let n=document.querySelector("#t-name"),s=document.querySelector("#t-amount"),u=document.querySelector(".form .error");if(""===n.value||""===s.value)return void(u.textContent="Missing Information");u.textContent="";let l={name:n.value,value:s.value,date:(new Date).toISOString()};t||(l.value*=-1),i.unshift(l),a(i,c),r(i),o(i),function(e){return fetch("/api/transaction",{method:"POST",body:JSON.stringify(e),headers:{Accept:"application/json, text/plain, */*","Content-Type":"application/json"}}).then((e=>e.json()))}(l).then((e=>{e.errors?u.textContent="Missing Information":(n.value="",s.value="")})).catch((t=>{var o;o=l,new Promise(((t,n)=>{e().then((e=>{e&&(e.transaction(["transactions"],"readwrite").objectStore("transactions").add(o),t(o))})).catch((e=>{n(e)}))})),n.value="",s.value=""}))}window.addEventListener("load",(function(){"serviceWorker"in navigator&&navigator.serviceWorker.register("/service-worker.js"),window.addEventListener("online",n),fetch("/api/transaction").then((e=>e.json())).then((e=>{i=e,navigator.onLine?(n(),o(i),r(i),a(i,c)):t().then((e=>{e.length>0&&e.forEach((e=>{i.unshift(e)})),o(i),r(i),a(i,c)}))}))})),document.querySelector("#add-btn").onclick=function(){s(!0)},document.querySelector("#sub-btn").onclick=function(){s(!1)}})();