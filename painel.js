const http = require("http");
const https = require("https");

const porta = process.env.PORT || 3000;
const apiBase = "https://apis.roblox.com";
const templateId = 95206881;
let cookie = (process.env.ROBLOSECURITY || "").trim();

const pagina = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Place Manager Pro v2.3</title>
<style>
:root {
  --bg-main: #0a0c10;
  --bg-card: rgba(22, 27, 34, 0.7);
  --bg-card-hover: rgba(33, 38, 45, 0.85);
  --border: rgba(240, 246, 252, 0.1);
  --border-focus: #58a6ff;
  --accent: #238636;
  --accent-hover: #2ea043;
  --danger: #da3633;
  --danger-hover: #f85149;
  --text-main: #f0f6fc;
  --text-muted: #8b949e;
  --primary: #1f6feb;
  --primary-hover: #388bfd;
}

* { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
body { background: var(--bg-main); color: var(--text-main); min-height: 100vh; padding: 24px 16px 80px; }
main { max-width: 1050px; margin: 0 auto; display: grid; gap: 24px; }

.topo { display: flex; justify-content: space-between; align-items: center; background: var(--bg-card); backdrop-filter: blur(12px); border: 1px solid var(--border); border-radius: 16px; padding: 20px 24px; }
.logo h1 { font-size: 20px; font-weight: 700; background: linear-gradient(90deg, #58a6ff, #bc8cff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.usuario-info { display: flex; align-items: center; gap: 12px; }
.avatar { width: 42px; height: 42px; border-radius: 50%; border: 2px solid var(--border); object-fit: cover; }
.usuario-detalhes { display: flex; flex-direction: column; }
.usuario-nome { font-size: 14px; font-weight: 600; color: var(--text-main); }
.status-badge { font-size: 11px; color: var(--text-muted); }

section { background: var(--bg-card); backdrop-filter: blur(12px); border: 1px solid var(--border); border-radius: 16px; padding: 24px; }
h2 { font-size: 16px; font-weight: 600; margin-bottom: 6px; color: var(--text-main); }
p.sub { font-size: 13px; color: var(--text-muted); margin-bottom: 16px; }

input, select, textarea { width: 100%; background: rgba(1, 4, 9, 0.6); border: 1px solid var(--border); color: var(--text-main); border-radius: 8px; padding: 10px 14px; font-size: 14px; margin-bottom: 12px; transition: border 0.2s; }
input:focus, select:focus, textarea:focus { outline: none; border-color: var(--border-focus); }
textarea { resize: vertical; min-height: 70px; }

button { background: var(--primary); color: #fff; border: none; border-radius: 8px; padding: 10px 16px; font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.2s, transform 0.1s; }
button:hover { background: var(--primary-hover); }
button:active { transform: scale(0.98); }
button.sec { background: transparent; border: 1px solid var(--border); color: var(--text-main); }
button.sec:hover { background: rgba(255,255,255,0.05); }
button.danger { background: var(--danger); }
button.danger:hover { background: var(--danger-hover); }
button:disabled { opacity: 0.5; cursor: not-allowed; }

.tab-btn { background: transparent; border: 1px solid var(--border); color: var(--text-muted); border-radius: 8px; padding: 6px 14px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.tab-btn:hover { border-color: var(--border-focus); color: var(--text-main); }
.tab-btn.ativo { background: var(--primary); border-color: var(--primary-hover); color: #fff; }

.grid-jogos { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; margin-top: 12px; }
.card-jogo { background: rgba(13, 17, 23, 0.8); border: 1px solid var(--border); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 12px; transition: border-color 0.2s; position: relative; }
.card-jogo:hover { border-color: var(--border-focus); }

.card-img-container { position: relative; width: 100%; aspect-ratio: 1; }
.card-img-container img { width: 100%; height: 100%; border-radius: 8px; object-fit: cover; border: 1px solid var(--border); background: #000; }

.btn-arquivar { position: absolute; top: 8px; right: 8px; background: rgba(1, 4, 9, 0.85); backdrop-filter: blur(6px); border: 1px solid var(--border); color: var(--text-main); border-radius: 6px; padding: 4px 8px; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.2s; z-index: 2; }
.btn-arquivar:hover { background: var(--primary); border-color: var(--border-focus); color: #fff; }

.card-jogo-info h3 { font-size: 15px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.card-jogo-info p { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
.card-acoes { display: flex; flex-direction: column; gap: 8px; }
.linha-botoes { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }

.search-bar { margin-bottom: 16px; }

.log-box { display: flex; flex-direction: column; gap: 8px; max-height: 260px; overflow-y: auto; }
.log-item { background: rgba(1, 4, 9, 0.8); border: 1px solid var(--border); border-radius: 8px; padding: 12px; font-size: 12px; }
.log-item.ok { border-left: 3px solid var(--accent); }
.log-item.erro { border-left: 3px solid var(--danger); }
.log-header { display: flex; justify-content: space-between; color: var(--text-muted); margin-bottom: 4px; }
pre { font-family: monospace; white-space: pre-wrap; word-break: break-all; color: var(--text-muted); font-size: 11px; margin-top: 4px; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(4px); display: none; align-items: center; justify-content: center; padding: 20px; z-index: 100; }
.modal-overlay.ativo { display: flex; }
.modal-card { background: #161b22; border: 1px solid var(--border); border-radius: 16px; padding: 24px; max-width: 480px; width: 100%; box-shadow: 0 16px 32px rgba(0,0,0,0.5); }

/* Toast */
#toast-container { position: fixed; bottom: 20px; right: 20px; display: flex; flex-direction: column; gap: 10px; z-index: 1000; }
.toast { background: #161b22; color: #fff; border: 1px solid var(--border); border-radius: 8px; padding: 12px 16px; font-size: 13px; box-shadow: 0 8px 16px rgba(0,0,0,0.4); display: flex; align-items: center; gap: 10px; animation: slideIn 0.2s forwards; }
.toast.sucesso { border-left: 4px solid var(--accent); }
.toast.erro { border-left: 4px solid var(--danger); }
@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
</style>
</head>
<body>
<main>
<div class="topo">
  <div class="logo">
    <h1>Place Manager Pro <span style="font-size:12px; color:var(--primary-hover); font-weight:normal;">v2.3</span></h1>
  </div>
  <div class="usuario-info" id="areaUsuario">
    <div class="usuario-detalhes" style="text-align:right;">
      <span class="usuario-nome">Desconectado</span>
      <span class="status-badge">Aguardando Cookie</span>
    </div>
  </div>
</div>

<section id="blocoLogin">
  <h2>Autenticação Local</h2>
  <p class="sub">Forneça o cookie .ROBLOSECURITY para carregar suas preferências e permissões de gerenciamento.</p>
  <input id="campoCookie" type="password" placeholder="Cole o .ROBLOSECURITY aqui..." autocomplete="off">
  <button id="btnConectar">Conectar ao Roblox</button>
</section>

<div id="painelControlador" style="display:none; display:grid; gap:24px;">
  <section>
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
      <div>
        <h2>Seus Universos</h2>
        <p class="sub" style="margin:0;">Gerencie preferências, configurações do studio, avatares e instâncias.</p>
      </div>
      <button class="sec" id="btnAtualizar">Atualizar Lista</button>
    </div>

    <div style="display:flex; gap:8px; margin-bottom:14px;">
      <button class="tab-btn ativo" id="tabAtivos" onclick="mudarAba('ativos')">Ativos (<span id="cntAtivos">0</span>)</button>
      <button class="tab-btn" id="tabArquivados" onclick="mudarAba('arquivados')">📦 Arquivados (<span id="cntArquivados">0</span>)</button>
    </div>

    <div class="search-bar">
      <input id="campoBusca" type="text" placeholder="🔍 Pesquisar por nome, Universe ID ou Place ID..." style="margin-bottom:0;">
    </div>
    <div class="grid-jogos" id="listaJogos">
      <div style="color:var(--text-muted); text-align:center; grid-column: 1 / -1; padding:20px;">Carregando jogos...</div>
    </div>
  </section>

  <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
    <section>
      <h2>Criar Universe</h2>
      <p class="sub">Cria uma nova experiência definindo o nome desejado.</p>
      <input id="campoNomeExp" type="text" placeholder="Nome da experiência (ex: Meu Jogo Incrível)">
      <button id="btnExp" style="width:100%;">Criar Experience</button>
    </section>

    <section>
      <h2>Criar Place Secundário</h2>
      <p class="sub">Vincula um novo place a um universo existente.</p>
      <input id="campoUniverso" inputmode="numeric" placeholder="Universe ID (ex: 5975960794)">
      <button id="btnPlace" style="width:100%;">Criar Place</button>
    </section>
  </div>

  <section>
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
      <h2>Histórico de Atividades</h2>
      <button class="sec" id="btnLimparLog">Limpar</button>
    </div>
    <div class="log-box" id="logBox">
      <div style="color:var(--text-muted); text-align:center; padding:12px;">Nenhuma operação executada.</div>
    </div>
  </section>

  <button class="danger" id="btnSair" style="width:100%;">Desconectar Sessão</button>
</div>
</main>

<div class="modal-overlay" id="modalConfig">
  <div class="modal-card">
    <h2>Configurações do Jogo</h2>
    <p class="sub">Ajuste os parâmetros do universo no Roblox.</p>
    <input type="hidden" id="cfgUniverseId">
    
    <label style="font-size:12px; color:var(--text-muted);">Nome do Jogo</label>
    <input id="cfgNome" type="text">
    
    <label style="font-size:12px; color:var(--text-muted);">Descrição</label>
    <textarea id="cfgDescricao"></textarea>
    
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
      <div>
        <label style="font-size:12px; color:var(--text-muted);">Tipo de Avatar</label>
        <select id="cfgAvatarType">
          <option value="PlayerChoice">Escolha do Jogador</option>
          <option value="MorphToR6">Forçar R6</option>
          <option value="MorphToR15">Forçar R15</option>
        </select>
      </div>
      <div>
        <label style="font-size:12px; color:var(--text-muted);">Acesso à API no Studio</label>
        <select id="cfgStudioApi">
          <option value="true">Ativado</option>
          <option value="false">Desativado</option>
        </select>
      </div>
    </div>

    <label style="font-size:12px; color:var(--text-muted);">Privacidade</label>
    <select id="cfgFriendsOnly">
      <option value="false">Público (Todos)</option>
      <option value="true">Apenas Amigos</option>
    </select>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:10px;">
      <button class="sec" id="btnFecharConfig">Cancelar</button>
      <button id="btnSalvarConfig">Salvar Alterações</button>
    </div>
  </div>
</div>

<div id="toast-container"></div>

<script>
var logList = [];
var todosJogos = [];
var abaAtual = 'ativos';

function getArquivados() {
  try {
    return JSON.parse(localStorage.getItem("archived_universes") || "[]");
  } catch {
    return [];
  }
}

function setArquivados(lista) {
  localStorage.setItem("archived_universes", JSON.stringify(lista));
}

function alternarArquivo(universeId) {
  var strId = String(universeId);
  var arq = getArquivados();
  var idx = arq.indexOf(strId);

  if (idx > -1) {
    arq.splice(idx, 1);
    toast("Jogo desarquivado com sucesso!");
  } else {
    arq.push(strId);
    toast("Jogo arquivado!");
  }

  setArquivados(arq);
  aplicarFiltroEBusca();
}

function mudarAba(aba) {
  abaAtual = aba;
  document.getElementById("tabAtivos").classList.toggle("ativo", aba === 'ativos');
  document.getElementById("tabArquivados").classList.toggle("ativo", aba === 'arquivados');
  aplicarFiltroEBusca();
}

function toast(msg, tipo = "sucesso") {
  var c = document.getElementById("toast-container");
  var t = document.createElement("div");
  t.className = "toast " + tipo;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

async function api(rota, corpo) {
  var res = await fetch(rota, {
    method: corpo === undefined ? "GET" : "POST",
    headers: {"Content-Type":"application/json"},
    body: corpo === undefined ? undefined : JSON.stringify(corpo)
  });
  return res.json();
}

function renderUsuario(s) {
  var area = document.getElementById("areaUsuario");
  if (s.logado) {
    document.getElementById("blocoLogin").style.display = "none";
    document.getElementById("painelControlador").style.display = "grid";
    area.innerHTML = \`
      <img src="\${s.avatar || 'https://images.rbxcdn.com/393284920677c3a076718d05ddce1033.png'}" class="avatar">
      <div class="usuario-detalhes">
        <span class="usuario-nome">\${s.usuario}</span>
        <span class="status-badge" style="color:#3fb950;">Autenticado</span>
      </div>
    \`;
    carregarJogos();
  } else {
    document.getElementById("blocoLogin").style.display = "block";
    document.getElementById("painelControlador").style.display = "none";
    area.innerHTML = \`
      <div class="usuario-detalhes" style="text-align:right;">
        <span class="usuario-nome">Desconectado</span>
        <span class="status-badge">Aguardando Cookie</span>
      </div>
    \`;
  }
}

async function inicializarSessao() {
  var s = await api("/api/status");
  if (!s.logado) {
    var salvo = localStorage.getItem("roblosecurity_saved");
    if (salvo) {
      s = await api("/api/cookie", { cookie: salvo });
      if (!s.logado) {
        localStorage.removeItem("roblosecurity_saved");
      }
    }
  }
  renderUsuario(s);
}

async function carregarJogos() {
  var grid = document.getElementById("listaJogos");
  grid.innerHTML = '<div style="color:var(--text-muted); text-align:center; grid-column: 1 / -1; padding:20px;">Atualizando catálogo...</div>';
  var r = await api("/api/universes");
  if (!r.ok || !r.data || r.data.length === 0) {
    grid.innerHTML = '<div style="color:var(--text-muted); text-align:center; grid-column: 1 / -1; padding:20px;">Nenhum universo disponível nesta conta.</div>';
    todosJogos = [];
    document.getElementById("cntAtivos").textContent = "0";
    document.getElementById("cntArquivados").textContent = "0";
    return;
  }
  todosJogos = r.data;
  aplicarFiltroEBusca();
}

function aplicarFiltroEBusca() {
  var q = document.getElementById("campoBusca").value.toLowerCase().trim();
  var arqIds = getArquivados();

  var ativos = todosJogos.filter(j => !arqIds.includes(String(j.id)));
  var arquivados = todosJogos.filter(j => arqIds.includes(String(j.id)));

  document.getElementById("cntAtivos").textContent = ativos.length;
  document.getElementById("cntArquivados").textContent = arquivados.length;

  var base = (abaAtual === 'ativos') ? ativos : arquivados;

  var filtrados = base.filter(j => 
    j.name.toLowerCase().includes(q) || 
    String(j.id).includes(q) || 
    String(j.rootPlaceId || '').includes(q)
  );

  renderizarGridJogos(filtrados);
}

function renderizarGridJogos(lista) {
  var grid = document.getElementById("listaJogos");
  grid.innerHTML = "";

  if (lista.length === 0) {
    var msg = abaAtual === 'ativos' ? 'Nenhum jogo ativo encontrado.' : 'Nenhum jogo arquivado.';
    grid.innerHTML = \`<div style="color:var(--text-muted); text-align:center; grid-column: 1 / -1; padding:20px;">\${msg}</div>\`;
    return;
  }

  lista.forEach(j => {
    var card = document.createElement("div");
    card.className = "card-jogo";
    var img = j.iconUrl || "https://images.rbxcdn.com/393284920677c3a076718d05ddce1033.png";
    var isArquivado = abaAtual === 'arquivados';
    var txtBtnArq = isArquivado ? '📤 Desarquivar' : '📦 Arquivar';

    card.innerHTML = \`
      <div class="card-img-container">
        <button class="btn-arquivar" onclick="alternarArquivo('\${j.id}')" title="\${isArquivado ? 'Desarquivar Jogo' : 'Arquivar Jogo'}">\${txtBtnArq}</button>
        <img src="\${img}" onerror="this.src='https://images.rbxcdn.com/393284920677c3a076718d05ddce1033.png'">
      </div>
      <div class="card-jogo-info">
        <h3 title="\${j.name}">\${j.name}</h3>
        <p>Universe ID: \${j.id}</p>
        <p style="font-size:11px; opacity:0.7;">Root Place: \${j.rootPlaceId || 'N/A'}</p>
      </div>
      <div class="card-acoes">
        <button class="sec" onclick="abrirModalConfig('\${j.id}', '\${encodeURIComponent(j.name)}')">Editar Detalhes</button>
        <div class="linha-botoes">
          <button class="sec" onclick="subirIcone('\${j.id}')">Trocar Ícone</button>
          <button class="danger" onclick="reiniciarServidores('\${j.id}', '\${j.rootPlaceId || ''}')">Shutdown</button>
        </div>
      </div>
    \`;
    grid.appendChild(card);
  });
}

document.getElementById("campoBusca").oninput = aplicarFiltroEBusca;

function abrirModalConfig(id, nomeEnc) {
  document.getElementById("cfgUniverseId").value = id;
  document.getElementById("cfgNome").value = decodeURIComponent(nomeEnc);
  document.getElementById("cfgDescricao").value = "";
  document.getElementById("modalConfig").classList.add("ativo");
}

document.getElementById("btnFecharConfig").onclick = () => document.getElementById("modalConfig").classList.remove("ativo");

document.getElementById("btnSalvarConfig").onclick = async () => {
  var id = document.getElementById("cfgUniverseId").value;
  var nome = document.getElementById("cfgNome").value;
  var desc = document.getElementById("cfgDescricao").value;
  var avatar = document.getElementById("cfgAvatarType").value;
  var studioApi = document.getElementById("cfgStudioApi").value === "true";
  var friendsOnly = document.getElementById("cfgFriendsOnly").value === "true";

  var btn = document.getElementById("btnSalvarConfig");
  btn.disabled = true;

  var payload = { 
    universeId: id, 
    name: nome, 
    universeAvatarType: avatar, 
    studioAccessToApisAllowed: studioApi,
    isFriendsOnly: friendsOnly
  };
  if (desc.trim() !== "") payload.description = desc;

  var r = await api("/api/universe/config", payload);
  btn.disabled = false;
  document.getElementById("modalConfig").classList.remove("ativo");

  registrar("Atualizar Configuração", r);
  if (r.ok) {
    toast("Configurações aplicadas!");
    carregarJogos();
  } else {
    toast("Falha ao atualizar parâmetros.", "erro");
  }
};

function subirIcone(universeId) {
  var input = document.createElement("input");
  input.type = "file";
  input.accept = "image/png, image/jpeg";
  input.onchange = async (e) => {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = async (evt) => {
      var base64 = evt.target.result.split(",")[1];
      var r = await api("/api/universe/icon", { universeId, imageBase64: base64, mimeType: file.type || "image/png" });
      registrar("Upload de Ícone", r);
      if (r.ok) {
        toast("Ícone alterado com sucesso!");
        carregarJogos();
      } else {
        toast("Erro ao alterar ícone.", "erro");
      }
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

async function reiniciarServidores(universeId, rootPlaceId) {
  if (!confirm("Encerrar todas as instâncias do universo " + universeId + "?")) return;
  var r = await api("/api/universe/restart", { universeId, rootPlaceId });
  registrar("Shutdown Geral", r);
  if (r.ok) toast("Instâncias encerradas com sucesso!");
  else toast("Erro no shutdown.", "erro");
}

function registrar(titulo, r) {
  logList.unshift({
    titulo: titulo,
    ok: r.ok,
    status: r.status,
    hora: new Date().toLocaleTimeString("pt-BR"),
    detalhe: r.dados ? JSON.stringify(r.dados, null, 2) : (r.texto || r.erro || "")
  });
  desenharLogs();
}

function desenharLogs() {
  var b = document.getElementById("logBox");
  if (logList.length === 0) {
    b.innerHTML = '<div style="color:var(--text-muted); text-align:center; padding:12px;">Nenhuma operação executada.</div>';
    return;
  }
  b.innerHTML = "";
  logList.forEach(l => {
    var item = document.createElement("div");
    item.className = "log-item " + (l.ok ? "ok" : "erro");
    item.innerHTML = \`
      <div class="log-header">
        <strong>\${l.titulo}</strong>
        <span>\${l.hora} · Code \${l.status}</span>
      </div>
      <pre>\${l.detalhe}</pre>
    \`;
    b.appendChild(item);
  });
}

document.getElementById("btnConectar").onclick = async () => {
  var btn = document.getElementById("btnConectar");
  var valCookie = document.getElementById("campoCookie").value.trim();
  btn.disabled = true;
  var r = await api("/api/cookie", { cookie: valCookie });
  document.getElementById("campoCookie").value = "";
  btn.disabled = false;
  if (r.logado) {
    localStorage.setItem("roblosecurity_saved", valCookie);
    toast("Conectado com sucesso!");
  } else {
    toast("Falha ao autenticar cookie.", "erro");
  }
  renderUsuario(r);
};

document.getElementById("btnSair").onclick = async () => {
  localStorage.removeItem("roblosecurity_saved");
  renderUsuario(await api("/api/sair", {}));
  toast("Sessão finalizada.");
};

document.getElementById("btnAtualizar").onclick = carregarJogos;
document.getElementById("btnLimparLog").onclick = () => { logList = []; desenharLogs(); };

document.getElementById("btnExp").onclick = async () => {
  var nome = document.getElementById("campoNomeExp").value.trim();
  var btn = document.getElementById("btnExp");
  btn.disabled = true;
  var r = await api("/api/experience", { name: nome });
  btn.disabled = false;
  document.getElementById("campoNomeExp").value = "";
  registrar("Criar Experience", r);
  if (r.ok) { 
    toast("Nova Experience gerada!"); 
    carregarJogos(); 
  } else { 
    toast("Erro ao criar universo.", "erro"); 
  }
};

document.getElementById("btnPlace").onclick = async () => {
  var id = document.getElementById("campoUniverso").value.trim();
  if (!/^\d+$/.test(id)) return toast("ID do Universo inválido.", "erro");
  var btn = document.getElementById("btnPlace");
  btn.disabled = true;
  var r = await api("/api/place", { universeId: id });
  btn.disabled = false;
  registrar("Criar Place Secundário", r);
  if (r.ok) toast("Place vinculado com sucesso!");
  else toast("Erro ao adicionar place.", "erro");
};

inicializarSessao();
</script>
</body>
</html>`;

function requisicaoRoblox(url, metodo, corpo, tokenExtra) {
    return new Promise((resolve) => {
        const urlObj = new URL(url);
        const dadosCorpo = corpo ? JSON.stringify(corpo) : null;
        
        const cabecalhos = {
            "Cookie": ".ROBLOSECURITY=" + cookie,
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        };
        if (dadosCorpo) cabecalhos["Content-Length"] = Buffer.byteLength(dadosCorpo);
        if (tokenExtra) cabecalhos["X-CSRF-TOKEN"] = tokenExtra;

        const req = https.request({
            hostname: urlObj.hostname,
            path: urlObj.pathname + urlObj.search,
            method: metodo,
            headers: cabecalhos
        }, (res) => {
            let respostaTexto = "";
            res.on("data", pedaco => respostaTexto += pedaco);
            res.on("end", () => {
                let dados = null;
                try { dados = JSON.parse(respostaTexto); } catch {}
                resolve({
                    status: res.statusCode,
                    headers: res.headers,
                    texto: respostaTexto,
                    dados
                });
            });
        });

        req.on("error", (err) => resolve({ status: 0, erro: err.message }));
        if (dadosCorpo) req.write(dadosCorpo);
        req.end();
    });
}

function enviarMultipartRoblox(url, buffer, mimeType, csrfToken) {
    return new Promise((resolve) => {
        const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
        const filename = 'icon.' + (mimeType.includes('jpeg') || mimeType.includes('jpg') ? 'jpg' : 'png');
        
        let headerPart = Buffer.from(
            `--${boundary}\r\n` +
            `Content-Disposition: form-data; name="image"; filename="${filename}"\r\n` +
            `Content-Type: ${mimeType}\r\n\r\n`
        );
        let footerPart = Buffer.from(`\r\n--${boundary}--\r\n`);
        let totalLength = headerPart.length + buffer.length + footerPart.length;

        const urlObj = new URL(url);
        const cabecalhos = {
            "Cookie": ".ROBLOSECURITY=" + cookie,
            "Content-Type": `multipart/form-data; boundary=${boundary}`,
            "Content-Length": totalLength,
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        };
        if (csrfToken) cabecalhos["X-CSRF-TOKEN"] = csrfToken;

        const req = https.request({
            hostname: urlObj.hostname,
            path: urlObj.pathname + urlObj.search,
            method: 'POST',
            headers: cabecalhos
        }, (res) => {
            let respostaTexto = "";
            res.on("data", pedaco => respostaTexto += pedaco);
            res.on("end", () => {
                let dados = null;
                try { dados = JSON.parse(respostaTexto); } catch {}
                resolve({
                    status: res.statusCode,
                    headers: res.headers,
                    texto: respostaTexto,
                    dados
                });
            });
        });

        req.on("error", (err) => resolve({ status: 0, erro: err.message }));
        req.write(headerPart);
        req.write(buffer);
        req.write(footerPart);
        req.end();
    });
}

async function postarComCsrf(url, corpo, metodo = "POST") {
    let res = await requisicaoRoblox(url, metodo, corpo);
    const token = res.headers["x-csrf-token"];
    if (res.status === 403 && token) {
        res = await requisicaoRoblox(url, metodo, corpo, token);
    }
    return {
        ok: res.status >= 200 && res.status < 300,
        status: res.status,
        texto: res.texto,
        dados: res.dados
    };
}

async function postarMultipartComCsrf(url, buffer, mimeType) {
    let res = await enviarMultipartRoblox(url, buffer, mimeType);
    const token = res.headers["x-csrf-token"];
    if (res.status === 403 && token) {
        res = await enviarMultipartRoblox(url, buffer, mimeType, token);
    }
    return {
        ok: res.status >= 200 && res.status < 300,
        status: res.status,
        texto: res.texto,
        dados: res.dados
    };
}

async function verificarLogin() {
    if (!cookie) return { logado: false };
    try {
        const resUser = await requisicaoRoblox("https://users.roblox.com/v1/users/authenticated", "GET");
        if (resUser.status !== 200 || !resUser.dados) return { logado: false };
        
        const userId = resUser.dados.id;
        const nome = resUser.dados.name;

        const resAvatar = await requisicaoRoblox(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=true`, "GET");
        let avatarUrl = "";
        if (resAvatar.status === 200 && resAvatar.dados && resAvatar.dados.data && resAvatar.dados.data.length > 0) {
            avatarUrl = resAvatar.dados.data[0].imageUrl;
        }

        return { logado: true, usuario: nome, id: userId, avatar: avatarUrl };
    } catch {
        return { logado: false };
    }
}

function lerCorpo(req) {
    return new Promise(resolve => {
        let bruto = "";
        req.on("data", pedaco => {
            bruto += pedaco;
            if (bruto.length > 10000000) req.destroy();
        });
        req.on("end", () => {
            try { resolve(JSON.parse(bruto || "{}")); } catch { resolve({}); }
        });
    });
}

function responder(res, codigo, conteudo, tipo) {
    res.writeHead(codigo, { "Content-Type": tipo || "application/json; charset=utf-8" });
    res.end(typeof conteudo === "string" ? conteudo : JSON.stringify(conteudo));
}

function origemSegura(req) {
    const host = (req.headers.host || "").split(":")[0];
    return host === "localhost" || host === "127.0.0.1";
}

const servidor = http.createServer(async (req, res) => {
    if (!origemSegura(req)) return responder(res, 403, { erro: "origem bloqueada" });

    const rota = req.url.split("?")[0];

    if (req.method === "GET" && rota === "/") {
        return responder(res, 200, pagina, "text/html; charset=utf-8");
    }

    if (req.method === "GET" && rota === "/api/status") {
        return responder(res, 200, await verificarLogin());
    }

    if (req.method === "GET" && rota === "/api/universes") {
        if (!cookie) return responder(res, 200, { ok: false, data: [] });
        
        const r = await requisicaoRoblox("https://develop.roblox.com/v1/user/universes?limit=50&sortOrder=Asc", "GET");
        if (r.status !== 200 || !r.dados || !r.dados.data) {
            return responder(res, 200, { ok: false, data: [] });
        }

        const universes = r.dados.data;
        const universeIds = universes.map(u => u.id).join(",");
        let iconsMap = {};

        if (universeIds) {
            const resIcons = await requisicaoRoblox(`https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeIds}&size=150x150&format=Png&isCircular=false`, "GET");
            if (resIcons.status === 200 && resIcons.dados && resIcons.dados.data) {
                resIcons.dados.data.forEach(item => {
                    iconsMap[item.targetId] = item.imageUrl;
                });
            }
        }

        const dataComIcones = universes.map(u => ({
            ...u,
            iconUrl: iconsMap[u.id] || ""
        }));

        return responder(res, 200, { ok: true, data: dataComIcones });
    }

    if (req.method !== "POST") return responder(res, 404, { erro: "não encontrado" });

    const corpo = await lerCorpo(req);

    if (rota === "/api/cookie") {
        const novo = String(corpo.cookie || "").trim().replace(/^["']|["']$/g, "");
        if (!novo) return responder(res, 200, { logado: false, erro: "Cookie vazio." });

        const antigo = cookie;
        cookie = novo;
        const estado = await verificarLogin();

        if (!estado.logado) {
            cookie = antigo;
            return responder(res, 200, { logado: false, erro: "Cookie inválido ou expirado." });
        }
        return responder(res, 200, estado);
    }

    if (rota === "/api/sair") {
        cookie = "";
        return responder(res, 200, { logado: false });
    }

    if (!cookie) return responder(res, 200, { ok: false, status: 401, texto: "Conecte a conta primeiro." });

    try {
        if (rota === "/api/experience") {
            const r = await postarComCsrf(apiBase + "/universes/v1/universes/create", { templatePlaceId: templateId });
            
            const novoId = r.dados && (r.dados.universeId || r.dados.UniverseId);
            if (r.ok && novoId && corpo.name && String(corpo.name).trim() !== "") {
                const nomeDesejado = String(corpo.name).trim();
                await postarComCsrf(`https://develop.roblox.com/v2/universes/${novoId}/configuration`, { name: nomeDesejado }, "PATCH");
            }

            return responder(res, 200, r);
        }

        if (rota === "/api/place") {
            const universo = String(corpo.universeId || "");
            if (!/^\d+$/.test(universo)) {
                return responder(res, 200, { ok: false, status: 400, texto: "Universe ID inválido." });
            }
            const r = await postarComCsrf(apiBase + "/universes/v1/user/universes/" + universo + "/places", { templatePlaceId: templateId });
            return responder(res, 200, r);
        }

        if (rota === "/api/universe/config") {
            const universo = String(corpo.universeId || "");
            if (!universo) return responder(res, 200, { ok: false, status: 400, texto: "Universe ID obrigatório." });

            const payloadConfig = {};
            if (corpo.name !== undefined) payloadConfig.name = corpo.name;
            if (corpo.description !== undefined) payloadConfig.description = corpo.description;
            if (corpo.universeAvatarType !== undefined) payloadConfig.universeAvatarType = corpo.universeAvatarType;
            if (corpo.studioAccessToApisAllowed !== undefined) payloadConfig.studioAccessToApisAllowed = corpo.studioAccessToApisAllowed;
            if (corpo.isFriendsOnly !== undefined) payloadConfig.isFriendsOnly = corpo.isFriendsOnly;

            const r = await postarComCsrf(`https://develop.roblox.com/v2/universes/${universo}/configuration`, payloadConfig, "PATCH");
            return responder(res, 200, r);
        }

        if (rota === "/api/universe/restart") {
            const universo = String(corpo.universeId || "");
            let placeId = String(corpo.rootPlaceId || "");

            if (!placeId && universo) {
                const infoUni = await requisicaoRoblox(`https://develop.roblox.com/v1/universes/${universo}`, "GET");
                if (infoUni.status === 200 && infoUni.dados && infoUni.dados.rootPlaceId) {
                    placeId = infoUni.dados.rootPlaceId;
                }
            }

            if (!placeId) {
                return responder(res, 200, { ok: false, status: 400, texto: "Root Place ID não encontrado para este Universo." });
            }

            const r = await postarComCsrf(`https://games.roblox.com/v1/games/${placeId}/shutdown-all-instances`, {}, "POST");
            return responder(res, 200, r);
        }

        if (rota === "/api/universe/icon") {
            const universo = String(corpo.universeId || "");
            const base64 = String(corpo.imageBase64 || "");
            const mimeType = String(corpo.mimeType || "image/png");
            if (!universo || !base64) return responder(res, 200, { ok: false, status: 400, texto: "Imagem ou universo inválido." });

            const buffer = Buffer.from(base64, "base64");
            const r = await postarMultipartComCsrf(`https://publish.roblox.com/v1/games/${universo}/icon`, buffer, mimeType);
            return responder(res, 200, r);
        }
    } catch (erro) {
        return responder(res, 200, { ok: false, status: 0, erro: erro.message });
    }

    responder(res, 404, { erro: "não encontrado" });
});

servidor.listen(porta, "127.0.0.1", () => {
    console.log("Place Manager Pro v2.3 rodando em http://localhost:" + porta);
});
