# Portfolio Admin Panel Documentation

## Project Overview
This is an admin panel built with Vue.js and Firebase to manage content for a portfolio website. The admin panel provides a secure interface to manage various sections of the portfolio including projects, blog posts, social media links, hero section, and profile information.

## Tech Stack
- **Frontend Framework**: Vue.js 3
- **UI Framework**: Tailwind CSS with DaisyUI
- **Backend/Database**: Firebase (Firestore)
- **Storage**: Firebase Storage
- **Authentication**: Firebase Authentication
- **State Management**: Vuex
- **Routing**: Vue Router

## Dependencies

### Core Dependencies
```json
{
  "@codemirror/lang-markdown": "^6.3.1",
  "@codemirror/theme-one-dark": "^6.1.2",
  "@fortawesome/fontawesome-svg-core": "^6.7.2",
  "@fortawesome/free-solid-svg-icons": "^6.7.2",
  "@fortawesome/vue-fontawesome": "^3.0.8",
  "@vuelidate/core": "^2.0.3",
  "@vuelidate/validators": "^2.0.3",
  "daisyui": "^4.4.19",
  "firebase": "^10.7.1",
  "md-editor-v3": "^5.1.1",
  "slugify": "^1.6.6",
  "vue": "^3.2.13",
  "vue-codemirror": "^6.1.1",
  "vue-router": "^4.0.3",
  "vuex": "^4.0.0"
}
```

### Development Dependencies
```json
{
  "@tailwindcss/typography": "^0.5.10",
  "autoprefixer": "^10.4.16",
  "postcss": "^8.4.32",
  "tailwindcss": "^3.3.6"
}
```

## State Management

The application uses Vuex for state management with the following structure:

### State
```javascript
{
  projects: [],
  blogPosts: [],
  socialMedia: [],
  hero: [],
  profile: [],
  user: null,
  authInitialized: false,
  loading: {
    projects: false,
    blogPosts: false,
    socialMedia: false,
    hero: false,
    profile: false
  },
  error: null
}
```

### Actions
- Projects:
  - `fetchProjects`: Get all projects
  - `addProject`: Create new project
  - `updateProject`: Update existing project
  - `deleteProject`: Remove project

- Blog Posts:
  - `fetchBlogPosts`: Get all blog posts
  - `addBlogPost`: Create new blog post
  - `updateBlogPost`: Update existing post
  - `deleteBlogPost`: Remove blog post

- Social Media:
  - `fetchSocialMedia`: Get all social links
  - `addSocialMedia`: Add new social link
  - `updateSocialMedia`: Update existing link
  - `deleteSocialMedia`: Remove social link

- Hero Section:
  - `fetchHero`: Get hero section data
  - `updateHero`: Update hero section

- Authentication:
  - `initAuth`: Initialize authentication state

### Error Handling
The store implements a global error handling wrapper:
```javascript
async handleAction({ commit }, action) {
  try {
    commit('setError', null);
    return await action();
  } catch (error) {
    commit('setError', error.message);
    throw error;
  }
}
```

## Project Structure

```
src/
├── assets/          # Static assets
├── components/      # Vue components
│   ├── AdminLayout.vue
│   ├── BlogPostsAdmin.vue
│   ├── HeroAdmin.vue
│   ├── ProfileAdmin.vue
│   ├── ProjectsAdmin.vue
│   ├── RichTextEditor.vue
│   └── SocialMediaAdmin.vue
├── router/         # Route configurations
├── store/          # Vuex store modules
├── views/          # Page components
├── firebase.js     # Firebase configuration
└── App.vue         # Root component
```

## Features

### Authentication
- Secure admin login using Firebase Authentication
- Protected routes requiring authentication
- Auto-redirect to login for unauthenticated users

### Dashboard
The main dashboard provides quick access to all manageable sections:
- Projects
- Blog Posts
- Social Media Links
- Hero Section
- Profile Information

### Data Structure

#### Projects Collection
```javascript
{
  id: string,
  title: string,
  description: string,
  image: string,
  tags: array,  // Array of technology tags
  githubUrl: string,
  liveUrl: string,
  order: number
}
```

#### Blog Posts Collection
```javascript
{
  id: string,
  title: string,
  content: string,
  excerpt: string,
  image: string,
  category: string,
  date: timestamp,
  slug: string
}
```

#### Social Media Collection
```javascript
{
  id: string,
  name: string,
  link: string,
  icon: string,
  class: string,  // CSS class for styling
  order: number
}
```

