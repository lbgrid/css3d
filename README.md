CSS3D
=====

CSS 3D engine, an original project of <a href="http://css3d.bitworking.de/">BitWorking</a>, now being used as the base of a new browser-based virtual world by Operator 1 Computer Technologies Group, International and Littlebird Grid. The project, while not in any way a port of OpenSim or LindenLab's Secondlife, devires its features and concepts almost entirely from the same. At the time of this original writing, the project has been dead (AFAIK) from the last two years. We plan to revitalize and monetize the code base and create something that enables others to make their dreams a reality. Enjoy!

### Features
* No need for browser prefixes
* Shading
* collision detection
* Because a matrix is calculated for every element it works in IE10, too
* Full camera movements
* Import obj files & wrap with images from obj
* matrix4, quaternion, vector3, vector4
* Different interpolations
* Render loop with requestAnimationFrame and callback
* Easy setup and progressive enhancement
* No dependency to other javascript libraries

```javascript
var engine = new css3d(document.getElementById('container'));         
var scene = new css3d.scene();
var content = new css3d.element(document.getElementById('content'));
content.setRotationXYZ(Math.PI / 8, 0, 0);
scene.addElement(content);
engine.setScene(scene);
engine.update().render();
```

### TODO
* ~~Collision detection~~
* Build scene from json
* hovertext on in-world onjects
* resident avatars
* HUDs and attachments, clothing, bodyparts, etc
* Depth cueing
* generate and assign UUIDs internally
* fully functional physics engine
* connect indivual viewers to remote nodeJS server instance
* integration of HTML5's PostMessage() for peer-to-peer communications (teleports,IMs,etc)
* Animation system
* develop and integrate a user interface
* develop and integrate a user interface
* generate some built-in geometries
* ~~Use textures/uvw coordinates from obj file~~
* Billboard element
* Develop and Isolate User inventory JSON
* develop and isolate region server JSON
* develop and isolate USER and ASSET management utilities
* Speed/memory optimization

### More infos
http://5world2.ml
