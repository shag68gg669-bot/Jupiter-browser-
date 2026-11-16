export let CTRLDown = false 
export let ShiftDown = false
export let EnterDown = false

export function checkForKeyPresses(element = document) {
    element.addEventListener('keydown', (e) => {
        switch (e.key) {
            case "Control": 
                CTRLDown = true; 
                break;
            case "Shift" : 
                ShiftDown = true;
                break;
        }
    })

    element.addEventListener('keyup', (e) => {
        switch (e.key) {
            case "Control": CTRLDown = false; break;
            case "Shift" : ShiftDown = false; break;
        }
    })
}