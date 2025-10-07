class TimerBox extends HTMLElement {

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        this.liquidHeight = 100;
        this._value = 0;
        this.nbSwitch = 0;

        //create the colorbox
        this.colorbox = document.createElement('div');//the color
        Object.assign(this.colorbox.style, {
            width: '150px',
            height: '100%',
            position: 'absolute',
            bottom: '0',
            backgroundColor: 'orange',
            zIndex: '1'
        });

        //create the spanbox
        this.spanbox = document.createElement('span');//the number
        Object.assign(this.spanbox.style, {
            position: 'relative',
            fontFamily: 'sans-serif',
            fontSize: '130px',
            fontWeight: 'bolder',
            color: 'yellow',
            zIndex: '2'
        });    
        
        //create the shapebox
        this.shapebox = document.createElement('div');//the box
        Object.assign(this.shapebox.style, {
            width: '150px',
            height: '150px',
            position: 'absolute',
            bottom: '0',
            border: '3px solid gainsboro',
            textAlign: 'center',
            borderRadius: '10px'
        })

        //create the containing area
        this.area = document.createElement('div');//the area
        Object.assign(this.area.style, {
            width: '275px',
            height: '153px',
            display: 'flex',
            position: 'relative'
        })

        //combine the elements
        this.shapebox.appendChild(this.spanbox);
        this.shapebox.appendChild(this.colorbox);
        this.area.appendChild(this.shapebox);
        shadow.appendChild(this.area);
    }

    static get observedAttributes() {
        return ['value'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'value') {
            this._value = parseInt(newValue) || 0;
            this.spanbox.textContent = this._value;
            this.setSide((this._value + this.nbSwitch) % 2 === 0);
        }
    }

    get value() { return this._value; }

    getPosition() {
        return {
            left: this.shapebox.style.left,
            right: this.shapebox.style.right
        };
    }

    setSide(isLeft) {
        this.shapebox.style.left = isLeft ? '0px' : 'auto';
        this.shapebox.style.right = isLeft ? 'auto' : '0px';
    }

    drain1() {
        this.liquidHeight -= 1; 
        this.colorbox.style.height = this.liquidHeight + '%';
    }

    isEmpty() {
        return this.liquidHeight <= 0;
    }

    resetHeight() {
        this.liquidHeight = 100;
        this.colorbox.style.height = this.liquidHeight + '%';
    }

    shiftSide() {
        this.nbSwitch++;
        this.setSide(!this.isLeftSide());
    }

    isLeftSide() {
        return this.shapebox.style.left !== 'auto';
    }
}

customElements.define('timer-box', TimerBox);