/*

Mathematical functions used for calculating shapes positions, collisions etc

*/
Vertaxis.module('Vertaxis.Math', {

	/**
	 * Return number sign 1 or -1
	 */
	sign: function(number)
	{
		return number && number / Math.abs(number);
	},

	/**
	 * Calculate distance between 2 points
	 *
	 * @param p1 Object Point 1
	 * @param p2 Object Point 2
	 * @return Number Distance
	 */
	distance: function(p1, p2)
	{
		return Math.sqrt( 
			(p2.x - p1.x)*(p2.x - p1.x) + 
			(p2.y - p1.y)*(p2.y - p1.y)
		);
	},

	/**
	 * Convert Angle Degrees to Radians
	 * and shift angle to -90 so 0 is represent UP direction
	 *
	 * @param angle Number Angle in degrees
	 * @return Number Angle in redians
	 */
	rad: function(angle)
	{
		var radians = (Math.PI / 180) * angle;
		return radians;
	},

	/**
	 * Rotate point by angle around center point
	 */
	rotatePoint: function(point, angle, center)
	{
		var p = {
			x: point.x - center.x,
			y: point.y - center.y,
		};

		var rotated = {
			x: Math.round( p.x * Math.cos(angle) - p.y * Math.sin(angle) ) + center.x,
			y: Math.round( p.x * Math.sin(angle) + p.y * Math.cos(angle) ) + center.y
		};

		return rotated;
	},

	translatePoint: function (point, center, reverse)
	{
		return {
			x: point.x - center.x * (reverse ? -1 : 1),
			y: point.y - center.y * (reverse ? -1 : 1)
		}
	},

	isPointOnSegment: function(point, a, b)
	{
		if( ! this.isPointsCollinear(point,a,b) )
		{
			return false;
		}

		if (point.x != a.x)
		{
			return this.within(point.x, a.x, b.x);
		}
		else
		{
			return this.within(point.y, a.y, b.y);
		}
	},

	within: function(p,q,r)
	{
		return p <= q && q <= r;
	},

	/**
	 * Check if points a, b, c alie on the same line
	 */
	isPointsCollinear: function(a, b, c)
	{
		return (b.x - a.x) * (c.y - a.y) == (c.x - a.x) * (b.y - a.y);
	}

	/*
	def is_on(a, b, c):
    "Return true iff point c intersects the line segment from a to b."
    # (or the degenerate case that all 3 points are coincident)
    return (collinear(a, b, c)
            and (within(a.x, c.x, b.x) if a.x != b.x else 
                 within(a.y, c.y, b.y)))

def collinear(a, b, c):
    "Return true iff a, b, and c all lie on the same line."
    return (b.x - a.x) * (c.y - a.y) == (c.x - a.x) * (b.y - a.y)

def within(p, q, r):
    "Return true iff q is between p and r (inclusive)."
    return p <= q <= r or r <= q <= p

	*/

});