#### Hero Section Document
```javascript
{
  image: string,
  imageAlt: string,
  subtitle: string,
  title: string,
  exploreText: string,
  exploreLink: string,
  contactText: string,
  contactLink: string,
  typedStrings: string  // Comma-separated strings for typing animation
}
```

## Rich Text Editor Integration

The admin panel uses multiple editor-related packages:
- `md-editor-v3`: Main markdown editor component
- `@codemirror/lang-markdown`: Markdown language support
- `@codemirror/theme-one-dark`: Dark theme for editor
- `vue-codemirror`: CodeMirror integration for Vue

## Icon System

Font Awesome is integrated with the following icons:
```javascript
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
```

## UI Components

### DaisyUI Components Used
- Cards for project and blog post displays
- Modals for forms
- Buttons with various styles
- Form inputs and textareas
- Badges for tags and categories
- Toast notifications
- Loading spinners

### Custom Components
- `RichTextEditor.vue`: Markdown editor wrapper
- `AdminLayout.vue`: Main layout with navigation
- Various admin components for each section

## Component Details

### AdminLayout Component
The main layout component that provides the structure for the admin panel:

Features:
- Responsive drawer layout with mobile support
- Top navigation bar with branding
- Sidebar with navigation links
- Profile section in sidebar
- Logout functionality
- Page transitions

```vue
<template>
  <div class="drawer drawer-mobile min-h-screen bg-gray-50">
    <!-- Drawer content -->
    <div class="drawer-content flex flex-col">
      <!-- Navbar with hamburger menu, branding, and logout -->
      <!-- Main content with router view and transitions -->
    </div>
    <!-- Sidebar with profile and navigation -->
  </div>
</template>
```

### RichTextEditor Component
A customized markdown editor component using CodeMirror:

Features:
- Markdown syntax highlighting
- Dark theme (One Dark)
- Auto-indentation
- Tab support
- Real-time preview
- Custom toolbar

```vue
<template>
  <div class="markdown-editor">
    <Codemirror
      v-model="content"
      :style="{ height: '400px' }"
      :autofocus="true"
      :indent-with-tab="true"
      :tab-size="2"
      :extensions="extensions"
      @change="handleChange"
    />
  </div>
</template>
```

Configuration:
```javascript
const extensions = [
  markdown(),
  oneDark
]
```

### Profile Component
Manages user profile information:

Fields:
- Profile Image URL
- Name
- Description

Features:
- Form validation
- Image preview
- Real-time updates
- Vuex integration

```vue
<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold">Profile Admin</h1>
    <form @submit.prevent="handleProfileUpdate">
      <!-- Profile form fields -->
    </form>
  </div>
</template>
```

## Component Interactions

### Data Flow
1. Components dispatch Vuex actions
2. Actions perform Firebase operations
3. Mutations update state
4. Components react to state changes

Example:
```javascript
// In component
async handleProfileUpdate() {
  await this.updateProfile(this.profileData);
  await this.fetchProfile();
}

// In Vuex store
async updateProfile({ dispatch }, profileData) {
  return dispatch('handleAction', async () => {
    await updateDoc(doc(db, 'profile', 'main'), profileData);
  });
}
```

### Navigation System

The admin panel uses Vue Router with nested routes:

```javascript
const routes = [
  {
    path: '/',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '/',
        name: 'dashboard',
        component: DashboardView
      },
      {
        path: '/projects',
        name: 'projects',
        component: ProjectsAdmin
      },
      // ... other routes
    ]
  }
]
```

### Component Features

#### AdminLayout
- Responsive sidebar
- Mobile-friendly navigation
- User profile display
- Authentication status
- Page transitions

#### RichTextEditor
- Markdown support
- Syntax highlighting
- Auto-save functionality
- Custom toolbar
- File uploads

#### Projects Management
- Grid layout
- Image previews
- Drag-and-drop ordering
- Tag management
- Bulk actions

#### Blog Posts
- Rich text editing
- Category management
- Publication status
- SEO optimization
- Media library

#### Social Media
- Icon selection
- Link validation
- Order management
- Preview functionality

#### Hero Section
- Image management
- Text customization
- Button configuration
- Animation settings

## Component Best Practices

1. State Management:
   - Use Vuex for global state
   - Component local state for UI-specific data
   - Computed properties for derived data

2. Performance:
   - Lazy loading of components
   - Debounced input handlers
   - Optimized image loading
   - Cached API responses

