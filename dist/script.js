const app = Vue.createApp({
  data() {
    return {
      //constants
      step: 1,
      // constants awaiting initialization
      width: 0,
      height: 0,
      ctx: null,
      boxDims: {
        width: 0, 
        height: 0,
      },
      // variables
      hue: 0,
      noOfDivisions: 0,
      saturationRange: 0,
      lightnessRange: 50,
      opacityRange: 100,
    }
  },
  computed: {
    corners: function() { 
      return { 
        NW: {x: 0, y:0, sX: 1, sY: 1}, 
        NE: {x: this.width, y:0, sX: -1, sY: 1},
        SW: {x: 0, y:this.height, sX: 1, sY: -1}, 
        SE: {x: this.width, y:this.height, sX: -1, sY: -1},
      };
    },
  },
  mounted() {
    const canvas = this.$refs.myCanvas;
    this.width = canvas.width = window.innerWidth;
    this.height = canvas.height = window.innerHeight;
    this.ctx = canvas.getContext('2d');
    let self = this;
    this.paintBackground();
    this.mainInterval = setInterval(function() {
      self.hue = self.hue + 0.1;
      self.noOfDivisions = Math.floor(5 + Math.random()*1000);
      self.boxDims.width = self.width/self.noOfDivisions;
      self.boxDims.height = self.height/self.noOfDivisions;
      self.paint();
    }, self.step);
  },
  methods: {
    paint() {
      this.paintCornerRects();
    },
    paintBackground() {
      this.ctx.fillStyle = `hsl(0, 0%, 0%)`;
      this.ctx.fillRect(0, 0, this.width/2, this.height);
      this.ctx.fillStyle = `hsl(0, 0%, 0%)`;
      this.ctx.fillRect(this.width/2, 0, this.width/2, this.height);
    },
    paintCornerRects() {
      const saturationRangeBase = 100
      const randSaturation = Math.floor(saturationRangeBase - Math.random()*this.saturationRange) + '%';
      const lightnessRangeBase = (100 - this.lightnessRange)/2;
      const randLightness = Math.floor(lightnessRangeBase + Math.random()*this.lightnessRange) + '%';
      const opacityRangeBase = 0;
      const randOpacity = Math.floor(opacityRangeBase + Math.random()*this.opacityRange) + '%';

        for (const [key, corner] of Object.entries(this.corners)) {
          this.paintCornerRect(corner, this.boxDims, this.boxDims, `hsl(${this.hue}, ${randSaturation}, ${randLightness}, ${randOpacity})`);
        }
    },
    paintCornerRect(corner, offset, boxDims, color) {
      this.ctx.fillStyle = color;
      // if (Math.floor(Math.random()*10) === 9) {
      //   this.ctx.fillStyle = 'hsl(0, 0%, 0%)';
      // } 
      // else if (Math.floor(Math.random()*20) === 8) {
      //   this.ctx.fillStyle = 'hsl(0, 0%, 100%)';
      // }
        this.ctx.fillRect(this.getCornerX(corner, boxDims), this.getCornerY(corner, boxDims), boxDims.width, boxDims.height);
    },
    getCornerX(corner, boxDims) {
      const randIdx = Math.floor(Math.random()*this.noOfDivisions/2);
      const offset =  randIdx * boxDims.width;
      const subtractedWidth = ((corner.sX === 1) ? 0 : boxDims.width);
      return corner.x + corner.sX * offset - subtractedWidth;
    },
    getCornerY(corner, boxDims) {
      const randIdx = Math.floor(Math.random()*this.noOfDivisions/2);
      const offset = randIdx * boxDims.height;
      const subtractedHeight = ((corner.sY === 1) ? 0 : boxDims.height);
      return corner.y + corner.sY * offset - subtractedHeight;
    }
  }
    
});

app.mount('.app');