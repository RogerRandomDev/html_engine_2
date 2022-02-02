let gravity = V2(0,256)
let delta_time = 60
delta_time=1/delta_time
let do_update = true;
let dragging_scene=false
document.addEventListener('wheel',function(ev){
    if(grabbed!=null){
    point_num.value = String(Math.max(parseInt(point_num.value)+Math.sign(ev.deltaY),0))
    change_active_point()}
})
window.setInterval(function(){
    draw()
    if(!do_update){return}
    for(object of update_objects){object.update()}

},delta_time*1000)
let keys_pressed = []
let grabbed = null
let grabbed_offset = V2(0,0)
let dragging = false
document.addEventListener('mousedown',function(ev){
    if(in_editor){
        let out = get_overlapping(V2(ev.clientX,ev.clientY).s(offset_render))
    if(ev.button==1){if(!editing_object){grabbed=null};dragging_scene=true;grabbed_offset=offset_render.s(V2(ev.clientX,ev.clientY))}
    if((grabbed!=out||out==null)&&ev.button==0){editing_object=false}
    if(out==null||ev.button==1){return}
    grabbed = out;
    if(out==grabbed&&out!=null){dragging=true}
    if(grabbed!=null){select_object(grabbed);grabbed_offset = (V2(ev.clientX,ev.clientY).s(grabbed.position))}}
    
})
document.addEventListener('mouseup',function(ev){
    dragging = false
    dragging_scene=false
})
const grid_snap = V2(8,8)
let mouse_pos = zero
let in_editor = true;
let editing_object = false;
const svg = document.getElementById('background_SVG')
document.addEventListener('mousemove',function(ev){
    
    mouse_pos=(V2(ev.pageX,ev.pageY)).s(offset_render);
    if(dragging_scene){offset_render=grabbed_offset.a(V2(ev.clientX,ev.clientY)).d(grid_snap).round().m(grid_snap)};
    svg.style.transform = "translateX("+offset_render.x%80+"px) translateY("+offset_render.y%80+"px)"
    
    if(in_editor){
    if(editing_object&&grabbed!=null){
        grabbed.points[grabbed_points]=mouse_pos.s(grabbed.position).d(grid_snap).round().m(grid_snap)
        grabbed.update_position()
    }
    if(grabbed==null||!dragging){return};grabbed.position=V2(ev.clientX,ev.clientY).s(grabbed_offset).d(grid_snap).round().m(grid_snap)}
    
    
    })
document.addEventListener('keydown',function(ev){if(!keys_pressed.includes(ev.key)){keys_pressed.push(ev.key)};
    if(in_editor){
    switch(ev.key){
        case("`"):do_update=!do_update;break
        case("r"):editing_object=!editing_object;break
    }}
})
document.addEventListener('keyup',function(ev){if(keys_pressed.includes(ev.key)){keys_pressed.splice(keys_pressed.indexOf(ev.key),1)}})

let scene_data = []
load_scene(scene_data)
function get_scene_data(){
    let output = []
    for(const object of render_objects){output.push((object.get_data()))}
    console.log(JSON.stringify(output))}