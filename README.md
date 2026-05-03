# ArkFront - Interface do Sistema de Monitoria (AQS)

Este é o repositório de Frontend do projeto AQS, uma plataforma de gestão de monitoria acadêmica desenvolvida em Angular. 
O foco desta aplicação é fornecer uma interface intuitiva, rápida e responsiva para que administradores e professores gerenciem o ecossistema educacional.

> Sobre o Projeto

O Arks Requiem é um sistema back-end projetado para centralizar e modernizar a gestão educacional. A API fornece endpoints protegidos para gerenciar todo o fluxo acadêmico: desde a infraestrutura física (IES e Escolas), estruturação pedagógica (Cursos, Matrizes e Disciplinas), até a alocação de Professores e o controle detalhado de Alunos, Monitorias e emissão de Relatórios (PDF/Excel).

O sistema foi arquitetado para ser consumido por um Front-end em Angular, possuindo configurações nativas de CORS e autenticação via tokens.

> Tecnologias e Ferramentas

* Angular 17+: Framework base utilizando componentes standalone.
* TypeScript: Garantia de tipagem forte em toda a jornada de dados.
* Tailwind CSS: Utilizado para estilização moderna e layout responsivo (classes utilitárias).
* Phosphor Icons: Biblioteca de ícones para ações de interface (editar, inativar, etc.).
* RxJS: Gerenciamento de fluxos de dados e requisições HTTP assíncronas.

> Funcionalidades Em Lista para ser Implementada

* Gestão de Professores: Visualização em lista com paginação visual e controle de status (Ativo/Inativo).
* Editor de Perfil: Interface dedicada para atualização de dados pessoais e upload de foto.
* Histórico Acadêmico: Sistema dinâmico para adicionar e remover formações (Nível, Ano, Instituição e Curso).
* Gestão de Unidades (Escolas): Modais para cadastro e edição de escolas com vínculo direto a coordenadores e IES.
* Feedbacks em Tempo Real: Integração de Toasts para confirmar ações de sucesso ou alertar sobre erros.

> Estrutura do Projeto
- `core/services`: Centralização das chamadas à API Java (utilizando HttpClient e inject).
- `core/models`: Definição de interfaces (Escola, Professor, IES) para padronização de dados.
- `pages/admin`: Módulos administrativos para controle de escolas e professores.
- `pages/professor`: Área logada para gestão do perfil individual do docente.

> Inicialização Local
Para rodar este frontend em sua máquina:

Certifique-se de ter o Node.js e o Angular CLI instalados.

Instale as dependências:

Bash
  ```bash
  npm install
```
  Inicie o servidor de desenvolvimento:

Bash
```bash
ng serve
```
O projeto estará disponível em http://localhost:4200.

##
> Nota: Este repositório deve ser conectado ao backend ArkBack para funcionamento total das funcionalidades de persistência
