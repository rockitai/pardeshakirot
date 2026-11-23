(function(){
  var EN=document.documentElement.lang==='en';
  var T=EN?{
    site:'Pardes Investigations',
    views:{home:'Private Investigations & Business Intelligence',about:'About the Firm',services:'Services',cases:'Case Studies',contact:'Contact Us',privacy:'Privacy Policy',terms:'Terms of Use',accessibility:'Accessibility Statement'},
    name:'Name',phone:'Phone',email:'Email',subject:'Website inquiry',
    note:'Your message has not been sent yet. Open it in your email app, or copy it and send it to info@prdsbi.com.',
    copied:'Copied'
  }:{
    site:'פרד"ס חקירות',
    views:{home:'חקירות פרטיות ומודיעין עסקי',about:'אודות המשרד',services:'שירותים',cases:'מקרי בוחן',contact:'צור קשר',privacy:'מדיניות פרטיות',terms:'תנאי שימוש',accessibility:'הצהרת נגישות'},
    name:'שם',phone:'טלפון',email:'דוא״ל',subject:'פנייה מהאתר',
    note:'ההודעה עדיין לא נשלחה. פתחו אותה במייל, או העתיקו ושלחו אל info@prdsbi.com.',
    copied:'הועתק'
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

  /* forms */
  var forms=document.querySelectorAll('.lead-form');
  Array.prototype.forEach.call(forms,function(form){
    var sent=form.querySelector('.sent'),txt=form.querySelector('.sent-text'),copyBtn=form.querySelector('.sent-copy');
    form.addEventListener('submit',function(e){
      e.preventDefault();
      if(!form.reportValidity()){return;}
      var g=function(n){var el=form.querySelector('[name="'+n+'"]');return el?el.value.trim():'';};
      var body=T.name+': '+g('name')+'\n'+T.phone+': '+g('phone')+'\n'+T.email+': '+g('email')+(g('message')?'\n\n'+g('message'):'');
      txt.value=body;
      form.querySelector('.sent-note').textContent=T.note;
      form.querySelector('.sent-mail').href='mailto:info@prdsbi.com?subject='+encodeURIComponent(T.subject)+'&body='+encodeURIComponent(body);
      sent.hidden=false;
    });
    copyBtn.addEventListener('click',function(){
      var done=function(){copyBtn.textContent=T.copied;};
      var fb=function(){txt.focus();txt.select();};
      try{navigator.clipboard.writeText(txt.value).then(done,fb);}catch(err){fb();}
    });
  });
})();
