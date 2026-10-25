
import './core css/index.css';
import '/src/themes&configs/default theme/themeUI.css';
import { generateWindowControls } from './generateWinControls';
import { handleUIElements } from './generateUIElements';
import { tabManager } from './tabs.js';


window.addEventListener('DOMContentLoaded', () => {

    generateWindowControls();
    handleUIElements();
});