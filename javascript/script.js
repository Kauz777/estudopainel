// ==========================================
// CONFIGURAÇÃO E INICIALIZAÇÃO DO SUPABASE
// ==========================================
const supabaseUrl = 'https://vajoqkvvujxhcmtkkddv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZham9xa3Z2dWp4aGNtdGtrZGR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MzM4NDIsImV4cCI6MjA5NTQwOTg0Mn0.foBo2c1GPL7jf3SVLjyodyr4ei9qDhU7WSW_G5kMndQ'; 

// Inicializa o cliente usando o objeto global injetado pelo CDN do HTML
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// ==========================================
// SELECIONANDO OS ELEMENTOS DA TELA
// ==========================================
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

const toRegisterLink = document.getElementById('toRegister');
const toLoginLink = document.getElementById('toLogin');

const formLogin = document.getElementById('formLogin');
const formRegister = document.getElementById('formRegister');

// ==========================================
// ALTERNÂNCIA DE TELAS (LOGIN / REGISTRO)
// ==========================================
if (toRegisterLink && toLoginLink) {
    toRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (loginForm) loginForm.classList.add('hidden');
        if (registerForm) registerForm.classList.remove('hidden');
    });

    toLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (registerForm) registerForm.classList.add('hidden');
        if (loginForm) loginForm.classList.remove('hidden');
    });
}

// ==========================================
// LÓGICA DE REGISTRO REAL (SUPABASE AUTH)
// ==========================================
if (formRegister) {
    formRegister.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nomeComercio = document.getElementById('nomeComercio').value.trim();
        const email = document.getElementById('emailRegister').value.trim().toLowerCase();
        const senha = document.getElementById('senhaRegister').value;

        // Cria o usuário na tabela de autenticação criptografada do Supabase
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: senha,
            options: {
                data: {
                    display_name: nomeComercio
                }
            }
        });

        if (error) {
            alert('Erro ao cadastrar: ' + error.message);
            return;
        }

        alert(`Comércio "${nomeComercio}" registrado com sucesso! Redirecionando para o seu painel...`);
        
        // CORREÇÃO: Como a confirmação por e-mail foi desativada, o Supabase loga o usuário automaticamente.
        // Mudamos o fluxo para mandar ele direto para a dashboard, usando caminhos relativos "./" essenciais para o Git.
        window.location.href = "./dashboard.html";
    });
}

// ==========================================
// LÓGICA DE LOGIN REAL COM REDIRECIONAMENTO
// ==========================================
if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('emailLogin').value.trim().toLowerCase();
        const senha = document.getElementById('senhaLogin').value;
        
        // Faz a autenticação direta no banco de dados do Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: senha,
        });
        
        if (error) {
            alert('Erro de autenticação: ' + error.message);
            return;
        }

        // CORREÇÃO: Ajustado caminho para "./dashboard.html" para o GitHub Pages não quebrar as rotas
        window.location.href = "./dashboard.html";
    });
}

// ==========================================
// LÓGICA DO DASHBOARD (CONTROLE DE ACESSO E SESSÃO)
// ==========================================
if (document.getElementById('nomeLoja')) {
    
    // Função assíncrona para validar se quem está tentando acessar a página possui sessão válida
    async function checarSessao() {
        const { data: { user }, error } = await supabase.auth.getUser();

        // CORREÇÃO: Se não houver usuário logado, redireciona usando caminhos relativos para a index
        if (!user || error) {
            alert('Acesso negado! Faça login primeiro.');
            window.location.href = "./index.html";
        } else {
            // Recupera o nome da empresa salvo nos metadados da conta
            const nomeDoComercio = user.user_metadata.display_name || "Minha Empresa";
            document.getElementById('nomeLoja').innerText = nomeDoComercio;
            
            // Ativa a classe que remove o "display: none" definido no HTML para evitar o efeito pisca-tela
            document.documentElement.classList.add('auth-checked');
        }
    }

    // Executa a validação imediatamente ao renderizar o script na página dashboard
    checarSessao();

    // Lógica do botão de deslogar do sistema
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            // Destrói os tokens de autenticação salvos no navegador pelo Supabase
            const { error } = await supabase.auth.signOut();
            
            if (error) {
                alert('Erro ao sair do sistema: ' + error.message);
                return;
            }
            
            // CORREÇÃO: Ajustado caminho de saída para usar caminhos relativos
            window.location.href = "./index.html";
        });
    }
}
