import './app.css';
import { mount } from 'svelte';
import App from './App.svelte';
import { applyFontSettings } from './shared/settings/font-settings';

// Apply font defaults early — user overrides are applied later via loadSettings()
applyFontSettings({ theme: 'system', lang: 'en' });

const target = document.getElementById('app');

if (!target) {
  throw new Error('fractalApp root element was not found');
}

const app = mount(App, { target });

export default app;
