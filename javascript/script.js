// ==========================================
// CONFIGURAÇÃO E INICIALIZAÇÃO DO SUPABASE
// ==========================================
const supabaseUrl = 'https://vajoqkvvujxhcmtkkddv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZham9xa3Z2dWp4aGNtdGtrZGR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MzM4NDIsImV4cCI6MjA5NTQwOTg0Mn0.foBo2c1GPL7jf3SVLjyodyr4ei9qDhU7WSW_G5kMndQ'; 

// CORREÇÃO: Alterado de 'supabase' para 'supabaseClient' para não dar conflito global
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

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

        // Usando o cliente corrigido aqui
        const { data, error } = await supabaseClient.auth.signUp({
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
        
        // Usando o cliente corrigido aqui
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: senha,
        });
        
        if (error) {
            alert('Erro de autenticação: ' + error.message);
            return;
        }

        window.location.href = "./dashboard.html";
    });
}

// ==========================================
// LÓGICA DO DASHBOARD (CONTROLE DE ACESSO E SESSÃO)
// ==========================================
if (document.getElementById('nomeLoja')) {
    
    async function checarSessao() {
        // Usando o cliente corrigido aqui
        const { data: { user }, error } = await supabaseClient.auth.getUser();

        if (!user || error) {
            alert('Acesso negado! Faça login primeiro.');
            window.location.href = "./index.html";
        } else {
            const nomeDoComercio = user.user_metadata.display_name || "Minha Empresa";
            document.getElementById('nomeLoja').innerText = nomeDoComercio;
            document.documentElement.classList.add('auth-checked');
        }
    }

    checarSessao();

    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            // Usando o cliente corrigido aqui
            const { error } = await supabaseClient.auth.signOut();
            
            if (error) {
                alert('Erro ao sair do sistema: ' + error.message);
                return;
            }
            
            window.location.href = "./index.html";
        });
    }
}
