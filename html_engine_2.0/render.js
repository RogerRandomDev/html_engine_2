let canvas = document.getElementById("canvas")
let ctx = canvas.getContext('2d');
let render_objects=[]
let update_objects=[]
let player_objects = []
let sWidth = window.innerWidth;
let sHeight = window.innerHeight;
canvas.width=sWidth;
canvas.height=sHeight;
let zero = null;
let offset_render=null;
let screen_size = null;
function draw(){
    ctx.clearRect(0,0,sWidth,sHeight)
    svg.style.transform = "translateX("+offset_render.x%80+"px) translateY("+offset_render.y%80+"px)"
    for(const object of render_objects){
        if(object.draw_shape!=null){
            ctx.fillStyle=object.color.css_form();
            draw_shape(object.points,object.position.a(offset_render),object.rotation)}
        if(object.text!=null){
            ctx.fillStyle=object.text_color.css_form();
            draw_text(object.text,object.fontSize,object.position.a(offset_render).a(V2(0,object.height).rotated(object.rotation)),object.rotation)}
    }
}
function draw_text(text,fontSize,position,angle){
    ctx.save()
    ctx.rotate(angle)
    ctx.font=fontSize+'px serif'
    position = position.rotated(-angle)
    ctx.fillText(text,position.x,position.y)
    ctx.restore()
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