AFRAME.registerComponent('drag-rotate-component',{
      schema : { speed : {default:1}},
      init : function(){
        this.ifMouseDown = false;
        this.x_cord = 0;
        this.y_cord = 0;
        this.distance= 11.0;
        this.rotX = -1.49;
        this.rotY =  0.0;
        document.addEventListener('mousedown',this.OnDocumentMouseDown.bind(this));
        document.addEventListener('mouseup',  this.OnDocumentMouseUp.bind  (this));
        document.addEventListener('mousemove',this.OnDocumentMouseMove.bind(this));
        document.addEventListener('keyup',    this.OnDocumentKeyDown.bind  (this));
        this.beam   = document.getElementById ("beam");
        this.bullet = document.getElementById ("bullet");
        this.anim   = document.getElementById ("anim");
        this.ship   = document.getElementById ("ship");
        this.ufo    = document.getElementById ("ufo");
        this.ufoPos = document.getElementById ("ufo-pos");
        this.ufo.addEventListener ('hit', this.OnCollission.bind (this));
        let audio = document.getElementById ("background-audio");
        audio.play();
        audio.volume = 0.3;
        audio.loop = true;
        this.setUfoPosition ();
     },
     setUfoPosition : function ()  {
        let rotY = Math.random () * 180;     // betweeen 0 and 180
        let dist = Math.random () * 2 + 8.5; // between -8.5 and -10.5
        //console.log ( "DIST: " + dist + " WHERE : " + rotY );
        this.ufoPos.setAttribute ("rotation", "0 "+rotY+" 0");
        this.ufo.setAttribute ("position", -dist + " 0 0");
      },

      OnCollission  : function (e)  {
        e.preventDefault ();
        this.stopShot ();
        this.ufoExplode ();
      },
      OnDocumentKeyDown : function (e)  {
        if ( e.keyCode === 32 ) { // spacebar
          e.preventDefault ();
          this.shoot ();
        }
      },
      OnDocumentMouseDown : function (event)  {
        this.ifMouseDown = true;
        this.x_cord = event.clientX;
        this.y_cord = event.clientY;
      },

      OnDocumentMouseUp : function ()  {
        this.ifMouseDown = false;
      },

      OnDocumentMouseMove : function (event)  {
        if (this.ifMouseDown)  {
          let temp_x = event.clientX-this.x_cord;
          let temp_y = event.clientY-this.y_cord;
          if ( Math.abs ( temp_y ) < Math.abs ( temp_x ) )  {
            let  rotY = temp_x*this.data.speed/300;
            this.rotY = this.el.object3D.rotateY ( rotY ).rotation.y;
            this.bullet.object3D.rotateY( rotY );
          }
          else {
            let  rotX = temp_y*this.data.speed/500;
            if ( rotX > 0 && this.rotX === -1.0 )
                return;
            if ( rotX < 0 && this.rotX === -1.5 )
                return;
            this.rotX = this.ship.object3D.rotateX ( rotX ).rotation.x;
            if ( this.rotX > -1.0 )
                 this.rotX = -1.0;
            if ( this.rotX < -1.5 )
                 this.rotX = -1.5;
          }
          this.x_cord = event.clientX;
          this.y_cord = event.clientY;
        }
      },

      lockAndLoad : function ()  {
        let  rotY = this.rotY * 180.0/Math.PI;
        this.beam.object3D.position.x = -11.0;
        this.bullet.object3D.rotation.z = 0.0;
        this.bullet.object3D.rotation.order = "ZYX";
        this.anim.setAttribute ("from", "0 "+rotY+" 0");
        this.anim.setAttribute ("to", "0 "+rotY+" -360");
        this.anim.data.from="0 "+rotY+" 0";
        this.anim.data.to="0 "+rotY+" -360";
      },
      shoot : function ()  {
        let shoot = document.getElementById ("shoot-audio");
        shoot.play();
        shoot.volume = 0.5;
        this.lockAndLoad ();
        this.beam.emit ("startAnimation");
        this.animate ();
      },
      stopShot : function ()  {
        this.beam.emit ("endAnimation");
        this.lockAndLoad ();
        // Stop animation
        this.beam.object3D.position.x = 0.0;
      },

      animate : function ()  {
        let self = this;
        if ( this.beam.object3D.position.x > -7.5 )  {
          this.stopShot ();
          return;
        }
        // this.rotX defines the speed of the descend
        // this.rotX in range of [-1.5 .. -1.0]
        let delta = (this.rotX+1.5) * 2; // Normalized value [0 .. 1]
        delta = 0.01 + delta* 0.1;

        this.beam.object3D.position.x += delta;
        function handle ()  {
           self.animate ();
        }
        window.requestAnimationFrame(handle);
      },

      ufoExplode : function ()  {
        let hit = document.getElementById ("hit-audio");
        hit.play();
        hit.volume = 0.4;
        let pos = document.getElementById('ufo').getAttribute();
        document.getElementById ("explosion").setAttribute('position',pos);
        this.setUfoPosition();
      }

} );
