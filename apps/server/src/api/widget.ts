import { Hono } from 'hono';

export const widgetRoutes = new Hono();

// Serve the embeddable chat widget JS
widgetRoutes.get('/omona-widget.js', (c) => {
  const script = `
(function() {
  if (window.__omonaLoaded) return;
  window.__omonaLoaded = true;

  var orgId = document.currentScript?.getAttribute('data-org-id') || '';
  var color = document.currentScript?.getAttribute('data-color') || '#25D366';
  var title = document.currentScript?.getAttribute('data-title') || 'Chat con nosotros';
  var serverUrl = document.currentScript?.src.replace('/widget/omona-widget.js', '');

  var style = document.createElement('style');
  style.textContent = \`
    #omona-widget-btn { position:fixed; bottom:20px; right:20px; z-index:9999; width:60px; height:60px; border-radius:50%; border:none; cursor:pointer; box-shadow:0 4px 12px rgba(0,0,0,.15); display:flex; align-items:center; justify-content:center; transition:transform .2s; background:\${color}; }
    #omona-widget-btn:hover { transform:scale(1.1); }
    #omona-widget-btn svg { width:28px; height:28px; fill:white; }
    #omona-widget-frame { position:fixed; bottom:90px; right:20px; z-index:9998; width:380px; height:520px; max-width:calc(100vw - 40px); max-height:calc(100vh - 120px); border-radius:16px; overflow:hidden; box-shadow:0 8px 32px rgba(0,0,0,.2); display:none; background:white; border:1px solid #e0e0e0; }
    #omona-widget-frame.open { display:block; animation:omona-slide .3s ease; }
    @keyframes omona-slide { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    #omona-widget-header { background:\${color}; color:white; padding:14px 16px; display:flex; align-items:center; gap:10px; }
    #omona-widget-header span { font:600 15px/1.2 -apple-system,BlinkMacSystemFont,sans-serif; }
    #omona-widget-close { background:none; border:none; color:white; font-size:20px; cursor:pointer; margin-left:auto; padding:0 4px; }
    #omona-widget-messages { height:calc(100% - 120px); overflow-y:auto; padding:12px; display:flex; flex-direction:column; gap:8px; }
    .omona-msg { max-width:80%; padding:10px 14px; border-radius:12px; font:14px/1.4 -apple-system,BlinkMacSystemFont,sans-serif; word-wrap:break-word; }
    .omona-msg.bot { background:#f0f0f0; color:#111; align-self:flex-start; border-bottom-left-radius:4px; }
    .omona-msg.user { background:\${color}; color:white; align-self:flex-end; border-bottom-right-radius:4px; }
    .omona-msg.typing { background:#f0f0f0; align-self:flex-start; border-bottom-left-radius:4px; }
    .omona-dots { display:flex; gap:4px; padding:4px 0; }
    .omona-dots span { width:6px; height:6px; background:#999; border-radius:50%; animation:omona-bounce .6s infinite alternate; }
    .omona-dots span:nth-child(2) { animation-delay:.2s; }
    .omona-dots span:nth-child(3) { animation-delay:.4s; }
    @keyframes omona-bounce { to{opacity:.3;transform:translateY(-4px)} }
    #omona-widget-input { display:flex; gap:8px; padding:10px 12px; border-top:1px solid #e0e0e0; background:white; }
    #omona-widget-input input { flex:1; border:1px solid #ddd; border-radius:20px; padding:8px 16px; font:14px -apple-system,BlinkMacSystemFont,sans-serif; outline:none; }
    #omona-widget-input input:focus { border-color:\${color}; }
    #omona-widget-input button { background:\${color}; border:none; border-radius:50%; width:36px; height:36px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
    #omona-widget-input button svg { width:16px; height:16px; fill:white; }
  \`;
  document.head.appendChild(style);

  // Button
  var btn = document.createElement('button');
  btn.id = 'omona-widget-btn';
  btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/></svg>';
  document.body.appendChild(btn);

  // Frame
  var frame = document.createElement('div');
  frame.id = 'omona-widget-frame';
  frame.innerHTML = \`
    <div id="omona-widget-header">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="10"/><text x="12" y="16" text-anchor="middle" fill="\${color}" font-weight="bold" font-size="12">L</text></svg>
      <span>\${title}</span>
      <button id="omona-widget-close">&times;</button>
    </div>
    <div id="omona-widget-messages"></div>
    <div id="omona-widget-input">
      <input type="text" placeholder="Escribe un mensaje..." />
      <button><svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button>
    </div>
  \`;
  document.body.appendChild(frame);

  var msgs = frame.querySelector('#omona-widget-messages');
  var input = frame.querySelector('#omona-widget-input input');
  var sendBtn = frame.querySelector('#omona-widget-input button');
  var convId = null;

  function addMsg(text, type) {
    var el = document.createElement('div');
    el.className = 'omona-msg ' + type;
    el.textContent = text;
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
    return el;
  }

  function showTyping() {
    var el = document.createElement('div');
    el.className = 'omona-msg typing';
    el.id = 'omona-typing';
    el.innerHTML = '<div class="omona-dots"><span></span><span></span><span></span></div>';
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function hideTyping() {
    var t = document.getElementById('omona-typing');
    if (t) t.remove();
  }

  async function send(text) {
    if (!text.trim()) return;
    addMsg(text, 'user');
    input.value = '';
    showTyping();
    try {
      var res = await fetch(serverUrl + '/api/test/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, conversation_id: convId })
      });
      var data = await res.json();
      hideTyping();
      convId = data.conversation_id;
      addMsg(data.reply, 'bot');
    } catch(e) {
      hideTyping();
      addMsg('Error al conectar. Intenta de nuevo.', 'bot');
    }
  }

  // Welcome
  btn.onclick = function() {
    frame.classList.toggle('open');
    if (frame.classList.contains('open') && !msgs.children.length) {
      addMsg('¡Hola! 👋 ¿En qué puedo ayudarte?', 'bot');
    }
  };
  frame.querySelector('#omona-widget-close').onclick = function() { frame.classList.remove('open'); };
  sendBtn.onclick = function() { send(input.value); };
  input.onkeydown = function(e) { if (e.key === 'Enter') send(input.value); };
})();
`;

  return new Response(script, {
    headers: {
      'Content-Type': 'application/javascript',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600',
    },
  });
});
