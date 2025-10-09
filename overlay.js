class Overlay extends HTMLElement {

    constructor() {
        super();

        this.state = 'play';

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
            width: '100vw',
            height: '101%',
            zIndex: '3',
            fontSize: '200px',
            textAlign: 'center',
            backgroundColor: "rgba(0, 0, 0, 0.5)"
        });

        this.detectorOverlay = document.createElement('div');
        this.detectorOverlay.addEventListener('click', () => this.overlayClickEvent());
        Object.assign(this.detectorOverlay.style, {
            width: '100%',
            height: '100%'
        })

        this.sideOverlay = document.createElement('div');
        Object.assign(this.sideOverlay.style, {
            width: '50%',
            height: '100%',
            display: 'none',
            position: 'absolute',
        });

        this.leftOverlay = document.createElement('div'); //for good anwser
        this.leftOverlay.classList.add('leftOverlay');
        this.leftOverlay.innerHTML = '&#10004;';
        this.leftOverlay.addEventListener('click', () => this.rightAnswerEvent());
        Object.assign(this.leftOverlay.style, {
            width: '50%',
            height: '100%',
            color: 'green',
            right: '0'
        });

        this.rightOverlay = document.createElement('div'); //for bad answer
        this.rightOverlay.classList.add('rightOverlay');
        this.rightOverlay.innerHTML = '&#10060;';
        this.rightOverlay.addEventListener('click', () => this.wrongAnswerEvent());
        Object.assign(this.rightOverlay.style, {
            width: '50%',
            height: '100%',
            left: '0'
        });

        this.sideOverlay.append(this.leftOverlay, this.rightOverlay);
        this.overlay.appendChild(this.sideOverlay);
        this.overlay.appendChild(this.detectorOverlay);
        shadow.append(style, this.overlay);
    }

    show() {
        this.overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    }

    hide() {
        this.overlay.style.backgroundColor = "rgba(0, 0, 0, 0)";
    }

    showChoice() {
        this.detectorOverlay.style.display = 'none';
        this.sideOverlay.style.display = 'flex';
    }

    hideChoice() {
        this.sideOverlay.style.display = 'none';
        this.detectorOverlay.style.display = 'flex'
    }

    putLeft(isLeft) {
        this.sideOverlay.style.left = isLeft ? '0px' : 'auto';
        this.sideOverlay.style.right = isLeft ? 'auto' : '0px';
    }

    setResetEvent() {
        this.state = 'reset';
    }

    //functions to react to events
    overlayClickEvent() {
        switch (this.state) {
            case 'play':
                this.playEvent();
                break;
            case 'pause':
                this.pauseEvent();
                break;
            case 'reset':
                this.resetEvent();
                break;
        }
    }

    rightAnswerEvent() {
        this.dispatchEvent(new CustomEvent('right-answer-event', { bubbles: true, composed: true }));
        this.show();
        this.hideChoice();
        this.state = 'play';
    }

    wrongAnswerEvent() {
        this.dispatchEvent(new CustomEvent('wrong-answer-event', { bubbles: true, composed: true }));
        this.playEvent();
    }

    playEvent() {
        this.dispatchEvent(new CustomEvent('play-event', {bubbles: true, composed: true}));
        this.hide();
        this.hideChoice();
        this.state = 'pause';
    }

    pauseEvent() {
        this.dispatchEvent(new CustomEvent('pause-event', {bubbles: true, composed: true}));
        this.show();
        this.showChoice();
    }

    //when the timer is done or a right answer is given
    resetEvent() {
        this.dispatchEvent(new CustomEvent('reset-event', {bubbles: true, composed: true}));
        this.show();
        this.hideChoice();
        this.state = 'play';
    }
}

customElements.define('x-overlay', Overlay);