export default class RGBAColor{
    red: number;
    green: number;
    blue: number;
    alpha: number;

    constructor({
        red = Math.floor(Math.random()*255), 
        green = Math.floor(Math.random()*255), 
        blue = Math.floor(Math.random()*255), 
        alpha = 1.0
    }){
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }

    toString(): string {
        return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`;
    }

    setOpacity(alpha: number): void {
        this.alpha = alpha;
    }
}