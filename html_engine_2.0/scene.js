let gravity = V2(0,256)
let in_editor = true;
let delta_time = 60
let scene_data =[]
delta_time=1/delta_time
let do_update = true;
let dragging_scene=false
screen_size = V2(sWidth/2,sHeight/2)
window.setInterval(function(){
    draw()
    if(!do_update){return}
    for(object of update_objects){object.update()}

},delta_time*1000)
let keys_pressed = []
let grabbed = null
let grabbed_offset = V2(0,0)
let dragging = false
let grabbed_point = 0
document.addEventListener('mousedown',function(ev){
    if(in_editor){
        let out = get_overlapping(V2(ev.clientX,ev.clientY).s(offset_render).sS(8))
    if(ev.button==1){if(!editing_object){grabbed=null};dragging_scene=true;grabbed_offset=offset_render.s(V2(ev.clientX,ev.clientY))}
    if((grabbed!=out||out==null)&&ev.button==0){editing_object=false}
    if(out==null||ev.button==1){return}
    grabbed = out;
    if(out==grabbed&&out!=null){dragging=true}
    if(grabbed!=null){select_object(grabbed);grabbed_offset = (V2(ev.clientX,ev.clientY).s(grabbed.position));
        if(grabbed.can_edit){
        grabbed_point = -1
        let grabbed_pos = (offset_render.s(V2(ev.clientX,ev.clientY).s(grabbed.position))).d(grid_snap).aS(1).round().m(grid_snap);
        for(let i = 0;i < grabbed.points.length;i++){
            let p = grabbed.points[i].a(grabbed_pos).length();
            if(p < 16){grabbed_point = i;dragging=false;break}}}}}
    
})
document.addEventListener('mouseup',function(ev){
    dragging = false
    dragging_scene=false
    grabbed_point = -1
})
const grid_snap = V2(8,8)
let mouse_pos = zero

let editing_object = false;
const svg = document.getElementById('background_SVG')
document.addEventListener('mousemove',function(ev){
    
    mouse_pos=(V2(ev.pageX,ev.pageY)).s(offset_render);
    if(dragging_scene){offset_render=grabbed_offset.a(V2(ev.clientX,ev.clientY)).d(grid_snap).round().m(grid_snap)};
    svg.style.transform = "translateX("+offset_render.x%80+"px) translateY("+offset_render.y%80+"px)"
    if(in_editor){
        if(grabbed_point!=-1&&grabbed!=null&&grabbed.can_edit){grabbed.points[grabbed_point]=mouse_pos.s(grabbed.position).d(grid_snap).round().m(grid_snap);grabbed.update_position()}
    if(editing_object&&grabbed!=null&&grabbed.can_edit){
        grabbed.points[grabbed_points]=mouse_pos.s(grabbed.position).d(grid_snap).round().m(grid_snap)
        grabbed.update_position()
    }
    if(grabbed==null||!dragging){return};grabbed.position=V2(ev.clientX,ev.clientY).s(grabbed_offset).d(grid_snap).round().m(grid_snap)}
    
    
    })
let level_won = false
document.addEventListener('keydown',function(ev){if(!keys_pressed.includes(ev.key)){keys_pressed.push(ev.key)};
    if(!in_editor){
        switch(ev.key){
            case("r"):empty_scene();load_scene(scene_data);break
            case("Escape"):;in_editor=true;if(level_won){empty_scene();load_scene(scene_data);level_won=false;};show_editor();;break
        }
    }
    if(in_editor){
    switch(ev.key){
        case("`"):do_update=!do_update;break
        case("l"):if(grabbed!=null){duplicate(grabbed)};break
        case("r"):editing_object=!editing_object;break
        case("Backspace"):if(grabbed!=null&&grabbed.text!=null&&grabbed.text.length!=0&&grabbed.text!="Insert Text"&&grabbed.color==null){grabbed.text=grabbed.text.slice(0,-1);if(grabbed.text==""){grabbed.text="Insert Text"};grabbed.update_text()}
    }}
    if(grabbed!=null){
        if(grabbed.text!=null&&ev.key.length==1&&grabbed.color==null){
            if(grabbed.text=="Insert Text"){grabbed.text=""}
            grabbed.text+=ev.key
            if(grabbed.text.split(" ").length==grabbed.text.length+1){grabbed.text="Insert Text"}
            grabbed.update_text()
        }
    }
})
document.addEventListener('keyup',function(ev){if(keys_pressed.includes(ev.key)){keys_pressed.splice(keys_pressed.indexOf(ev.key),1)}})






load_scene(scene_data)
function get_scene_data(){
    let output = []
    for(const object of render_objects){output.push((object.get_data()))}
    console.log(JSON.stringify(output))
    return output;
};

function win_level(){
    empty_scene();
    let obj = new_object("Text");
    obj.text = "Level Complete"
    render_objects.push(obj)
    level_won=true
}