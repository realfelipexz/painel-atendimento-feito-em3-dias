

## Refinamento da Tela de Login — Chamador de Senhas

### Contexto
A tela de login ainda não foi implementada (Index.tsx está com placeholder). Este plano cria a tela completa já com todos os refinamentos solicitados.

### Arquivos a criar/modificar

**1. `src/pages/Index.tsx`** — Tela de login completa
- Background cinza claro (`#f0f2f5`)
- Logo centralizado no topo (ícone + texto "Chamador de Senhas")
- Título "ACESSAR O SISTEMA" centralizado
- Card branco com padding 32px, sombra suave
- Campo "Email" com placeholder "Digite seu email"
- Campo "Senha" com placeholder "Digite sua senha" + toggle mostrar/ocultar (Eye/EyeOff do Lucide)
- Borda azul no focus com transição 0.3s
- Espaçamento de 16px entre campos
- Botão "Entrar" azul, altura mínima 48px, hover com escurecimento
- Estado de loading: texto "Entrando...", botão desabilitado, spinner
- Mensagem de erro "Email ou senha inválidos" abaixo dos campos (visível apenas quando erro)
- Texto "Painel de Atendimento" abaixo do botão
- Animação fade-in ao carregar
- Função `handleLogin` placeholder preparada para Supabase, com redirecionamento por role (CHAMADOR → `/chamador`, TRIADOR → `/triagem`, PAINEL → `/painel`)
- Validação: campos vazios não permitidos
- Responsivo: card com max-width ~400px, inputs 100% em mobile

**2. `src/App.tsx`** — Adicionar rotas placeholder
- `/chamador`, `/triagem`, `/painel` com componentes placeholder simples

**3. `tailwind.config.ts`** — Adicionar keyframe `fade-in` para animação suave

**4. `src/index.css`** — Classe de foco customizada com borda azul e transição

### Detalhes técnicos
- Cores: azul principal `#1a4b8c`, background `#f0f2f5`, card branco
- Focus ring: `ring-[#1a4b8c]` com `transition-all duration-300`
- Botão: `min-h-[48px]`, `bg-[#1a4b8c]`, `hover:bg-[#153d73]`
- Loading simulado com `setTimeout` de 2s para demonstração
- Estado de erro controlado por `useState`
- Ícones: `Eye`, `EyeOff`, `Loader2` do lucide-react

