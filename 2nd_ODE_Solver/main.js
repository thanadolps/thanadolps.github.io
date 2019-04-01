$("#form_equation").on('submit', submit_equation);
$("#button_clear_particle").on('click', function(){particles = []})

/** @type {HTMLInputElement} */
const input_equation1 = document.getElementById("input_equation1");
const input_equation2 = document.getElementById("input_equation2");
const display_equation1 = document.getElementById("display_equation1");
const display_equation2 = document.getElementById("display_equation2");

const input_ppv = $("#input_ppv");

function submit_equation(event)
{
    if(!input_equation1.value)
    {
        input_equation1.focus();
        return;
    }

    if(!input_equation2.value)
    {
        input_equation2.focus();
        return;
    }

    const equation1 = math.parse(input_equation1.value);
    const equation2 = math.parse(input_equation2.value);

    render_equation(equation1, equation2)

    ds_dt = equation1.compile();
    dv_dt = equation2.compile();
    pixel_per_meter = float(input_ppv.val());
    update_vector_field();



    return false;
}

function render_equation(equation1, equation2)
{
    const equation_display1 = MathJax.Hub.getAllJax(display_equation1)[0];
    const equation_display2 = MathJax.Hub.getAllJax(display_equation2)[0];
    MathJax.Hub.Queue(["Text", equation_display1, equation1.toTex()]);
    MathJax.Hub.Queue(["Text", equation_display2, equation2.toTex()]);
}

input_equation1.value = "sin(s+v)";
input_equation2.value = "cos(s-v)";
setTimeout(submit_equation, 1000);