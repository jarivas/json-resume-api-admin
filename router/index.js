import { createRouter, createWebHistory } from 'vue-router';

import LoginView from '../views/LoginView.vue';


import AwardListView from '../views/modules/AwardListView.vue';
import BasicListView from '../views/modules/BasicListView.vue';
import CertificateListView from '../views/modules/CertificateListView.vue';
import EducationListView from '../views/modules/EducationListView.vue';
import InterestListView from '../views/modules/InterestListView.vue';
import LanguageListView from '../views/modules/LanguageListView.vue';
import ProjectListView from '../views/modules/ProjectListView.vue';
import PublicationListView from '../views/modules/PublicationListView.vue';
import ReferenceListView from '../views/modules/ReferenceListView.vue';
import SkillListView from '../views/modules/SkillListView.vue';
import VolunteerListView from '../views/modules/VolunteerListView.vue';
import WorkListView from '../views/modules/WorkListView.vue';
import ChatView from '../views/modules/ChatView.vue';
import ImportView from '../views/modules/ImportView.vue';
import AiRequestListView from '../views/modules/AiRequestListView.vue';
import AgentConversationListView from '../views/modules/AgentConversationListView.vue';

const routes = [
  { path: '/login', name: 'login', component: LoginView },
  { path: '/', redirect: '/awards' },
  { path: '/awards', name: 'awards', component: AwardListView },
  { path: '/basics', name: 'basics', component: BasicListView },
  { path: '/certificates', name: 'certificates', component: CertificateListView },
  { path: '/education', name: 'education', component: EducationListView },
  { path: '/interests', name: 'interests', component: InterestListView },
  { path: '/languages', name: 'languages', component: LanguageListView },
  { path: '/projects', name: 'projects', component: ProjectListView },
  { path: '/publications', name: 'publications', component: PublicationListView },
  { path: '/references', name: 'references', component: ReferenceListView },
  { path: '/skills', name: 'skills', component: SkillListView },
  { path: '/volunteers', name: 'volunteers', component: VolunteerListView },
  { path: '/work', name: 'work', component: WorkListView },
  { path: '/chat', name: 'chat', component: ChatView },
  { path: '/import', name: 'import', component: ImportView },
  { path: '/ai-requests', name: 'aiRequests', component: AiRequestListView },
  { path: '/agent-conversations', name: 'agentConversations', component: AgentConversationListView },
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Protección de rutas: solo /login es pública
import { useAuthStore } from '../stores/auth';
import { useUIStore } from '../stores/ui';

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();
  // Prevent navigation while a long-running import is in progress
  try {
    const ui = useUIStore()
    if (ui && ui.busy) {
      // Inform user and block navigation
      // eslint-disable-next-line no-alert
      alert('Un proceso de importación está en curso. Por favor espere hasta que termine.');
      return next(false)
    }
  } catch (e) {
    // ignore store import errors
  }
  if (to.name !== 'login') {
    if (!auth.token) {
      return next({ name: 'login' });
    }
    // If token is expired or expiring now, attempt a refresh. If refresh fails,
    // logout will have been called and we should redirect to login.
    try {
      if (typeof auth.isTokenExpiringSoon === 'function' && auth.isTokenExpiringSoon(0)) {
        if (typeof auth.refreshToken === 'function') {
          await auth.refreshToken();
        }
      }
    } catch (e) {
      return next({ name: 'login' });
    }
    next();
  } else if (to.name === 'login' && auth.token) {
    next({ name: 'awards' }); // Redirige a una ruta existente
  } else {
    next();
  }
});

export default router;
