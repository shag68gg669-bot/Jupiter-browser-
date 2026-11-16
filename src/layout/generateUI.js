import { layoutData } from './layoutData.js';
import { flowCaseMainTabGenerate } from './flowTabUI/mainTab.js';
import { flowCaseButtonsSectionGenerate } from './flowTabUI/buttonSection.js';
import { flowCaseTabMenuGenerate } from './flowTabUI/tabMenu.js';
import { flowCaseURLBarGenerate } from './flowTabUI/URLbar.js';

export function generateUIElements() {
    switch (layoutData['layoutCase']) {
        case 'flow':
            generateFlowCaseUI();
            break;
        case 'side':
            break;
        default:
            break;
    }
}

function generateFlowCaseUI() {
    flowCaseMainTabGenerate();
    flowCaseButtonsSectionGenerate();
    flowCaseURLBarGenerate();
    flowCaseTabMenuGenerate();

}