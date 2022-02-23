import { createApp } from 'vue'
import App from './App.vue'
import { router } from '../routes/index'; // 라우터 추가하고

const app = createApp(App);

app.use(router);

app.mount('#app')
