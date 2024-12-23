import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './index.css'; // Import DaisyUI styles

/* Import Font Awesome */
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { 
  faBold, 
  faItalic, 
  faStrikethrough, 
  faCode, 
  faRotateLeft,
  faParagraph,
  faListUl,
  faListOl,
  faQuoteLeft,
  faImage,
  faLink
} from '@fortawesome/free-solid-svg-icons';

/* Add icons to the library */
library.add(
  faBold, 
  faItalic, 
  faStrikethrough, 
  faCode, 
  faRotateLeft,
  faParagraph,
  faListUl,
  faListOl,
  faQuoteLeft,
  faImage,
  faLink
);

const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon);
app.use(store)
  .use(router)
  .mount('#app');
