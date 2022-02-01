let grabbed_points = 0
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
function change_grav(){
    if(parseInt(grav_x)!=null&&parseInt(grav_y)!=null){
    let new_grav = V2(parseInt(grav_x.value),parseInt(grav_y.value))
    gravity = new_grav;
    }
}
grav_x.value = 0;
grav_y.value = 256;
function add_point(){
    if(grabbed!=null){grabbed.add_point(zero)}
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
    point_x.value = obj.points[0].x
    point_y.value = obj.points[0].y
    point_num.value = 0
    grabbed_points=0
    obj_rot.value = Math.round(obj.rotation*180/Math.PI)
    obj_color.value = rgbToHex(obj.color.r,obj.color.g,obj.color.b)
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