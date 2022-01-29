let canvas = document.getElementById("canvas")
let ctx = canvas.getContext('2d');
let render_objects=[]
let update_objects=[]
let sWidth = window.innerWidth;
let sHeight = window.innerHeight;
canvas.width=sWidth;
canvas.height=sHeight;
let zero = null;
function draw(){
    ctx.clearRect(0,0,sWidth,sHeight)
    for(const object of render_objects){
        ctx.fillStyle=object.color.css_form();
        draw_shape(object.points,object.position,object.rotation)
    }
}
function draw_shape(points=[],offset=zero,rotation){
    if(points.length==0){return}
    ctx.beginPath();
    let s_point = points[0].rotated(rotation)
    ctx.moveTo(s_point.x+offset.x,s_point.y+offset.y);
    for(let i=1;i<points.length;i++){
        let n_point = points[i].rotated(rotation)
        ctx.lineTo(n_point.x+offset.x,n_point.y+offset.y);}
    ctx.fill();
}