var resolution_level = 50;

var dw=-1, dh=-1, pw, ph;

var pixel_per_meter = 30;

/** @type {Array<Array<any>>} */
var vector_field = Array();

var ds_dt;
var dv_dt;

let background_color;


function d_dt(s, v)
{
    return [ds_dt.eval({s:s,v:v}), dv_dt.eval({s:s,v:v})];
}

/**
 * @param {number} pixel 
 */
function p2v(pixel)
{
    return pixel / pixel_per_meter;
}

/**
 * @param {number} pixel 
 */
function v2p(value)
{
    return value * pixel_per_meter;
}

function setup() {

    createCanvas(1000, 1000);
    dw = width/resolution_level;
    dh = height/resolution_level;

    background_color = color(255);
    background(background_color);

    // Create Vector Field
    for (var j = 0; j < height; j += dh)
    {    
        var inner = Array();
        for (var i = 0; i < width; i += dw)
        {
            inner.push(createVector(1, 1));
        }
        vector_field.push(inner);
    }

    print(vector_field);


}

function format_for_display(vector)
{
    vector.setMag(0.9 * p2v(dw));
}

function update_vector_field()
{
    // this is not a true vector, only for display
    for (var j = 0; j < height; j += dh)
    {    
        var vector_row = vector_field[j/dh];
        for (var i = 0; i < width; i += dw)
        {
            var vector = vector_row[i/dw];
            
            var flow = d_dt(p2v(i), p2v(j));
            vector.set(flow[0], flow[1]);
            format_for_display(vector);
        }
    }

    render_field();
}


function render_field(override=true)
{

    if(override)
        background(background_color)

    // Render Vector Field
    for (var j = 0; j < height; j += dh)
    {    
        var vector_row = vector_field[j/dh];
        for (var i = 0; i < width; i += dw)
        {
            var vector = vector_row[i/dw];

            const dpx = v2p(vector.x);
            const dpy = v2p(vector.y);

            line(i, j, i + dpx, j + dpy);
        }
    }

    // Render axis line
    line()
}


function draw() {

    particles.forEach(particle => {
        render_particle(particle);
        tick_particle(particle);
    });

}

function mouseClicked()
{
    particles.push(createVector(p2v(mouseX), p2v(mouseY)));
}

function draw_arrow(x1, y1, x2, y2)
{
    line(x1, y1, x2, y2);
    line(x2, y2, x2 + 5, y2 - 5);
    line(x2, y2, x2 - 5, y2 - 5);
}

var particles = [];


function render_particle(particle)
{
    // will use layer system to avoid rewrite of vector field
    ellipse(v2p(particle.x), v2p(particle.y), 10);
}

const lr = 0.01;

function tick_particle(particle)
{
    // using euler method
    var delta = d_dt(particle.x, particle.y);
    particle.add(delta.map((ele)=>{return lr*ele}))
}

