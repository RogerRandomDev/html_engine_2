let grabbed_points = 0
const level_load = document.getElementById("change_level")
const level_play = document.getElementById("play_level")
const point_holder = document.getElementById("point_values")
const point_num = document.getElementById("point_id")
const point_x = document.getElementById("point_x")
const point_y = document.getElementById("point_y")
const p_add = document.getElementById("add_point")
const p_remove = document.getElementById("remove_point")
const obj_rot = document.getElementById('obj_rot')
const obj_color = document.getElementById("obj_color")
const obj_adder = document.getElementById('obj_adder')
const obj_remove = document.getElementById('remove_obj')
const grav_x = document.getElementById("grav_x")
const grav_y = document.getElementById("grav_y")
const f_size = document.getElementById("obj_fSize")
function enter_editor(){
obj_rot.addEventListener('change',update_rot)
point_num.addEventListener("change",change_active_point)
point_x.addEventListener("change",update_point)
point_y.addEventListener("change",update_point)
p_add.addEventListener('mousedown',add_point)
p_remove.addEventListener('mousedown',remove_point)
obj_color.addEventListener('change',update_color)
obj_adder.addEventListener('change',add_object)
obj_remove.addEventListener('mousedown',remove_object)
grav_x.addEventListener('change',change_grav)
grav_y.addEventListener('change',change_grav)
f_size.addEventListener('change',update_fontsize)
level_load.addEventListener("click",load_level)
level_play.addEventListener('click',play_level)
}
function load_level(){
    scene_data = prompt("enter level data:");
    empty_scene();
    scene_data = JSON.parse(scene_data)
    load_scene(scene_data)}
function play_level(){
    scene_data = get_scene_data()
    exit_editor()
    in_editor=false
    document.getElementById('edit_holder').remove()
}
function exit_editor(){
    obj_rot.removeEventListener('change',update_rot)
    point_num.removeEventListener("change",change_active_point)
    point_x.removeEventListener("change",update_point)
    point_y.removeEventListener("change",update_point)
    p_add.removeEventListener('mousedown',add_point)
    p_remove.removeEventListener('mousedown',remove_point)
    obj_color.removeEventListener('change',update_color)
    obj_adder.removeEventListener('change',add_object)
    obj_remove.removeEventListener('mousedown',remove_object)
    grav_x.removeEventListener('change',change_grav)
    grav_y.removeEventListener('change',change_grav)
    f_size.removeEventListener('change',update_fontsize)
    level_load.removeEventListener('click',load_level)
    level_play.removeEventListener('click',play_level)
}
function change_grav(){
    if(parseInt(grav_x)!=null&&parseInt(grav_y)!=null){
    let new_grav = V2(parseInt(grav_x.value),parseInt(grav_y.value))
    gravity = new_grav;
    }
}
grav_x.value = 0;
grav_y.value = 256;
function update_fontsize(){
    if(grabbed!=null&&grabbed.fontSize!==undefined){
        grabbed.fontSize=parseInt(f_size.value)
        grabbed.update_text()
    }
}
function add_point(){
    if(grabbed!=null){grabbed.add_point(grabbed.points[grabbed.points.length-1].a(V2(8,8)))}
}
function remove_point(){
    if(grabbed!=null){grabbed.remove_point()}
}
function update_color(){
    if(grabbed!=null){
        let col = hexToRgb(obj_color.value)
        grabbed.color=new Color(col.r,col.g,col.b)
}}
function update_rot(){
    if(grabbed!=null){
        grabbed.rotation=parseFloat(obj_rot.value)*Math.PI/180
    }
}
function remove_object(){
    if(grabbed!=null){grabbed.remove_from_scene()}
}
function add_object(){
    let obj = new_object(obj_adder.value)
    obj_adder.value="ADD OBJECT"
    obj.position = (V2(sWidth/2,sHeight/2)).s(offset_render)
}
function change_active_point(){
    if(grabbed!=null&&grabbed.points.length>parseInt(point_num.value)){
    grabbed_points = parseInt(point_num.value)
    point_x.value = grabbed.points[grabbed_points].x
    point_y.value = grabbed.points[grabbed_points].y
    };
}
function update_point(){
    if(grabbed!=null&&grabbed.points.length>grabbed_points){
    let point_pos = V2(parseInt(point_x.value),parseInt(point_y.value))
    grabbed.points[grabbed_points]=point_pos
    }
    
}
function select_object(obj){
    obj_rot.value = Math.round(obj.rotation*180/Math.PI)
    obj_color.value = rgbToHex(obj.color.r,obj.color.g,obj.color.b)
    let point_visibility=(obj.can_edit?"visible":"hidden")
    point_holder.style.visibility=point_visibility
    if(point_visibility=="visible"){
    point_x.value = obj.points[0].x
    point_y.value = obj.points[0].y
    point_num.value = 0
    grabbed_points=0}
    let font_visibility = (obj.text!==undefined?"visible":"hidden")
    f_size.style.visibility = font_visibility
    if(font_visibility=="visible"){
        f_size.value = obj.fontSize
    }
}
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
obj_adder.value="ADD OBJECT"
document.addEventListener('wheel',function(ev){
    if(grabbed!=null){
    point_num.value = String(Math.max(parseInt(point_num.value)+Math.sign(ev.deltaY),0))
    change_active_point()}
})
if(in_editor){
    enter_editor()
}else{
    document.getElementById('edit_holder').remove()
}