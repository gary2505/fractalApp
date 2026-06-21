import './app.css';
import { mount } from 'svelte';
import App from './App.svelte';

const target = document.getElementById('app');

if (!target) {
  throw new Error('fractalApp root element was not found');
}

const app = mount(App, { target });

export default app;
