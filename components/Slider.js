export default class Slider {
    element;
    subElements = {};
    prevElement;
    handlerMoveUp;
    handlerMoveDown;
    handlerMoveBoth;
    changeSliderState = false;

    startScrolling = event => {
        const that = this;
        const current = event.target.closest('li');
        const clientY = event.clientY;

        const { y, height } = current.getBoundingClientRect();
        current.style.cursor = 'grab';

        if(current.classList.contains('first')) {
            const halfWay = (clientY - y) / 2;

            this.handlerMoveUp =  function(event) {

                that.moveUp(event,current,halfWay,clientY);
            }
            document.addEventListener('pointermove',this.handlerMoveUp);
        } else if(current.classList.contains('last')) {
            
            this.handlerMoveDown = function(event) {

                that.moveDown(event,current,y,height,clientY)
            }
            document.addEventListener('pointermove',this.handlerMoveDown);
        } else {
            this.handlerMoveBoth = function(event) {

                that.moveBoth(event,current,y,height,clientY);
            }
            document.addEventListener('pointermove',this.handlerMoveBoth);
        }
    }

    constructor(images = [], 
        IMAGES_HEIGHT = 512,
        IMAGES_WIDTH = 512,  
        ) {
        this.images = images;
        this.IMAGES_HEIGHT = IMAGES_HEIGHT;
        this.IMAGES_WIDTH = IMAGES_WIDTH;

        this.render()
    }

    render() {
        const element = document.createElement('div');

        this.element = element; 

        this.element.innerHTML = this.template;

        this.subElements = this.getSubElements(this.element);

        // this.subElements.rangeSliderContainer.append(rangeSlider.element)

        this.initEventListener()
    }

    get template() {
        return `
        <div class="wrapper" style="width: fit-content; height: ${this.IMAGES_HEIGHT}px">
            <div class="slider-container">
                <ul class="images" data-elem="imageList">
                    ${this.renderImages()}
                </ul> 
            </div>
            <div class="dots_container" data-elem="dotsContainer">
            ${this.renderDots()}
            </div>
        </div>
        <div data-elem="rangeSliderContainer"></div>
        `
    }

    getSubElements(element) {
        const elements = element.querySelectorAll('[data-elem]');
        return [...elements].reduce((accum, subElement) => {
          accum[subElement.dataset.elem] = subElement;
    
          return accum;
        }, {});
      }

    renderImages() {
        let imagesStr = ''
        const imagesArray = this.images.map((image,index) => {
            if(index === 0) {
                return  `<li class="image first" data-index="${index}">
                            <img src="./img/${image}"></img>
                            <p class="first-span">Scroll down</p>
                            <div class="arrow-down"></div>
                        </li>`;
            } else if(index === this.images.length - 1) {
                return `<li class="image last" data-index="${index}">
                            <img src="./img/${image}"/>
                            <p class="last-span">Scroll up</p>
                            <div class="arrow-up"></div>
                        </li>`;
            } else {
                return `<li class="image" data-index="${index}">
                            <img src="./img/${image}"></img>
                        </li>`;
            }
        }).join('')
        return imagesStr + imagesArray
    }

    renderDots() {
        let dotsStr = '';
        const dotsAmount = this.images.length;
        for(let i = 0; i < dotsAmount; i++) {
            dotsStr += `<div class="dot" data-indexDot="${i}"></div>`
        }
        return dotsStr
    }

    initEventListener() {
        this.subElements.imageList.addEventListener('pointerdown',this.startScrolling);
    }

    moveUp(event,current,halfWay,initialClientY) {
        const clientY = event.clientY;
        if(initialClientY < clientY) {
            current.style.cursor = 'default';
            document.removeEventListener('pointermove',this.handlerMoveUp)
        } else {
            if(clientY < halfWay) {
                current.style.display = 'none';
                current.style.cursor = 'default';
                let currentIndex;
                if(currentIndex !== 0) {
                    currentIndex = Number(current.dataset.index) + 1;
                    this.hightLightDots(currentIndex)
                }
                let prevEl = this.subElements.imageList.querySelector(`[data-index="${currentIndex}"]`) || undefined;
                if(prevEl) {
                    prevEl.style.display = 'block';
                    prevEl.style.cursor = 'default';
                    prevEl.style.top = '0px';
                }
                document.removeEventListener('pointermove',this.handlerMoveUp)
                this.prevElement = current;
            } else {
                current.style.top =  `-${initialClientY - clientY}px`
            }
        }
    }

    moveDown(event,current,elY,elHeight,initialClientY) {
        const clientY = event.clientY;
        const halfFromBottom = (elY + elHeight) - initialClientY / 2;

        if(initialClientY > clientY) {
            current.style.cursor = 'default';
            document.removeEventListener('pointermove',this.handlerMoveDown)
        } else {
            if(clientY > halfFromBottom) {
                current.style.display = 'none';
                current.style.cursor = 'default';
                let currentIndex;
                currentIndex = Number(current.dataset.index) - 1;
                let prevEl = this.subElements.imageList.querySelector(`[data-index="${currentIndex}"]`) || undefined;
                if(prevEl) {
                    prevEl.style.display = 'block';
                    prevEl.style.cursor = 'default';
                    prevEl.style.top = '0px';
                }
                this.hightLightDots(currentIndex)
                document.removeEventListener('pointermove',this.handlerMoveDown)
                this.prevElement = current;
            }  else {
                current.style.top =  `-${clientY - initialClientY}px`
            }
        }
    }

    moveBoth(event,current,elY,elHeight,initialClientY) {
        const clientY = event.clientY;
        const halfFromTop = (initialClientY - elY) / 2;
        const halfFromBottom = (elY + elHeight) - initialClientY / 2;
        // go up scenario for middle pictures
        if(clientY > initialClientY) {
            if(clientY < halfFromBottom) {
                current.style.top = ''; 
                current.style.bottom =  `-${clientY - initialClientY}px`
            } else {
                current.style.display = 'none';
                let currentIndex = current.dataset.index - 1;
                let prevEl = this.subElements.imageList.querySelector(`[data-index="${currentIndex}"]`);
                prevEl.style.display = 'block';
                prevEl.style.cursor = 'default';
                prevEl.style.top = '0px';
                this.hightLightDots(currentIndex)
                document.removeEventListener('pointermove',this.handlerMoveBoth);
                this.prevElement = current;
            }
        }
        // go down scenario for middle pictures
        if(clientY < initialClientY) {
            if(clientY > halfFromTop) {
                current.style.top =  `-${initialClientY - clientY}px`
            } else {
                current.style.display = 'none';
                let currentIndex = Number(current.dataset.index) + 1;
                let prevEl = this.subElements.imageList.querySelector(`[data-index="${currentIndex}"]`);
                prevEl.style.display = 'block';
                prevEl.style.top = '0px';
                prevEl.style.cursor = 'default';
                this.hightLightDots(currentIndex)
                document.removeEventListener('pointermove',this.handlerMoveBoth)
                this.prevElement = current;
            }
        }
    }

    hightLightDots(index) {
        // check for zero , coz js engine consider 0 as falthy value
        if(!index && index !== 0) return;
        const allDots = this.subElements.dotsContainer.children;
        for(const dot of allDots) {
            dot.style.backgroundColor = '#000000';
        }
        allDots[index].style.backgroundColor = 'orange';
    }

    removeEventListener() {
        this.subElements.imageList.removeEventListener('pointerdown',this.startScrolling);
    }
}