3. Error Handling:
   - Form validation
   - API error handling
   - User feedback
   - Error boundaries

4. Accessibility:
   - ARIA labels
   - Keyboard navigation
   - Focus management
   - Screen reader support

5. Responsive Design:
   - Mobile-first approach
   - Flexible layouts
   - Touch-friendly interfaces
   - Adaptive content

## Component Styling

The application uses a combination of Tailwind CSS and DaisyUI:

### Global Styles
```css
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
```

### Theme Configuration
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Custom colors
      }
    }
  },
  plugins: [
    require('daisyui'),
    require('@tailwindcss/typography')
  ]
}
```

### Component-Specific Styles
```css
/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
```

## Authentication Flow

1. Initial Auth Check:
```javascript
const init = async () => {
  const app = createApp(App);
  await store.dispatch('initAuth');
  app.use(store).use(router).mount('#app');
};
```

2. Route Guards:
```javascript
{
  path: '/',
  component: AdminLayout,
  meta: { requiresAuth: true },
  children: [...]
}
```

## Error Handling and Notifications

The application implements a comprehensive error handling system:

1. Global Error State:
- Stored in Vuex
- Accessible throughout the application
- Automatically cleared on new actions

2. Loading States:
- Individual loading states for each section
- Prevents multiple simultaneous operations
- Provides feedback during async operations

3. Toast Notifications:
- Success messages for completed operations
- Error messages for failed operations
- Warning messages for important notices
- Info messages for general updates

## Performance Considerations

1. Image Optimization:
- Recommended image sizes for different sections
- Automatic compression before upload
- Lazy loading for images

2. Data Fetching:
- Efficient Firestore queries with proper indexing
- Pagination where applicable
- Real-time updates only where necessary

3. Code Splitting:
- Route-level code splitting
- Async component loading
- Optimized bundle size

## Security Considerations

1. Authentication:
- Email/password authentication
- Protected routes
- Session management

2. Data Validation:
- Client-side validation using Vuelidate
- Server-side validation through Firestore Rules
- Input sanitization

3. File Upload:
- File type restrictions
- Size limits
- Secure URLs

## Firebase Configuration
The application uses Firebase for backend services. Configuration is managed through environment variables:

```javascript
const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
  measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID
}
```

## Security Rules
Implement these Firestore security rules to protect your data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Image Storage
Images are stored in Firebase Storage with the following structure:
- `/projects/` - Project images
- `/blog/` - Blog post images
- `/profile/` - Profile and avatar images
- `/hero/` - Hero section background image

## Features

### Projects Management
- Add, edit, and delete projects
- Upload project images
- Order projects using drag-and-drop
- Tag projects with technologies
- Set GitHub and live demo URLs

### Blog Posts Management
- Create, edit, and delete blog posts
- Rich text editor for content
- Image upload for post covers
- Category assignment
- Auto-generated SEO-friendly slugs
- Preview functionality

### Social Media Management
- Add and edit social media links
- Customize icons and colors
- Reorder links using up/down buttons
- Preview links before saving

### Hero Section Management
- Update hero section image
- Customize titles and subtitles
- Configure call-to-action buttons
- Set up typing animation strings

## Development Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` file with Firebase credentials:
```
VUE_APP_FIREBASE_API_KEY=your_api_key
VUE_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
VUE_APP_FIREBASE_PROJECT_ID=your_project_id
VUE_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VUE_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VUE_APP_FIREBASE_APP_ID=your_app_id
VUE_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```
4. Run development server: `npm run serve`

## Build and Deploy
1. Build for production: `npm run build`
2. Deploy to hosting: `firebase deploy`

## Best Practices
1. Always use environment variables for sensitive data
2. Implement proper error handling
3. Use loading states for async operations
4. Validate data before saving
5. Keep image sizes optimized
6. Regular backups of Firestore data
7. Monitor Firebase usage and quotas

## Troubleshooting
Common issues and solutions:
1. Authentication errors: Check Firebase console for auth settings
2. Image upload fails: Verify Storage rules and quota
3. Database operations fail: Check Firestore rules and permissions
4. CORS issues: Configure Storage CORS settings properly

## Maintenance
Regular tasks to maintain the admin panel:
1. Update npm packages
2. Monitor Firebase usage
3. Backup database regularly
4. Clean up unused storage files
5. Review security rules
6. Check error logs
7. Update environment variables if needed