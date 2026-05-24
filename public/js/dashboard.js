// public/js/dashboard.js

inicializarAutenticacao();

const usuario = getUsuarioAtual();
if (!usuario) window.location.href = 'login.html';

function logout() {
  localStorage.removeItem('usuario');
  window.location.href = 'login.html';
}

async function fetchComRetry(url, { timeoutMs = 8000, tentativas = 2 } = {}) {
  let ultimoErro;
  for (let i = 0; i < tentativas; i++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const r = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return await r.json();
    } catch (err) {
      clearTimeout(timeoutId);
      ultimoErro = err;
      if (i < tentativas - 1) await new Promise(res => setTimeout(res, 800));
    }
  }
  throw ultimoErro;
}

function atualizarBoasVindas() {
  const msgElement = document.getElementById('msg-tipo');
  let mensagem = '';

  switch (usuario.tipo) {
    case 1:
      mensagem = `Olá, ${usuario.nome}! Você está logado como ALUNO.`;
      break;
    case 2:
      mensagem = `Olá, ${usuario.nome}! Você está logado como FUNCIONÁRIO.`;
      break;
    case 3:
      mensagem = `Olá, ${usuario.nome}! Você está logado como ADMINISTRADOR.`;
      break;
  }

  msgElement.textContent = '';
  msgElement.innerHTML = mensagem;
}

async function carregarEstatisticas() {
  const statsContainer = document.getElementById('stats');
  statsContainer.innerHTML = '<p>Carregando estatísticas…</p>';
  try {
    const stats = await fetchComRetry('/estatisticas');

    let estatisticasHTML = '';
    if (usuario.tipo === 1) {
      estatisticasHTML = `
        <div class="stat-card">
          <h3>Livros Disponíveis</h3>
          <div class="number">${stats.livrosDisponiveis}</div>
        </div>
        <div class="stat-card">
          <h3>Total de Livros</h3>
          <div class="number">${stats.totalLivros}</div>
        </div>
        <div class="stat-card">
          <h3>Alunos Cadastrados</h3>
          <div class="number">${stats.usuariosPorTipo.alunos}</div>
        </div>
      `;
    } else if (usuario.tipo === 2) {
      estatisticasHTML = `
        <div class="stat-card">
          <h3>Arrendamentos Pendentes</h3>
          <div class="number">${stats.arrendamentosPendentes}</div>
        </div>
        <div class="stat-card">
          <h3>Livros Disponíveis</h3>
          <div class="number">${stats.livrosDisponiveis}</div>
        </div>
        <div class="stat-card">
          <h3>Funcionários</h3>
          <div class="number">${stats.usuariosPorTipo.funcionarios}</div>
        </div>
      `;
    } else {
      // ADMIN: mostra totais + quebra por tipo
      estatisticasHTML = `
        <div class="stat-card">
          <h3>Total de Livros</h3>
          <div class="number">${stats.totalLivros}</div>
        </div>
        <div class="stat-card">
          <h3>Total de Usuários</h3>
          <div class="number">${stats.totalUsuarios}</div>
        </div>
        <div class="stat-card">
          <h3>Livros Disponíveis</h3>
          <div class="number">${stats.livrosDisponiveis}</div>
        </div>
        <div class="stat-card">
          <h3>Alunos</h3>
          <div class="number">${stats.usuariosPorTipo.alunos}</div>
        </div>
        <div class="stat-card">
          <h3>Funcionários</h3>
          <div class="number">${stats.usuariosPorTipo.funcionarios}</div>
        </div>
        <div class="stat-card">
          <h3>Administradores</h3>
          <div class="number">${stats.usuariosPorTipo.admins}</div>
        </div>
      `;
    }

    statsContainer.innerHTML = estatisticasHTML;
  } catch (error) {
    console.error('Erro ao carregar estatísticas:', error);
    statsContainer.innerHTML = `
      <p>Não foi possível carregar as estatísticas agora.
        <button onclick="carregarEstatisticas()">Tentar novamente</button>
      </p>`;
  }
}

async function carregarLivrosRecentes() {
  const container = document.getElementById('livros-recentes');
  container.innerHTML = '<p>Carregando livros…</p>';
  try {
    const livros = await fetchComRetry('/livros/disponiveis');
    container.innerHTML = '';

    if (!livros.length) {
      container.innerHTML = '<p>Nenhum livro disponível no momento.</p>';
      return;
    }

    livros.slice(0, 5).forEach(livro => {
      const card = document.createElement('div');
      card.className = 'book-card';
      card.onclick = () => window.location.href = `detalhes.html?id=${livro.id}`;
      card.innerHTML = `
        <img src="${livro.imagemUrl}" alt="${livro.nome}">
        <h3>${livro.nome}</h3>
        <p><strong>Autor:</strong> ${livro.autor}</p>
        <p><strong>Estoque:</strong> ${livro.estoque}</p>
        <p><strong>€ ${livro.preco?.toFixed(2) || '0,00'}</strong></p>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error('Erro ao carregar livros:', error);
    container.innerHTML = `
      <p>Não foi possível carregar os livros agora.
        <button onclick="carregarLivrosRecentes()">Tentar novamente</button>
      </p>`;
  }
}

atualizarBoasVindas();
carregarEstatisticas();
carregarLivrosRecentes();
