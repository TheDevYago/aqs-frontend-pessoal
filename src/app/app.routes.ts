import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Layout } from './pages/admin/layout/layout';
import { Dashboard } from './pages/admin/dashboard/dashboard';
import { IesC } from './pages/admin/ies/ies';
import { Escolas } from './pages/admin/escolas/escolas';
import { Professores } from './pages/admin/professores/professores';
import { Cursos } from './pages/admin/cursos/cursos';
import { Matrizes } from './pages/admin/matrizes/matrizes';
import { Disciplinas } from './pages/admin/disciplinas/disciplinas';
import { Relatorios } from './pages/admin/relatorios/relatorios';
import { Fechamento } from './pages/admin/fechamento/fechamento';

// rotas de professor
import { Layout as layoutProfessor } from './pages/professor/layout/layout';
import { Dashboard as dashboardProfessor } from './pages/professor/dashboard/dashboard';
import { Perfil } from './pages/professor/perfil/perfil';
import { Monitores } from './pages/professor/monitores/monitores';
import { Resultados } from './pages/professor/resultados/resultados';
import { Historico } from './pages/professor/historico/historico';

export const routes: Routes = [
    { path: 'login', component: Login },
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    {path: 'admin', component: Layout, children: [
            {path:'', redirectTo: 'dashboard', pathMatch: 'full'},
            {path: 'dashboard', component: Dashboard},
            {path: 'ies', component: IesC},
            {path: 'escolas', component: Escolas},
            {path: 'professores', component: Professores},
            {path: 'cursos', component: Cursos},
            {path: 'matrizes',  component: Matrizes},
            {path: 'disciplinas', component: Disciplinas},
            {path: 'relatorios', component:Relatorios},
            {path: 'fechamento', component:Fechamento}
        ]
    },

    {path: 'professor', component:layoutProfessor, children: [
        {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
        {path: 'dashboard', component: dashboardProfessor},
        {path: 'perfil', component: Perfil},
        {path: 'monitores', component: Monitores},
        {path: 'resultados', component: Resultados},
        {path: 'historico', component: Historico}
    ]

    }
];