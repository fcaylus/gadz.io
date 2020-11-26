import './assets/style/index.scss';
import { Engine } from './engine';

const resourcesContainer = document.getElementById('resources-container');
const canvas = document.getElementById('game') as HTMLCanvasElement;
const engine = new Engine(canvas, resourcesContainer);
engine.run();
