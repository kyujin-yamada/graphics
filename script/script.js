(() => {
    const CANVAS_WIDTH = 640;
    const CANVAS_HEIGHT = 480;

    let util = null;
    let canvas = null;
    let ctx = null;
    let image = null;

    window.addEventListener('load', () => {
        util = new Canvas2DUtility(document.body.querySelector('#main_canvas'));
        canvas = util.canvas;
        ctx = util.context;

        util.imageLoader('./image/viper.png', (loadeImage) =>{
            image = loadeImage;
            initialize();
            render();
        });
    }, false);

    function initialize(){
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;
    }

    function render(){
        util.drawRect(0, 0, canvas.width, canvas.height, '#eeeeee');
        ctx.drawImage(image, 100, 100);
    }
    function generateRandomInt(range){
        let random = Math.random();
        return Math.floor(random*range);
    }
    
})();