class Overlay extends HTMLElement {

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        const style = document.createElement('style');
        style.textContent = `
            .leftOverlay:hover {
                text-shadow: 2px 2px 0 white,
                            -2px -2px 0 white,
                            2px -2px 0 white,
                            -2px 2px 0 white;
            }
            .rightOverlay:hover {
                text-shadow: 2px 2px 0 red,
                            -2px -2px 0 red,
                            2px -2px 0 red,
                            -2px 2px 0 red;
            }
        `;

        this.overlay = document.createElement('div');
        Object.assign(this.overlay.style, {
            position: 'absolute',
            display: 'flex',
            bottom: '0',
            width: '100%',
            height: '101%',
            zIndex: '3',
            fontSize: '200px',
            textAlign: 'center'
        });

        this.sideOverlay = document.createElement('div');
        Object.assign(this.sideOverlay.style, {
            width: '50%',
            height: '100%',
            display: 'flex',
            position: 'absolute'
        });

        this.leftOverlay = document.createElement('div');
        this.leftOverlay.classList.add('leftOverlay');
        Object.assign(this.leftOverlay.style, {
            width: '50%',
            height: '100%',
            color: 'green',
            right: '0'
        });

        this.rightOverlay = document.createElement('div');
        this.rightOverlay.classList.add('rightOverlay');
        Object.assign(this.rightOverlay.style, {
            width: '50%',
            height: '100%',
            left: '0'
        });

        this.sideOverlay.append(this.leftOverlay, this.rightOverlay);
        this.overlay.appendChild(this.sideOverlay);
        shadow.append(style, this.overlay);
    }

    show() {
        this.overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    }

    hide() {
        this.overlay.style.backgroundColor = "rgba(0, 0, 0, 0)";
    }

    showChoice() {
        this.leftOverlay.innerHTML = '&#10004;';
        this.rightOverlay.innerHTML = '&#10060;';
    }

    hideChoice() {
        this.leftOverlay.innerHTML = '';
        this.rightOverlay.innerHTML = '';
    }

    putLeft(isLeft) {
        this.sideOverlay.style.left = isLeft ? '0px' : 'auto';
        this.sideOverlay.style.right = isLeft ? 'auto' : '0px';
    }

    //TODO manage events
}

customElements.define('x-overlay', Overlay);