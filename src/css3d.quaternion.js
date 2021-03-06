/**
 * CSS 3D engine
 *
 * @category    css3d
 * @package     css3d.quaternion
 * @author      Jan Fischer, bitWorking <info@bitworking.de>
 * @copyright   2014 Jan Fischer
 * @license     http://www.opensource.org/licenses/mit-license.html  MIT License
 */

/**
 * 
 * @name css3d.quaternion
 * @class
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @param {Number} w
 * @returns {css3d.quaternion}
 */
css3d.quaternion = (function()
{

    /**
     * 
     * @param {Number} x
     * @param {Number} y
     * @param {Number} z
     * @param {Number} w
     * @returns {css3d.quaternion}
     */
    var quaternion = function(x, y, z, w)
    {
        /**
         * x value
         * @type {Number}
         * @memberof! css3d.quaternion
         * @instance
         */
        this.x = x || 0;
        /**
         * y value
         * @type {Number}
         * @memberof! css3d.quaternion
         * @instance
         */
        this.y = y || 0;
        /**
         * z value
         * @type {Number}
         * @memberof! css3d.quaternion
         * @instance
         */
        this.z = z || 0;
        /**
         * w value
         * @type {Number}
         * @memberof! css3d.quaternion
         * @instance
         */
        this.w = w || 1;

        this.TOLERANCE = 0.00001;
    };

    /**
     * 
     * @memberof! css3d.quaternion
     * @instance
     * @returns {css3d.quaternion}
     */
    quaternion.prototype.normalize = function()
    {
        var mag2 = this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z;
        if (Math.abs(mag2) > this.TOLERANCE && Math.abs(mag2 - 1) > this.TOLERANCE) {
            var mag = Math.sqrt(mag2);
            this.x /= mag;
            this.y /= mag;
            this.z /= mag;
            this.w /= mag;
        }
        return this;
    };

    /**
     * 
     * @memberof! css3d.quaternion
     * @instance
     * @returns {css3d.quaternion}
     */
    quaternion.prototype.getConjugate = function()
    {
        return new css3d.quaternion(-this.x, -this.y, -this.z, this.w);
    };

    /**
     * 
     * @memberof! css3d.quaternion
     * @instance
     * @param {css3d.quaternion} rq
     * @returns {css3d.quaternion}
     */
    quaternion.prototype.multiply = function(rq)
    {
        return new css3d.quaternion(
            this.w * rq.x + this.x * rq.w + this.y * rq.z - this.z * rq.y,
            this.w * rq.y + this.y * rq.w + this.z * rq.x - this.x * rq.z,
            this.w * rq.z + this.z * rq.w + this.x * rq.y - this.y * rq.x,
            this.w * rq.w - this.x * rq.x - this.y * rq.y - this.z * rq.z
        );
    };

    /**
     * 
     * @memberof! css3d.quaternion
     * @instance
     * @param {css3d.vector3} v
     * @returns {css3d.vector3}
     */
    quaternion.prototype.multiplyVector = function(v)
    {
        var vn = new css3d.vector3(v.x, v.y, v.z);
    	vn.normalize();

        var vecQuat = new css3d.quaternion();
    	vecQuat.x = vn.x;
    	vecQuat.y = vn.y;
    	vecQuat.z = vn.z;
    	vecQuat.w = 0;
        
    	var resQuat = vecQuat.multiply(this.getConjugate());
    	resQuat = this.multiply(resQuat);

    	return new css3d.vector3(resQuat.x, resQuat.y, resQuat.z);
    };

    /**
     * 
     * @memberof! css3d.quaternion
     * @instance
     * @param {css3d.vector3} axis
     * @param {Number} angle
     * @returns {css3d.quaternion}
     */
    quaternion.prototype.fromAxisAngle = function(axis, angle)
    {
        angle *= 0.5;
        var sinAngle = Math.sin(angle);

        return new css3d.quaternion(
            axis.x * sinAngle,
            axis.y * sinAngle,
            axis.z * sinAngle,
            Math.cos(angle)
        );
    };

    /**
     * 
     * @memberof! css3d.quaternion
     * @instance
     * @param {Number} x
     * @param {Number} y
     * @param {Number} z
     * @returns {css3d.quaternion}
     */
    quaternion.prototype.fromXYZ = function(x, y, z)
    {
        x *= 0.5;
        y *= 0.5;
        z *= 0.5;

        var sinp = Math.sin(y);
        var siny = Math.sin(z);
        var sinr = Math.sin(x);
        var cosp = Math.cos(y);
        var cosy = Math.cos(z);
        var cosr = Math.cos(x);

        return new css3d.quaternion(
            sinr * cosp * cosy - cosr * sinp * siny,
            cosr * sinp * cosy + sinr * cosp * siny,
            cosr * cosp * siny - sinr * sinp * cosy,
            cosr * cosp * cosy + sinr * sinp * siny
        ).normalize();
    };

    /**
     * 
     * @memberof! css3d.quaternion
     * @instance
     * @param {Array} m
     * @returns {css3d.quaternion}
     */
    quaternion.prototype.fromMatrix4 = function(m)
    {
        var tr = m[0] + m[5] + m[10];

        var q = new css3d.quaternion();

        if (tr > 0) {
            var s = Math.sqrt(tr+1) * 2;
            q.w = 0.25 * s;
            q.x = (m[9] - m[6]) / s;
            q.y = (m[2] - m[8]) / s;
            q.z = (m[4] - m[1]) / s;
        }
        else if ((m[0] > m[5])&(m[0] > m[10])) {
            var s = Math.sqrt(1 + m[0] - m[5] - m[10]) * 2;
            q.w = (m[9] - m[6]) / s;
            q.x = 0.25 * s;
            q.y = (m[1] + m[4]) / s;
            q.z = (m[2] + m[8]) / s;
        }
        else if (m[5] > m[10]) {
            var s = Math.sqrt(1 + m[5] - m[0] - m[10]) * 2;
            q.w = (m[2] - m[8]) / s;
            q.x = (m[1] + m[4]) / s;
            q.y = 0.25 * s;
            q.z = (m[6] + m[9]) / s;
        }
        else {
            var s = Math.sqrt(1 + m[10] - m[0] - m[5]) * 2;
            q.w = (m[4] - m[1]) / s;
            q.x = (m[2] + m[8]) / s;
            q.y = (m[6] + m[9]) / s;
            q.z = 0.25 * s;
        }
        return q;
    };

    /**
     * 
     * @memberof! css3d.quaternion
     * @instance
     * @returns {Array}
     */
    quaternion.prototype.toMatrix4 = function()
    {
        var x2 = this.x * this.x;
        var y2 = this.y * this.y;
        var z2 = this.z * this.z;
        var xy = this.x * this.y;
        var xz = this.x * this.z;
        var yz = this.y * this.z;
        var wx = this.w * this.x;
        var wy = this.w * this.y;
        var wz = this.w * this.z;

        // TODO: transpose ?
        return [
            1 - 2 * (y2 + z2), 2 * (xy - wz)    , 2 * (xz + wy)    , 0,
            2 * (xy + wz)    , 1 - 2 * (x2 + z2), 2 * (yz - wx)    , 0,
            2 * (xz - wy)    , 2 * (yz + wx)    , 1 - 2 * (x2 + y2), 0,
            0                , 0                , 0                , 1
        ];
    };

    /**
     * http://nic-gamedev.blogspot.de/2011/11/quaternion-math-getting-local-axis.html
     * 
     * @memberof! css3d.quaternion
     * @instance
     * @returns {css3d.vector3}
     */
    quaternion.prototype.right = function()
    {
        return new css3d.vector3(
            1 - 2 * (this.y * this.y + this.z * this.z),
            2 * (this.x * this.y + this.w * this.z),
            2 * (this.x * this.z - this.w * this.y)
        );
    };

    /**
     * 
     * @memberof! css3d.quaternion
     * @instance
     * @returns {css3d.vector3}
     */
    quaternion.prototype.up = function()
    {
        return new css3d.vector3(
            2 * (this.x * this.y - this.w * this.z),
            1 - 2 * (this.x * this.x + this.z * this.z),
            2 * (this.y * this.z + this.w * this.x)
        );
    };

    /**
     * 
     * @memberof! css3d.quaternion
     * @instance
     * @returns {css3d.vector3}
     */
    quaternion.prototype.forward = function()
    {
        return new css3d.vector3(
            2 * (this.x * this.z + this.w * this.y),
            2 * (this.y * this.x - this.w * this.x),
            1 - 2 * (this.x * this.x + this.y * this.y)
        );
    };

    /**
     * if t=0 then qm=qa, if t=1 then qm=qb
     * 
     * @memberof! css3d.quaternion
     * @instance
     * @param {css3d.quaternion} qa
     * @param {css3d.quaternion} qb
     * @param {Number} t 0-1
     * @returns {css3d.quaternion}
     */
    quaternion.prototype.slerp = function(qa, qb, t)
    {
        // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/

    	// quaternion to return
    	var qm = new css3d.quaternion();
    	// Calculate angle between them.
    	var cosHalfTheta = qa.w * qb.w + qa.x * qb.x + qa.y * qb.y + qa.z * qb.z;

        if (cosHalfTheta < 0) {
            qb.w = -qb.w; qb.x = -qb.x; qb.y = -qb.y; qb.z = qb.z;
            cosHalfTheta = -cosHalfTheta;
        }

    	// if qa=qb or qa=-qb then theta = 0 and we can return qa
    	if (Math.abs(cosHalfTheta) >= 1) {
            qm.w = qa.w;qm.x = qa.x;qm.y = qa.y;qm.z = qa.z;            
            return qm;
    	}

    	// Calculate temporary values.
    	var halfTheta = Math.acos(cosHalfTheta);
    	var sinHalfTheta = Math.sqrt(1 - cosHalfTheta*cosHalfTheta);

    	// if theta = 180 degrees then result is not fully defined
    	// we could rotate around any axis normal to qa or qb
    	if (Math.abs(sinHalfTheta) < 0.001) {
            qm.w = (qa.w * 0.5 + qb.w * 0.5);
            qm.x = (qa.x * 0.5 + qb.x * 0.5);
            qm.y = (qa.y * 0.5 + qb.y * 0.5);
            qm.z = (qa.z * 0.5 + qb.z * 0.5);            
            return qm;
    	}

    	var ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
    	var ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

    	//calculate Quaternion.
    	qm.w = (qa.w * ratioA + qb.w * ratioB);
    	qm.x = (qa.x * ratioA + qb.x * ratioB);
    	qm.y = (qa.y * ratioA + qb.y * ratioB);
    	qm.z = (qa.z * ratioA + qb.z * ratioB);        
    	return qm;
    };
    
    /**
     * 
     * @memberof! css3d.quaternion
     * @instance
     * @returns {Object} {'axis':{css3d.vector3}, 'angle':{Number}}
     */
    quaternion.prototype.toAxisAngle = function()
    {
        // http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToAngle/index.htm
        
        if (this.w > 1) this.normalize();
        var angle = 2 * Math.acos(this.w);
        var s = Math.sqrt(1-this.w*this.w);
        var axis = new css3d.vector3();
        if (s < 0.001) {            
            axis.x = this.x;
            axis.y = this.y;
            axis.z = this.z;
        } 
        else {
            axis.x = this.x / s;
            axis.y = this.y / s;
            axis.z = this.z / s;
        }
        return {
            'axis': axis,
            'angle': angle
        };
    };


    return quaternion;

}());