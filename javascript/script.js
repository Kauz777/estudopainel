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
// CONFIGURAÇÃO DO LOGIN DE TESTE AUTOMÁTICO
// ==========================================
// Sempre que a página carregar, criamos um usuário padrão de teste caso não exista nenhum
(function criarUsuarioTeste() {
    let comerciosCadastrados = JSON.parse(localStorage.getItem('comercios')) || [];
    
    // Verifica se o e-mail de teste já existe para não duplicar
    const testeExiste = comerciosCadastrados.some(c => c.email === "teste@teste.com");
    
    if (!testeExiste) {
        const usuarioTeste = {
            id: 'id_teste123',
            nome: 'Barbearia Fictícia de Teste',
            email: 'teste@teste.com',
            senha: '123'
        };
        comerciosCadastrados.push(usuarioTeste);
        localStorage.setItem('comercios', JSON.stringify(comerciosCadastrados));
        console.log("👉 Usuário de teste criado! Email: teste@teste.com | Senha: 123");
    }
})();

// ==========================================
// ALTERNÂNCIA DE TELAS (LOGIN / REGISTRO)
// ==========================================
if (toRegisterLink && toLoginLink) {
    toRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    });

    toLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });
}

// ==========================================
// LÓGICA DE REGISTRO REAL (SALVANDO NO LOCALSTORAGE)
// ==========================================
if (formRegister) {
    formRegister.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nomeComercio = document.getElementById('nomeComercio').value.trim();
        const email = document.getElementById('emailRegister').value.trim().toLowerCase();
        const senha = document.getElementById('senhaRegister').value;

        let comerciosCadastrados = JSON.parse(localStorage.getItem('comercios')) || [];

        const emailExiste = comerciosCadastrados.some(c => c.email === email);
        if (emailExiste) {
            alert('Este e-mail já está cadastrado!');
            return;
        }

        const novoComercio = {
            id: 'id_' + Math.random().toString(36).substr(2, 9),
            nome: nomeComercio,
            email: email,
            senha: senha
        };

        comerciosCadastrados.push(novoComercio);
        localStorage.setItem('comercios', JSON.stringify(comerciosCadastrados));
        
        alert(`Comércio "${nomeComercio}" registrado com sucesso!\nAgora você pode fazer login.`);
        
        formRegister.reset();
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });
}

// ==========================================
// LÓGICA DE LOGIN REAL COM REDIRECIONAMENTO SEGURO
// ==========================================
if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('emailLogin').value.trim().toLowerCase();
        const senha = document.getElementById('senhaLogin').value;
        
        let comerciosCadastrados = JSON.parse(localStorage.getItem('comercios')) || [];

        // 1º PASSO: Verificar se o e-mail existe na lista
        const emailExiste = comerciosCadastrados.some(c => c.email === email);

        if (!emailExiste) {
            alert('Erro: Este usuário/comércio não existe! Cadastre-se primeiro.');
            return; 
        }

        // 2º PASSO: Verificar se a senha bate
        const comercioEncontrado = comerciosCadastrados.find(
            c => c.email === email && c.senha === senha
        );
        
        if (comercioEncontrado) {
            // Salva os dados do comércio logado na sessão ativa
            localStorage.setItem('comercioLogado', JSON.stringify(comercioEncontrado));
            
            // AJUSTE SEGURO: Removemos o "./" para o Live Server não se perder com o espaço da pasta
            window.location.href = "dashboard.html";
        } else {
            alert('Senha incorreta! Tente novamente.');
        }
    });
}

// ==========================================
// LÓGICA DO DASHBOARD (CONTROLE DE ACESSO E NOME)
// ==========================================
if (document.getElementById('nomeLoja')) {
    const dadosSessao = localStorage.getItem('comercioLogado');

    if (!dadosSessao) {
        alert('Acesso negado! Faça login primeiro.');
        window.location.href = "./index.html";
    } else {
        const comercio = JSON.parse(dadosSessao);
        document.getElementById('nomeLoja').innerText = comercio.nome;
    }

    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('comercioLogado');
            window.location.href = "./index.html";
        });
    }
}