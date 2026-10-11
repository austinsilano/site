/* Mobile menu — same behaviour as index.html */
(function(){
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  if (!burger || !menu) return;

  function set(open){
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  burger.addEventListener('click', function(e){
    e.stopPropagation();
    set(!menu.classList.contains('open'));
  });
  menu.addEventListener('click', function(e){
    if (e.target.closest && e.target.closest('a')) set(false);
  });
  document.addEventListener('click', function(e){
    if (menu.classList.contains('open') && !menu.contains(e.target) && !burger.contains(e.target)) set(false);
  });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && menu.classList.contains('open')){
      set(false);
      burger.focus();
    }
  });
})();

/* Background video — same cross-fade loop as index.html.
   The clip's last frame does not match its first, so two copies swap
   at the loop point. Nothing is downloaded for reduced-motion or data-saver
   visitors, and the tinted still stays as the backdrop. */
(function(){
  var A = document.getElementById('bgVideoA');
  var B = document.getElementById('bgVideoB');
  if (!A || !B) return;

  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var saver  = navigator.connection && navigator.connection.saveData;
  if (reduce || saver) return;

  var FADE = 0.9, cur = A, nxt = B, swapping = false;

  function play(v){
    var p = v.play();
    if (p && p.catch) p.catch(function(){});
  }

  A.addEventListener('playing', function(){ document.body.classList.add('video-on'); }, { once: true });
  A.preload = 'auto';
  B.preload = 'auto';
  play(A);

  function tick(){
    if (swapping || !cur.duration) return;
    if (cur.duration - cur.currentTime > FADE) return;
    swapping = true;
    var out = cur;
    nxt.currentTime = 0;
    play(nxt);
    nxt.classList.add('is-active');
    out.classList.remove('is-active');
    cur = nxt; nxt = out;
    setTimeout(function(){
      out.pause();
      out.currentTime = 0;
      swapping = false;
    }, FADE * 1000 + 100);
  }
  A.addEventListener('timeupdate', tick);
  B.addEventListener('timeupdate', tick);
})();
