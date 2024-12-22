

// animateBG.js
export default class AnimateBG {
    constructor(canvasId, imageUrl) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas?.getContext('2d');
      this.imageUrl = imageUrl;
      this.image = new Image();
      this.image.src = this.imageUrl;
      this.frame = 0;
    }
  
    start() {
      if (!this.ctx || !this.canvas) return;
  
      this.image.onload = () => {
        this.animate();
      };
    }
  
    animate() {
      if (!this.ctx) return;
  
      // Example animation logic (you can customize it as needed)
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
      // Draw the background image
      this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
  
      // Draw some animated shapes (e.g., falling snowflakes)
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      this.ctx.beginPath();
      this.ctx.arc(
        Math.random() * this.canvas.width,
        (this.frame % this.canvas.height) + 5,
        Math.random() * 5 + 2,
        0,
        Math.PI * 2
      );
      this.ctx.fill();
  
      this.frame += 2;
      requestAnimationFrame(this.animate.bind(this));
    }
  }
  