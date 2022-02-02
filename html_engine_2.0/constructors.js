class Color{
    constructor(r,g,b){this.r=r;this.g=g;this.b=b;}
    css_form(){return 'rgb('+this.r+","+this.g+","+this.b+")"}
}
class Vector2{
    constructor(x,y){
        this.x=x;this.y=y
    }
    //Math functions//
    s(a){return new Vector2(this.x-a.x,this.y-a.y)}
    a(a){return new Vector2(this.x+a.x,this.y+a.y)}
    m(a){return new Vector2(this.x*a.x,this.y*a.y)}
    d(a){return new Vector2(this.x/a.x,this.y/a.y)}
    sS(a){return new Vector2(this.x-a,this.y-a)}
    aS(a){return new Vector2(this.x+a,this.y+a)}
    mS(a){return new Vector2(this.x*a,this.y*a)}
    dS(a){return new Vector2(this.x/a,this.y/a)}
    distance_to(a){return Math.sqrt((a.x-this.x)+(a.y-this.y))}
    distance_to_squared(a){return ((a.x-this.x)+(a.y-this.y))}
    rotated(ang){
        return V2(
        this.x * Math.cos(ang) - this.y * Math.sin(ang),
        this.x * Math.sin(ang) + this.y * Math.cos(ang));}
    normalized(){
        let normal_value = Math.max(this.x,this.y);
        return new Vector2(this.x/normal_value,this.y/normal_value)}
    length(){
        return Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2))
    }
    round(){
        return new Vector2(Math.round(this.x),Math.round(this.y))
        
    }
}
class Polygon{
    constructor(points=[V2(0,0),V2(32,0),V2(32,32),V2(0,32)],position=V2(0,0),color=new Color(0,0,0),rotation=0.0,original=true){
        this.points=points;
        this.can_edit = true
        this.color=color;
        this.extents=V2(0,0)
        this.minextents=V2(0,0)
        this.position=position;
        render_objects.push(this)
        if(original){collision_objects.push(this)}
        this.rotation=rotation;

    }
    remove_from_scene(){
        if(render_objects.indexOf(this)!=-1){render_objects.splice(render_objects.indexOf(this),1)}
        if(update_objects.indexOf(this)!=-1){update_objects.splice(update_objects.indexOf(this),1)}
        if(collision_objects.indexOf(this)!=-1){collision_objects.splice(collision_objects.indexOf(this),1)}
        if(player_objects.indexOf(this)!=-1){player_objects.splice(player_objects.indexOf(this),1)}
    }
    add_point(pos){
        this.points.push(pos)
        this.extents.x=Math.max(this.extents.x,pos.x)
        this.extents.y=Math.max(this.extents.y,pos.y)
        this.minextents.x=Math.min(this.extents.x,pos.x)
        this.minextents.y=Math.min(this.extents.y,pos.y)
    }
    update_position(){
        this.minextents=this.points[0]
        for(let i = 0;i<this.points.length;i++){
            this.extents = V2(Math.max(this.extents.x,this.points[i].x),Math.max(this.extents.y,this.points[i].y));
            this.minextents = V2(Math.min(this.minextents.x,this.points[i].x),Math.min(this.minextents.y,this.points[i].y));
        }
        this.position = this.position.a(this.minextents);
        for(let i =0; i<this.points.length;i++){this.points[i]=this.points[i].s(this.minextents)}
        this.minextents=this.points[0];this.extents=zero
    }
    remove_point(id){this.points.pop()}
    move_to(pos){
        let col=[false,false,0,0]
        let n_posx = this.position.x;
        let n_posy = this.position.y;
        this.position.y = pos.y;
        let collide = do_collision(this)
        if(collide[0]){
            this.position.y=n_posy;
            col[1]=true;
            col[2]=Math.sign(pos.y-this.position.y);
            this.position.y-=col[2]*delta_time
        }
        this.position.x = pos.x;
        collide = do_collision(this)
        if(collide[0]){
            this.position.y-=Math.abs(pos.x-n_posx)
            if(do_collision(this)[0]){
            this.position.x=n_posx;col[0]=true;col[3]=Math.sign(pos.x-this.position.x)
            }
        }
        return col
    }
    move_by(pos){
        let val = this.position.a(pos)
        return this.move_to(val)
    }
    get_data(){
        let data = {}
        data.type = "Polygon"
        data.pos=this.position.round()
        data.pts=this.points
        data.col=this.color
        data.rot=Math.round(this.rotation*180/Math.PI)
        return data
    }
}
function V2(x,y){return new Vector2(x,y)}
function color(r=0,g=0,b=0){return new Color(r,g,b)}

