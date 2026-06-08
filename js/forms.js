// forms.js — CTA button interactions
(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    // Plan buttons
    document.querySelectorAll('.plan-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var plan = btn.closest('.plan').querySelector('.plan-tier').textContent;
        var subject = encodeURIComponent('Interés en Plan ' + plan + ' - AIXON');
        var body = encodeURIComponent('Hola equipo AIXON,\n\nEstoy interesado en el plan ' + plan + '.\n\nPor favor contáctenme.\n\nGracias.');
        window.location.href = 'mailto:contacto@aixon.co?subject=' + subject + '&body=' + body;
      });
    });

    // CTA main button ripple effect
    document.querySelectorAll('.btn-main, .btn-ghost').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        var rect = btn.getBoundingClientRect();
        var ripple = document.createElement('span');
        ripple.style.cssText = 'position:absolute;border-radius:50%;background:rgba(255,255,255,0.25);transform:scale(0);animation:ripple .6s linear;pointer-events:none;width:100px;height:100px;left:' + (e.clientX - rect.left - 50) + 'px;top:' + (e.clientY - rect.top - 50) + 'px';
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.appendChild(ripple);
        setTimeout(function() { ripple.remove(); }, 700);
      });
    });
  });

  // Add ripple keyframe
  var style = document.createElement('style');
  style.textContent = '@keyframes ripple{to{transform:scale(4);opacity:0}}';
  document.head.appendChild(style);
})();
