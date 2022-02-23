import { createWebHistory, createRouter } from 'vue-router';
import HomeView from '../src/components/Home';
import AdminView from '../src/components/Admin';

const routes = [
    {
        path: '/',
        name: 'HomeView',
        component: HomeView, // 동적 import
    },
    {
        path: '/admin',
        name: 'AdminView',
        component: AdminView, // 동적 import
    },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
    mode: 'history'
});