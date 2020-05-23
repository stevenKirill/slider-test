export default class RangeSlider {
    element;
    subElements = {};

    moveImage = event => {
        const { value: rangeValue } = event.target;
        const { rangeImages } = this.subElements;
        const children = rangeImages.children;
        if(rangeValue > 0 && rangeValue < 33) {
            children[0].style.display = 'block';
        } else if(rangeValue > 33 && rangeValue < 66) {
            children[0].style.display = 'none';
            children[1].style.display = 'block';
        } else if(rangeValue > 66 && rangeValue < 100) {
            children[1].style.display = 'none';
            children[2].style.display = 'block';
        }
    }

    constructor(min = 0, max = 100, years = [], rangeImages = []) {
        this.min = min;
        this.max = max;
        this.years = years;
        this.rangeImages = rangeImages

        this.render()
    }

    render() {
        const element = document.createElement('div');

        this.element = element;

        this.element.innerHTML = this.template;

        this.subElements = this.getSubElements(this.element);

        this.initEventListeners()

    }

    get template() {
        return `
        <div class="range-slider-wrapper">
            <ul class="range-slider-images" data-elem="rangeImages">
                ${this.renderRangeImages(this.rangeImages)}
            </ul>
            <input 
            type="range" 
            value=${this.min}
            min="${this.min}" 
            max="${this.max}" 
            class="range-slider" 
            data-elem="rangeSlider"/>
            <div class="range-slider-years" style="grid-template-columns: repeat(${this.years.length},1fr)">
            ${this.renderYears(this.years)}
            </div>
        </div>
        `
    }

    renderYears(years) {
        let spans = '';
        for(const year of years) {
            spans += `<span class="range-slider-year" data-year=${year}>${year}</span>`
        } 
        return spans;
    }

    renderRangeImages(images) {
        let imagesStr = '';
        let index = 0;
        for(const image of images) {
            imagesStr += `<li class="range-slider-element-image" data-imageIndex="${index}">
                <img src="./img/${image}.png" alt=${image}>
            </li>`
            index++;
        }
        return imagesStr
    }

    getSubElements(element) {
        const elements = element.querySelectorAll('[data-elem]');
        return [...elements].reduce((accum, subElement) => {
          accum[subElement.dataset.elem] = subElement;
    
          return accum;
        }, {});
      }

    initEventListeners() {
        this.subElements.rangeSlider.addEventListener('input',this.moveImage)
    }
}