let gravity = V2(0,256)
let delta_time = 60
delta_time=1/delta_time
let do_update = true;
let dragging_scene=false
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
    let out = get_overlapping(V2(ev.clientX,ev.clientY).s(offset_render))
    if(ev.button==1){grabbed=null;dragging_scene=true;grabbed_offset=offset_render.s(V2(ev.clientX,ev.clientY))}
    if(out==null){return}
    grabbed = out;
    if(out==grabbed&&out!=null){dragging=true}
    if(grabbed!=null){select_object(grabbed);grabbed_offset = (V2(ev.clientX,ev.clientY).s(grabbed.position))}
    
})
document.addEventListener('mouseup',function(ev){
    dragging = false
    dragging_scene=false
})
document.addEventListener('mousemove',function(ev){if(dragging_scene){offset_render=grabbed_offset.a(V2(ev.clientX,ev.clientY))};if(grabbed==null||!dragging){return};grabbed.position=V2(ev.clientX,ev.clientY).s(grabbed_offset)})
document.addEventListener('keydown',function(ev){if(!keys_pressed.includes(ev.key)){keys_pressed.push(ev.key)};
    switch(ev.key){
        case("`"):
            do_update=!do_update
    }    
})
document.addEventListener('keyup',function(ev){if(keys_pressed.includes(ev.key)){keys_pressed.splice(keys_pressed.indexOf(ev.key),1)}})

let scene_data = []
load_scene(scene_data)
function get_scene_data(){
    let output = []
    for(const object of render_objects){output.push((object.get_data()))}
    console.log(JSON.stringify(output))}