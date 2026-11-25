(function(){
  var EN=document.documentElement.lang==='en';
  var T=EN?{
    site:'P.R.D.S Investigations',
    views:{home:'Private Investigations & Business Intelligence',about:'About the Firm',services:'Services',cases:'Case Studies',contact:'Contact Us',privacy:'Privacy Policy',terms:'Terms of Use',accessibility:'Accessibility Statement'},
    name:'Name',phone:'Phone',email:'Email',msg:'Message',subject:'Website inquiry',
    sending:'Sending…',ok:'Thank you! Your inquiry has been received and we will get back to you shortly.',
    fail:'Sending failed. Please call us on +972-54-397-5210 or write to info@prdsbi.com.'
  }:{
    site:'פרד"ס חקירות',
    views:{home:'חקירות פרטיות ומודיעין עסקי',about:'אודות המשרד',services:'שירותים',cases:'מקרי בוחן',contact:'צור קשר',privacy:'מדיניות פרטיות',terms:'תנאי שימוש',accessibility:'הצהרת נגישות'},
    name:'שם',phone:'טלפון',email:'דוא״ל',msg:'הודעה',subject:'פנייה מהאתר',
    sending:'שולח…',ok:'תודה! הפנייה התקבלה ונחזור אליכם בהקדם.',
    fail:'השליחה לא הצליחה. אפשר להתקשר אלינו למספר ⁦054-397-5210⁩ או לכתוב ל-info@prdsbi.com.'
  };
  var VIEWS=['home','about','services','cases','contact','privacy','terms','accessibility'];
  var menu=document.getElementById('menu'),burger=document.getElementById('burger');
  var switches=document.querySelectorAll('[data-lang-switch]');
  function route(){
    var h=(location.hash||'').replace('#','');
    if(!h){h='home';}
    if(VIEWS.indexOf(h)<0){return;}
    var secs=document.querySelectorAll('[data-view]');
    for(var i=0;i<secs.length;i++){secs[i].hidden=secs[i].getAttribute('data-view')!==h;}
    var links=document.querySelectorAll('[data-nav]');
    for(var j=0;j<links.length;j++){
      if(links[j].getAttribute('data-nav')===h){links[j].setAttribute('aria-current','page');}else{links[j].removeAttribute('aria-current');}
    }
    document.title=(h==='home'?T.site+' — '+T.views.home:T.views[h]+' — '+T.site);
    /* the language switch opens the same page in the other language */
    for(var k=0;k<switches.length;k++){
      switches[k].href=switches[k].getAttribute('data-lang-switch')+(h==='home'?'':'#'+h);
    }
    menu.classList.remove('open');burger.setAttribute('aria-expanded','false');
    window.scrollTo(0,0);
  }
  window.addEventListener('hashchange',route);
  route();
  burger.addEventListener('click',function(){
    var open=menu.classList.toggle('open');
    burger.setAttribute('aria-expanded',open?'true':'false');
  });

  /* forms: sent to info@prdsbi.com through FormSubmit (formsubmit.co) */
  var FORM_URL='https://formsubmit.co/ajax/info@prdsbi.com';
  var forms=document.querySelectorAll('.lead-form');
  Array.prototype.forEach.call(forms,function(form){
    var status=form.querySelector('.form-status'),btn=form.querySelector('button[type=submit]'),label=btn.textContent;
    function show(msg,kind){status.textContent=msg;status.className='form-status '+kind;status.hidden=false;}
    form.addEventListener('submit',function(e){
      e.preventDefault();
      if(!form.reportValidity()){return;}
      var g=function(n){var el=form.querySelector('[name="'+n+'"]');return el?el.value.trim():'';};
      if(g('_honey')){return;}
      var data={};data[T.name]=g('name');data[T.phone]=g('phone');data[T.email]=g('email');data[T.msg]=g('message');
      data._subject=T.subject+' — '+g('name');data._replyto=g('email');data._template='table';data._captcha='false';
      btn.disabled=true;btn.textContent=T.sending;status.hidden=true;
      fetch(FORM_URL,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)})
        .then(function(r){return r.json().then(function(j){if(!r.ok||String(j.success)!=='true'){throw new Error(j.message||r.status);}});})
        .then(function(){form.reset();show(T.ok,'ok');})
        .catch(function(){show(T.fail,'err');})
        .then(function(){btn.disabled=false;btn.textContent=label;});
    });
  });
})();
