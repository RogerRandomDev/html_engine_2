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
}
class Polygon{
    constructor(points=[],position=V2(0,0),color=new Color(0,0,0),rotation=0.0){
        this.points=points;
        this.color=color;
        this.extents=V2(0,0)
        this.minextents=V2(0,0)
        this.position=position;
        render_objects.push(this)
        collision_objects.push(this)
        this.rotation=rotation;

    }
    
    add_point(pos){
        this.points.push(pos)
        this.extents.x=Math.max(this.extents.x,pos.x)
        this.extents.y=Math.max(this.extents.y,pos.y)
        this.minextents.x=Math.min(this.extents.x,pos.x)
        this.minextents.y=Math.min(this.extents.y,pos.y)
    }
    remove_point(id){this.points=this.points.slice(id,1)}
    move_to(pos){
        let col=[false,false]
        let n_posx = this.position.x;
        let n_posy = this.position.y;
        this.position.y = pos.y;
        if(do_collision(this)){this.position.y=n_posy;col[1]=true}
        this.position.x = pos.x;
        if(do_collision(this)){this.position.x=n_posx;col[0]=true}
        return col
    }
    move_by(pos){
        let val = this.position.a(pos)
        return this.move_to(val)
    }
    get_data(){
        let data = {}
        data.type = "Polygon"
        data.pos=this.position
        data.pts=this.points
        data.col=this.color
        data.rot=this.rotation
        return data
    }
}
function V2(x,y){return new Vector2(x,y)}
function color(r=0,g=0,b=0){return new Color(r,g,b)}

zero=V2(0,0)


class PhysicsObject extends Polygon{
    constructor(points=[V2(0,0),V2(32,0),V2(32,32),V2(0,32)],position,color,original=true){
        super(points,position,color,false)
        this.bounce = 0.5
        this.friction = 0.5
        this.damp=0.75
        if(original){update_objects.push(this)}
        this.velocity = V2(0,0)
        this.on_floor=0.0;
        this.can_move_sideways=false;
    }
    update(){
        let did_move = this.move_by(this.velocity.mS(delta_time))
        this.velocity.y+=gravity*delta_time
        this.on_floor=(did_move[1]&&this.velocity.y>0)
        if(did_move[0]){this.velocity.x*=-this.bounce}
        if(did_move[1]){this.velocity.y*=-this.bounce}
        this.can_move_sideways=!did_move[0]
        this.velocity = this.velocity.s(this.velocity.mS(this.damp*delta_time))
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
    constructor(points=[V2(0,0),V2(32,0),V2(32,32),V2(0,32)],position,color,original=true){
        super(points,position,color,false)
        if(original){update_objects.push(this)}
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
        super.update()
    }
    get_data(){
        let data = super.get_data()
        data.type = "PlayerObject"
        return data
    }
}
