zero=V2(0,0)
offset_render=zero;
function calcAngle(x, y) {
  return Math.atan2(y, x);
}
class PhysicsObject extends Polygon{
    constructor(points=[V2(0,0),V2(32,0),V2(32,32),V2(0,32)],position,color=new Color(0,255,0),original=true){
        super(points,position,color,0.0,false)
        this.bounce = 0.5
        this.friction = 0.5
        this.damp=0.75
        if(original){update_objects.push(this);collision_objects.push(this)}
        this.velocity = V2(0,0)
        this.on_floor=0.0;
        this.can_move_sideways=false;
        this.angular_velocity=0.0;
    }
    update(){
        let did_move = this.move_by(this.velocity.mS(delta_time))
        this.velocity = this.velocity.a(gravity.mS(delta_time))
        this.on_floor=(did_move[1]&&this.velocity.y>-0.5||this.on_floor&&(this.velocity.y <gravity.y*0.1&&this.velocity.y>0))
        if(did_move[1]){this.velocity.y*=-this.bounce-0.1}
        if(did_move[0]){this.velocity.x*=-this.bounce}
        this.can_move_sideways=!did_move[0]
        this.velocity = this.velocity.s(this.velocity.m(V2(this.damp*delta_time,this.damp*0.5*delta_time)))
    }
    get_data(){
        let data = super.get_data()
        data.type = "PhysicsObject"
        data.bnc = this.bounce
        data.frc = this.friction
        data.dmp = this.damp
        return data
    }
}
class PlayerObject extends PhysicsObject{
    constructor(points=[V2(0,0),V2(32,0),V2(32,32),V2(0,32)],position,color=new Color(255,0,0),original=true){
        super(points,position,color,false)
        if(original){update_objects.push(this);player_objects.push(this);collision_objects.push(this)}
        this.bounce=0.0
        this.can_jump=true
        this.just_jumped=false
        this.accel=256
    }
    update(){
        this.can_jump=(this.on_floor||this.can_jump)
        if(keys_pressed.includes('w')&&!this.just_jumped&&this.can_jump){
            this.velocity.y=-256;
            this.just_jumped=true;
            if(!this.on_floor){this.can_jump=false}}
        if(!keys_pressed.includes('w')){this.just_jumped=false}
        if(keys_pressed.includes('a')){this.velocity.x-=this.accel*delta_time}
        if(keys_pressed.includes('d')){this.velocity.x+=this.accel*delta_time}
        if(!in_editor){offset_render=this.position.s(screen_size).mS(-1)}
        super.update()
    }
    get_data(){
        let data = super.get_data()
        data.type = "PlayerObject"
        return data
    }
}
class jumpPad extends Polygon{
    constructor(points=[V2(0,0),V2(32,0),V2(32,32),V2(0,32)],position,color=new Color(255,0,255),original=true){
        super(points,position,color,0.0,false)
        this.rotation = 0.0;
        if(original){update_objects.push(this)}
        if(collision_objects.indexOf(this)!=-1){collision_objects.splice(collision_objects.indexOf(this),1)}
    }
    update(){
        let out=null
        for(let i = 0; i < this.points.length;i++){
            out=get_overlapping_poly_update(this);if(out!=null){break}
        }
        if(out!=undefined){out.velocity.y-=4096*delta_time}
    }
    remove_from_scene(){
        if(render_objects.indexOf(this)!=-1){render_objects.splice(render_objects.indexOf(this),1)}
        if(update_objects.indexOf(this)!=-1){update_objects.splice(update_objects.indexOf(this),1)}
        if(collision_objects.indexOf(this)!=-1){collision_objects.splice(collision_objects.indexOf(this),1)}
    }
    get_data(){
        let data = super.get_data()
        data.type="jumpPad"
        return data
    }
}
class Text{
    constructor(font=48,position=V2(0,0),color=new Color(0,0,0),rotation=0.0){
    this.fontSize=font
    this.position=position
    this.color=color
    this.rotation=rotation;
    this.points = []
    this.text = "Insert Text"
    this.can_edit =false
    render_objects.push(this)
    this.height = 0
    this.update_text()
    }
    update_text(){
        this.points = []
        let length = Math.round((this.text.length-this.text.split(" ").length*0.4375)*this.fontSize/2.25)
        let width = Math.round(this.text.split("\n").length*this.fontSize)
        this.points.push(V2(0,0))
        this.points.push(V2(length,0))
        this.points.push(V2(length,width))
        this.points.push(V2(0,width))
        this.height = width
    }
    get_data(){
        let data ={}
        data.type="Text"
        data.txt = this.text
        data.pos = this.position.round()
        data.col = this.color
        data.fS=this.fontSize
        data.rot=this.rotation
        data.pts=this.points
        return data
    }
    remove_from_scene(){
        if(render_objects.indexOf(this)!=-1){render_objects.splice(render_objects.indexOf(this),1)}
        if(update_objects.indexOf(this)!=-1){update_objects.splice(update_objects.indexOf(this),1)}
        if(collision_objects.indexOf(this)!=-1){collision_objects.splice(collision_objects.indexOf(this),1)}
    }
}















