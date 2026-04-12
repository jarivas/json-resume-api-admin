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

const routes = [
  { path: '/login', name: 'login', component: LoginView },
  { path: '/', redirect: '/awards' },
  // { path: '/', name: 'resources', component: ResourceListView }, // Eliminado porque la vista ya no existe
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
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Protección de rutas: solo /login es pública
import { useAuthStore } from '../stores/auth';
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();
  // Prevent navigation while a long-running import is in progress
  try {
    const mod = await import('../stores/ui')
    const ui = mod.useUIStore()
    if (ui && ui.busy) {
      // Inform user and block navigation
      // eslint-disable-next-line no-alert
      alert('Un proceso de importación está en curso. Por favor espere hasta que termine.');
      return next(false)
    }
  } catch (e) {
    // ignore store import errors
  }
  if (to.name !== 'login' && !auth.token) {
    next({ name: 'login' });
  } else if (to.name === 'login' && auth.token) {
    next({ name: 'awards' }); // Redirige a una ruta existente
  } else {
    next();
  }
});

export default router;
