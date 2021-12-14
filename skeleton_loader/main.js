function animate(from, to, step, delay, cb) {
    return new Promise(resolve => {
        const loop = setInterval(() => {
            if(from >= to) {
                clearInterval(loop);
                resolve(from);
                return;
            }

            cb(from += step);
        }, delay)
    });
}

class Placeholder {
    constructor() {
        const element = document.createElement('div');
        element.style = 'z-index:1;position:absolute;top:100px;left:100px;background:#e7e7e7;background:linear-gradient(90deg,#e7e7e7 0,#b0b0b0 0,#e7e7e7 100%);';
        this.element = element;
        this.__render();
    }

    __render() {
        let i = 0;
        let ii = 1;

        setInterval(() => {
            if(i > 100 || i < 0)
                ii = -ii;
    
            this.element.style.background = `linear-gradient(90deg, rgba(231,231,231,1) 0%, rgba(176,176,176,1) ${i}%, rgba(231,231,231,1) 100%)`;
            i += ii;
        }, 10);
    }

    applyTo(element) {
        if(!(element?.width) || !(element?.height))
            throw new Error('Element has no width or height!');

        this.element.style.width = element.width + 'px';
        this.element.style.height = element.height + 'px';

        this.element.style.left = element.x + 'px';
        this.element.style.top = element.y + 'px';

        const cb = () => {
            element.removeEventListener('load', cb);
            document.body.removeChild(this.element);
            delete this;
        }

        element.addEventListener('load', cb);

        document.body.appendChild(this.element);    
    }
}

(async() => {
    document.querySelectorAll('img').forEach(img => img.src += `?cache=${performance.now()}`); //disable caching for slow loading
    
    document.querySelectorAll('img').forEach(img => {
        const placeholder = new Placeholder();
        placeholder.applyTo(img);


    });

})();